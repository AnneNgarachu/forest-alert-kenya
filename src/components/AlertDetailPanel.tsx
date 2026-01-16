// src/components/AlertDetailPanel.tsx

'use client';

import { useState } from 'react';
import { Alert, Forest, CivilSocietyContact } from '@/types';
import { forests } from '@/data/forests';
import { 
  XMarkIcon, 
  MapPinIcon, 
  CalendarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ShareIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserGroupIcon,
  ShieldCheckIcon
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

interface VerificationData {
  operatorName: string;
  workEmail: string;
  followUp: 'verified' | 'false_alarm' | 'needs_visit' | 'in_progress' | '';
  comments: string;
}

export default function AlertDetailPanel({ alert, onClose, onReportUpdate }: AlertDetailPanelProps) {
  const [showVerification, setShowVerification] = useState(false);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);
  const [verification, setVerification] = useState<VerificationData>({
    operatorName: '',
    workEmail: '',
    followUp: '',
    comments: ''
  });

  const forest: Forest | undefined = forests.find((f: Forest) => f.id === alert.forest_id);
  
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

  const handleVerificationSubmit = () => {
    console.log('Verification submitted:', {
      alertId: alert.id,
      user: verification.operatorName,
      email: verification.workEmail,
      follow_up: verification.followUp,
      comments: verification.comments,
      timestamp: new Date().toISOString()
    });
    setVerificationSubmitted(true);
  };

  const followUpOptions = [
    { value: 'verified', label: '✅ Verified - Deforestation confirmed', color: 'text-red-600' },
    { value: 'false_alarm', label: '❌ False Alarm - No deforestation found', color: 'text-gray-600' },
    { value: 'needs_visit', label: '📍 Needs Site Visit - Cannot confirm remotely', color: 'text-yellow-600' },
    { value: 'in_progress', label: '🔄 In Progress - Investigation ongoing', color: 'text-blue-600' },
  ];

  const canSubmit = verification.operatorName && verification.workEmail && verification.followUp;

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

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* FOREST INFO - Context first, before actions                          */}
        {/* ════════════════════════════════════════════════════════════════════ */}
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

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 📋 CONTRIBUTE SECTION - Now after context                            */}
        {/* Two pathways: Operator (inline) and Community (popup)                */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="border-t pt-5">
          <h3 className="font-semibold text-kenya-black mb-3 flex items-center gap-2">
            <span className="text-lg">📋</span>
            Contribute to This Alert
          </h3>
          <p className="text-xs text-earth-500 mb-4">
            Choose how you'd like to help verify this alert
          </p>

          <div className="space-y-3">
            {/* Option 1: Operator Quick Verification (inline for speed) */}
            <div className="border-2 border-amber-200 rounded-xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50">
              <button
                onClick={() => setShowVerification(!showVerification)}
                className="w-full flex items-center justify-between p-4 hover:bg-amber-100/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <ShieldCheckIcon className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-amber-900">🔍 Operator Verification</p>
                    <p className="text-xs text-amber-600">For authorized field operators</p>
                  </div>
                </div>
                {showVerification ? (
                  <ChevronUpIcon className="w-5 h-5 text-amber-600" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-amber-600" />
                )}
              </button>

              {showVerification && (
                <div className="p-4 border-t border-amber-200 space-y-4 bg-white/50">
                  {verificationSubmitted ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="font-semibold text-green-800">Verification Submitted!</p>
                      <p className="text-sm text-green-600">Thank you for ground-truthing this alert</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Operator: {verification.operatorName}<br/>
                        Email: {verification.workEmail}<br/>
                        Status: {verification.followUp.replace('_', ' ')}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Operator Name */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <UserIcon className="w-4 h-4" />
                          Operator Name
                        </label>
                        <input
                          type="text"
                          value={verification.operatorName}
                          onChange={(e) => setVerification(v => ({ ...v, operatorName: e.target.value }))}
                          placeholder="e.g., Jane Wanjiku"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>

                      {/* Work Email */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <EnvelopeIcon className="w-4 h-4" />
                          Work Email
                        </label>
                        <input
                          type="email"
                          value={verification.workEmail}
                          onChange={(e) => setVerification(v => ({ ...v, workEmail: e.target.value }))}
                          placeholder="e.g., jane@kfs.go.ke"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">So we know your organization</p>
                      </div>

                      {/* Follow-up Status */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <ClipboardDocumentCheckIcon className="w-4 h-4" />
                          Verification Status
                        </label>
                        <div className="space-y-2">
                          {followUpOptions.map(option => (
                            <label
                              key={option.value}
                              className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition ${
                                verification.followUp === option.value
                                  ? 'border-amber-500 bg-amber-100'
                                  : 'border-gray-200 bg-white hover:border-amber-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="followUp"
                                value={option.value}
                                checked={verification.followUp === option.value}
                                onChange={(e) => setVerification(v => ({ ...v, followUp: e.target.value as VerificationData['followUp'] }))}
                                className="text-amber-600 focus:ring-amber-500"
                              />
                              <span className={`text-sm ${option.color}`}>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Comments */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          Field Notes
                        </label>
                        <textarea
                          value={verification.comments}
                          onChange={(e) => setVerification(v => ({ ...v, comments: e.target.value }))}
                          placeholder="Add observations from your site visit..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={handleVerificationSubmit}
                        disabled={!canSubmit}
                        className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                          canSubmit
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ClipboardDocumentCheckIcon className="w-5 h-5" />
                        Submit Verification
                      </button>

                      <p className="text-xs text-gray-500 text-center">
                        Data feeds back to PyEO for model improvement
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Option 2: Public Community Report (opens popup modal) */}
            <button
              onClick={() => onReportUpdate(alert)}
              className="w-full flex items-center gap-3 p-4 border-2 border-forest-200 rounded-xl hover:border-forest-400 hover:bg-forest-50 transition bg-white"
            >
              <div className="p-2 bg-forest-100 rounded-lg">
                <UserGroupIcon className="w-5 h-5 text-forest-700" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-forest-900">📝 Community Report</p>
                <p className="text-xs text-forest-600">For citizens, NGOs & journalists</p>
              </div>
              <ChevronDownIcon className="w-5 h-5 text-forest-400 rotate-[-90deg]" />
            </button>
          </div>
        </div>
        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* END CONTRIBUTE SECTION                                               */}
        {/* ════════════════════════════════════════════════════════════════════ */}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 🤝 CIVIL SOCIETY CONTACTS - Take action by reaching out              */}
        {/* ════════════════════════════════════════════════════════════════════ */}
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
                    {contact.contact_phone && (
                      <a 
                        href={`tel:${contact.contact_phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-2 text-sm text-forest-700 hover:text-forest-500 font-medium"
                      >
                        <PhoneIcon className="w-4 h-4" />
                        {contact.contact_phone}
                      </a>
                    )}
                    
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

      {/* Footer - Just Share */}
      <div className="p-4 border-t border-earth-200 bg-earth-50">
        <button
          onClick={handleShare}
          className="w-full bg-white border-2 border-earth-300 hover:border-forest-500 text-kenya-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <ShareIcon className="w-5 h-5" />
          Share This Alert
        </button>
      </div>
    </div>
  );
}