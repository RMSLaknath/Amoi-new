'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

interface Category {
  _id: string
  name: string
  subcategories: string[]
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState('')
  const [newSub, setNewSub] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories')
    if (res.status === 401) { router.push('/admin/login'); return }
    const data = await res.json()
    if (data.success) setCategories(data.categories as Category[])
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [router])

  const call = async (body: object) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.status === 401) { router.push('/admin/login'); return }
      const data = await res.json()
      if (data.success) {
        await fetchCategories()
      } else {
        toast.error(data.message as string)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategory = async () => {
    const name = newCategory.trim()
    if (!name) return
    await call({ action: 'add-category', name })
    setNewCategory('')
  }

  const handleRemoveCategory = (categoryId: string, name: string) => {
    if (!confirm(`Delete category "${name}" and all its subcategories?`)) return
    call({ action: 'remove-category', categoryId })
  }

  const handleAddSub = async (categoryId: string) => {
    const sub = (newSub[categoryId] ?? '').trim()
    if (!sub) return
    await call({ action: 'add-subcategory', categoryId, subcategory: sub })
    setNewSub((prev) => ({ ...prev, [categoryId]: '' }))
  }

  const handleRemoveSub = (categoryId: string, subcategory: string) => {
    call({ action: 'remove-subcategory', categoryId, subcategory })
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-playfair italic text-3xl text-text-primary">Categories</h1>
        <p className="text-sm text-text-muted mt-1">Manage product categories and subcategories</p>
      </div>

      {/* Add category */}
      <div className="bg-white border border-border p-5 mb-8">
        <p className="text-xs tracking-widest uppercase text-text-secondary mb-4">Add New Category</p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Category name (e.g. Women)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            className="flex-1 bg-transparent border-b border-text-primary py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button
            onClick={handleAddCategory}
            disabled={saving || !newCategory.trim()}
            className="bg-cta text-white text-xs tracking-widest uppercase px-5 py-2 hover:bg-opacity-80 transition-colors disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>

      {/* Category list */}
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-text-muted">No categories yet. Add one above.</p>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white border border-border">
              {/* Category header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <p className="font-medium text-text-primary">{cat.name}</p>
                <button
                  onClick={() => handleRemoveCategory(cat._id, cat.name)}
                  disabled={saving}
                  className="text-xs tracking-widest uppercase text-text-muted hover:text-red-500 transition-colors disabled:opacity-40"
                >
                  Delete
                </button>
              </div>

              {/* Subcategories */}
              <div className="px-5 py-4">
                <p className="text-xs tracking-widest uppercase text-text-muted mb-3">Subcategories</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cat.subcategories.length === 0 ? (
                    <span className="text-xs text-text-muted italic">None yet</span>
                  ) : (
                    cat.subcategories.map((sub) => (
                      <span key={sub} className="flex items-center gap-1.5 bg-surface border border-border px-3 py-1 text-xs text-text-primary">
                        {sub}
                        <button
                          onClick={() => handleRemoveSub(cat._id, sub)}
                          disabled={saving}
                          className="text-text-muted hover:text-red-500 transition-colors leading-none"
                          title="Remove"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add subcategory */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="New subcategory…"
                    value={newSub[cat._id] ?? ''}
                    onChange={(e) => setNewSub((prev) => ({ ...prev, [cat._id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSub(cat._id)}
                    className="flex-1 bg-transparent border-b border-border py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary"
                  />
                  <button
                    onClick={() => handleAddSub(cat._id)}
                    disabled={saving || !(newSub[cat._id] ?? '').trim()}
                    className="text-xs tracking-widest uppercase text-text-primary border border-border px-4 py-1.5 hover:border-text-primary transition-colors disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
