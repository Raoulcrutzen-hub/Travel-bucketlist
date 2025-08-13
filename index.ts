
export type Status = 'Planned' | 'Booked' | 'Done';

export interface Trip {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  priceTier?: '€' | '€€' | '€€€' | 'Luxury';
  priceMin?: number;
  priceMax?: number;
  bestMonths?: string[]; // ['Jan','Feb',...]
  durationDays?: number;
  types: string[]; // Relax, Active, Backpack, Roadtrip, etc.
  status: Status;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}
