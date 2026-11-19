import type {
  Asset,
  AssetCategory,
  DemoPersonaId,
  FamilyContact,
  Language,
  LegalTrack,
  MalaysianState,
  Relationship,
  UserProfile,
} from '../types';
import { createId } from '../lib/id';

export interface DemoPersonaMeta {
  id: DemoPersonaId;
  name: string;
  track: LegalTrack;
  state?: MalaysianState;
  score: number;
  assetCount: number;
  contactCount: number;
  totalValue: number;
}

export const DEMO_PERSONAS: DemoPersonaMeta[] = [
  {
    id: 'ahmad',
    name: 'Ahmad Hakimi',
    track: 'muslim',
    score: 65,
    assetCount: 4,
    contactCount: 3,
    totalValue: 330000,
  },
  {
    id: 'lim',
    name: 'Lim Wei Ming',
    track: 'non-muslim',
    score: 80,
    assetCount: 4,
    contactCount: 2,
    totalValue: 755000,
  },
  {
    id: 'rajesh',
    name: 'Rajesh Kumar',
    track: 'non-muslim',
    score: 45,
    assetCount: 4,
    contactCount: 2,
    totalValue: 545000,
  },
  {
    id: 'anak-dayang',
    name: 'Anak Dayang',
    track: 'native-customary',
    state: 'Sarawak',
    score: 60,
    assetCount: 3,
    contactCount: 2,
    totalValue: 187000,
  },
];

interface AssetSeed {
  name: string;
  category: AssetCategory;
  institution: string;
  value: number;
  documentLocation: string;
}

interface ContactSeed {
  name: string;
  relationship: Relationship;
  isPrimaryContact: boolean;
}

interface PersonaSeed {
  name: string;
  track: LegalTrack;
  state?: MalaysianState;
  documents: boolean;
  planning: boolean;
  emergency: boolean;
  assets: AssetSeed[];
  contacts: ContactSeed[];
}

const PERSONAS: Record<DemoPersonaId, PersonaSeed> = {
  ahmad: {
    name: 'Ahmad Hakimi',
    track: 'muslim',
    documents: true,
    planning: false,
    emergency: false,
    assets: [
      {
        name: 'Rumah Kediaman',
        category: 'Property',
        institution: '',
        value: 250000,
        documentLocation: 'Fail Biru di Rumah',
      },
      {
        name: 'Simpanan ASB',
        category: 'Investments (ASB, unit trust, shares)',
        institution: 'ASNB',
        value: 35000,
        documentLocation: 'Portal ASNB (rujukan dokumen sahaja)',
      },
      {
        name: 'Akaun Simpanan',
        category: 'Bank Savings',
        institution: 'Bank Demo',
        value: 15000,
        documentLocation: 'Fail Penyata Bank',
      },
      {
        name: 'Kereta Perodua Myvi',
        category: 'Vehicle',
        institution: '',
        value: 30000,
        documentLocation: 'Fail Kenderaan',
      },
    ],
    contacts: [
      { name: 'Siti Aminah', relationship: 'Spouse', isPrimaryContact: true },
      { name: 'Aisyah', relationship: 'Child', isPrimaryContact: false },
      { name: 'Encik Rahman', relationship: 'Parent', isPrimaryContact: false },
    ],
  },
  lim: {
    name: 'Lim Wei Ming',
    track: 'non-muslim',
    documents: true,
    planning: false,
    emergency: true,
    assets: [
      {
        name: 'Teres',
        category: 'Property',
        institution: '',
        value: 420000,
        documentLocation: 'Fail Hartanah di Rumah',
      },
      {
        name: 'Shares in family Sdn Bhd',
        category: 'Business Interest',
        institution: 'Syarikat Keluarga Demo',
        value: 180000,
        documentLocation: 'Fail Syarikat',
      },
      {
        name: 'EPF',
        category: 'EPF / KWSP',
        institution: 'KWSP',
        value: 95000,
        documentLocation: 'Portal KWSP (rujukan)',
      },
      {
        name: 'Unit trust',
        category: 'Investments (ASB, unit trust, shares)',
        institution: 'Fund Demo',
        value: 60000,
        documentLocation: 'Fail Pelaburan',
      },
    ],
    contacts: [
      { name: 'Tan Mei Ling', relationship: 'Spouse', isPrimaryContact: true },
      { name: 'Lim Jia Hao', relationship: 'Child', isPrimaryContact: false },
    ],
  },
  rajesh: {
    name: 'Rajesh Kumar',
    track: 'non-muslim',
    documents: false,
    planning: false,
    emergency: false,
    assets: [
      {
        name: 'Apartment',
        category: 'Property',
        institution: '',
        value: 300000,
        documentLocation: 'Fail Hartanah',
      },
      {
        name: 'Gold and jewellery',
        category: 'Cash, Gold and Jewellery',
        institution: '',
        value: 45000,
        documentLocation: 'Peti Simpanan',
      },
      {
        name: 'EPF',
        category: 'EPF / KWSP',
        institution: 'KWSP',
        value: 120000,
        documentLocation: 'Portal KWSP',
      },
      {
        name: 'Fixed deposit',
        category: 'Bank Savings',
        institution: 'Bank Demo',
        value: 80000,
        documentLocation: 'Fail Penyata Bank',
      },
    ],
    contacts: [
      { name: 'Kavitha', relationship: 'Spouse', isPrimaryContact: true },
      { name: 'Anusha', relationship: 'Child', isPrimaryContact: false },
    ],
  },
  'anak-dayang': {
    name: 'Anak Dayang',
    track: 'native-customary',
    state: 'Sarawak',
    documents: false,
    planning: false,
    emergency: true,
    assets: [
      {
        name: 'NCR farmland (indicative)',
        category: 'Property',
        institution: '',
        value: 150000,
        documentLocation: 'Dokumen Tanah NCR',
      },
      {
        name: 'Savings',
        category: 'Bank Savings',
        institution: 'Bank Demo',
        value: 12000,
        documentLocation: 'Fail Penyata Bank',
      },
      {
        name: 'Vehicle',
        category: 'Vehicle',
        institution: '',
        value: 25000,
        documentLocation: 'Fail Kenderaan',
      },
    ],
    contacts: [
      { name: 'Jimbun', relationship: 'Spouse', isPrimaryContact: true },
      { name: 'Rina', relationship: 'Child', isPrimaryContact: false },
    ],
  },
};

export function getDemoPersonaMeta(id: DemoPersonaId): DemoPersonaMeta {
  const meta = DEMO_PERSONAS.find((persona) => persona.id === id);
  if (!meta) throw new Error(`Unknown demo persona: ${id}`);
  return meta;
}

export function buildDemoProfile(id: DemoPersonaId, language: Language): UserProfile {
  const seed = PERSONAS[id];
  const base = Date.now();
  const assets: Asset[] = seed.assets.map((asset, index) => ({
    id: createId(),
    name: asset.name,
    category: asset.category,
    institution: asset.institution,
    estimatedValue: asset.value,
    documentLocation: asset.documentLocation,
    createdAt: new Date(base - index * 60_000).toISOString(),
  }));
  const contacts: FamilyContact[] = seed.contacts.map((contact) => ({
    id: createId(),
    name: contact.name,
    relationship: contact.relationship,
    phone: '',
    isPrimaryContact: contact.isPrimaryContact,
  }));

  return {
    name: seed.name,
    legalTrack: seed.track,
    state: seed.state,
    language,
    assets,
    contacts,
    readiness: {
      documents: seed.documents,
      planning: seed.planning,
      emergency: seed.emergency,
    },
    updatedAt: new Date().toISOString(),
  };
}
