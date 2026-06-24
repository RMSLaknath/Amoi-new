'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import FilterSidebar from './FilterSidebar'
import SortDropdown from './SortDropdown'
import ProductGrid from '@/components/product/ProductGrid'
import type { Product, SortOption } from '@/types'

interface Category {
  _id: string
  name: string
  subcategories: string[]
}

interface Props {
  allProducts: Product[]
}

export default function CollectionClient({ allProducts }: Props) {
  const searchParams = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [subcategories, setSubcategories] = useState<string[]>(
    searchParams.get('subcategory') ? [searchParams.get('subcategory')!] : []
  )
  const [sizes, setSizes] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) ?? 'relevant'
  )
  const [adminCategories, setAdminCategories] = useState<Category[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((d) => { if (d.success) setAdminCategories(d.categories) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category') ?? ''
    const sub = searchParams.get('subcategory')
    const best = searchParams.get('bestseller')
    const s = searchParams.get('sort') as SortOption | null
    setCategory(cat)
    setSubcategories(sub ? [sub] : [])
    if (best === 'true') setSubcategories([])
    if (s) setSort(s)
  }, [searchParams])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const categoryOptions = useMemo(() => adminCategories.map((c) => c.name), [adminCategories])

  const subcategoryOptions = useMemo(() => {
    if (category) {
      const matched = adminCategories.find((c) => c.name === category)
      return matched?.subcategories ?? []
    }
    const all = adminCategories.flatMap((c) => c.subcategories)
    return [...new Set(all)]
  }, [adminCategories, category])

  const handleCategory = (v: string) => {
    setCategory(v)
    setSubcategories([])
  }

  const handleSubcategory = (v: string, checked: boolean) =>
    setSubcategories((prev) => checked ? [...prev, v] : prev.filter((s) => s !== v))

  const handleSize = (v: string, checked: boolean) =>
    setSizes((prev) => checked ? [...prev, v] : prev.filter((s) => s !== v))

  const activeFilterCount = (category ? 1 : 0) + subcategories.length + sizes.length

  const filtered = useMemo(() => {
    let products = [...allProducts]
    if (searchParams.get('bestseller') === 'true') products = products.filter((p) => p.bestseller)
    if (category) products = products.filter((p) => p.category === category)
    if (subcategories.length) products = products.filter((p) => subcategories.includes(p.subcategory))
    if (sizes.length) products = products.filter((p) => p.sizes.some((s) => sizes.includes(s)))
    switch (sort) {
      case 'low-high': return [...products].sort((a, b) => a.price - b.price)
      case 'high-low': return [...products].sort((a, b) => b.price - a.price)
      case 'newest': return [...products].sort((a, b) => b.date - a.date)
      default: return products
    }
  }, [allProducts, category, subcategories, sizes, sort, searchParams])

  const pageTitle = useMemo(() => {
    if (searchParams.get('sort') === 'newest') return 'New Arrivals'
    if (searchParams.get('bestseller') === 'true') return 'Bestsellers'
    if (category) return category
    return 'All Collections'
  }, [searchParams, category])

  const sidebarProps = {
    category, subcategories, sizes,
    categoryOptions, subcategoryOptions,
    onCategory: handleCategory,
    onSubcategory: handleSubcategory,
    onSize: handleSize,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-playfair italic text-3xl mb-6">{pageTitle}</h1>

      {/* Mobile top bar: filter button + sort */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-widest uppercase text-text-primary hover:border-text-primary transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-cta text-white text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <div className="flex gap-12">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <FilterSidebar {...sidebarProps} />
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <div className="hidden md:flex items-center justify-between mb-8">
            <p className="text-sm text-text-secondary">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </p>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
          <p className="text-sm text-text-secondary mb-6 md:hidden">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </p>
          <ProductGrid products={filtered} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white max-h-[85vh] overflow-y-auto">
            {/* Handle + header */}
            <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-center justify-between">
              <span className="text-xs tracking-[0.2em] uppercase font-medium">Filters</span>
              <div className="flex items-center gap-4">
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setCategory(''); setSubcategories([]); setSizes([]) }}
                    className="text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Close filters"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filter content */}
            <div className="px-5 py-6">
              <FilterSidebar {...sidebarProps} />
            </div>

            {/* Apply button */}
            <div className="sticky bottom-0 bg-white border-t border-border px-5 py-4">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-cta text-white py-3 text-xs tracking-[0.2em] uppercase"
              >
                Show {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
