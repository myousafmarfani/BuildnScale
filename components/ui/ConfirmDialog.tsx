'use client'
import { useEffect, useRef } from 'react'
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      className="guide-dialog !max-w-sm p-6"
      aria-label={title}
      onCancel={onClose}
      onClose={onClose}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-6 mt-3 text-sm leading-relaxed text-muted">
        {description}
      </p>
      <div className="flex flex-wrap gap-3">
        <button autoFocus className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-primary"
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
