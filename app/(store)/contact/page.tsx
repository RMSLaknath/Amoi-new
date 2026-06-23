'use client'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    toast.success("Message sent! We'll be in touch within 24 hours.")
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Info */}
        <div>
          <h1 className="font-playfair italic text-4xl mb-8">Get in Touch</h1>
          <div className="space-y-5 text-sm text-text-secondary">
            <div>
              <p className="text-xs tracking-widest uppercase text-text-muted mb-1">Email</p>
              <a href="mailto:amoi.collection2021@gmail.com" className="hover:text-text-primary transition-colors">
                amoi.collection2021@gmail.com
              </a>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-text-muted mb-1">Phone</p>
              <a href="tel:+94716174364" className="hover:text-text-primary transition-colors">
                071 617 4364
              </a>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-text-muted mb-1">WhatsApp</p>
              <a
                href="https://wa.me/94716174364"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-primary transition-colors"
              >
                +94 71 617 4364
              </a>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-text-muted mb-1">Hours</p>
              <p>Mon – Sat: 9:00 AM – 7:00 PM</p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-text-muted mb-1">Location</p>
              <p>Sri Lanka</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          {sent ? (
            <div className="pt-10">
              <p className="text-sm text-text-primary">Thank you for reaching out.</p>
              <p className="text-sm text-text-secondary mt-2">We&apos;ll reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <div className="flex flex-col gap-1">
                <label className="text-xs tracking-widest uppercase text-text-secondary">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="bg-transparent border-0 border-b border-text-primary py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <Button type="submit">Send Message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
