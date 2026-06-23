'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-toastify'
import type { Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/product/list')
      const data = await res.json()
      if (data.success) setProducts(data.products as Product[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q),
    )
  }, [products, search])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    const res = await fetch('/api/product/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success('Product deleted')
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } else {
      toast.error(data.message as string)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair italic text-3xl text-text-primary">Products</h1>
          <p className="text-sm text-text-muted mt-1">{products.length} items</p>
        </div>
        <Link
          href="/admin/products/add"
          className="inline-flex items-center gap-2 bg-cta text-white text-xs tracking-widest uppercase px-5 py-3 hover:bg-opacity-80 transition-colors"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-border pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary"
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-text-muted">No products found.</p>
      ) : (
        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal">Image</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal">Name</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal hidden sm:table-cell">Price</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product._id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-10 h-12 bg-surface overflow-hidden">
                      {product.image[0] && (
                        <Image
                          src={product.image[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary truncate max-w-[180px]">{product.name}</p>
                    {product.bestseller && (
                      <span className="text-xs text-text-muted">Bestseller</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                    {product.category} / {product.subcategory}
                  </td>
                  <td className="px-4 py-3 text-text-primary hidden sm:table-cell">
                    Rs. {product.price.toLocaleString('en-LK')}
                  </td>
                  <td className="px-4 py-3 text-text-muted hidden lg:table-cell">
                    {new Date(product.date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-xs tracking-widest uppercase text-text-muted hover:text-text-primary transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
