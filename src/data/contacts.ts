// src/data/contacts.ts

import { CivilSocietyContact } from '@/types';

export const civilSocietyContacts: CivilSocietyContact[] = [
  {
    id: 'gbm',
    name: 'Green Belt Movement',
    type: 'ngo',
    focus_area: 'Community-based tree planting and conservation',
    contact_email: 'info@greenbeltmovement.org',
    website: 'https://www.greenbeltmovement.org',
    forests: ['all']
  },
  {
    id: 'kfs',
    name: 'Kenya Forest Service',
    type: 'ngo',
    focus_area: 'Government forest management agency',
    contact_email: 'info@kenyaforestservice.org',
    website: 'http://www.kenyaforestservice.org',
    forests: ['all']
  },
  {
    id: 'karura-cfa',
    name: 'Friends of Karura Forest',
    type: 'cfa',
    focus_area: 'Urban forest conservation and community engagement',
    contact_email: 'info@friendsofkarura.org',
    website: 'https://www.friendsofkarura.org',
    forests: ['karura']
  },
  {
    id: 'mau-cfa',
    name: 'Mau Forest CFA Network',
    type: 'cfa',
    focus_area: 'Mau Forest restoration and protection',
    contact_email: 'maucfa@example.org',
    forests: ['mau']
  },
  {
    id: 'nature-kenya',
    name: 'Nature Kenya',
    type: 'ngo',
    focus_area: 'Biodiversity conservation and Important Bird Areas',
    contact_email: 'office@naturekenya.org',
    website: 'https://naturekenya.org',
    forests: ['kakamega', 'arabuko']
  },
  {
    id: 'wwf-kenya',
    name: 'WWF Kenya',
    type: 'ngo',
    focus_area: 'Wildlife and forest conservation',
    contact_email: 'info@wwfkenya.org',
    website: 'https://www.wwfkenya.org',
    forests: ['all']
  },
  {
    id: 'keja',
    name: 'Kenya Environmental Journalists Association',
    type: 'media',
    focus_area: 'Environmental journalism and public awareness',
    contact_email: 'info@keja.or.ke',
    forests: ['all']
  },
  {
    id: 'act-kenya',
    name: 'ACT! Kenya',
    type: 'ngo',
    focus_area: 'Civil society strengthening and advocacy',
    contact_email: 'info@act.or.ke',
    website: 'https://www.act.or.ke',
    forests: ['all']
  }
];

export function getContactsForForest(forestId: string): CivilSocietyContact[] {
  return civilSocietyContacts.filter(
    (c: CivilSocietyContact) => c.forests.includes(forestId) || c.forests.includes('all')
  );
}