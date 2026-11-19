import type { LegalTrack } from '../types';
import type { DictKey } from './i18n';

export interface LearnCard {
  id: string;
  titleKey: DictKey;
  introKey: DictKey;
  whyKey: DictKey;
  tipKey: DictKey;
  linkLabel: string;
  url: string;
}

export const MUSLIM_CARDS: LearnCard[] = [
  {
    id: 'faraid',
    titleKey: 'learn.card.faraid.title',
    introKey: 'learn.card.faraid.intro',
    whyKey: 'learn.card.faraid.why',
    tipKey: 'learn.card.faraid.tip',
    linkLabel: 'malaysia.gov.my',
    url: 'https://www.malaysia.gov.my/categories/kematian-pusaka',
  },
  {
    id: 'wasiat',
    titleKey: 'learn.card.wasiat.title',
    introKey: 'learn.card.wasiat.intro',
    whyKey: 'learn.card.wasiat.why',
    tipKey: 'learn.card.wasiat.tip',
    linkLabel: 'malaysia.gov.my',
    url: 'https://www.malaysia.gov.my/categories/kematian-pusaka',
  },
  {
    id: 'hibah',
    titleKey: 'learn.card.hibah.title',
    introKey: 'learn.card.hibah.intro',
    whyKey: 'learn.card.hibah.why',
    tipKey: 'learn.card.hibah.tip',
    linkLabel: 'efaraid.mais.gov.my',
    url: 'https://efaraid.mais.gov.my/hibah/',
  },
  {
    id: 'takaful',
    titleKey: 'learn.card.takaful.title',
    introKey: 'learn.card.takaful.intro',
    whyKey: 'learn.card.takaful.why',
    tipKey: 'learn.card.takaful.tip',
    linkLabel: 'amanahraya.my',
    url: 'https://www.amanahraya.my/',
  },
];

export const NON_MUSLIM_CARDS: LearnCard[] = [
  {
    id: 'wills',
    titleKey: 'learn.card.wills.title',
    introKey: 'learn.card.wills.intro',
    whyKey: 'learn.card.wills.why',
    tipKey: 'learn.card.wills.tip',
    linkLabel: 'malaysianbar.org.my',
    url: 'https://www.malaysianbar.org.my/',
  },
  {
    id: 'intestacy',
    titleKey: 'learn.card.intestacy.title',
    introKey: 'learn.card.intestacy.intro',
    whyKey: 'learn.card.intestacy.why',
    tipKey: 'learn.card.intestacy.tip',
    linkLabel: 'jkptg.gov.my',
    url: 'https://www.jkptg.gov.my/ms/perkhidmatan/pembahagian-harta-pusaka',
  },
  {
    id: 'probate',
    titleKey: 'learn.card.probate.title',
    introKey: 'learn.card.probate.intro',
    whyKey: 'learn.card.probate.why',
    tipKey: 'learn.card.probate.tip',
    linkLabel: 'jkptg.gov.my',
    url: 'https://www.jkptg.gov.my/ms/perkhidmatan/pembahagian-harta-pusaka',
  },
  {
    id: 'epf',
    titleKey: 'learn.card.epf.title',
    introKey: 'learn.card.epf.intro',
    whyKey: 'learn.card.epf.why',
    tipKey: 'learn.card.epf.tip',
    linkLabel: 'amanahraya.my',
    url: 'https://www.amanahraya.my/',
  },
];

export const NATIVE_CARDS: LearnCard[] = [
  {
    id: 'ncr',
    titleKey: 'learn.card.ncr.title',
    introKey: 'learn.card.ncr.intro',
    whyKey: 'learn.card.ncr.why',
    tipKey: 'learn.card.ncr.tip',
    linkLabel: 'malaysia.gov.my',
    url: 'https://www.malaysia.gov.my/categories/kematian-pusaka',
  },
  {
    id: 'native-court',
    titleKey: 'learn.card.nativeCourt.title',
    introKey: 'learn.card.nativeCourt.intro',
    whyKey: 'learn.card.nativeCourt.why',
    tipKey: 'learn.card.nativeCourt.tip',
    linkLabel: 'malaysia.gov.my',
    url: 'https://www.malaysia.gov.my/categories/kematian-pusaka',
  },
  {
    id: 'land-succession',
    titleKey: 'learn.card.landSuccession.title',
    introKey: 'learn.card.landSuccession.intro',
    whyKey: 'learn.card.landSuccession.why',
    tipKey: 'learn.card.landSuccession.tip',
    linkLabel: 'jkptg.gov.my',
    url: 'https://www.jkptg.gov.my/ms/perkhidmatan/pembahagian-harta-pusaka',
  },
  {
    id: 'native-docs',
    titleKey: 'learn.card.nativeDocs.title',
    introKey: 'learn.card.nativeDocs.intro',
    whyKey: 'learn.card.nativeDocs.why',
    tipKey: 'learn.card.nativeDocs.tip',
    linkLabel: 'malaysia.gov.my',
    url: 'https://www.malaysia.gov.my/categories/kematian-pusaka',
  },
];

export const TRACK_CARDS: Record<LegalTrack, LearnCard[]> = {
  muslim: MUSLIM_CARDS,
  'non-muslim': NON_MUSLIM_CARDS,
  'native-customary': NATIVE_CARDS,
  unsure: [...MUSLIM_CARDS, ...NON_MUSLIM_CARDS],
};

export const ADVICE_URL = 'https://www.malaysianbar.org.my/';
