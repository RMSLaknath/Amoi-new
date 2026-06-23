interface Props {
  sizes: string[]
  selected: string
  onChange: (size: string) => void
}

export default function SizePicker({ sizes, selected, onChange }: Props) {
  return (
    <div>
      <p className="text-xs tracking-widest uppercase text-text-secondary mb-3">
        Select Size
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={`min-w-[44px] px-3 py-2 text-sm border transition-colors ${
              selected === size
                ? 'bg-cta text-white border-cta'
                : 'bg-white text-text-primary border-border hover:border-text-primary'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
