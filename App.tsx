
import React, { useEffect, useMemo, useState } from 'react'
import MapView from './components/MapView'
import TripDetailPanel from './components/TripDetailPanel'
import TripForm from './components/TripForm'
import FiltersBar from './components/FiltersBar'
import TripsList from './components/TripsList'
import { useApp } from './state/store'
import { downloadBlob, readJSONFile } from './services/exportImport'

export default function App() {
  const init = useApp(s => s.init)
  const exportJSON = useApp(s => s.exportJSON)
  const importJSON = useApp(s => s.importJSON)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { init() }, [init])

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b bg-white px-4 py-3">
        <h1 className="text-lg font-semibold">Travel Bucketlist</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-xl border px-3 py-2" onClick={async()=>{
            const blob = await exportJSON()
            downloadBlob(blob, 'trips.json')
          }}>Export</button>
          <label className="rounded-xl border px-3 py-2">
            Import
            <input type="file" accept="application/json" className="hidden" onChange={async(e)=>{
              const file = e.target.files?.[0]
              if (!file) return
              const data = await readJSONFile(file)
              await importJSON(data)
              e.currentTarget.value = ''
            }} />
          </label>
          <button onClick={()=>setShowForm(true)} className="rounded-xl bg-black px-3 py-2 text-white">+ Add destination</button>
        </div>
      </header>

      <FiltersBar />

      <main className="relative grid flex-1 grid-cols-1 md:grid-cols-3">
        <div className="col-span-2"><MapView /></div>
        <div className="border-l bg-white">
          <TripsList />
        </div>
        <TripDetailPanel />
        {showForm && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add destination</h2>
                <button className="rounded-full border px-3 py-1" onClick={()=>setShowForm(false)}>Close</button>
              </div>
              <TripForm onClose={()=>setShowForm(false)} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t bg-white p-3 text-center text-xs text-gray-500">
        Made with ❤ for adventures — local-first, no account needed.
      </footer>
    </div>
  )
}
