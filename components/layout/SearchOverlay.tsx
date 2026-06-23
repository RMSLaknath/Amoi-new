'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-text-primary">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [fetched, setFetched] = useState(false)
  const [fetching, setFetching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load all products once when overlay first opens
  useEffect(() => {
    if (!open || fetched) return
    setFetching(true)
    fetch('/api/product/list')
      .then((r) => r.json())
      .then((d) => { if (d.success) setProducts(d.products) })
      .catch(() => {})
      .finally(() => { setFetched(true); setFetching(false) })
  }, [open, fetched])

  // Auto-focus input
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else setQuery('')
  }, [open])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const results = query.trim().length >= 1
    ? products.filter((p) => {
        const q = query.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
        )
      }).slice(0, 8)
    : []

  const handleClose = useCallback(() => {
    setQuery('')
    onClose()
  }, [onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex flex-col items-center pt-[12vh] px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <svg
            width="18" height="18" fill="none" stroke="currentColor"
            strokeWidth="1.5" viewBox="0 0 24 24"
            className="text-text-muted shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search styles, dresses, collections…"
            className="flex-1 text-sm text-text-primary placeholder:text-text-muted bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-text-muted hover:text-text-primary transition-colors shrink-0"
              aria-label="Clear search"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <button
            onClick={handleClose}
            className="text-xs tracking-widest text-text-muted hover:text-text-primary transition-colors ml-2 uppercase shrink-0"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        {fetching && (
          <div className="py-10 flex justify-center">
            <div className="w-5 h-5 border-2 border-cta border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!fetching && results.length > 0 && (
          <>
            <ul className="max-h-[52vh] overflow-y-auto divide-y divide-border">
              {results.map((product) => (
                <li key={product._id}>
                  <Link
                    href={`/product/${product._id}`}
                    onClick={handleClose}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-14 h-14 shrink-0 bg-surface overflow-hidden">
                      {product.image?.[0] && (
                        <Image
                          src={product.image[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">
                        <Highlight text={product.name} query={query} />
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        <Highlight text={product.category} query={query} />
                        {product.subcategory && (
                          <> · <Highlight text={product.subcategory} query={query} /></>
                        )}
                      </p>
                    </div>
                    {/* Price */}
                    <p className="text-sm text-text-primary shrink-0">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border">
              <Link
                href={`/collection`}
                onClick={handleClose}
                className="text-xs tracking-widest uppercase text-text-muted hover:text-text-primary transition-colors"
              >
                View all results →
              </Link>
            </div>
          </>
        )}

        {!fetching && query.trim().length >= 1 && results.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-text-muted">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-xs text-text-muted mt-2">Try a different word or browse the collection.</p>
          </div>
        )}

        {!fetching && !query && (
          <div className="py-8 px-5 text-center">
            <p className="text-xs tracking-widest uppercase text-text-muted">
              Start typing to discover styles
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
