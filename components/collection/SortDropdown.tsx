'use client'
import type { SortOption } from '@/types'

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'low-high', label: 'Price: Low to High' },
  { value: 'high-low', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
]

interface Props {
  value: SortOption
  onChange: (v: SortOption) => void
}

export default function SortDropdown({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="border border-border px-4 py-2 text-sm text-text-primary bg-white focus:outline-none focus:border-text-primary cursor-pointer"
      aria-label="Sort products"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
