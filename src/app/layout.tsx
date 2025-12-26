// src/app/layout.tsx

import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Forest Alert Kenya | Public Deforestation Monitoring',
  description: 'Real-time satellite monitoring of Kenya\'s forests. Track deforestation alerts in Karura, Mau, Aberdares, Mt. Kenya, and other critical ecosystems. Extending University of Leicester PyEO research for public transparency.',
  keywords: ['deforestation', 'Kenya', 'forest monitoring', 'satellite', 'conservation', 'Karura', 'Mau Forest', 'PyEO', 'Leicester', 'civil society'],
  authors: [{ name: 'Forest Alert Kenya' }],
  openGraph: {
    title: 'Forest Alert Kenya',
    description: 'Public dashboard for monitoring deforestation in Kenya\'s forests - extending Leicester PyEO research',
    type: 'website',
  },
  // Favicon configuration using files from public folder
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}