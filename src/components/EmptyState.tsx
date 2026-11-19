import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <div className="text-slate-400">{icon}</div>
      <p className="text-sm text-slate-600">{message}</p>
      {action}
    </div>
  );
}
