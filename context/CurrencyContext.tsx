'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Currency } from '@/types'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (c: Currency) => void
  formatPrice: (lkrAmount: number) => string
  rates: Record<string, number>
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

const CACHE_KEY = 'amoi_currency_rates'
const CACHE_TTL = 24 * 60 * 60 * 1000

const SYMBOLS: Record<Currency, string> = {
  LKR: 'Rs. ',
  USD: '$ ',
  EUR: '€ ',
  GBP: '£ ',
  AUD: 'A$ ',
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('LKR')
  const [rates, setRates] = useState<Record<string, number>>({ LKR: 1 })

  useEffect(() => {
    const load = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data, ts } = JSON.parse(cached) as { data: Record<string, number>; ts: number }
          if (Date.now() - ts < CACHE_TTL) {
            setRates(data)
            return
          }
        }
        const res = await fetch('/api/currency/rates')
        const json = await res.json()
        if (json.success) {
          setRates(json.rates as Record<string, number>)
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: json.rates, ts: Date.now() }))
        }
      } catch {
        // keep default LKR: 1
      }
    }
    load()
  }, [])

  const formatPrice = (lkrAmount: number): string => {
    const rate = rates[currency] ?? 1
    const converted = lkrAmount * rate
    return `${SYMBOLS[currency]}${converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
