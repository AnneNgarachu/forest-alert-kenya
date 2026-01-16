import { Forest } from '@/types';

// Real forests from PyEO monitoring data - Mt. Elgon region, Western Kenya
// Data source: University of Leicester PyEO system

export const forests: Forest[] = [
  {
    id: 'mount_elgon',
    name: 'Mount Elgon',
    latitude: 1.1483,
    longitude: 34.7426,
    area_hectares: 73000,
    region: 'Trans Nzoia / Bungoma',
    description: 'Extinct shield volcano straddling Kenya-Uganda border. Important water catchment and biodiversity hotspot. PyEO monitoring active since 2023 with 863 alerts detected.',
    known_threats: ['Encroachment', 'Illegal logging', 'Charcoal burning', 'Cultivation on steep slopes'],
    conservation_status: 'National Reserve'
  },
  {
    id: 'kapkanyar',
    name: 'Kapkanyar',
    latitude: 1.1946,
    longitude: 35.2065,
    area_hectares: 15000,
    region: 'West Pokot',
    description: 'Part of the Cherangani Hills ecosystem. Critical water tower for the Nzoia River basin. 334 PyEO alerts detected.',
    known_threats: ['Agricultural expansion', 'Illegal logging', 'Settlement encroachment'],
    conservation_status: 'Forest Reserve'
  },
  {
    id: 'kiptaberr',
    name: 'Kiptaberr',
    latitude: 1.1128,
    longitude: 35.2763,
    area_hectares: 12000,
    region: 'Trans Nzoia / Elgeyo-Marakwet',
    description: 'Highland forest in the North Rift region. Part of the Cherangani ecosystem. 303 PyEO alerts detected.',
    known_threats: ['Deforestation', 'Charcoal production', 'Grazing'],
    conservation_status: 'Forest Reserve'
  },
  {
    id: 'chemurokoi',
    name: 'Chemurokoi',
    latitude: 0.9879,
    longitude: 35.4343,
    area_hectares: 8000,
    region: 'West Pokot',
    description: 'Part of Cherangani Hills complex. Important for local water supply and biodiversity. 298 PyEO alerts detected.',
    known_threats: ['Illegal logging', 'Agricultural encroachment', 'Charcoal burning'],
    conservation_status: 'Forest Reserve'
  },
  {
    id: 'kamatira',
    name: 'Kamatira',
    latitude: 1.2701,
    longitude: 35.1917,
    area_hectares: 5000,
    region: 'West Pokot',
    description: 'Highland forest reserve in West Pokot County. 159 PyEO alerts detected.',
    known_threats: ['Deforestation', 'Settlement expansion'],
    conservation_status: 'Forest Reserve'
  },
  {
    id: 'kitalale',
    name: 'Kitalale',
    latitude: 0.9876,
    longitude: 34.9152,
    area_hectares: 3500,
    region: 'Trans Nzoia',
    description: 'Small forest reserve near Kitale town. Under significant pressure from urban expansion. 134 PyEO alerts detected - highest per-hectare alert rate.',
    known_threats: ['Urban encroachment', 'Illegal logging', 'Land grabbing'],
    conservation_status: 'Forest Reserve'
  },
  {
    id: 'kapolet',
    name: 'Kapolet',
    latitude: 1.1697,
    longitude: 35.1599,
    area_hectares: 2500,
    region: 'Trans Nzoia',
    description: 'Forest reserve on the slopes of the Cherangani Hills. 53 PyEO alerts detected.',
    known_threats: ['Encroachment', 'Illegal harvesting'],
    conservation_status: 'Forest Reserve'
  },
  {
    id: 'excision',
    name: 'Excision Area',
    latitude: 1.2259,
    longitude: 35.2346,
    area_hectares: 4000,
    region: 'West Pokot',
    description: 'Previously excised forest area now under restoration monitoring. 113 PyEO alerts detected.',
    known_threats: ['Re-encroachment', 'Illegal activities'],
    conservation_status: 'Forest Reserve (Restoration)'
  }
];

export const getForestById = (id: string): Forest | undefined => {
  return forests.find(f => f.id === id);
};

export const getForestsByRegion = (region: string): Forest[] => {
  return forests.filter(f => f.region.includes(region));
};