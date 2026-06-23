'use client'
import { useCurrency } from '@/context/CurrencyContext'
import type { Currency } from '@/types'

const OPTIONS: Currency[] = ['LKR', 'USD', 'EUR', 'GBP', 'AUD']

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      className="bg-transparent border-b border-current text-sm focus:outline-none cursor-pointer py-0.5"
      aria-label="Select currency"
    >
      {OPTIONS.map((c) => (
        <option key={c} value={c} className="bg-white text-text-primary">
          {c}
        </option>
      ))}
    </select>
  )
}
