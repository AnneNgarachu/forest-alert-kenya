// src/data/forests.ts

import { Forest } from '@/types';

export const forests: Forest[] = [
  {
    id: 'karura',
    name: 'Karura Forest',
    latitude: -1.2364,
    longitude: 36.8291,
    area_hectares: 1041,
    region: 'Nairobi',
    description: 'One of the largest urban forests in the world.',
    known_threats: ['Urban encroachment', 'Illegal logging'],
    conservation_status: 'Protected'
  },
  {
    id: 'mau',
    name: 'Mau Forest Complex',
    latitude: -0.4833,
    longitude: 35.6500,
    area_hectares: 400000,
    region: 'Rift Valley',
    description: 'Kenya\'s largest indigenous montane forest.',
    known_threats: ['Settlement', 'Logging', 'Charcoal'],
    conservation_status: 'Critical'
  },
  {
    id: 'aberdare',
    name: 'Aberdare Forest',
    latitude: -0.4167,
    longitude: 36.7000,
    area_hectares: 76619,
    region: 'Central',
    description: 'Crucial water tower for Nairobi.',
    known_threats: ['Illegal logging', 'Poaching'],
    conservation_status: 'Protected'
  },
  {
    id: 'mt_kenya',
    name: 'Mt. Kenya Forest',
    latitude: -0.1521,
    longitude: 37.3084,
    area_hectares: 71500,
    region: 'Central',
    description: 'UNESCO World Heritage Site.',
    known_threats: ['Logging', 'Fires', 'Agriculture'],
    conservation_status: 'Protected'
  },
  {
    id: 'kakamega',
    name: 'Kakamega Forest',
    latitude: 0.2833,
    longitude: 34.8500,
    area_hectares: 23800,
    region: 'Western',
    description: 'Kenya\'s only tropical rainforest.',
    known_threats: ['Encroachment', 'Firewood'],
    conservation_status: 'Protected'
  },
  {
    id: 'arabuko',
    name: 'Arabuko-Sokoke Forest',
    latitude: -3.2833,
    longitude: 39.9167,
    area_hectares: 42000,
    region: 'Coast',
    description: 'Largest coastal forest in East Africa.',
    known_threats: ['Logging', 'Poaching'],
    conservation_status: 'Protected'
  },
  {
    id: 'mt_elgon',
    name: 'Mt. Elgon Forest',
    latitude: 1.1167,
    longitude: 34.5500,
    area_hectares: 73706,
    region: 'Western',
    description: 'Trans-boundary forest on Kenya-Uganda border.',
    known_threats: ['Cross-border logging', 'Mining'],
    conservation_status: 'Protected'
  },
  {
    id: 'cherangani',
    name: 'Cherangani Hills',
    latitude: 1.1667,
    longitude: 35.4500,
    area_hectares: 114000,
    region: 'Rift Valley',
    description: 'Important water tower.',
    known_threats: ['Agriculture', 'Logging'],
    conservation_status: 'Vulnerable'
  }
];

export function getForestById(id: string): Forest | undefined {
  return forests.find(f => f.id === id);
}