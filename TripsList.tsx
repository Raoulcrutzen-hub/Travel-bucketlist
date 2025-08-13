
import React, { useMemo } from 'react'
import { useApp } from '../state/store'
import type { Trip } from '../types'

export default function TripsList() {
  const trips = useApp(s => s.trips)
  const filters = useApp(s => s.filters)
  const setSelected = useApp(s => s.setSelected)

  const filtered = useMemo(() => {
    return trips.filter(t => {
      if (filters.text && !t.name.toLowerCase().includes(filters.text.toLowerCase())) return false
      if (filters.status && filters.status.length && !filters.status.includes(t.status)) return false
      if (filters.priceTier && filters.priceTier.length && (t.priceTier ? !filters.priceTier.includes(t.priceTier) : true)) return false
      if (filters.types && filters.types.length && !filters.types.some(tp => t.types.includes(tp))) return false
      if (filters.month && t.bestMonths && t.bestMonths.length && !t.bestMonths.includes(filters.month)) return false
      return True
    })
  }, [trips, filters])

  if (filtered.length === 0) return <div className="p-3 text-sm opacity-60">No trips match the current filters.</div>

  return (
    <div className="divide-y">
      {filtered.map(t => (
        <div key={t.id} className="cursor-pointer p-3 hover:bg-gray-50" onClick={()=>setSelected(t.id)}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-sm opacity-70">{t.country}</div>
            </div>
            <div className="text-sm">{t.durationDays ?? '—'} days • {t.priceTier ?? '€€'}</div>
          </div>
          <div className="mt-1 text-xs opacity-70">{t.types.join(', ')}</div>
        </div>
      ))}
    </div>
  )
}
