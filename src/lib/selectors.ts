import type { Asset, ReadinessTaskView, UserProfile } from '../types'

export type ReadinessStatus = 'belum' | 'dalam' | 'hampir' | 'lengkap'

export function calculateAssetTotal(assets: Asset[]): number {
  return assets.reduce((sum, item) => sum + item.estimatedValue, 0)
}

export function calculateReadinessScore(profile: UserProfile): number {
  return (
    (profile.assets.length > 0 ? 25 : 0) +
    (profile.contacts.length > 0 ? 20 : 0) +
    (profile.readiness.documents ? 20 : 0) +
    (profile.readiness.planning ? 20 : 0) +
    (profile.readiness.emergency ? 15 : 0)
  )
}

export function getReadinessStatus(score: number): ReadinessStatus {
  if (score >= 100) return 'lengkap'
  if (score >= 70) return 'hampir'
  if (score >= 40) return 'dalam'
  return 'belum'
}

export function getReadinessTasks(profile: UserProfile): ReadinessTaskView[] {
  return [
    {
      id: 'assets',
      points: 25,
      completed: profile.assets.length > 0,
      mode: 'derived',
    },
    {
      id: 'family',
      points: 20,
      completed: profile.contacts.length > 0,
      mode: 'derived',
    },
    {
      id: 'documents',
      points: 20,
      completed: profile.readiness.documents,
      mode: 'manual',
    },
    {
      id: 'planning',
      points: 20,
      completed: profile.readiness.planning,
      mode: 'manual',
    },
    {
      id: 'emergency',
      points: 15,
      completed: profile.readiness.emergency,
      mode: 'manual',
    },
  ]
}
