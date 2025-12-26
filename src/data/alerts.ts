import { Alert } from '@/types';

// Generate dates within the last 90 days
const getRandomDate = (daysBack: number = 90): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString().split('T')[0];
};

// Add small random offset to coordinates
const jitter = (coord: number, amount: number = 0.05): number => {
  return coord + (Math.random() - 0.5) * amount;
};

export const mockAlerts: Alert[] = [
  // Karura Forest Alerts (most detailed for demo)
  {
    id: 'KAR-2025-001',
    forest_name: 'Karura Forest',
    forest_id: 'karura',
    detected_date: '2025-12-20',
    latitude: -1.2407,
    longitude: 36.8372,
    area_hectares: 0.8,
    confidence: 'high',
    status: 'unverified',
    alert_type: 'deforestation',
    source: 'pyeo',
    description: 'Clear-cut detected near Limuru Road entrance. Possible unauthorized harvesting of exotic trees.'
  },
  {
    id: 'KAR-2025-002',
    forest_name: 'Karura Forest',
    forest_id: 'karura',
    detected_date: '2025-12-18',
    latitude: -1.2350,
    longitude: 36.8290,
    area_hectares: 1.2,
    confidence: 'high',
    status: 'verified',
    alert_type: 'deforestation',
    source: 'pyeo',
    description: 'Logging activity detected in Sigiria section. Multiple trees removed.'
  },
  {
    id: 'KAR-2025-003',
    forest_name: 'Karura Forest',
    forest_id: 'karura',
    detected_date: '2025-12-15',
    latitude: -1.2480,
    longitude: 36.8410,
    area_hectares: 0.3,
    confidence: 'medium',
    status: 'responded',
    alert_type: 'encroachment',
    source: 'pyeo',
    description: 'Structure detected at forest edge. Possible illegal construction.'
  },
  {
    id: 'KAR-2025-004',
    forest_name: 'Karura Forest',
    forest_id: 'karura',
    detected_date: '2025-12-10',
    latitude: -1.2320,
    longitude: 36.8450,
    area_hectares: 0.5,
    confidence: 'high',
    status: 'unverified',
    alert_type: 'deforestation',
    source: 'gfw',
    description: 'Tree cover loss detected near UN compound boundary.'
  },

  // Mau Forest Complex Alerts
  {
    id: 'MAU-2025-001',
    forest_name: 'Mau Forest Complex',
    forest_id: 'mau',
    detected_date: '2025-12-22',
    latitude: -0.5833,
    longitude: 35.8333,
    area_hectares: 4.5,
    confidence: 'high',
    status: 'unverified',
    alert_type: 'deforestation',
    source: 'pyeo',
    description: 'Large clearing detected in Eastern Mau. Possible agricultural expansion.'
  },
  {
    id: 'MAU-2025-002',
    forest_name: 'Mau Forest Complex',
    forest_id: 'mau',
    detected_date: '2025-12-21',
    latitude: -0.6100,
    longitude: 35.8100,
    area_hectares: 2.8,
    confidence: 'high',
    status: 'unverified',
    alert_type: 'fire',
    source: 'pyeo',
    description: 'Burn scar detected. Likely slash-and-burn agriculture.'
  },
  {
    id: 'MAU-2025-003',
    forest_name: 'Mau Forest Complex',
    forest_id: 'mau',
    detected_date: '2025-12-19',
    latitude: -0.5500,
    longitude: 35.8600,
    area_hectares: 6.2,
    confidence: 'high',
    status: 'verified',
    alert_type: 'deforestation',
    source: 'gfw',
    description: 'Extensive tree cover loss in Olpusimoru section.'
  },
  {
    id: 'MAU-2025-004',
    forest_name: 'Mau Forest Complex',
    forest_id: 'mau',
    detected_date: '2025-12-17',
    latitude: -0.6400,
    longitude: 35.7800,
    area_hectares: 3.1,
    confidence: 'medium',
    status: 'unverified',
    alert_type: 'encroachment',
    source: 'pyeo',
    description: 'Settlement expansion detected at forest boundary.'
  },
  {
    id: 'MAU-2025-005',
    forest_name: 'Mau Forest Complex',
    forest_id: 'mau',
    detected_date: '2025-12-14',
    latitude: -0.5200,
    longitude: 35.9000,
    area_hectares: 1.9,
    confidence: 'high',
    status: 'responded',
    alert_type: 'deforestation',
    source: 'pyeo',
    description: 'Logging detected near Londiani area. Authorities notified.'
  },

  // Aberdare Forest Alerts
  {
    id: 'ABD-2025-001',
    forest_name: 'Aberdare Forest',
    forest_id: 'aberdare',
    detected_date: '2025-12-23',
    latitude: -0.4167,
    longitude: 36.7000,
    area_hectares: 1.5,
    confidence: 'high',
    status: 'unverified',
    alert_type: 'deforestation',
    source: 'pyeo',
    description: 'Tree removal detected near planned road corridor.'
  },
  {
    id: 'ABD-2025-002',
    forest_name: 'Aberdare Forest',
    forest_id: 'aberdare',
    detected_date: '2025-12-16',
    latitude: -0.4500,
    longitude: 36.7300,
    area_hectares: 0.7,
    confidence: 'medium',
    status: 'false_alarm',
    alert_type: 'deforestation',
    source: 'gfw',
    description: 'Initial alert - later confirmed as natural tree fall from storm.'
  },
  {
    id: 'ABD-2025-003',
    forest_name: 'Aberdare Forest',
    forest_id: 'aberdare',
    detected_date: '2025-12-12',
    latitude: -0.3900,
    longitude: 36.6800,
    area_hectares: 2.1,
    confidence: 'high',
    status: 'verified',
    alert_type: 'encroachment',
    source: 'pyeo',
    description: 'Agricultural plots expanding into forest reserve.'
  },

  // Mt. Kenya Forest Alerts
  {
    id: 'MTK-2025-001',
    forest_name: 'Mt. Kenya Forest',
    forest_id: 'mt_kenya',
    detected_date: '2025-12-24',
    latitude: -0.1521,
    longitude: 37.3084,
    area_hectares: 3.2,
    confidence: 'high',
    status: 'unverified',
    alert_type: 'deforestation',
    source: 'pyeo',
    description: 'Clearing detected on western slopes. Possible illegal logging.'
  },
  {
    id: 'MTK-2025-002',
    forest_name: 'Mt. Kenya Forest',
    forest_id: 'mt_kenya',
    detected_date: '2025-12-20',
    latitude: -0.1800,
    longitude: 37.2800,
    area_hectares: 1.8,
    confidence: 'high',
    status: 'unverified',
    alert_type: 'fire',
    source: 'gfw',
    description: 'Fire damage detected in plantation section.'
  },
  {
    id: 'MTK-2025-003',
    forest_name: 'Mt. Kenya Forest',
    forest_id: 'mt_kenya',
    detected_date: '2025-12-11',
    latitude: -0.1300,
    longitude: 37.3500,
    area_hectares: 0.9,
    confidence: 'medium',
    status: 'verified',
    alert_type: 'deforestation',
    source: 'pyeo',
    description: 'Selective logging of cedar trees detected.'
  },

  // Kakamega Forest Alerts
  {
    id: 'KAK-2025-001',
    forest_name: 'Kakamega Forest',
    forest_id: 'kakamega',
    detected_date: '2025-12-22',
    latitude: 0.2333,
    longitude: 34.8667,
    area_hectares: 0.6,
    confidence: 'high',
    status: 'unverified',
    alert_type: 'deforestation',
    source: 'pyeo',
    description: 'Small-scale clearing at forest edge.'
  },
  {
    id: 'KAK-2025-002',
    forest_name: 'Kakamega Forest',
    forest_id: 'kakamega',
    detected_date: '2025-12-18',
    latitude: 0.2500,
    longitude: 34.8900,
    area_hectares: 1.1,
    confidence: 'medium',
    status: 'responded',
    alert_type: 'encroachment',
    source: 'gfw',
    description: 'Farming activity detected within reserve boundary.'
  },

  // Arabuko-Sokoke Alerts
  {
    id: 'ARB-2025-001',
    forest_name: 'Arabuko-Sokoke Forest',
    forest_id: 'arabuko_sokoke',
    detected_date: '2025-12-21',
    latitude: -3.3000,
    longitude: 39.8833,
    area_hectares: 2.4,
    confidence: 'high',
    status: 'unverified',
    alert_type: 'deforestation',
    source: 'pyeo',
    description: 'Clearing for charcoal production suspected.'
  },
  {
    id: 'ARB-2025-002',
    forest_name: 'Arabuko-Sokoke Forest',
    forest_id: 'arabuko_sokoke',
    detected_date: '2025-12-13',
    latitude: -3.2800,
    longitude: 39.9100,
    area_hectares: 1.7,
    confidence: 'high',
    status: 'verified',
    alert_type: 'deforestation',
    source: 'gfw',
    description: 'Tree cover loss confirmed near Gede ruins.'
  },

  // Mt. Elgon Alerts
  {
    id: 'ELG-2025-001',
    forest_name: 'Mt. Elgon Forest',
    forest_id: 'mt_elgon',
    detected_date: '2025-12-19',
    latitude: 1.1167,
    longitude: 34.5500,
    area_hectares: 3.8,
    confidence: 'high',
    status: 'unverified',
    alert_type: 'deforestation',
    source: 'pyeo',
    description: 'Large-scale clearing on southern slopes.'
  },

  // Cherangani Hills Alerts
  {
    id: 'CHE-2025-001',
    forest_name: 'Cherangani Hills Forest',
    forest_id: 'cherangani',
    detected_date: '2025-12-17',
    latitude: 1.2000,
    longitude: 35.4500,
    area_hectares: 2.2,
    confidence: 'medium',
    status: 'unverified',
    alert_type: 'deforestation',
    source: 'gfw',
    description: 'Logging activity suspected in northern section.'
  },
  {
    id: 'CHE-2025-002',
    forest_name: 'Cherangani Hills Forest',
    forest_id: 'cherangani',
    detected_date: '2025-12-09',
    latitude: 1.1800,
    longitude: 35.4200,
    area_hectares: 4.1,
    confidence: 'high',
    status: 'verified',
    alert_type: 'encroachment',
    source: 'pyeo',
    description: 'Settlement expansion confirmed. Eviction notice issued.'
  }
];

// Helper functions
export const getAlertsByForest = (forestId: string): Alert[] => {
  return mockAlerts.filter(a => a.forest_id === forestId);
};

export const getAlertsByDateRange = (startDate: string, endDate: string): Alert[] => {
  return mockAlerts.filter(a => a.detected_date >= startDate && a.detected_date <= endDate);
};

export const getAlertsByConfidence = (confidence: Alert['confidence']): Alert[] => {
  return mockAlerts.filter(a => a.confidence === confidence);
};

export const getAlertStats = () => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return {
    total_alerts: mockAlerts.length,
    alerts_this_week: mockAlerts.filter(a => a.detected_date >= weekAgo).length,
    alerts_this_month: mockAlerts.filter(a => a.detected_date >= monthAgo).length,
    total_area_affected: mockAlerts.reduce((sum, a) => sum + a.area_hectares, 0),
    unverified_count: mockAlerts.filter(a => a.status === 'unverified').length,
    by_forest: mockAlerts.reduce((acc, a) => {
      acc[a.forest_id] = (acc[a.forest_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    by_type: mockAlerts.reduce((acc, a) => {
      acc[a.alert_type] = (acc[a.alert_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
};
