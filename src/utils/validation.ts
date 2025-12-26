/**
 * Forest Alert Kenya - Input Validation
 * 
 * Security best practice: Validate all inputs using Zod schemas
 * 
 * IMPORTANT: Run `npm install zod` before using this file!
 */

import { z } from 'zod';

// ============================================
// REPORT SUBMISSION VALIDATION
// ============================================

export const ReportStatusEnum = z.enum([
  'confirmed',
  'false_alarm', 
  'ongoing',
  'resolved'
]);

export const ReporterTypeEnum = z.enum([
  'community',
  'ranger',
  'ngo',
  'journalist',
  'other'
]);

export const ReportSchema = z.object({
  alertId: z.string()
    .min(1, 'Alert ID is required')
    .max(50, 'Alert ID too long')
    .regex(/^[A-Z]{3}-\d{4}-\d{3}$/, 'Invalid alert ID format'),
  
  status: ReportStatusEnum,
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .transform((text: string): string => {
      // Basic XSS prevention - strip HTML tags
      return text.replace(/<[^>]*>/g, '').trim();
    }),
  
  reporterType: ReporterTypeEnum,
  
  contactEmail: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .optional()
    .or(z.literal('')),
  
  hasPhotos: z.boolean()
});

export type ReportInput = z.infer<typeof ReportSchema>;

/**
 * Validate report submission data
 * @throws ZodError if validation fails
 */
export function validateReport(data: unknown): ReportInput {
  return ReportSchema.parse(data);
}

/**
 * Safe validation that returns result object instead of throwing
 */
export function safeValidateReport(data: unknown): z.SafeParseReturnType<unknown, ReportInput> {
  return ReportSchema.safeParse(data);
}


// ============================================
// ALERT FILTERS VALIDATION
// ============================================

export const ConfidenceEnum = z.enum(['high', 'medium', 'low']);
export const AlertTypeEnum = z.enum(['deforestation', 'fire', 'encroachment']);
export const AlertStatusEnum = z.enum(['unverified', 'verified', 'responded', 'false_alarm']);

export const AlertFiltersSchema = z.object({
  forest_id: z.string()
    .max(50, 'Forest ID too long')
    .optional(),
  
  confidence: z.array(ConfidenceEnum)
    .max(3, 'Too many confidence filters')
    .optional(),
  
  alert_type: z.array(AlertTypeEnum)
    .max(3, 'Too many type filters')
    .optional(),
  
  status: z.array(AlertStatusEnum)
    .max(4, 'Too many status filters')
    .optional(),
  
  date_from: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional(),
  
  date_to: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional(),
  
  page: z.number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .max(1000, 'Page too large')
    .default(1),
  
  limit: z.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20)
});

export type AlertFilters = z.infer<typeof AlertFiltersSchema>;

export function validateAlertFilters(data: unknown): AlertFilters {
  return AlertFiltersSchema.parse(data);
}


// ============================================
// PYEO WEBHOOK VALIDATION
// ============================================

export const PyEOAlertSchema = z.object({
  type: z.literal('Feature'),
  
  geometry: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
      z.number().min(-180).max(180), // longitude
      z.number().min(-90).max(90)    // latitude
    ])
  }),
  
  properties: z.object({
    alert_id: z.string()
      .min(1)
      .max(100),
    
    detected_date: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}Z)?$/),
    
    confidence: z.number()
      .min(0)
      .max(1),
    
    area_hectares: z.number()
      .min(0)
      .max(100000),
    
    forest_name: z.string()
      .max(200)
      .optional(),
    
    source: z.string()
      .max(50)
      .optional()
      .default('pyeo')
  })
});

export type PyEOAlert = z.infer<typeof PyEOAlertSchema>;

export function validatePyEOAlert(data: unknown): PyEOAlert {
  return PyEOAlertSchema.parse(data);
}


// ============================================
// SEARCH/QUERY VALIDATION
// ============================================

export const SearchQuerySchema = z.object({
  q: z.string()
    .min(1, 'Search query required')
    .max(200, 'Search query too long')
    .transform((text: string): string => {
      // Sanitize search query - remove special characters
      return text.replace(/[<>{}[\]\\]/g, '').trim();
    }),
  
  type: z.enum(['alerts', 'forests', 'all'])
    .default('all')
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;


// ============================================
// CONTACT FORM VALIDATION
// ============================================

export const ContactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Invalid characters in name'),
  
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long'),
  
  organization: z.string()
    .max(200, 'Organization name too long')
    .optional(),
  
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(5000, 'Message too long')
    .transform((text: string): string => text.replace(/<[^>]*>/g, '').trim()),
  
  subject: z.enum([
    'partnership',
    'data_access',
    'bug_report',
    'feature_request',
    'media_inquiry',
    'other'
  ])
});

export type ContactForm = z.infer<typeof ContactFormSchema>;


// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format Zod errors into user-friendly messages
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  
  return errors;
}

/**
 * Sanitize string for safe database queries
 * Removes MongoDB operators and potential injection patterns
 */
export function sanitizeForDatabase(input: string): string {
  return input
    .replace(/[${}]/g, '') // Remove MongoDB operators
    .replace(/[<>]/g, '')  // Remove HTML brackets
    .trim();
}

/**
 * Validate and sanitize coordinates
 */
export function validateCoordinates(lat: number, lng: number): boolean {
  return (
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180 &&
    !isNaN(lat) && !isNaN(lng)
  );
}