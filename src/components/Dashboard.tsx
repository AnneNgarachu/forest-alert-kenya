// src/components/Dashboard.tsx

'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import AlertDetailPanel from '@/components/AlertDetailPanel';
import ReportUpdateModal from '@/components/ReportUpdateModal';
import MapLegend from '@/components/MapLegend';
import { Alert } from '@/types';
import { mockAlerts, getAlertStats } from '@/data/alerts';
import { Bars3Icon, XMarkIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-earth-200 rounded-xl">
      <div className="animate-spin w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full" />
    </div>
  )
});

// Countries with Leicester PyEO research
const COUNTRIES = [
  { id: 'kenya', name: 'Kenya', flag: '🇰🇪', center: [-1.2921, 36.8219] as [number, number], zoom: 6, status: 'active', alerts: 22 },
  { id: 'drc', name: 'DR Congo', flag: '🇨🇩', center: [-4.0383, 21.7587] as [number, number], zoom: 5, status: 'research', alerts: 0 },
  { id: 'colombia', name: 'Colombia', flag: '🇨🇴', center: [4.5709, -74.2973] as [number, number], zoom: 6, status: 'research', alerts: 0 },
  { id: 'madagascar', name: 'Madagascar', flag: '🇲🇬', center: [-18.7669, 46.8691] as [number, number], zoom: 6, status: 'research', alerts: 0 },
  { id: 'mexico', name: 'Mexico', flag: '🇲🇽', center: [23.6345, -102.5528] as [number, number], zoom: 5, status: 'pilot', alerts: 0 },
];

export default function Dashboard() {
  // Country state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  
  // Alert state
  const [selectedForest, setSelectedForest] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [reportingAlert, setReportingAlert] = useState<Alert | null>(null);
  const [showMobileList, setShowMobileList] = useState(false);

  // Panel widths (draggable)
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [detailWidth, setDetailWidth] = useState(380);
  
  // Drag refs
  const isDraggingSidebar = useRef(false);
  const isDraggingDetail = useRef(false);

  // Filter alerts by country and forest
  const filteredAlerts = useMemo(() => {
    if (selectedCountry.id !== 'kenya') return [];
    if (!selectedForest) return mockAlerts;
    return mockAlerts.filter(a => a.forest_id === selectedForest);
  }, [selectedForest, selectedCountry]);

  const stats = useMemo(() => {
    if (selectedCountry.id !== 'kenya') {
      return { total_alerts: 0, alerts_this_week: 0, total_area_affected: 0, unverified_count: 0 };
    }
    const base = getAlertStats();
    return {
      total_alerts: filteredAlerts.length,
      alerts_this_week: base.alerts_this_week,
      total_area_affected: filteredAlerts.reduce((sum, a) => sum + a.area_hectares, 0),
      unverified_count: filteredAlerts.filter(a => a.status === 'unverified').length
    };
  }, [filteredAlerts, selectedCountry]);

  // Drag handlers for sidebar
  const handleSidebarDragStart = useCallback(() => {
    isDraggingSidebar.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  // Drag handlers for detail panel
  const handleDetailDragStart = useCallback(() => {
    isDraggingDetail.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingSidebar.current) {
      const newWidth = Math.max(250, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);
    }
    if (isDraggingDetail.current) {
      const newWidth = Math.max(300, Math.min(550, window.innerWidth - e.clientX));
      setDetailWidth(newWidth);
    }
  }, []);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    isDraggingSidebar.current = false;
    isDraggingDetail.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowMobileList(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'bg-forest-100', text: 'text-forest-700', label: 'Active' };
      case 'research': return { bg: 'bg-sunset-100', text: 'text-sunset-700', label: 'Research' };
      case 'pilot': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pilot' };
      default: return { bg: 'bg-earth-100', text: 'text-earth-700', label: status };
    }
  };

  return (
    <div 
      className="h-screen flex flex-col overflow-hidden bg-earth-100"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Desktop Header */}
      <div className="max-lg:hidden"><Header /></div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-kenya-black via-forest-900 to-kenya-black text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{selectedCountry.flag}</span>
          <h1 className="font-bold text-sm">Forest Alert <span className="text-maasai-400">{selectedCountry.name}</span></h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCountryModal(true)} className="p-2 bg-forest-700 rounded-lg">
            <GlobeAltIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setShowMobileList(!showMobileList)} className="p-2 bg-forest-700 rounded-lg">
            {showMobileList ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ========== COUNTRY SELECTOR BAR (Desktop) ========== */}
      <div className="max-lg:hidden flex items-center gap-3 px-4 py-2.5 bg-white border-b border-earth-200 shadow-sm">
        <span className="text-sm font-semibold text-earth-600 flex items-center gap-2">
          <GlobeAltIcon className="w-4 h-4" />
          Select Region:
        </span>
        <div className="flex items-center gap-2">
          {COUNTRIES.map(country => {
            const badge = getStatusBadge(country.status);
            return (
              <button
                key={country.id}
                onClick={() => {
                  setSelectedCountry(country);
                  setSelectedAlert(null);
                  setSelectedForest(null);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCountry.id === country.id
                    ? 'bg-forest-700 text-white shadow-md ring-2 ring-forest-300'
                    : 'bg-earth-50 text-kenya-black hover:bg-earth-100 border border-earth-200'
                }`}
              >
                <span className="text-base">{country.flag}</span>
                <span>{country.name}</span>
                {selectedCountry.id !== country.id && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                )}
                {country.alerts > 0 && selectedCountry.id === country.id && (
                  <span className="bg-maasai-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {country.alerts}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="ml-auto text-xs text-earth-400 flex items-center gap-1">
          <span className="w-2 h-2 bg-forest-500 rounded-full"></span>
          Powered by <span className="font-semibold text-forest-600">Leicester PyEO</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ========== SIDEBAR (Draggable Width) ========== */}
        <div 
          className="max-lg:hidden flex flex-col bg-white border-r border-earth-200 overflow-hidden flex-shrink-0"
          style={{ width: `${sidebarWidth}px` }}
        >
          <Sidebar
            alerts={filteredAlerts}
            selectedForest={selectedForest}
            onForestChange={setSelectedForest}
            onAlertClick={handleAlertClick}
            stats={stats}
            countryName={selectedCountry.name}
          />
        </div>

        {/* Sidebar Drag Handle */}
        <div
          onMouseDown={handleSidebarDragStart}
          className="max-lg:hidden flex w-1.5 bg-earth-200 hover:bg-forest-400 cursor-col-resize flex-shrink-0 transition-colors items-center justify-center group"
          title="Drag to resize sidebar"
        >
          <div className="w-0.5 h-8 bg-earth-400 group-hover:bg-forest-600 rounded-full transition-colors"></div>
        </div>

        {/* Mobile Sidebar */}
        {showMobileList && (
          <div className="lg:hidden fixed inset-0 top-14 z-40 bg-white overflow-y-auto">
            <Sidebar 
              alerts={filteredAlerts} 
              selectedForest={selectedForest} 
              onForestChange={setSelectedForest} 
              onAlertClick={handleAlertClick} 
              stats={stats} 
              countryName={selectedCountry.name} 
            />
          </div>
        )}

        {/* ========== MAP ========== */}
        <div className="flex-1 p-4 relative min-w-0">
          {/* Non-Kenya info banner */}
          {selectedCountry.id !== 'kenya' && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-xl shadow-lg px-6 py-4 max-w-md text-center border border-earth-200">
              <span className="text-4xl mb-2 block">{selectedCountry.flag}</span>
              <h3 className="text-xl font-bold text-kenya-black">{selectedCountry.name}</h3>
              <p className="text-earth-600 text-sm mt-2">
                {selectedCountry.status === 'research' 
                  ? '🔬 Research phase with Leicester - public dashboard coming soon'
                  : selectedCountry.status === 'pilot'
                    ? '📡 Pilot monitoring program in development'
                    : '📡 Active monitoring - alerts coming soon'}
              </p>
              <p className="text-xs text-earth-400 mt-3">
                Contact Prof. Heiko Balzter at Leicester for partnership opportunities
              </p>
            </div>
          )}
          
          <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-earth-200">
            <Map 
              alerts={filteredAlerts} 
              onAlertClick={handleAlertClick} 
              selectedForest={selectedForest}
              center={selectedCountry.center}
              zoom={selectedCountry.zoom}
              countryId={selectedCountry.id}
            />
          </div>
          <MapLegend />
        </div>

        {/* ========== DETAIL PANEL (Draggable Width) ========== */}
        {selectedAlert && (
          <>
            {/* Detail Drag Handle */}
            <div
              onMouseDown={handleDetailDragStart}
              className="max-lg:hidden flex w-1.5 bg-earth-200 hover:bg-sunset-400 cursor-col-resize flex-shrink-0 transition-colors items-center justify-center group"
              title="Drag to resize detail panel"
            >
              <div className="w-0.5 h-8 bg-earth-400 group-hover:bg-sunset-600 rounded-full transition-colors"></div>
            </div>
            
            {/* Detail Panel */}
            <div 
              className="max-lg:hidden bg-white border-l border-earth-200 overflow-y-auto flex-shrink-0"
              style={{ width: `${detailWidth}px` }}
            >
              <AlertDetailPanel
                alert={selectedAlert}
                onClose={() => setSelectedAlert(null)}
                onReportUpdate={setReportingAlert}
              />
            </div>
          </>
        )}
      </div>

      {/* Mobile Detail Panel */}
      {selectedAlert && (
        <div className="lg:hidden fixed inset-0 bg-black/70 z-50 flex items-end">
          <div className="bg-white w-full max-h-[85vh] overflow-y-auto rounded-t-2xl">
            <AlertDetailPanel 
              alert={selectedAlert} 
              onClose={() => setSelectedAlert(null)} 
              onReportUpdate={setReportingAlert} 
            />
          </div>
        </div>
      )}

      {/* Mobile Country Modal */}
      {showCountryModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <GlobeAltIcon className="w-5 h-5 text-forest-600" />
              Select Region
            </h3>
            <div className="space-y-2">
              {COUNTRIES.map(country => {
                const badge = getStatusBadge(country.status);
                return (
                  <button
                    key={country.id}
                    onClick={() => { 
                      setSelectedCountry(country); 
                      setShowCountryModal(false);
                      setSelectedAlert(null);
                      setSelectedForest(null);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                      selectedCountry.id === country.id 
                        ? 'bg-forest-100 border-2 border-forest-500' 
                        : 'bg-earth-50 border-2 border-transparent hover:border-earth-300'
                    }`}
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1 text-left">
                      <span className="font-medium">{country.name}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </div>
                    {country.alerts > 0 && (
                      <span className="bg-maasai-500 text-white text-xs px-2 py-1 rounded-full">
                        {country.alerts} alerts
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={() => setShowCountryModal(false)} 
              className="w-full mt-4 py-2.5 bg-earth-200 hover:bg-earth-300 rounded-xl font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportingAlert && (
        <ReportUpdateModal 
          alert={reportingAlert} 
          onClose={() => setReportingAlert(null)} 
          onSubmit={console.log} 
        />
      )}
    </div>
  );
}