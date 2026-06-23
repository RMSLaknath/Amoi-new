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

  const filtered = useMemo(() => {
    let products = [...allProducts]

    if (searchParams.get('bestseller') === 'true') {
      products = products.filter((p) => p.bestseller)
    }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-playfair italic text-3xl mb-10">{pageTitle}</h1>
      <div className="flex gap-12">
        {/* Sidebar */}
        <div className="hidden md:block">
          <FilterSidebar
            category={category}
            subcategories={subcategories}
            sizes={sizes}
            categoryOptions={categoryOptions}
            subcategoryOptions={subcategoryOptions}
            onCategory={handleCategory}
            onSubcategory={handleSubcategory}
            onSize={handleSize}
          />
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-text-secondary">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </p>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  )
}
