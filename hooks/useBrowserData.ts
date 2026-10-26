'use client'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
export function useBrowserData<T>(key: string, fallback: T) {
  const defaults = useRef(fallback)
  const [value, setValue] = useState(fallback)
  const [loadedKey, setLoadedKey] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    const restore = () => {
      try {
        const raw = localStorage.getItem(key)
        setValue(raw === null ? defaults.current : JSON.parse(raw))
        setError('')
      } catch {
        setValue(defaults.current)
        setError(
          'Could not read saved data. Export a workspace backup before clearing browser storage.'
        )
      }
      setLoadedKey(key)
    }
    restore()
    window.addEventListener('bns:sync', restore)
    const crossTab = (event: StorageEvent) => {
      if (event.key === key) restore()
    }
    window.addEventListener('storage', crossTab)
    return () => {
      window.removeEventListener('bns:sync', restore)
      window.removeEventListener('storage', crossTab)
    }
  }, [key])
  const update: Dispatch<SetStateAction<T>> = useCallback(
    (next) => {
      if (loadedKey !== key) return
      setValue((previous) => {
        const resolved =
          typeof next === 'function'
            ? (next as (value: T) => T)(previous)
            : next
        try {
          localStorage.setItem(key, JSON.stringify(resolved))
          setError('')
        } catch {
          setError(
            'Browser storage is full or unavailable. These changes are in this tab only; export a backup before leaving.'
          )
        }
        return resolved
      })
    },
    [key, loadedKey]
  )
  return [
    loadedKey === key ? value : defaults.current,
    update,
    error,
    loadedKey === key,
  ] as const
}
