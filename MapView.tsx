
import React, { useEffect, useRef } from 'react'
import maplibregl, { Map as MLMap, Marker, LngLatLike } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useApp } from '../state/store'
import type { Trip } from '../types'

const STATUS_COLOR: Record<string, string> = {
  'Planned': '#3b82f6',
  'Booked': '#16a34a',
  'Done': '#6b7280'
}

export default function MapView() {
  const mapRef = useRef<MLMap | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trips = useApp(s => s.trips)
  const selectedId = useApp(s => s.selectedTripId)
  const setSelected = useApp(s => s.setSelected)

  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [10, 20] as LngLatLike,
        zoom: 1.5,
        attributionControl: true
      })
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
      mapRef.current = map
    }
    return () => { /* no dispose */ }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    // clear existing markers
    const existing = document.querySelectorAll('.trip-marker')
    existing.forEach(el => el.remove())

    trips.forEach((t: Trip) => {
      const el = document.createElement('div')
      el.className = 'trip-marker'
      el.style.padding = '0'
      el.style.cursor = 'pointer'
      el.style.transform = 'translate(-50%,-50%)'

      const tile = document.createElement('div')
      tile.style.background = 'white'
      tile.style.border = '1px solid rgba(0,0,0,0.1)'
      tile.style.borderRadius = '12px'
      tile.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)'
      tile.style.padding = '8px 10px'
      tile.style.minWidth = '160px'
      tile.style.pointerEvents = 'auto'
      tile.style.display = 'flex'
      tile.style.alignItems = 'center'
      tile.style.gap = '8px'

      const dot = document.createElement('div')
      dot.style.width = '10px'
      dot.style.height = '10px'
      dot.style.borderRadius = '9999px'
      dot.style.background = STATUS_COLOR[t.status] || '#3b82f6'
      tile.appendChild(dot)

      const label = document.createElement('div')
      label.style.fontSize = '12px'
      label.style.lineHeight = '1.2'
      label.innerHTML = `<strong>${t.name}</strong><br/><span style="opacity:.7">${t.country}</span>`
      tile.appendChild(label)

      tile.onclick = () => setSelected(t.id)
      el.appendChild(tile)

      new Marker({ element: el, anchor: 'center' }).setLngLat([t.lng, t.lat]).addTo(map)
    })

    if (selectedId) {
      const t = trips.find(x => x.id === selectedId)
      if (t) {
        map.flyTo({ center: [t.lng, t.lat], zoom: 6, speed: 0.8 })
      }
    }
  }, [trips, selectedId])

  return <div ref={containerRef} className="h-full w-full" />
}
