/** @type {import('next').NextConfig} */

// Security headers per OWASP best practices
const securityHeaders = [
  {
    // Prevent clickjacking attacks
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    // Prevent MIME type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    // Enable XSS protection in older browsers
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    // Control referrer information
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    // Permissions policy - restrict features
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  },
  {
    // Content Security Policy
    // Allows:
    // - Self-hosted scripts and styles
    // - Inline styles (needed for Tailwind)
    // - Leaflet map tiles from OpenStreetMap
    // - Fonts from Google
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://*.tile.openstreetmap.org https://*.openstreetmap.org blob:",
      "connect-src 'self' https://api.globalforestwatch.org https://*.tile.openstreetmap.org",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  }
];

// Add HSTS in production only
if (process.env.NODE_ENV === 'production') {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  });
}

const nextConfig = {
  // Apply security headers to all routes
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: securityHeaders
      },
      {
        // Additional headers for API routes
        source: '/api/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          }
        ]
      }
    ];
  },
  
  // Redirect HTTP to HTTPS in production
  async redirects() {
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }
    
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http'
          }
        ],
        destination: 'https://forest-alert-kenya.vercel.app/:path*',
        permanent: true
      }
    ];
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.tile.openstreetmap.org',
      },
      {
        protocol: 'https',
        hostname: 'api.globalforestwatch.org',
      }
    ]
  },
  
  // Enable React strict mode for better dev experience
  reactStrictMode: true,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Environment variables exposed to browser (public)
  env: {
    NEXT_PUBLIC_APP_NAME: 'Forest Alert Kenya',
    NEXT_PUBLIC_APP_VERSION: '1.0.0-demo',
  }
};

module.exports = nextConfig;