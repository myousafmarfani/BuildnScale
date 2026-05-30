"use client"

import { Nav } from "@/components/layout/Nav"

interface ToolLayoutProps {
  children: React.ReactNode
  bottomBar?: React.ReactNode
}

export function ToolLayout({ children, bottomBar }: ToolLayoutProps) {
  return (
    <>
      <Nav />
      {children}
      {bottomBar}
    </>
  )
}
