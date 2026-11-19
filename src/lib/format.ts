import type { Language } from '../types'
import { toLanguageLocale } from './validation'

export function formatMoney(value: number, language: Language): string {
  return new Intl.NumberFormat(toLanguageLocale(language), {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatDate(iso: string, language: Language): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(toLanguageLocale(language), { dateStyle: 'long' }).format(date)
}
