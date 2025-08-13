
import { create } from 'zustand'
import type { Trip } from '../types'
import { TripsRepo } from '../services/repo'

interface Filters {
  text?: string;
  types?: string[];
  status?: ('Planned'|'Booked'|'Done')[];
  priceTier?: ('€'|'€€'|'€€€'|'Luxury')[];
  month?: string; // Jan-Dec
  durationBand?: '3-5' | '7-10' | '14+';
  region?: string;
}

interface AppState {
  trips: Trip[];
  filters: Filters;
  selectedTripId?: string;
  init: () => Promise<void>;
  addTrip: (t: Omit<Trip, 'id'|'createdAt'|'updatedAt'>) => Promise<string>;
  updateTrip: (id: string, patch: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  setFilters: (f: Partial<Filters>) => void;
  setSelected: (id?: string) => void;
  importJSON: (data: Trip[]) => Promise<void>;
  exportJSON: () => Promise<Blob>;
}

export const useApp = create<AppState>((set, get) => ({
  trips: [],
  filters: {},
  selectedTripId: undefined,
  init: async () => {
    const trips = await TripsRepo.getAll()
    set({ trips })
    if (trips.length === 0) {
      await TripsRepo.seed()
      set({ trips: await TripsRepo.getAll() })
    }
  },
  addTrip: async (t) => {
    const id = await TripsRepo.add(t)
    set({ trips: await TripsRepo.getAll(), selectedTripId: id })
    return id
  },
  updateTrip: async (id, patch) => {
    await TripsRepo.update(id, patch)
    set({ trips: await TripsRepo.getAll() })
  },
  deleteTrip: async (id) => {
    await TripsRepo.remove(id)
    set({ trips: await TripsRepo.getAll(), selectedTripId: undefined })
  },
  setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
  setSelected: (id) => set({ selectedTripId: id }),
  importJSON: async (data) => {
    await TripsRepo.clear()
    for (const t of data) {
      await TripsRepo.add({ ...t, createdAt: t.createdAt ?? Date.now(), updatedAt: t.updatedAt ?? Date.now() } as any)
    }
    set({ trips: await TripsRepo.getAll() })
  },
  exportJSON: async () => {
    const data = await TripsRepo.getAll()
    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  }
}))
