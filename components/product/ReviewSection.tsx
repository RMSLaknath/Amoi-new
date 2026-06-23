'use client'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import StarRating from '@/components/ui/StarRating'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { Review } from '@/types'

interface Props {
  productId: string
  isAuthenticated: boolean
}

const PAGE_SIZE = 5

export default function ReviewSection({ productId, isAuthenticated }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [page, setPage] = useState(1)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadReviews = useCallback(async () => {
    const res = await fetch(`/api/review/${productId}`)
    const data = await res.json()
    if (data.success) {
      setReviews(data.reviews as Review[])
      setAvgRating(data.avgRating as number)
    }
  }, [productId])

  useEffect(() => { loadReviews() }, [loadReviews])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/review/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Review submitted')
        setComment('')
        setRating(5)
        await loadReviews()
      } else {
        toast.error(data.message as string)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const visible = reviews.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < reviews.length

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="font-playfair text-2xl">Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(avgRating)} readonly size="sm" />
            <span className="text-sm text-text-secondary">
              {avgRating.toFixed(1)} ({reviews.length})
            </span>
          </div>
        )}
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-text-muted mb-10">
          No reviews yet. Be the first to review this product.
        </p>
      ) : (
        <div className="space-y-8 mb-10">
          {visible.map((r) => (
            <div key={r._id} className="border-b border-border pb-8">
              <div className="flex items-center gap-3 mb-2">
                <StarRating value={r.rating} readonly size="sm" />
                <span className="text-sm font-medium text-text-primary">{r.userName}</span>
                <span className="text-xs text-text-muted">
                  {new Date(r.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{r.comment}</p>
            </div>
          ))}
          {hasMore && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="text-sm text-text-secondary underline underline-offset-2 hover:text-text-primary"
            >
              Load more reviews
            </button>
          )}
        </div>
      )}

      {/* Write review form */}
      {isAuthenticated ? (
        <div className="border-t border-border pt-10">
          <h3 className="text-sm tracking-widest uppercase mb-6">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div>
              <p className="text-xs tracking-widest uppercase text-text-secondary mb-2">Rating</p>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <Input
              label="Your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts…"
              required
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Review'}
            </Button>
          </form>
        </div>
      ) : (
        <p className="text-sm text-text-secondary border-t border-border pt-8">
          <a href="/account" className="underline underline-offset-2 hover:text-text-primary">
            Sign in
          </a>{' '}
          to leave a review.
        </p>
      )}
    </section>
  )
}
