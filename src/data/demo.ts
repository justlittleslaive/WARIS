import type {
  Asset,
  DemoPersonaId,
  FamilyContact,
  Language,
  LegalTrack,
  MalaysianState,
  ManualReadiness,
  UserProfile,
} from '../types'

export interface DemoPersona {
  id: DemoPersonaId
  name: string
  legalTrack: LegalTrack
  state?: MalaysianState
  readiness: ManualReadiness
  assets: Asset[]
  contacts: FamilyContact[]
}

function asset(
  id: string,
  name: string,
  category: Asset['category'],
  institution: string,
  estimatedValue: number,
  documentLocation: string,
  createdAt: string,
): Asset {
  return { id, name, category, institution, estimatedValue, documentLocation, createdAt }
}

function contact(
  id: string,
  name: string,
  relationship: FamilyContact['relationship'],
  isPrimaryContact: boolean,
): FamilyContact {
  return { id, name, relationship, isPrimaryContact }
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'ahmad',
    name: 'Ahmad Hakimi',
    legalTrack: 'muslim',
    readiness: { documents: true, planning: false, emergency: false },
    assets: [
      asset('ahmad-a1', 'Rumah Kediaman', 'Property', '', 250000, 'Fail Biru di Rumah', '2026-11-01T02:00:00.000Z'),
      asset('ahmad-a2', 'Simpanan ASB', 'Investments (ASB, unit trust, shares)', 'ASNB', 35000, 'Portal ASNB (rujukan dokumen sahaja)', '2026-11-02T02:00:00.000Z'),
      asset('ahmad-a3', 'Akaun Simpanan', 'Bank Savings', 'Contoh Bank', 15000, 'Fail Penyata Bank', '2026-11-03T02:00:00.000Z'),
      asset('ahmad-a4', 'Kereta Perodua Myvi', 'Vehicle', '', 30000, 'Fail Kenderaan', '2026-11-04T02:00:00.000Z'),
    ],
    contacts: [
      contact('ahmad-c1', 'Siti Aminah', 'Spouse', true),
      contact('ahmad-c2', 'Aisyah', 'Child', false),
      contact('ahmad-c3', 'Encik Rahman', 'Parent', false),
    ],
  },
  {
    id: 'lim',
    name: 'Lim Wei Ming',
    legalTrack: 'non-muslim',
    readiness: { documents: true, planning: false, emergency: true },
    assets: [
      asset('lim-a1', 'Teres', 'Property', '', 420000, 'Fail Hartanah di Rumah', '2026-11-01T03:00:00.000Z'),
      asset('lim-a2', 'Shares in family Sdn Bhd', 'Business Interest', 'Contoh Syarikat Keluarga', 180000, 'Fail Syarikat', '2026-11-02T03:00:00.000Z'),
      asset('lim-a3', 'EPF', 'EPF / KWSP', 'KWSP', 95000, 'Portal KWSP (rujukan)', '2026-11-03T03:00:00.000Z'),
      asset('lim-a4', 'Unit trust', 'Investments (ASB, unit trust, shares)', 'Sample Fund', 60000, 'Fail Pelaburan', '2026-11-04T03:00:00.000Z'),
    ],
    contacts: [
      contact('lim-c1', 'Tan Mei Ling', 'Spouse', true),
      contact('lim-c2', 'Lim Jia Hao', 'Child', false),
    ],
  },
  {
    id: 'rajesh',
    name: 'Rajesh Kumar',
    legalTrack: 'non-muslim',
    readiness: { documents: false, planning: false, emergency: false },
    assets: [
      asset('rajesh-a1', 'Apartment', 'Property', '', 300000, 'Fail Hartanah', '2026-11-01T04:00:00.000Z'),
      asset('rajesh-a2', 'Gold and jewellery', 'Cash, Gold and Jewellery', '', 45000, 'Peti Simpanan', '2026-11-02T04:00:00.000Z'),
      asset('rajesh-a3', 'EPF', 'EPF / KWSP', 'KWSP', 120000, 'Portal KWSP', '2026-11-03T04:00:00.000Z'),
      asset('rajesh-a4', 'Fixed deposit', 'Bank Savings', 'Contoh Bank', 80000, 'Fail Penyata Bank', '2026-11-04T04:00:00.000Z'),
    ],
    contacts: [
      contact('rajesh-c1', 'Kavitha', 'Spouse', true),
      contact('rajesh-c2', 'Anusha', 'Child', false),
    ],
  },
  {
    id: 'anak-dayang',
    name: 'Anak Dayang',
    legalTrack: 'native-customary',
    state: 'Sarawak',
    readiness: { documents: false, planning: false, emergency: true },
    assets: [
      asset('dayang-a1', 'NCR farmland (indicative)', 'Property', '', 150000, 'Dokumen Tanah NCR', '2026-11-01T05:00:00.000Z'),
      asset('dayang-a2', 'Savings', 'Bank Savings', 'Contoh Bank', 12000, 'Fail Penyata Bank', '2026-11-02T05:00:00.000Z'),
      asset('dayang-a3', 'Vehicle', 'Vehicle', '', 25000, 'Fail Kenderaan', '2026-11-03T05:00:00.000Z'),
    ],
    contacts: [
      contact('dayang-c1', 'Jimbun', 'Spouse', true),
      contact('dayang-c2', 'Rina', 'Child', false),
    ],
  },
]

export const DEFAULT_PERSONA_ID: DemoPersonaId = 'ahmad'

export function getPersona(id: DemoPersonaId): DemoPersona {
  return DEMO_PERSONAS.find((persona) => persona.id === id) ?? DEMO_PERSONAS[0]
}

/**
 * Persona load replaces the record data but preserves the active UI language.
 */
export function buildDemoProfile(persona: DemoPersona, language: Language): UserProfile {
  const profile: UserProfile = {
    name: persona.name,
    legalTrack: persona.legalTrack,
    language,
    assets: persona.assets.map((item) => ({ ...item })),
    contacts: persona.contacts.map((item) => ({ ...item, isPrimaryContact: item.isPrimaryContact })),
    readiness: { ...persona.readiness },
    updatedAt: new Date().toISOString(),
  }
  if (persona.state) profile.state = persona.state
  return profile
}
