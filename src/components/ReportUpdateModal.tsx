'use client';

import { useState } from 'react';
import { Alert } from '@/types';
import { XMarkIcon, CameraIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface ReportUpdateModalProps {
  alert: Alert;
  onClose: () => void;
  onSubmit: (data: ReportData) => void;
}

export interface ReportData {
  alertId: string;
  status: 'confirmed' | 'false_alarm' | 'ongoing' | 'resolved';
  description: string;
  reporterType: 'community' | 'ranger' | 'ngo' | 'journalist' | 'other';
  contactEmail?: string;
  hasPhotos: boolean;
}

export default function ReportUpdateModal({ alert, onClose, onSubmit }: ReportUpdateModalProps) {
  const [formData, setFormData] = useState<ReportData>({
    alertId: alert.id,
    status: 'confirmed',
    description: '',
    reporterType: 'community',
    contactEmail: '',
    hasPhotos: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission (in real app, this would call an API)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSubmit(formData);
    }, 1000);
  };

  if (submitted) {
    return (
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(26, 26, 46, 0.85)' }}
      >
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">✓</span>
          </div>
          <h3 className="text-xl font-bold text-kenya-black mb-2">Report Submitted!</h3>
          <p className="text-earth-600 mb-4">
            Thank you for helping verify this alert. Your report will be reviewed and used to update the alert status.
          </p>
          <p className="text-sm text-earth-500 mb-6 bg-earth-100 px-3 py-2 rounded-lg inline-block">
            Alert ID: <span className="font-mono font-bold text-forest-700">{alert.id}</span>
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-forest-700 to-forest-800 text-white px-6 py-3 rounded-xl hover:from-forest-600 hover:to-forest-700 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(26, 26, 46, 0.85)' }}
    >
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-kenya-black via-forest-900 to-forest-800 text-white p-4 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="font-bold text-lg">Report Ground-Truth Update</h2>
            <p className="text-forest-300 text-sm">
              Alert: <span className="font-mono">{alert.id}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-xl transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Alert Summary */}
        <div className="bg-gradient-to-r from-earth-100 to-earth-50 p-4 border-b border-earth-200">
          <div className="flex items-start gap-3">
            <div className="bg-forest-100 p-2 rounded-lg">
              <MapPinIcon className="w-5 h-5 text-forest-600" />
            </div>
            <div>
              <p className="font-semibold text-kenya-black">{alert.forest_name}</p>
              <p className="text-sm text-earth-600">
                {alert.detected_date} • <span className="text-maasai-600 font-medium">{alert.area_hectares} hectares</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-kenya-black mb-3">
              What did you observe? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'confirmed', label: '✓ Confirmed', desc: 'Deforestation is real', color: 'maasai' },
                { value: 'ongoing', label: '🔄 Ongoing', desc: 'Activity still happening', color: 'sunset' },
                { value: 'resolved', label: '🌱 Resolved', desc: 'Area being restored', color: 'forest' },
                { value: 'false_alarm', label: '✗ False Alarm', desc: 'No deforestation found', color: 'earth' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: option.value as ReportData['status'] })}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    formData.status === option.value
                      ? option.color === 'maasai' ? 'border-maasai-500 bg-maasai-50' :
                        option.color === 'sunset' ? 'border-sunset-500 bg-sunset-50' :
                        option.color === 'forest' ? 'border-forest-500 bg-forest-50' :
                        'border-earth-400 bg-earth-100'
                      : 'border-earth-200 hover:border-earth-300 bg-white'
                  }`}
                >
                  <p className="font-semibold text-sm text-kenya-black">{option.label}</p>
                  <p className="text-xs text-earth-500 mt-0.5">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-kenya-black mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what you observed at the location..."
              rows={3}
              required
              className="w-full border-2 border-earth-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest-500 focus:border-forest-500 bg-earth-50 placeholder-earth-400 transition-all"
            />
          </div>

          {/* Reporter Type */}
          <div>
            <label className="block text-sm font-bold text-kenya-black mb-2">
              I am a... *
            </label>
            <select
              value={formData.reporterType}
              onChange={(e) => setFormData({ ...formData, reporterType: e.target.value as ReportData['reporterType'] })}
              className="w-full border-2 border-earth-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest-500 focus:border-forest-500 bg-earth-50 font-medium text-kenya-black transition-all"
            >
              <option value="community">🏘️ Community Member</option>
              <option value="ranger">🌲 Forest Ranger / Scout</option>
              <option value="ngo">🤝 NGO / Conservation Organization</option>
              <option value="journalist">📰 Journalist / Researcher</option>
              <option value="other">👤 Other</option>
            </select>
          </div>

          {/* Photo checkbox */}
          <div className="flex items-center gap-3 bg-earth-50 p-3 rounded-xl">
            <input
              type="checkbox"
              id="hasPhotos"
              checked={formData.hasPhotos}
              onChange={(e) => setFormData({ ...formData, hasPhotos: e.target.checked })}
              className="w-5 h-5 text-forest-600 border-2 border-earth-300 rounded focus:ring-forest-500"
            />
            <label htmlFor="hasPhotos" className="text-sm text-kenya-black flex items-center gap-2 font-medium">
              <CameraIcon className="w-5 h-5 text-sunset-500" />
              I have photos to share
            </label>
          </div>

          {/* Email (optional) */}
          <div>
            <label className="block text-sm font-bold text-kenya-black mb-2">
              Contact Email <span className="font-normal text-earth-500">(optional)</span>
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="your@email.com"
              className="w-full border-2 border-earth-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest-500 focus:border-forest-500 bg-earth-50 placeholder-earth-400 transition-all"
            />
            <p className="text-xs text-earth-500 mt-1.5">
              We may contact you for additional information
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-earth-300 text-earth-600 py-3 px-4 rounded-xl hover:bg-earth-100 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.description}
              className="flex-1 bg-gradient-to-r from-forest-700 to-forest-800 text-white py-3 px-4 rounded-xl hover:from-forest-600 hover:to-forest-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-forest"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Submitting...
                </span>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>

        {/* Privacy note */}
        <div className="bg-earth-100 px-4 py-3 rounded-b-2xl">
          <p className="text-xs text-earth-500 text-center flex items-center justify-center gap-2">
            <span>🔒</span>
            Your report helps improve forest monitoring. Personal information is kept confidential.
          </p>
        </div>
      </div>
    </div>
  );
}