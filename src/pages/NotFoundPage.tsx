import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export function NotFoundPage() {
  const { t } = useProfile();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <MapPinOff className="h-12 w-12 text-slate-400" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{t('notFound.title')}</h1>
      <p className="mt-2 text-sm text-slate-600">{t('notFound.desc')}</p>
      <Link to="/" className="btn-primary mt-5">
        {t('notFound.home')}
      </Link>
    </div>
  );
}
