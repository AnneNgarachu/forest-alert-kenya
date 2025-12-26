// src/components/AlertDetailPanel.tsx

'use client';

import { Alert, Forest, CivilSocietyContact } from '@/types';
import { forests } from '@/data/forests';
import { 
  XMarkIcon, 
  MapPinIcon, 
  CalendarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ShareIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

// Real Kenya conservation contacts with actual phone numbers
const civilSocietyContacts: CivilSocietyContact[] = [
  {
    id: 'kfs',
    name: 'Kenya Forest Service (KFS)',
    type: 'ngo',
    focus_area: 'Government forest management authority',
    contact_email: 'info@kenyaforestservice.org',
    contact_phone: '+254 20 2014663',
    website: 'https://www.kenyaforestservice.org',
    forests: ['all']
  },
  {
    id: 'kfs-mau',
    name: 'KFS Mau Conservancy',
    type: 'ngo',
    focus_area: 'Mau Forest protection and restoration',
    contact_email: 'hocmau@kenyaforestservice.org',
    contact_phone: '+254 709 751828',
    forests: ['mau']
  },
  {
    id: 'kfs-western',
    name: 'KFS Western Conservancy',
    type: 'ngo',
    focus_area: 'Kakamega & Western forests',
    contact_email: 'hocwestern@kenyaforestservice.org',
    contact_phone: '+254 709 751876',
    forests: ['kakamega', 'mt_elgon']
  },
  {
    id: 'kfs-coast',
    name: 'KFS Coast Conservancy',
    type: 'ngo',
    focus_area: 'Arabuko-Sokoke & Coastal forests',
    contact_email: 'hoccoast@kenyaforestservice.org',
    contact_phone: '+254 709 751877',
    forests: ['arabuko']
  },
  {
    id: 'gbm',
    name: 'Green Belt Movement',
    type: 'ngo',
    focus_area: 'Community tree planting & conservation',
    contact_email: 'info@greenbeltmovement.org',
    contact_phone: '+254 721 342696',
    website: 'https://www.greenbeltmovement.org',
    forests: ['all']
  },
  {
    id: 'fkf',
    name: 'Friends of Karura Forest',
    type: 'cfa',
    focus_area: 'Karura Forest protection & community engagement',
    contact_email: 'info@karurafriends.org',
    contact_phone: '+254 728 501333',
    website: 'https://www.friendsofkarura.org',
    forests: ['karura']
  },
  {
    id: 'kfo',
    name: 'Kenya Forests Organisation',
    type: 'ngo',
    focus_area: 'Forest policy advocacy',
    contact_email: 'fsk@fsk.or.ke',
    contact_phone: '+254 794 054765',
    forests: ['all']
  }
];

interface AlertDetailPanelProps {
  alert: Alert;
  onClose: () => void;
  onReportUpdate: (alert: Alert) => void;
}

export default function AlertDetailPanel({ alert, onClose, onReportUpdate }: AlertDetailPanelProps) {
  const forest: Forest | undefined = forests.find((f: Forest) => f.id === alert.forest_id);
  
  // Get contacts relevant to this forest (specific + general)
  const relevantContacts: CivilSocietyContact[] = civilSocietyContacts.filter(
    (contact: CivilSocietyContact) => 
      contact.forests.includes(alert.forest_id) || contact.forests.includes('all')
  );

  const getConfidenceStyle = (confidence: string): string => {
    const styles: Record<string, string> = {
      high: 'bg-maasai-500 text-white',
      medium: 'bg-sunset-500 text-white',
      low: 'bg-savanna-500 text-white'
    };
    return styles[confidence] || 'bg-gray-500 text-white';
  };

  const getStatusStyle = (status: string): string => {
    const styles: Record<string, string> = {
      unverified: 'bg-earth-200 text-earth-700',
      verified: 'bg-forest-100 text-forest-700',
      responded: 'bg-forest-500 text-white',
      false_alarm: 'bg-earth-300 text-earth-600'
    };
    return styles[status] || 'bg-gray-200 text-gray-700';
  };

  const getIcon = (type: string): string => {
    const icons: Record<string, string> = { deforestation: '🪓', fire: '🔥', encroachment: '🏗️' };
    return icons[type] || '⚠️';
  };

  const handleShare = async () => {
    const text = `Forest Alert: ${alert.id}\n${alert.forest_name}: ${alert.description}`;
    if (navigator.share) {
      await navigator.share({ title: `Alert ${alert.id}`, text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-700 to-forest-800 text-white p-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg">
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{getIcon(alert.alert_type)}</span>
          <div>
            <h2 className="font-bold text-lg">Alert {alert.id}</h2>
            <p className="text-forest-200 text-sm capitalize">{alert.alert_type} Detected</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${getConfidenceStyle(alert.confidence)}`}>
            {alert.confidence} Confidence
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusStyle(alert.status)}`}>
            {alert.status.replace('_', ' ')}
          </span>
        </div>
        
        <div className="mt-2">
          <span className="bg-white/20 px-2 py-1 rounded text-xs">Source: {alert.source.toUpperCase()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Location & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-earth-500 text-sm mb-1">
              <MapPinIcon className="w-4 h-4" /> Location
            </div>
            <p className="font-semibold text-kenya-black">{alert.forest_name}</p>
            <p className="text-xs text-earth-500">{alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-earth-500 text-sm mb-1">
              <CalendarIcon className="w-4 h-4" /> Detected
            </div>
            <p className="font-semibold text-kenya-black">{alert.detected_date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-earth-500 text-sm mb-1">
              <ExclamationTriangleIcon className="w-4 h-4" /> Area Affected
            </div>
            <p className="font-semibold text-maasai-600">{alert.area_hectares} hectares</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-earth-500 text-sm mb-1">
              <ClockIcon className="w-4 h-4" /> Status
            </div>
            <p className="font-semibold text-kenya-black capitalize">{alert.status.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold text-kenya-black mb-2">Description</h3>
          <p className="text-earth-600 text-sm">{alert.description}</p>
        </div>

        {/* Forest Info */}
        {forest && (
          <div className="bg-earth-50 rounded-xl p-4">
            <h3 className="font-semibold text-kenya-black mb-2">About {forest.name}</h3>
            <p className="text-earth-600 text-sm mb-3">{forest.description}</p>
            
            {forest.known_threats.length > 0 && (
              <>
                <p className="text-xs font-semibold text-earth-500 mb-1">Known Threats:</p>
                <div className="flex flex-wrap gap-1">
                  {forest.known_threats.map((threat: string, i: number) => (
                    <span key={i} className="bg-maasai-100 text-maasai-700 text-xs px-2 py-0.5 rounded">
                      {threat}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Civil Society Contacts - RENAMED SECTION */}
        {relevantContacts.length > 0 && (
          <div>
            <h3 className="font-semibold text-kenya-black mb-3 flex items-center gap-2">
              <span className="text-lg">🤝</span> 
              Take Action - Reach Out
            </h3>
            <p className="text-xs text-earth-500 mb-3">
              Contact these organizations to report what you've seen or coordinate a response
            </p>
            <div className="space-y-3">
              {relevantContacts.slice(0, 4).map((contact: CivilSocietyContact) => (
                <div key={contact.id} className="bg-white border border-earth-200 rounded-xl p-4">
                  <p className="font-semibold text-sm text-kenya-black">{contact.name}</p>
                  <p className="text-xs text-earth-500 mb-2">{contact.focus_area}</p>
                  
                  <div className="space-y-1">
                    {/* Phone - Clickable */}
                    {contact.contact_phone && (
                      <a 
                        href={`tel:${contact.contact_phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-2 text-sm text-forest-700 hover:text-forest-500 font-medium"
                      >
                        <PhoneIcon className="w-4 h-4" />
                        {contact.contact_phone}
                      </a>
                    )}
                    
                    {/* Email - Clickable */}
                    {contact.contact_email && (
                      <a 
                        href={`mailto:${contact.contact_email}`}
                        className="flex items-center gap-2 text-xs text-earth-600 hover:text-forest-600"
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                        {contact.contact_email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-earth-400 mt-2 text-center">
              📱 Tap phone number to call directly
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-earth-200 bg-earth-50 space-y-2">
        <button
          onClick={() => onReportUpdate(alert)}
          className="w-full bg-forest-700 hover:bg-forest-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <DocumentTextIcon className="w-5 h-5" />
          Submit Ground-Truth Report
        </button>
        <button
          onClick={handleShare}
          className="w-full bg-white border-2 border-earth-300 hover:border-forest-500 text-kenya-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <ShareIcon className="w-5 h-5" />
          Share Alert
        </button>
      </div>
    </div>
  );
}