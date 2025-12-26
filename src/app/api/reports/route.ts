/**
 * Forest Alert Kenya - Reports API
 * 
 * POST /api/reports - Submit ground-truth report
 * 
 * Per security_excellence_framework.md:
 * - Input validation with Zod
 * - Rate limiting placeholder
 * - Sanitization
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================
// RESPONSE HELPERS
// ============================================

function apiSuccess<T>(data: T, meta = {}) {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
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
// VALIDATION
// ============================================

const ReportSchema = z.object({
  alertId: z.string()
    .min(1, 'Alert ID is required')
    .max(50, 'Alert ID too long')
    .regex(/^[A-Z]{3}-\d{4}-\d{3}$/, 'Invalid alert ID format (expected: XXX-YYYY-NNN)'),
  
  status: z.enum(['confirmed', 'false_alarm', 'ongoing', 'resolved'], {
    errorMap: () => ({ message: 'Invalid status value' })
  }),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .transform((text) => {
      // XSS prevention - strip HTML tags
      return text.replace(/<[^>]*>/g, '').trim();
    }),
  
  reporterType: z.enum(['community', 'ranger', 'ngo', 'journalist', 'other'], {
    errorMap: () => ({ message: 'Invalid reporter type' })
  }),
  
  contactEmail: z.union([
    z.string().email('Invalid email format').max(254, 'Email too long'),
    z.literal(''),
    z.undefined()
  ]).optional(),
  
  hasPhotos: z.boolean()
});

// ============================================
// RATE LIMITING (Placeholder)
// In production, use Upstash or Redis
// ============================================

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(clientId: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(clientId);
  
  if (!record || now > record.resetAt) {
    rateLimitStore.set(clientId, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

function getClientId(request: NextRequest): string {
  // In production, use more robust client identification
  return request.headers.get('x-forwarded-for') 
    || request.headers.get('x-real-ip')
    || 'anonymous';
}

// ============================================
// POST /api/reports
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientId(request);
    if (!checkRateLimit(clientId, 5, 60000)) { // 5 requests per minute
      return apiError(
        'Too many requests. Please wait before submitting another report.',
        'RATE_LIMITED',
        429
      );
    }
    
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError(
        'Invalid JSON in request body',
        'INVALID_JSON',
        400
      );
    }
    
    // Validate input
    const validation = ReportSchema.safeParse(body);
    
    if (!validation.success) {
      const errors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      }
      
      return apiError(
        'Validation failed',
        'VALIDATION_ERROR',
        422,
        errors
      );
    }
    
    const reportData = validation.data;
    
    // Generate report ID
    const reportId = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create report object
    const report = {
      id: reportId,
      ...reportData,
      submittedAt: new Date().toISOString(),
      submittedBy: clientId.slice(0, 8) + '...',  // Anonymized
      reviewStatus: 'pending',
      ipCountry: request.headers.get('cf-ipcountry') || 'unknown'
    };
    
    // In production:
    // 1. Store in database (Supabase, PostgreSQL)
    // 2. Send notification to civil society contacts
    // 3. Send webhook to Leicester's system if configured
    // 4. Log to monitoring system
    
    console.log('Report submitted:', report);
    
    // TODO: Actual database storage
    // await supabase.from('reports').insert(report);
    
    // TODO: Notify relevant contacts
    // await notifyContacts(reportData.alertId, report);
    
    return apiSuccess({
      reportId: report.id,
      alertId: report.alertId,
      status: report.status,
      message: 'Report submitted successfully. Thank you for helping protect Kenya\'s forests.'
    }, {
      reviewExpectedWithin: '24-48 hours'
    });
    
  } catch (error) {
    console.error('Reports API error:', error);
    return apiError(
      'An error occurred while processing your report. Please try again.',
      'INTERNAL_ERROR',
      500
    );
  }
}

// ============================================
// GET /api/reports (Admin only - placeholder)
// ============================================

export async function GET(request: NextRequest) {
  // TODO: Implement authentication check
  // const isAdmin = await checkAdminAuth(request);
  // if (!isAdmin) {
  //   return apiError('Unauthorized', 'UNAUTHORIZED', 401);
  // }
  
  return apiError(
    'This endpoint requires authentication',
    'UNAUTHORIZED',
    401
  );
}