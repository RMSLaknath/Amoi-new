'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface Category {
  _id: string
  name: string
  subcategories: string[]
}

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [sizes, setSizes] = useState<string[]>([])
  const [bestseller, setBestseller] = useState(false)
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null])
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null])

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories as Category[])
          const first = data.categories[0] as Category
          setCategory(first.name)
          setSubcategory(first.subcategories[0] ?? '')
        }
      })
      .catch(() => null)
  }, [])

  const ref0 = useRef<HTMLInputElement>(null)
  const ref1 = useRef<HTMLInputElement>(null)
  const ref2 = useRef<HTMLInputElement>(null)
  const ref3 = useRef<HTMLInputElement>(null)
  const fileInputRefs = [ref0, ref1, ref2, ref3]

  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...images]
    const newPreviews = [...previews]
    newImages[index] = file
    newPreviews[index] = file ? URL.createObjectURL(file) : null
    setImages(newImages)
    setPreviews(newPreviews)
  }

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    )
  }

  const handleCategoryChange = (catName: string) => {
    setCategory(catName)
    const found = categories.find((c) => c.name === catName)
    setSubcategory(found?.subcategories[0] ?? '')
  }

  const currentSubcategories = categories.find((c) => c.name === category)?.subcategories ?? []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !description || !price) {
      toast.error('Please fill all required fields')
      return
    }
    if (sizes.length === 0) {
      toast.error('Please select at least one size')
      return
    }
    const hasImage = images.some((img) => img !== null)
    if (!hasImage) {
      toast.error('Please upload at least one image')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subcategory', subcategory)
      formData.append('sizes', JSON.stringify(sizes))
      formData.append('bestseller', bestseller.toString())
      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img)
      })

      const res = await fetch('/api/product/add', { method: 'POST', body: formData })
      const data = await res.json()

      if (data.success) {
        toast.success('Product added successfully')
        router.push('/admin/products')
      } else {
        toast.error(data.message as string)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-playfair italic text-3xl text-text-primary">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Images */}
        <div>
          <p className="text-xs tracking-widest uppercase text-text-secondary mb-3">
            Product Images <span className="text-text-muted">(up to 4)</span>
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <input
                  ref={fileInputRefs[i]}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(i, e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs[i].current?.click()}
                  className="w-full aspect-[3/4] bg-surface border border-border hover:border-text-primary transition-colors flex items-center justify-center overflow-hidden relative"
                >
                  {previews[i] ? (
                    <Image src={previews[i]!} alt="" fill className="object-cover" sizes="150px" />
                  ) : (
                    <div className="text-center text-text-muted">
                      <svg
                        className="mx-auto mb-1"
                        width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="0" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span className="text-xs">{i === 0 ? 'Main' : `Image ${i + 1}`}</span>
                    </div>
                  )}
                </button>
                {previews[i] && (
                  <button
                    type="button"
                    onClick={() => handleImageChange(i, null)}
                    className="w-full text-xs text-text-muted hover:text-text-primary mt-1 text-center"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Name & Description */}
        <div className="space-y-6">
          <Input
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase text-text-secondary">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="bg-transparent border-0 border-b border-text-primary py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none resize-none"
              placeholder="Product description…"
            />
          </div>
          <Input
            label="Price (LKR)"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase text-text-secondary">Category</label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={categories.length === 0}
              className="bg-transparent border-0 border-b border-text-primary py-2 text-sm text-text-primary focus:outline-none disabled:opacity-50"
            >
              {categories.length === 0 ? (
                <option value="">Loading…</option>
              ) : (
                categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)
              )}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase text-text-secondary">Subcategory</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              disabled={currentSubcategories.length === 0}
              className="bg-transparent border-0 border-b border-text-primary py-2 text-sm text-text-primary focus:outline-none disabled:opacity-50"
            >
              {currentSubcategories.length === 0 ? (
                <option value="">No subcategories</option>
              ) : (
                currentSubcategories.map((s) => <option key={s} value={s}>{s}</option>)
              )}
            </select>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="text-xs tracking-widest uppercase text-text-secondary mb-3">Sizes</p>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
                  sizes.includes(size)
                    ? 'bg-cta text-white border-cta'
                    : 'bg-background text-text-primary border-border hover:border-text-primary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setBestseller(!bestseller)}
              className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                bestseller ? 'bg-cta border-cta' : 'border-border bg-background'
              }`}
            >
              {bestseller && (
                <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-sm text-text-primary">Mark as Bestseller</span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" disabled={loading || categories.length === 0}>
            {loading ? 'Uploading…' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}
