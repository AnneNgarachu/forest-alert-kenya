/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🇰🇪 KENYAN FLAG INSPIRED - Modern & Vibrant
        kenya: {
          black: '#1a1a2e',      // Deep charcoal (not pure black)
          red: '#e63946',        // Vibrant red
          green: '#2d6a4f',      // Forest green
          white: '#f8f9fa',      // Clean white
        },
        
        // PRIMARY: Savanna - Golden warmth
        savanna: {
          50: '#fefcf3',
          100: '#fef7e4',
          200: '#fcefc4',
          300: '#f9e4a1',
          400: '#f5d67a',
          500: '#efc050',         // Golden savanna
          600: '#d4a84a',
          700: '#b8923f',
          800: '#9a7a35',
          900: '#7d632c',
        },
        
        // SECONDARY: Forest - Mt Kenya inspired greens
        forest: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',         // Primary green
          800: '#065f46',
          900: '#064e3b',
        },
        
        // ACCENT: Maasai - Warm reds/corals
        maasai: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',         // Maasai red
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // NEUTRAL: Earth - Safari tan tones
        earth: {
          50: '#fdfcfb',
          100: '#faf6f1',          // Warm background
          200: '#f3ebe0',
          300: '#e8d5c4',
          400: '#d4b896',          // Safari tan
          500: '#c49a6c',
          600: '#a67c52',
          700: '#8a6642',
          800: '#6f5235',
          900: '#5a432c',
        },
        
        // FEATURE: Sunset - Nairobi evening sky
        sunset: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',          // Vibrant orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        
        // ALERTS: Clear communication
        alert: {
          critical: '#dc2626',    // High confidence - Maasai red
          high: '#f97316',        // Medium confidence - Sunset orange
          medium: '#eab308',      // Low confidence - Gold
          success: '#10b981',     // Verified - Forest green
          info: '#0ea5e9',        // Info - Sky blue
        },
        
        // SPECIAL ACCENTS
        turkana: '#14b8a6',       // Lake Turkana teal
        night: '#1e293b',         // Night sky (headers)
        dawn: '#fbbf24',          // Golden dawn
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      
      backgroundImage: {
        'kenya-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #047857 50%, #dc2626 100%)',
        'savanna-gradient': 'linear-gradient(180deg, #fef7e4 0%, #f3ebe0 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
        'header-gradient': 'linear-gradient(90deg, #1a1a2e 0%, #064e3b 100%)',
      },
      
      boxShadow: {
        'kenya': '0 4px 14px 0 rgba(220, 38, 38, 0.15)',
        'forest': '0 4px 14px 0 rgba(4, 120, 87, 0.15)',
        'warm': '0 4px 20px 0 rgba(212, 184, 150, 0.3)',
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(220, 38, 38, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}