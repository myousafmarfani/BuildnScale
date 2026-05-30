"use client"

import Link from "next/link"
import { IconShare, IconDownload, IconChartBar } from "@tabler/icons-react"

interface BottomBarProps {
  progress?: number
  progressLabel?: string
  dateNav?: { prev: string; label: string; next: string }
}

export function BottomBar({
  progress = 65,
  progressLabel = "5 / 8 tasks in blocks",
  dateNav,
}: BottomBarProps) {
  return (
    <footer className="border-t border-border bg-bg" style={{ height: 44 }}>
      <div className="flex h-full items-center justify-between px-4 text-sm">
        {dateNav ? (
          <div className="flex items-center gap-4 text-muted">
            <span className="cursor-pointer text-tertiary hover:text-muted">←</span>
            <span>{dateNav.prev}</span>
            <span className="border-b-2 border-teal pb-0.5 text-fg">{dateNav.label}</span>
            <span>{dateNav.next}</span>
            <span className="cursor-pointer text-tertiary hover:text-muted">→</span>
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-tertiary">{progressLabel}</span>
          <div className="h-[3px] w-20 overflow-hidden rounded-full bg-raised">
            <div
              className="h-full rounded-full bg-teal"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-tertiary">
          <Link href="#" className="transition-colors hover:text-muted">
            <IconShare className="h-4 w-4" />
          </Link>
          <Link href="#" className="transition-colors hover:text-muted">
            <IconDownload className="h-4 w-4" />
          </Link>
          <Link href="/dashboard" className="text-amber transition-colors hover:text-amber-hover">
            <IconChartBar className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
