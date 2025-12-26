/**
 * Forest Alert Kenya - Alerts API
 * 
 * GET /api/alerts - Retrieve alerts with filtering
 * 
 * NOTE: Run `npm install zod` first!
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mockAlerts } from '@/data/alerts';
import { Alert } from '@/types';

// ============================================
// RESPONSE HELPERS
// ============================================

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: Record<string, unknown>;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    timestamp: string;
  };
}

function apiSuccess<T>(data: T, meta: Record<string, unknown> = {}): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    success: true as const,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
      ...meta
    }
  });
}

function apiError(
  message: string, 
  code: string, 
  status: number = 400, 
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({
    success: false as const,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString()
    }
  }, { status });
}

// ============================================
// VALIDATION
// ============================================

const AlertQuerySchema = z.object({
  forest_id: z.string().optional(),
  confidence: z.enum(['high', 'medium', 'low']).optional(),
  alert_type: z.enum(['deforestation', 'fire', 'encroachment']).optional(),
  status: z.enum(['unverified', 'verified', 'responded', 'false_alarm']).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['date_asc', 'date_desc', 'area_asc', 'area_desc']).default('date_desc')
});

type AlertQuery = z.infer<typeof AlertQuerySchema>;

// ============================================
// GET /api/alerts
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    
    // Validate query parameters
    const validation = AlertQuerySchema.safeParse(queryParams);
    
    if (!validation.success) {
      return apiError(
        'Invalid query parameters',
        'VALIDATION_ERROR',
        400,
        validation.error.flatten().fieldErrors
      );
    }
    
    const { forest_id, confidence, alert_type, status, page, limit, sort }: AlertQuery = validation.data;
    
    // Filter alerts
    let filteredAlerts: Alert[] = [...mockAlerts];
    
    if (forest_id) {
      filteredAlerts = filteredAlerts.filter((a: Alert) => a.forest_id === forest_id);
    }
    
    if (confidence) {
      filteredAlerts = filteredAlerts.filter((a: Alert) => a.confidence === confidence);
    }
    
    if (alert_type) {
      filteredAlerts = filteredAlerts.filter((a: Alert) => a.alert_type === alert_type);
    }
    
    if (status) {
      filteredAlerts = filteredAlerts.filter((a: Alert) => a.status === status);
    }
    
    // Sort alerts
    filteredAlerts.sort((a: Alert, b: Alert): number => {
      switch (sort) {
        case 'date_asc':
          return new Date(a.detected_date).getTime() - new Date(b.detected_date).getTime();
        case 'date_desc':
          return new Date(b.detected_date).getTime() - new Date(a.detected_date).getTime();
        case 'area_asc':
          return a.area_hectares - b.area_hectares;
        case 'area_desc':
          return b.area_hectares - a.area_hectares;
        default:
          return 0;
      }
    });
    
    // Calculate pagination
    const total = filteredAlerts.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedAlerts = filteredAlerts.slice(offset, offset + limit);
    
    // Calculate summary stats
    const stats = {
      total_alerts: total,
      total_area_hectares: filteredAlerts.reduce((sum: number, a: Alert) => sum + a.area_hectares, 0),
      by_confidence: {
        high: filteredAlerts.filter((a: Alert) => a.confidence === 'high').length,
        medium: filteredAlerts.filter((a: Alert) => a.confidence === 'medium').length,
        low: filteredAlerts.filter((a: Alert) => a.confidence === 'low').length
      },
      by_status: {
        unverified: filteredAlerts.filter((a: Alert) => a.status === 'unverified').length,
        verified: filteredAlerts.filter((a: Alert) => a.status === 'verified').length,
        responded: filteredAlerts.filter((a: Alert) => a.status === 'responded').length,
        false_alarm: filteredAlerts.filter((a: Alert) => a.status === 'false_alarm').length
      }
    };
    
    return apiSuccess(paginatedAlerts, {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats,
      filters_applied: {
        forest_id: forest_id || null,
        confidence: confidence || null,
        alert_type: alert_type || null,
        status: status || null
      }
    });
    
  } catch (error) {
    console.error('Alerts API error:', error);
    return apiError(
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
}