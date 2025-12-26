'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function MapLegend() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-xl shadow-warm overflow-hidden border border-earth-300">
      {/* Header - Kenyan gradient */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-kenya-black to-forest-900 text-white text-sm font-semibold hover:from-forest-900 hover:to-kenya-black transition-all"
      >
        <span className="flex items-center gap-2">
          <span className="text-sm">🗺️</span>
          Legend
        </span>
        {isExpanded ? (
          <ChevronDownIcon className="w-4 h-4" />
        ) : (
          <ChevronUpIcon className="w-4 h-4" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 min-w-[180px] bg-gradient-to-b from-white to-earth-50">
          {/* Alert Types */}
          <div>
            <p className="text-xs font-bold text-kenya-black mb-2 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-maasai-500 rounded-full"></span>
              Alert Type
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">🪓</span>
                <span className="text-earth-700">Deforestation</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">🔥</span>
                <span className="text-earth-700">Fire</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">🏗️</span>
                <span className="text-earth-700">Encroachment</span>
              </div>
            </div>
          </div>

          {/* Confidence - with Kenyan-inspired colors */}
          <div className="border-t border-earth-200 pt-3">
            <p className="text-xs font-bold text-kenya-black mb-2 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-forest-500 rounded-full"></span>
              Confidence
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-maasai-500 to-maasai-600 shadow-sm animate-pulse"></span>
                <span className="text-sm text-earth-700">High</span>
                <span className="text-xs text-maasai-600 ml-auto font-medium">Critical</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-sunset-400 to-sunset-500 shadow-sm"></span>
                <span className="text-sm text-earth-700">Medium</span>
                <span className="text-xs text-sunset-600 ml-auto font-medium">Warning</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-savanna-400 to-savanna-500 shadow-sm"></span>
                <span className="text-sm text-earth-700">Low</span>
                <span className="text-xs text-savanna-700 ml-auto font-medium">Monitor</span>
              </div>
            </div>
          </div>

          {/* Location Markers */}
          <div className="border-t border-earth-200 pt-3">
            <p className="text-xs font-bold text-kenya-black mb-2 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-savanna-500 rounded-full"></span>
              Locations
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">🌲</span>
                <span className="text-sm text-earth-700">Forest center</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-maasai-500 bg-opacity-20 border-2 border-maasai-500 border-dashed"></span>
                <span className="text-sm text-earth-700">Affected area</span>
              </div>
            </div>
          </div>

          {/* Kenya flag accent at bottom */}
          <div className="kenya-stripe rounded-full mt-2"></div>
        </div>
      )}
    </div>
  );
}