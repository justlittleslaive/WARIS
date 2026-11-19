interface EmptyStateProps {
  title: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-surface px-6 py-10 text-center">
      <p className="text-sm font-medium text-ink-soft">{title}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
