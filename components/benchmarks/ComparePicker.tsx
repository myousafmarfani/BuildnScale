'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Model } from '@/lib/benchmarks/types'
export function ComparePicker({
  models,
  selected,
}: {
  models: Model[]
  selected: string[]
}) {
  const [ids, setIds] = useState([
    selected[0] || '',
    selected[1] || '',
    selected[2] || '',
  ])
  const [error, setError] = useState(''),
    router = useRouter()
  return (
    <form
      className="mb-8 rounded-2xl border border-border bg-surface p-5"
      onSubmit={(e) => {
        e.preventDefault()
        const unique = [...new Set(ids.filter(Boolean))]
        if (unique.length < 2) {
          setError('Choose at least two different models.')
          return
        }
        setError('')
        router.push(
          unique.length === 2
            ? `/compare/${[...unique].sort().join('-vs-')}`
            : `/compare?models=${unique.join(',')}`
        )
      }}
    >
      <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        {ids.map((id, i) => (
          <label className="text-xs text-muted" key={i}>
            Model {i + 1}
            {i === 2 ? ' (optional)' : ''}
            <select
              className="workspace-input mt-2 min-h-11"
              value={id}
              onChange={(e) => {
                setError('')
                setIds(
                  ids.map((value, j) => (j === i ? e.target.value : value))
                )
              }}
            >
              <option value="">Choose a model</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        ))}
        <button className="btn-primary min-h-11" type="submit">
          Compare →
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-amber" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
