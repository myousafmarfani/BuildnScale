import { IconBook2, IconSettings } from '@tabler/icons-react'
export function ToolPageIntro({
  eyebrow,
  title,
  description,
  children,
  onGuide,
  onSettings,
  settingsDisabled = false,
}: {
  eyebrow: string
  title: string
  description: string
  children?: React.ReactNode
  onGuide?: () => void
  onSettings?: () => void
  settingsDisabled?: boolean
}) {
  return (
    <div className="tool-page-intro">
      <div className="min-w-0">
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h1 className="tool-page-title">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {onGuide && (
          <button
            onClick={onGuide}
            className="tool-button"
            aria-label="How to use this tool"
          >
            <IconBook2 className="h-4 w-4" />
            <span className="hidden sm:inline">How it works</span>
          </button>
        )}
        {onSettings && (
          <button
            onClick={onSettings}
            disabled={settingsDisabled}
            className="tool-button"
            aria-label={
              settingsDisabled
                ? 'Pause timer to change settings'
                : 'Tool settings'
            }
          >
            <IconSettings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        )}
      </div>
    </div>
  )
}
export function EmptyToolState({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="tool-empty-state">
      <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-subtle font-mono text-lg text-teal">
        +
      </span>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mb-5 mt-2 max-w-sm text-sm leading-relaxed text-muted">
        {description}
      </p>
      {children}
    </div>
  )
}
