
export async function geocode(query: string): Promise<{lat:number; lng:number; name:string; country:string}[]> {
  if (!query?.trim()) return []
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'travel-bucketlist-demo' }
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.slice(0, 5).map((d: any) => ({
    lat: parseFloat(d.lat),
    lng: parseFloat(d.lon),
    name: d.display_name?.split(',')[0] ?? query,
    country: (d.display_name?.split(',').pop() ?? '').trim() || 'Unknown'
  }))
}
