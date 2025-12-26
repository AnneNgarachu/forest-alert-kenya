// src/app/api/boundary/[country]/route.ts

import { NextRequest, NextResponse } from 'next/server';

// OSM Relation IDs for countries
const COUNTRY_OSM_IDS: Record<string, string> = {
  kenya: '192798',
  drc: '192795',
  colombia: '120027',
  madagascar: '447325',
  mexico: '114686'
};

// Cache boundaries in memory
const boundaryCache: Record<string, any> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  const country = params.country.toLowerCase();
  const osmId = COUNTRY_OSM_IDS[country];

  if (!osmId) {
    return NextResponse.json(
      { error: 'Country not found' },
      { status: 404 }
    );
  }

  // Check cache
  if (boundaryCache[country]) {
    return NextResponse.json(boundaryCache[country]);
  }

  try {
    // Fetch from Nominatim (server-side - no CSP issues)
    const url = `https://nominatim.openstreetmap.org/lookup?osm_ids=R${osmId}&format=geojson&polygon_geojson=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ForestAlertKenya/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim returned ${response.status}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      // Cache the result
      boundaryCache[country] = data.features[0];
      return NextResponse.json(data.features[0]);
    }

    return NextResponse.json(
      { error: 'No boundary data found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Boundary fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boundary' },
      { status: 500 }
    );
  }
}