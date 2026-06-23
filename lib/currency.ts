interface RateCache {
  rates: Record<string, number>
  timestamp: number
}

let cache: RateCache | null = null
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export async function getExchangeRates(): Promise<Record<string, number>> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.rates
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY!
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/LKR`)

  if (!res.ok) {
    if (cache) return cache.rates // return stale on error
    throw new Error('Failed to fetch exchange rates')
  }

  const data = await res.json()
  cache = { rates: data.conversion_rates as Record<string, number>, timestamp: Date.now() }
  return cache.rates
}
