'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Local work wins when both devices contain data. Pull only missing keys, then
// upload changes. Do not acknowledge failed uploads: retry them on the next tick.
export function useSync(keys: string[]) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const signature = [...keys].sort().join(',')
  useEffect(() => {
    if (!userId) return
    const watched = signature.split(',')
    const controller = new AbortController()
    let disposed = false,
      busy = false
    const acknowledged: Record<string, string | null> = {}
    async function push() {
      const entries = watched.flatMap((key) => {
        const value = localStorage.getItem(key)
        if (value === null || value === acknowledged[key]) return []
        try {
          return [{ key, value: JSON.parse(value), serialized: value }]
        } catch {
          return [{ key, value, serialized: value }]
        }
      })
      if (!entries.length || disposed) return
      const response = await fetch('/api/sync', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: entries.map(({ key, value }) => ({ key, value })),
        }),
        signal: controller.signal,
      })
      if (!response.ok) throw new Error('Sync unavailable')
      for (const entry of entries) acknowledged[entry.key] = entry.serialized
    }
    async function initialize() {
      busy = true
      try {
        const response = await fetch('/api/sync', { signal: controller.signal })
        if (!response.ok) throw new Error('Sync unavailable')
        const data: Record<string, unknown> = await response.json()
        if (disposed) return
        let restored = false
        for (const key of watched) {
          const local = localStorage.getItem(key)
          if (local === null && data[key] !== undefined) {
            const value = JSON.stringify(data[key])
            localStorage.setItem(key, value)
            acknowledged[key] = value
            restored = true
          } else if (
            data[key] !== undefined &&
            local === JSON.stringify(data[key])
          )
            acknowledged[key] = local
        }
        if (restored) window.dispatchEvent(new Event('bns:sync'))
        await push()
      } catch {
        /* Keep local work intact while offline. */
      } finally {
        busy = false
      }
    }
    void initialize()
    const interval = setInterval(async () => {
      if (busy || disposed) return
      busy = true
      try {
        await push()
      } catch {
        /* Unacknowledged changes retry automatically. */
      } finally {
        busy = false
      }
    }, 3000)
    return () => {
      disposed = true
      controller.abort()
      clearInterval(interval)
    }
  }, [userId, signature])
}
