// src/components/Map.tsx

'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert, Forest } from '@/types';
import { forests } from '@/data/forests';

interface MapProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
  selectedForest: string | null;
  center?: [number, number];
  zoom?: number;
  countryId?: string;
}

const CONFIDENCE_COLORS: Record<string, string> = {
  high: '#dc2626',
  medium: '#f97316',
  low: '#eab308'
};

const ALERT_ICONS: Record<string, string> = {
  deforestation: '🪓',
  fire: '🔥',
  encroachment: '🏗️'
};

// Cache for fetched boundaries
const boundaryCache: Record<string, any> = {};

export default function Map({ 
  alerts, 
  onAlertClick, 
  selectedForest,
  center = [-1.2921, 36.8219],
  zoom = 6,
  countryId = 'kenya'
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const boundaryLayersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map ONCE
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { 
      center, 
      zoom,
      zoomControl: true
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    boundaryLayersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => { 
      map.remove(); 
      mapRef.current = null; 
    };
  }, []);

  // Fetch and display country boundary
  useEffect(() => {
    if (!mapRef.current || !boundaryLayersRef.current) return;

    // Clear old boundaries
    boundaryLayersRef.current.clearLayers();

    const addBoundary = (geoJson: any) => {
      if (!mapRef.current || !boundaryLayersRef.current) return;
      
      // LAYER 1: Outer glow (thinner)
      L.geoJSON(geoJson, {
        style: {
          color: '#7c3aed',
          weight: 6,               // Reduced from 12
          opacity: 0.15,
          fill: false,
          lineCap: 'round',
          lineJoin: 'round'
        }
      }).addTo(boundaryLayersRef.current);

      // LAYER 2: Middle glow (thinner)
      L.geoJSON(geoJson, {
        style: {
          color: '#8b5cf6',
          weight: 3,               // Reduced from 6
          opacity: 0.3,
          fill: false,
          lineCap: 'round',
          lineJoin: 'round'
        }
      }).addTo(boundaryLayersRef.current);

      // LAYER 3: Main border line (thinner)
      L.geoJSON(geoJson, {
        style: {
          color: '#a855f7',
          weight: 1.5,             // Reduced from 3
          opacity: 1,
          fill: false,
          lineCap: 'round',
          lineJoin: 'round'
        }
      }).addTo(boundaryLayersRef.current);

      // LAYER 4: Very subtle fill
      L.geoJSON(geoJson, {
        style: {
          color: 'transparent',
          weight: 0,
          fillColor: '#a855f7',
          fillOpacity: 0.04,       // Reduced from 0.06
        }
      }).addTo(boundaryLayersRef.current);
    };

    // Check cache first
    if (boundaryCache[countryId]) {
      addBoundary(boundaryCache[countryId]);
    } else {
      // Fetch from our API route
      fetch(`/api/boundary/${countryId}`)
        .then(res => {
          if (!res.ok) throw new Error(`API returned ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data && data.geometry) {
            boundaryCache[countryId] = data;
            addBoundary(data);
          }
        })
        .catch(err => {
          console.log('Boundary fetch failed:', err);
        });
    }

    // Animate to new view
    mapRef.current.setView(center, zoom, { animate: true, duration: 0.8 });

  }, [center, zoom, countryId]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;
    
    markersRef.current.clearLayers();

    // Forest markers (Kenya only)
    if (countryId === 'kenya') {
      const forestsToShow = selectedForest 
        ? forests.filter((f: Forest) => f.id === selectedForest)
        : forests;

      forestsToShow.forEach((forest: Forest) => {
        const icon = L.divIcon({
          html: '<div style="font-size:26px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">🌳</div>',
          className: 'forest-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        
        L.marker([forest.latitude, forest.longitude], { icon })
          .bindTooltip(`<strong>${forest.name}</strong><br/>${forest.area_hectares.toLocaleString()} ha`, { 
            direction: 'top', 
            offset: [0, -10]
          })
          .addTo(markersRef.current!);
      });
    }

    // Alert markers
    alerts.forEach((alert: Alert) => {
      const color = CONFIDENCE_COLORS[alert.confidence];
      const emoji = ALERT_ICONS[alert.alert_type];
      
      const icon = L.divIcon({
        html: `
          <div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer">
            <div style="position:absolute;width:44px;height:44px;background:${color};border-radius:50%;opacity:0.2;${alert.confidence === 'high' ? 'animation:alertPulse 2s infinite' : ''}"></div>
            <div style="position:absolute;width:30px;height:30px;background:${color};border-radius:50%;opacity:0.4"></div>
            <span style="font-size:20px;position:relative;z-index:10;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5))">${emoji}</span>
          </div>
        `,
        className: 'alert-marker',
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      L.marker([alert.latitude, alert.longitude], { icon })
        .on('click', () => onAlertClick(alert))
        .bindTooltip(`<strong>${alert.forest_name}</strong><br/>${alert.alert_type} • ${alert.area_hectares} ha`, { 
          direction: 'top', 
          offset: [0, -16]
        })
        .addTo(markersRef.current!);
    });

    // Fit bounds
    if (alerts.length > 0 && !selectedForest && mapRef.current) {
      const bounds = L.latLngBounds(alerts.map((a: Alert) => [a.latitude, a.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    } else if (selectedForest && mapRef.current) {
      const forest = forests.find((f: Forest) => f.id === selectedForest);
      if (forest) {
        mapRef.current.setView([forest.latitude, forest.longitude], 11);
      }
    }
  }, [alerts, selectedForest, onAlertClick, countryId]);

  return (
    <>
      <style jsx global>{`
        @keyframes alertPulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.1; }
        }
        .leaflet-container {
          font-family: inherit;
          background: #f5f5f4;
        }
      `}</style>
      <div ref={containerRef} className="w-full h-full rounded-xl" />
    </>
  );
}