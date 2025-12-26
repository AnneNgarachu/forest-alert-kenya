// src/types/index.ts

export interface Alert {
  id: string;
  forest_id: string;
  forest_name: string;
  latitude: number;
  longitude: number;
  detected_date: string;
  alert_type: 'deforestation' | 'fire' | 'encroachment';
  confidence: 'high' | 'medium' | 'low';
  area_hectares: number;
  status: 'unverified' | 'verified' | 'responded' | 'false_alarm';
  description: string;
  source: 'pyeo' | 'gfw' | 'viirs';
  satellite_image_url?: string;
}

export interface Forest {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  area_hectares: number;
  region: string;
  description: string;
  known_threats: string[];
  conservation_status: string;
}

export interface CivilSocietyContact {
  id: string;
  name: string;
  type: 'ngo' | 'cfa' | 'media' | 'research';
  focus_area: string;
  contact_email?: string;
  contact_phone?: string;  // <-- ADDED for quick calling
  website?: string;
  forests: string[];  // forest IDs this org covers, or ['all']
}

export interface ReportData {
  alertId: string;
  status: 'confirmed' | 'false_alarm' | 'ongoing' | 'resolved';
  description: string;
  reporterType: 'community' | 'ranger' | 'ngo' | 'journalist' | 'other';
  contactEmail?: string;
  hasPhotos: boolean;
}

export interface AlertStats {
  total_alerts: number;
  alerts_this_week: number;
  total_area_affected: number;
  unverified_count: number;
}