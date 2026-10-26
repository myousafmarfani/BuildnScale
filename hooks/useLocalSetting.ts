'use client'
import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
// Load after hydration; defaults are not written until the user changes them.
export function useLocalSetting<T>(
  key: string,
  fallback: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(fallback)
  useEffect(() => {
    const restore = () => {
      try {
        const raw = localStorage.getItem(key)
        if (raw !== null) setValue(JSON.parse(raw))
      } catch {
        /* Retain default for damaged settings. */
      }
    }
    restore()
    window.addEventListener('bns:sync', restore)
    return () => window.removeEventListener('bns:sync', restore)
  }, [key])
  const update = useCallback<Dispatch<SetStateAction<T>>>(
    (next) => {
      setValue((previous) => {
        const resolved =
          typeof next === 'function'
            ? (next as (previous: T) => T)(previous)
            : next
        localStorage.setItem(key, JSON.stringify(resolved))
        return resolved
      })
    },
    [key]
  )
  return [value, update]
}
