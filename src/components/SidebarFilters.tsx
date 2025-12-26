// ============================================
// src/components/SidebarFilters.tsx
// ============================================

'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  confidenceFilter: string[];
  onConfidenceChange: (filters: string[]) => void;
  typeFilter: string[];
  onTypeChange: (filters: string[]) => void;
}

export default function SidebarFilters({
  searchQuery,
  onSearchChange,
  confidenceFilter,
  onConfidenceChange,
  typeFilter,
  onTypeChange
}: FiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = confidenceFilter.length + typeFilter.length;

  const toggleConfidence = (conf: string) => {
    onConfidenceChange(
      confidenceFilter.includes(conf) 
        ? confidenceFilter.filter(c => c !== conf) 
        : [...confidenceFilter, conf]
    );
  };

  const toggleType = (type: string) => {
    onTypeChange(
      typeFilter.includes(type) 
        ? typeFilter.filter(t => t !== type) 
        : [...typeFilter, type]
    );
  };

  return (
    <>
      {/* Search */}
      <div className="p-4 border-b border-earth-200">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-earth-300 rounded-xl text-sm bg-earth-50"
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-earth-50 border-b border-earth-200 text-sm font-semibold"
      >
        <span className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-forest-600" />
          Filters
          {activeCount > 0 && (
            <span className="bg-maasai-500 text-white text-xs px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </span>
        {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
      </button>

      {/* Filter Options */}
      {expanded && (
        <div className="p-4 border-b border-earth-200 bg-earth-50 space-y-4">
          <FilterGroup 
            label="Confidence" 
            options={['high', 'medium', 'low']} 
            selected={confidenceFilter} 
            onToggle={toggleConfidence} 
          />
          <FilterGroup 
            label="Type" 
            options={['deforestation', 'fire', 'encroachment']} 
            selected={typeFilter} 
            onToggle={toggleType}
            icons={{ deforestation: '🪓', fire: '🔥', encroachment: '🏗️' }}
          />
          {activeCount > 0 && (
            <button
              onClick={() => { onConfidenceChange([]); onTypeChange([]); }}
              className="text-sm text-maasai-600 hover:underline"
            >
              ✕ Clear filters
            </button>
          )}
        </div>
      )}
    </>
  );
}

function FilterGroup({ 
  label, 
  options, 
  selected, 
  onToggle,
  icons = {}
}: { 
  label: string; 
  options: string[]; 
  selected: string[]; 
  onToggle: (opt: string) => void;
  icons?: Record<string, string>;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-kenya-black mb-2 uppercase">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selected.includes(opt)
                ? 'bg-forest-600 text-white'
                : 'bg-white border border-earth-300 text-earth-600'
            }`}
          >
            {icons[opt] ? `${icons[opt]} ` : ''}{opt}
          </button>
        ))}
      </div>
    </div>
  );
}