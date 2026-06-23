'use client'

const CATEGORIES = ['Women', 'Men', 'Kids', 'New']
const SUBCATEGORIES = ['Topwear', 'Bottomwear', 'Winterwear', 'Dresses', 'Ethnic']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface Props {
  category: string
  subcategories: string[]
  sizes: string[]
  onCategory: (v: string) => void
  onSubcategory: (v: string, checked: boolean) => void
  onSize: (v: string, checked: boolean) => void
}

export default function FilterSidebar({
  category, subcategories, sizes, onCategory, onSubcategory, onSize,
}: Props) {
  return (
    <aside className="w-56 shrink-0 space-y-8">
      {/* Category */}
      <div>
        <h3 className="text-xs tracking-[0.2em] uppercase text-text-secondary mb-4">Category</h3>
        <div className="space-y-2.5">
          {['All', ...CATEGORIES].map((c) => (
            <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={c}
                checked={category === c || (c === 'All' && !category)}
                onChange={() => onCategory(c === 'All' ? '' : c)}
                className="accent-cta"
              />
              <span className="text-sm text-text-primary group-hover:text-text-secondary transition-colors">
                {c}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Subcategory */}
      <div>
        <h3 className="text-xs tracking-[0.2em] uppercase text-text-secondary mb-4">Type</h3>
        <div className="space-y-2.5">
          {SUBCATEGORIES.map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={subcategories.includes(s)}
                onChange={(e) => onSubcategory(s, e.target.checked)}
                className="accent-cta"
              />
              <span className="text-sm text-text-primary group-hover:text-text-secondary transition-colors">
                {s}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-xs tracking-[0.2em] uppercase text-text-secondary mb-4">Size</h3>
        <div className="space-y-2.5">
          {SIZES.map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={sizes.includes(s)}
                onChange={(e) => onSize(s, e.target.checked)}
                className="accent-cta"
              />
              <span className="text-sm text-text-primary group-hover:text-text-secondary transition-colors">
                {s}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
