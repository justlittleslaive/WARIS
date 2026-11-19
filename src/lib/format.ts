import type { Language } from '../types';

function localeFor(language: Language): string {
  return language === 'en' ? 'en-MY' : 'ms-MY';
}

export function formatMoney(value: number, language: Language): string {
  return new Intl.NumberFormat(localeFor(language), {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: Date | string, language: Language): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat(localeFor(language), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
