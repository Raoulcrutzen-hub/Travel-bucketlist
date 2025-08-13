
import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '../state/store'
import { geocode } from '../services/geocode'
import type { Trip } from '../types'

const TYPES = ['Relax','Active','Backpack','Roadtrip','City trip','Nature','Beach','Culture']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const TIERS = ['€','€€','€€€','Luxury'] as const

interface Props { onClose?: () => void; existing?: Trip }

export default function TripForm({ onClose, existing }: Props) {
  const addTrip = useApp(s => s.addTrip)
  const updateTrip = useApp(s => s.updateTrip)
  const [query, setQuery] = useState(existing?.name ?? '')
  const [suggestions, setSuggestions] = useState<{name:string; country:string; lat:number; lng:number}[]>([])
  const [chosen, setChosen] = useState<{name:string; country:string; lat:number; lng:number} | null>(existing ? { name: existing.name, country: existing.country, lat: existing.lat, lng: existing.lng } : null)
  const [priceTier, setPriceTier] = useState<Trip['priceTier']>(existing?.priceTier ?? '€€')
  const [priceMin, setPriceMin] = useState<number | undefined>(existing?.priceMin)
  const [priceMax, setPriceMax] = useState<number | undefined>(existing?.priceMax)
  const [bestMonths, setBestMonths] = useState<string[]>(existing?.bestMonths ?? [])
  const [duration, setDuration] = useState<number>(existing?.durationDays ?? 7)
  const [types, setTypes] = useState<string[]>(existing?.types ?? [])
  const [status, setStatus] = useState<Trip['status']>(existing?.status ?? 'Planned')
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.length < 3) return setSuggestions([])
      const results = await geocode(query)
      setSuggestions(results)
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  const canSave = useMemo(() => chosen && types.length > 0, [chosen, types])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!canSave || !chosen) { setError('Please choose a destination and at least one type.'); return }
    setSaving(True)
  }

  async function save() {
    try {
      if (existing) {
        await updateTrip(existing.id, {
          name: chosen!.name,
          country: chosen!.country,
          lat: chosen!.lat,
          lng: chosen!.lng,
          priceTier, priceMin, priceMax,
          bestMonths, durationDays: duration, types, status, notes
        })
      } else {
        await addTrip({
          name: chosen!.name,
          country: chosen!.country,
          lat: chosen!.lat,
          lng: chosen!.lng,
          priceTier, priceMin, priceMax,
          bestMonths, durationDays: duration, types, status, notes,
        } as any)
      }
      onClose?.()
    } catch (e:any) {
      setError(e?.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (saving) save()
  }, [saving])

  function toggle<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter(x => x!==v) : [...arr, v]
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Destination</label>
        <input value={query} onChange={e=>{ setQuery(e.target.value); setChosen(null) }} placeholder="City, region, country" className="mt-1 w-full rounded-xl border p-2" />
        {suggestions.length>0 && !chosen && (
          <div className="mt-1 rounded-xl border bg-white shadow">
            {suggestions.map(s => (
              <div key={s.name+s.lat} className="cursor-pointer px-3 py-2 hover:bg-gray-50" onClick={()=>{ setChosen(s); setQuery(`${s.name}, ${s.country}`)}}>
                {s.name}, <span className="opacity-70">{s.country}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Price range</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {TIERS.map(t => (
            <button type="button" key={t} onClick={()=>setPriceTier(t)} className={'px-3 py-1 rounded-full border ' + (priceTier===t ? 'bg-black text-white' : 'bg-white')}>
              {t}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input type="number" placeholder="Min" value={priceMin ?? ''} onChange={e=>setPriceMin(e.target.value? Number(e.target.value):undefined)} className="w-1/2 rounded-xl border p-2" />
          <input type="number" placeholder="Max" value={priceMax ?? ''} onChange={e=>setPriceMax(e.target.value? Number(e.target.value):undefined)} className="w-1/2 rounded-xl border p-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Best time to travel</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {MONTHS.map(m => (
            <button type="button" key={m} onClick={()=>setBestMonths(toggle(bestMonths, m))} className={'px-2 py-1 rounded-full border text-sm ' + (bestMonths.includes(m) ? 'bg-black text-white' : 'bg-white')}>
              {m}
            </button>
          ))}
          <button type="button" onClick={()=>setBestMonths([])} className="px-2 py-1 rounded-full border text-sm">All year</button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Proposed duration (days)</label>
        <div className="mt-1 flex gap-2">
          <input type="number" min={1} value={duration} onChange={e=>setDuration(Number(e.target.value))} className="w-1/2 rounded-xl border p-2" />
          {[5,10,14].map(d => (
            <button type="button" key={d} onClick={()=>setDuration(d)} className="px-3 py-1 rounded-full border">{d}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Type of holiday</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {TYPES.map(t => (
            <button type="button" key={t} onClick={()=>setTypes(toggle(types, t))} className={'px-3 py-1 rounded-full border ' + (types.includes(t) ? 'bg-black text-white' : 'bg-white')}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select value={status} onChange={e=>setStatus(e.target.value as any)} className="mt-1 w-full rounded-xl border p-2">
          <option>Planned</option>
          <option>Booked</option>
          <option>Done</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border p-2" />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex items-center gap-2 pt-2">
        <button disabled={!canSave || saving} className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50" type="submit">
          {existing ? 'Save changes' : 'Add trip'}
        </button>
        <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2">Cancel</button>
      </div>
    </form>
  )
}
