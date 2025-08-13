
import Dexie, { Table } from 'dexie'
import type { Trip } from '../types'
import seed from '../data/seed.json'

class DB extends Dexie {
  trips!: Table<Trip, string>;
  constructor() {
    super('travel-bucketlist')
    this.version(1).stores({
      trips: 'id, name, country, status, createdAt'
    })
  }
}

const db = new DB()

export const TripsRepo = {
  async getAll(): Promise<Trip[]> {
    return db.trips.orderBy('createdAt').reverse().toArray()
  },
  async add(t: Omit<Trip, 'id'|'createdAt'|'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID()
    await db.trips.add({ ...t, id, createdAt: Date.now(), updatedAt: Date.now() })
    return id
  },
  async update(id: string, patch: Partial<Trip>): Promise<void> {
    await db.trips.update(id, { ...patch, updatedAt: Date.now() })
  },
  async remove(id: string): Promise<void> {
    await db.trips.delete(id)
  },
  async clear(): Promise<void> {
    await db.trips.clear()
  },
  async seed(): Promise<void> {
    for (const t of seed) {
      await this.add(t as any)
    }
  }
}
