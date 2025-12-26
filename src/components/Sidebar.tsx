// src/components/Sidebar.tsx

'use client';

import { useState } from 'react';
import { Alert } from '@/types';
import { forests } from '@/data/forests';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  alerts: Alert[];
  selectedForest: string | null;
  onForestChange: (forestId: string | null) => void;
  onAlertClick: (alert: Alert) => void;
  stats: {
    total_alerts: number;
    alerts_this_week: number;
    total_area_affected: number;
    unverified_count: number;
  };
  countryName?: string;
}

export default function Sidebar({ 
  alerts, 
  selectedForest, 
  onForestChange, 
  onAlertClick,
  stats,
  countryName = 'Kenya'
}: SidebarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [confidenceFilter, setConfidenceFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    if (confidenceFilter.length > 0 && !confidenceFilter.includes(alert.confidence)) {
      return false;
    }
    if (typeFilter.length > 0 && !typeFilter.includes(alert.alert_type)) {
      return false;
    }
    if (searchQuery && !alert.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alert.forest_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const toggleConfidence = (conf: string) => {
    setConfidenceFilter(prev => 
      prev.includes(conf) ? prev.filter(c => c !== conf) : [...prev, conf]
    );
  };

  const toggleType = (type: string) => {
    setTypeFilter(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Compact Stats Row */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 bg-gradient-to-r from-earth-100 to-earth-50 border-b border-earth-200">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-forest-500 rounded-full"></span>
          <span className="text-xs text-earth-600">Alerts:</span>
          <span className="text-sm font-bold text-kenya-black">{stats.total_alerts}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-maasai-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-maasai-500"></span>
          </span>
          <span className="text-xs text-earth-600">Unverified:</span>
          <span className="text-sm font-bold text-maasai-600">{stats.unverified_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-savanna-500 rounded-full"></span>
          <span className="text-xs text-earth-600">Area:</span>
          <span className="text-sm font-bold text-savanna-700">{stats.total_area_affected.toFixed(1)} ha</span>
        </div>
      </div>

      {/* Forest Selector - Compact */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-earth-200 bg-white">
        <select 
          value={selectedForest || ''}
          onChange={(e) => onForestChange(e.target.value || null)}
          className="w-full border border-earth-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-forest-500 focus:border-forest-500 bg-earth-50 font-medium text-kenya-black"
        >
          <option value="">🌲 All {countryName} Forests</option>
          {forests.map(forest => (
            <option key={forest.id} value={forest.id}>
              {forest.name} ({alerts.filter(a => a.forest_id === forest.id).length})
            </option>
          ))}
        </select>
      </div>

      {/* Search - Compact */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-earth-200 bg-white">
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-earth-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-earth-300 rounded-lg text-sm focus:ring-2 focus:ring-forest-500 focus:border-forest-500 bg-earth-50 placeholder-earth-400"
          />
        </div>
      </div>

      {/* Filters Toggle - Compact */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex-shrink-0 flex items-center justify-between px-3 py-2 bg-earth-50 border-b border-earth-200 text-sm font-medium text-kenya-black hover:bg-earth-100 transition-all"
      >
        <span className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-forest-600" />
          Filters
          {(confidenceFilter.length > 0 || typeFilter.length > 0) && (
            <span className="bg-maasai-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
              {confidenceFilter.length + typeFilter.length}
            </span>
          )}
        </span>
        {showFilters ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
      </button>

      {/* Filter Options - Compact */}
      {showFilters && (
        <div className="flex-shrink-0 px-3 py-2 border-b border-earth-200 bg-earth-50 space-y-2">
          <div>
            <p className="text-xs font-semibold text-earth-600 mb-1">Confidence</p>
            <div className="flex gap-1 flex-wrap">
              {[
                { key: 'high', label: 'High', bg: 'bg-maasai-500' },
                { key: 'medium', label: 'Med', bg: 'bg-sunset-500' },
                { key: 'low', label: 'Low', bg: 'bg-savanna-500' }
              ].map(conf => (
                <button
                  key={conf.key}
                  onClick={() => toggleConfidence(conf.key)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    confidenceFilter.includes(conf.key)
                      ? `${conf.bg} text-white`
                      : 'bg-white border border-earth-300 text-earth-600 hover:bg-earth-100'
                  }`}
                >
                  {conf.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-earth-600 mb-1">Type</p>
            <div className="flex gap-1 flex-wrap">
              {[
                { key: 'deforestation', label: '🪓' },
                { key: 'fire', label: '🔥' },
                { key: 'encroachment', label: '🏗️' }
              ].map(type => (
                <button
                  key={type.key}
                  onClick={() => toggleType(type.key)}
                  className={`px-2 py-1 rounded text-sm transition-all ${
                    typeFilter.includes(type.key)
                      ? 'bg-forest-600 text-white'
                      : 'bg-white border border-earth-300 hover:bg-earth-100'
                  }`}
                >
                  {type.label}
                </button>
              ))}
              {(confidenceFilter.length > 0 || typeFilter.length > 0) && (
                <button
                  onClick={() => { setConfidenceFilter([]); setTypeFilter([]); }}
                  className="px-2 py-1 text-xs text-maasai-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alert List Header */}
      <div className="flex-shrink-0 px-3 py-1.5 bg-forest-600 text-white">
        <p className="text-xs font-medium">
          📋 {filteredAlerts.length} of {alerts.length} alerts
        </p>
      </div>

      {/* Alert List - MAIN SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredAlerts.length === 0 ? (
          <div className="p-6 text-center text-earth-500">
            <ExclamationCircleIcon className="w-10 h-10 mx-auto mb-2 text-earth-300" />
            <p className="font-medium text-sm">No alerts found</p>
          </div>
        ) : (
          <div className="divide-y divide-earth-100">
            {filteredAlerts.map(alert => (
              <button
                key={alert.id}
                onClick={() => onAlertClick(alert)}
                className="w-full px-3 py-3 hover:bg-earth-50 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  {/* Alert Type Icon */}
                  <div className="flex-shrink-0 text-2xl">
                    {alert.alert_type === 'deforestation' && '🪓'}
                    {alert.alert_type === 'fire' && '🔥'}
                    {alert.alert_type === 'encroachment' && '🏗️'}
                  </div>
                  
                  {/* Alert Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`
                        w-2 h-2 rounded-full flex-shrink-0
                        ${alert.confidence === 'high' ? 'bg-maasai-500 animate-pulse' : ''}
                        ${alert.confidence === 'medium' ? 'bg-sunset-500' : ''}
                        ${alert.confidence === 'low' ? 'bg-savanna-500' : ''}
                      `} />
                      <span className="font-semibold text-sm text-kenya-black truncate group-hover:text-forest-700">
                        {alert.forest_name}
                      </span>
                    </div>
                    <p className="text-xs text-earth-500 truncate mb-1">{alert.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-earth-400">{alert.detected_date}</span>
                      <span className="bg-earth-100 text-earth-600 px-1.5 py-0.5 rounded font-medium">
                        {alert.area_hectares} ha
                      </span>
                      {alert.status === 'unverified' && (
                        <span className="bg-maasai-100 text-maasai-700 px-1.5 py-0.5 rounded font-medium">
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Compact Footer */}
      <div className="flex-shrink-0 px-3 py-2 border-t border-earth-200 bg-earth-50">
        <p className="text-xs text-earth-500 text-center">
          🇰🇪 PyEO (Leicester) • Global Forest Watch
        </p>
      </div>
    </div>
  );
}