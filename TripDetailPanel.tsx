
import React, { useMemo, useState } from 'react'
import { useApp } from '../state/store'
import TripForm from './TripForm'
import type { Trip } from '../types'

export default function TripDetailPanel() {
  const trips = useApp(s => s.trips)
  const selectedId = useApp(s => s.selectedTripId)
  const setSelected = useApp(s => s.setSelected)
  const remove = useApp(s => s.deleteTrip)
  const [editing, setEditing] = useState(false)
  const trip = useMemo(() => trips.find(t => t.id === selectedId), [trips, selectedId])

  if (!trip) return null

  return (
    <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-auto border-l bg-white p-4 shadow-xl">
      <button onClick={()=>setSelected(undefined)} className="mb-2 rounded-full border px-3 py-1">Close</button>
      {!editing ? (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">{trip.name}</h2>
          <div className="text-sm opacity-70">{trip.country}</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Info label="Price range" value={trip.priceMin || trip.priceMax ? `€${trip.priceMin ?? '?'} - €${trip.priceMax ?? '?'}` : (trip.priceTier ?? '—')} />
            <Info label="Best months" value={trip.bestMonths?.join(', ') || 'All year'} />
            <Info label="Duration" value={(trip.durationDays ?? '—') + ' days'} />
            <Info label="Types" value={trip.types.join(', ')} />
            <Info label="Status" value={trip.status} />
          </div>
          {trip.notes && <div><div className="text-sm font-medium">Notes</div><p className="text-sm">{trip.notes}</p></div>}
          <div className="flex gap-2 pt-2">
            <button className="rounded-xl border px-4 py-2" onClick={()=>setEditing(true)}>Edit</button>
            <button className="rounded-xl border px-4 py-2" onClick={()=>{ remove(trip.id); setSelected(undefined) }}>Delete</button>
          </div>
        </div>
      ) : (
        <TripForm existing={trip} onClose={()=>setEditing(False)} />
      )}
    </div>
  )
}

function Info({label, value}:{label:string; value:string}) {
  return <div><div className="text-xs opacity-60">{label}</div><div>{value}</div></div>
}
