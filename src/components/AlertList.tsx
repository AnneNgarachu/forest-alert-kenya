// ============================================
// src/components/AlertList.tsx
// ============================================

import { Alert } from '@/types';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface AlertListProps {
  alerts: Alert[];
  totalCount: number;
  onAlertClick: (alert: Alert) => void;
}

export default function AlertList({ alerts, totalCount, onAlertClick }: AlertListProps) {
  const getIcon = (type: string) => {
    const icons: Record<string, string> = { 
      deforestation: '🪓', 
      fire: '🔥', 
      encroachment: '🏗️' 
    };
    return icons[type] || '⚠️';
  };

  const getConfidenceStyle = (confidence: string) => {
    const styles: Record<string, string> = {
      high: 'bg-maasai-500 animate-pulse',
      medium: 'bg-sunset-500',
      low: 'bg-savanna-500'
    };
    return styles[confidence] || 'bg-gray-400';
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Count Header */}
      <div className="px-4 py-2 bg-earth-50 border-b border-earth-200">
        <p className="text-xs text-earth-500">
          Showing <span className="font-bold text-kenya-black">{alerts.length}</span> of {totalCount}
        </p>
      </div>

      {/* Empty State */}
      {alerts.length === 0 ? (
        <div className="p-8 text-center">
          <ExclamationCircleIcon className="w-12 h-12 mx-auto mb-2 text-earth-300" />
          <p className="text-earth-500 font-medium">No alerts match filters</p>
        </div>
      ) : (
        <div className="divide-y divide-earth-100">
          {alerts.map(alert => (
            <button
              key={alert.id}
              onClick={() => onAlertClick(alert)}
              className="w-full p-4 hover:bg-earth-50 transition text-left group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-3 h-3 rounded-full ${getConfidenceStyle(alert.confidence)}`} />
                    <span className="font-semibold text-sm text-kenya-black truncate">
                      {alert.forest_name}
                    </span>
                  </div>
                  <p className="text-xs text-earth-500 truncate">{alert.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-earth-400">{alert.detected_date}</span>
                    <span className="text-xs bg-earth-100 text-earth-600 px-2 py-0.5 rounded-full">
                      {alert.area_hectares} ha
                    </span>
                    {alert.status === 'unverified' && (
                      <span className="text-xs bg-maasai-100 text-maasai-700 px-2 py-0.5 rounded-full">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-2xl ml-2 group-hover:scale-110 transition">
                  {getIcon(alert.alert_type)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}