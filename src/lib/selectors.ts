import type { Asset, ReadinessTaskId, ReadinessTaskView, UserProfile } from '../types';
import type { DictKey, Translate } from '../data/i18n';

export type ReadinessStatusId = 'complete' | 'almost' | 'inProgress' | 'notReady';

export const STATUS_KEYS: Record<ReadinessStatusId, DictKey> = {
  complete: 'status.complete',
  almost: 'status.almost',
  inProgress: 'status.inProgress',
  notReady: 'status.notReady',
};

export function calculateAssetTotal(assets: Asset[]): number {
  return assets.reduce((sum, item) => sum + item.estimatedValue, 0);
}

export function calculateReadinessScore(profile: UserProfile): number {
  return (
    (profile.assets.length > 0 ? 25 : 0) +
    (profile.contacts.length > 0 ? 20 : 0) +
    (profile.readiness.documents ? 20 : 0) +
    (profile.readiness.planning ? 20 : 0) +
    (profile.readiness.emergency ? 15 : 0)
  );
}

export function getReadinessStatus(score: number): ReadinessStatusId {
  if (score >= 100) return 'complete';
  if (score >= 70) return 'almost';
  if (score >= 40) return 'inProgress';
  return 'notReady';
}

export function getReadinessTasks(profile: UserProfile, t: Translate): ReadinessTaskView[] {
  return [
    {
      id: 'assets',
      label: t('task.assets.label'),
      description: t('task.assets.desc'),
      points: 25,
      completed: profile.assets.length > 0,
      mode: 'derived',
    },
    {
      id: 'family',
      label: t('task.family.label'),
      description: t('task.family.desc'),
      points: 20,
      completed: profile.contacts.length > 0,
      mode: 'derived',
    },
    {
      id: 'documents',
      label: t('task.documents.label'),
      description: t('task.documents.desc'),
      points: 20,
      completed: profile.readiness.documents,
      mode: 'manual',
    },
    {
      id: 'planning',
      label: t('task.planning.label'),
      description: t('task.planning.desc'),
      points: 20,
      completed: profile.readiness.planning,
      mode: 'manual',
    },
    {
      id: 'emergency',
      label: t('task.emergency.label'),
      description: t('task.emergency.desc'),
      points: 15,
      completed: profile.readiness.emergency,
      mode: 'manual',
    },
  ];
}

export function getTaskPath(id: ReadinessTaskId): string {
  switch (id) {
    case 'assets':
      return '/assets';
    case 'family':
      return '/family';
    case 'emergency':
      return '/summary';
    default:
      return '/readiness';
  }
}

export function sortAssetsByNewest(assets: Asset[]): Asset[] {
  return [...assets].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}
