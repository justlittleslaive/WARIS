interface EmptyStateProps {
  title: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="ui-panel flex flex-col items-center gap-4 px-6 py-12 text-center">
      <p className="text-sm font-medium text-ink-soft">{title}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="ui-button"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
