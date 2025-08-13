
import React, { useMemo } from 'react'
import { useApp } from '../state/store'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function FiltersBar() {
  const filters = useApp(s => s.filters)
  const setFilters = useApp(s => s.setFilters)
  const trips = useApp(s => s.trips)

  const types = useMemo(() => {
    const all = new Set<string>()
    trips.forEach(t => t.types.forEach(v => all.add(v)))
    return Array.from(all)
  }, [trips])

  return (
    <div className="flex flex-wrap items-center gap-2 p-3">
      <input
        className="rounded-xl border px-3 py-2"
        placeholder="Search destination"
        value={filters.text ?? ''}
        onChange={e=>setFilters({ text: e.target.value })}
      />
      <select className="rounded-xl border px-3 py-2" value={filters.month ?? ''} onChange={e=>setFilters({ month: e.target.value || undefined })}>
        <option value="">Any month</option>
        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select className="rounded-xl border px-3 py-2" value={(filters.status?.[0]) ?? ''} onChange={e=>setFilters({ status: e.target.value ? [e.target.value as any] : undefined })}>
        <option value="">Any status</option>
        <option>Planned</option>
        <option>Booked</option>
        <option>Done</option>
      </select>
      <select className="rounded-xl border px-3 py-2" value={(filters.priceTier?.[0]) ?? ''} onChange={e=>setFilters({ priceTier: e.target.value ? [e.target.value as any] : undefined })}>
        <option value="">Any price</option>
        <option value="€">€</option>
        <option value="€€">€€</option>
        <option value="€€€">€€€</option>
        <option value="Luxury">Luxury</option>
      </select>
      <select className="rounded-xl border px-3 py-2" value={(filters.types?.[0]) ?? ''} onChange={e=>setFilters({ types: e.target.value ? [e.target.value] : undefined })}>
        <option value="">Any type</option>
        {types.map(t => <option key={t}>{t}</option>)}
      </select>
    </div>
  )
}
