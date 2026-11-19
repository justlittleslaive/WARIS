import type { ReactNode } from 'react'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  title: string
  body: ReactNode
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-canvas"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              danger ? 'bg-danger hover:bg-red-700' : 'bg-brand hover:bg-brand-dark'
            }`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm leading-relaxed text-ink-soft">{body}</div>
    </Modal>
  )
}
