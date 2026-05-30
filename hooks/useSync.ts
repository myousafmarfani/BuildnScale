"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"

const POLL_INTERVAL = 3000

export function useSync(keys: string[]) {
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user?.id
  const lastSnapshot = useRef<Record<string, string | null>>({})

  useEffect(() => {
    if (!isAuthenticated) return

    let polling = false

    const pullFromServer = async () => {
      try {
        const res = await fetch("/api/sync")
        if (!res.ok) return
        const data: Record<string, unknown> = await res.json()

        const dirtyPush: { key: string; value: unknown }[] = []

        for (const key of keys) {
          const serverValue = data[key]
          const localValue = localStorage.getItem(key)

          if (serverValue !== undefined) {
            const serverStr = JSON.stringify(serverValue)
            if (localValue !== serverStr) {
              localStorage.setItem(key, serverStr)
            }
          } else if (localValue !== null) {
            dirtyPush.push({ key, value: JSON.parse(localValue) })
          }
        }

        if (dirtyPush.length > 0) {
          await fetch("/api/sync", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ entries: dirtyPush }),
          })
        }

        for (const key of keys) {
          lastSnapshot.current[key] = localStorage.getItem(key)
        }
      } catch {
        // offline — skip
      }
    }

    const startPolling = async () => {
      await pullFromServer()
      polling = true

      const id = setInterval(async () => {
        const current: Record<string, string | null> = {}
        for (const key of keys) {
          current[key] = localStorage.getItem(key)
        }

        const changed: { key: string; value: unknown }[] = []
        for (const key of keys) {
          if (current[key] !== lastSnapshot.current[key] && current[key] !== null) {
            try {
              changed.push({ key, value: JSON.parse(current[key]!) })
            } catch {
              changed.push({ key, value: current[key] })
            }
          }
        }

        if (changed.length > 0) {
          try {
            await fetch("/api/sync", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ entries: changed }),
            })
          } catch {
            // offline — skip
          }
        }

        lastSnapshot.current = current
      }, POLL_INTERVAL)

      return id
    }

    let intervalId: ReturnType<typeof setInterval> | null = null
    startPolling().then((id) => {
      intervalId = id
    })

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isAuthenticated, keys.join(",")])
}
