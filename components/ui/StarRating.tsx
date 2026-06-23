interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: 'sm' | 'md'
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <div className="flex gap-0.5" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`${sizeClass} transition-transform ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${star <= value ? 'text-text-primary' : 'text-text-muted'}`}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
