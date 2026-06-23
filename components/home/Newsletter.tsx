'use client'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    toast.success('You\'re subscribed! Welcome to the Amoi community.')
  }

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="font-playfair italic text-3xl mb-3">Explore More With Us</h2>
        <p className="text-sm text-text-secondary mb-8">
          Be the first to discover new collections, behind-the-scenes stories, and exclusive member-only offers.
        </p>
        {submitted ? (
          <p className="text-sm text-text-primary tracking-wider">Thank you for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-0 border border-border">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 text-sm bg-white text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <Button type="submit" className="border-0 shrink-0">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
