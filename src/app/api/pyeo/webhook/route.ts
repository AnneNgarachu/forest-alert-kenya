/**
 * Forest Alert Kenya - PyEO Webhook Handler
 * 
 * POST /api/pyeo/webhook - Receive alerts from Leicester's PyEO system
 * 
 * This endpoint is designed to receive GeoJSON alerts from the
 * University of Leicester's PyEO (Python for Earth Observation) system.
 * 
 * Expected format: GeoJSON Feature with Point geometry
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

// ============================================
// RESPONSE HELPERS
// ============================================

function apiSuccess<T>(data: T, meta = {}) {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      source: 'pyeo-webhook',
      ...meta
    }
  }, { status: 201 });
}

function apiError(message: string, code: string, status = 400, details?: any) {
  return NextResponse.json({
    success: false,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString()
    }
  }, { status });
}

// ============================================
// VALIDATION - PyEO GeoJSON Format
// ============================================

// Single alert feature
const PyEOFeatureSchema = z.object({
  type: z.literal('Feature'),
  
  geometry: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
      z.number().min(-180).max(180), // longitude
      z.number().min(-90).max(90)    // latitude
    ])
  }),
  
  properties: z.object({
    // PyEO standard fields
    alert_id: z.string().min(1).max(100),
    detected_date: z.string(), // ISO date
    confidence: z.number().min(0).max(1),
    area_hectares: z.number().min(0).max(100000),
    
    // Optional fields
    forest_id: z.string().max(50).optional(),
    forest_name: z.string().max(200).optional(),
    alert_type: z.enum(['deforestation', 'fire', 'encroachment', 'unknown']).optional().default('deforestation'),
    description: z.string().max(2000).optional(),
    
    // PyEO metadata
    sensor: z.string().max(50).optional(),
    processing_date: z.string().optional(),
    tile_id: z.string().max(50).optional()
  })
});

// Feature collection (batch of alerts)
const PyEOFeatureCollectionSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(PyEOFeatureSchema).min(1).max(1000)
});

// Accept either single feature or collection
const PyEOPayloadSchema = z.union([
  PyEOFeatureSchema,
  PyEOFeatureCollectionSchema
]);

// ============================================
// WEBHOOK SIGNATURE VERIFICATION
// ============================================

function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expectedSignature}`)
  );
}

// ============================================
// FOREST MATCHING
// ============================================

// Kenya forests with bounding boxes (approximate)
const KENYA_FORESTS = [
  { id: 'karura', name: 'Karura Forest', bounds: { lat: [-1.25, -1.22], lng: [36.82, 36.86] } },
  { id: 'mau', name: 'Mau Forest Complex', bounds: { lat: [-0.8, -0.2], lng: [35.3, 36.0] } },
  { id: 'aberdare', name: 'Aberdare Forest', bounds: { lat: [-0.7, -0.3], lng: [36.6, 36.9] } },
  { id: 'mt_kenya', name: 'Mt. Kenya Forest', bounds: { lat: [-0.3, 0.1], lng: [37.0, 37.5] } },
  { id: 'kakamega', name: 'Kakamega Forest', bounds: { lat: [0.2, 0.4], lng: [34.8, 35.0] } },
  { id: 'arabuko', name: 'Arabuko-Sokoke Forest', bounds: { lat: [-3.4, -3.1], lng: [39.8, 40.1] } },
  { id: 'mt_elgon', name: 'Mt. Elgon Forest', bounds: { lat: [0.8, 1.2], lng: [34.4, 34.8] } },
  { id: 'cherangani', name: 'Cherangani Hills', bounds: { lat: [0.9, 1.4], lng: [35.2, 35.6] } }
];

function matchForest(lat: number, lng: number): { id: string; name: string } | null {
  for (const forest of KENYA_FORESTS) {
    if (
      lat >= forest.bounds.lat[0] && lat <= forest.bounds.lat[1] &&
      lng >= forest.bounds.lng[0] && lng <= forest.bounds.lng[1]
    ) {
      return { id: forest.id, name: forest.name };
    }
  }
  return null;
}

// ============================================
// TRANSFORM PYEO TO INTERNAL FORMAT
// ============================================

function transformPyEOAlert(feature: z.infer<typeof PyEOFeatureSchema>) {
  const [lng, lat] = feature.geometry.coordinates;
  const props = feature.properties;
  
  // Match to known forest
  const matchedForest = matchForest(lat, lng);
  
  // Convert confidence (0-1) to category
  let confidenceLevel: 'high' | 'medium' | 'low' = 'medium';
  if (props.confidence >= 0.8) confidenceLevel = 'high';
  else if (props.confidence < 0.5) confidenceLevel = 'low';
  
  // Generate internal alert ID if not provided
  const internalId = `${matchedForest?.id?.toUpperCase().slice(0, 3) || 'UNK'}-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
  
  return {
    id: internalId,
    pyeo_id: props.alert_id,
    latitude: lat,
    longitude: lng,
    forest_id: matchedForest?.id || props.forest_id || 'unknown',
    forest_name: matchedForest?.name || props.forest_name || 'Unknown Forest',
    detected_date: props.detected_date,
    confidence: confidenceLevel,
    confidence_score: props.confidence,
    area_hectares: props.area_hectares,
    alert_type: props.alert_type || 'deforestation',
    description: props.description || `Forest change detected via PyEO satellite analysis. ${props.area_hectares} hectares affected.`,
    status: 'unverified' as const,
    source: 'pyeo' as const,
    metadata: {
      sensor: props.sensor,
      processing_date: props.processing_date,
      tile_id: props.tile_id
    },
    created_at: new Date().toISOString()
  };
}

// ============================================
// POST /api/pyeo/webhook
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    
    // Verify webhook signature (if secret is configured)
    const webhookSecret = process.env.PYEO_WEBHOOK_SECRET;
    const signature = request.headers.get('X-PyEO-Signature') 
      || request.headers.get('X-Hub-Signature-256');
    
    if (webhookSecret) {
      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.warn('PyEO webhook: Invalid signature');
        return apiError(
          'Invalid webhook signature',
          'UNAUTHORIZED',
          401
        );
      }
    } else {
      // Log warning if no secret configured (development mode)
      console.warn('PyEO webhook: No secret configured - skipping signature verification');
    }
    
    // Parse JSON
    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return apiError(
        'Invalid JSON payload',
        'INVALID_JSON',
        400
      );
    }
    
    // Validate against schema
    const validation = PyEOPayloadSchema.safeParse(payload);
    
    if (!validation.success) {
      return apiError(
        'Invalid GeoJSON format',
        'VALIDATION_ERROR',
        422,
        validation.error.flatten()
      );
    }
    
    const data = validation.data;
    
    // Handle single feature or collection
    const features = data.type === 'FeatureCollection' 
      ? data.features 
      : [data];
    
    // Transform and process alerts
    const processedAlerts = features.map(transformPyEOAlert);
    
    // In production:
    // 1. Store in database
    // 2. Trigger notifications to subscribers
    // 3. Update real-time dashboard
    
    console.log(`PyEO webhook: Received ${processedAlerts.length} alerts`);
    processedAlerts.forEach(alert => {
      console.log(`  - ${alert.id}: ${alert.forest_name}, ${alert.area_hectares}ha, ${alert.confidence}`);
    });
    
    // TODO: Database storage
    // await supabase.from('alerts').insert(processedAlerts);
    
    // TODO: Notify subscribers
    // await notifySubscribers(processedAlerts);
    
    return apiSuccess({
      received: processedAlerts.length,
      alerts: processedAlerts.map(a => ({
        id: a.id,
        pyeo_id: a.pyeo_id,
        forest: a.forest_name,
        area_hectares: a.area_hectares
      }))
    }, {
      processing_time_ms: Date.now() - new Date(processedAlerts[0]?.created_at || Date.now()).getTime()
    });
    
  } catch (error) {
    console.error('PyEO webhook error:', error);
    return apiError(
      'Failed to process webhook',
      'INTERNAL_ERROR',
      500
    );
  }
}

// ============================================
// GET /api/pyeo/webhook - Health check
// ============================================

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Forest Alert Kenya - PyEO Webhook',
    version: '1.0.0',
    accepts: ['application/geo+json', 'application/json'],
    documentation: 'https://github.com/clcr/pyeo',
    timestamp: new Date().toISOString()
  });
}