'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2560&q=90',
    label: 'New Season Arrivals',
    heading: 'Dressed for\nEvery Moment',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2560&q=90',
    label: 'Exclusive Styles',
    heading: 'Effortless\nElegance',
  },
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2560&q=90',
    label: 'Sri Lankan Couture',
    heading: 'Crafted\nFor You',
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2560&q=90',
    label: 'Latest Collection',
    heading: 'Style That\nSpeaks',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [textVisible, setTextVisible] = useState(true)

  const goTo = useCallback((idx: number) => {
    setTextVisible(false)
    setTimeout(() => {
      setCurrent(idx)
      setTextVisible(true)
    }, 350)
  }, [])

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length)
  }, [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 5500)
    return () => clearInterval(timer)
  }, [next])

  const slide = SLIDES[current]

  return (
    <section id="hero" className="relative h-[calc(100vh-41px)] w-full overflow-hidden bg-neutral-900">
      {/* Crossfading background images */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: i === current ? 1 : 0,
            backgroundImage: `url(${s.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Text content — fades out/in on slide change */}
      <div
        className="absolute bottom-24 left-8 sm:left-12 z-10 transition-all duration-500"
        style={{ opacity: textVisible ? 1 : 0, transform: textVisible ? 'translateY(0)' : 'translateY(12px)' }}
      >
        <p className="text-xs tracking-[0.4em] uppercase mb-4 text-white/75">
          {slide.label}
        </p>
        <h1 className="font-playfair italic text-5xl sm:text-7xl leading-tight text-white mb-10 whitespace-pre-line">
          {slide.heading}
        </h1>
        <Link
          href="/collection"
          className="inline-block bg-white text-cta px-10 py-3 text-xs tracking-[0.2em] uppercase hover:bg-cta hover:text-white border border-white transition-colors"
        >
          Explore the Collection
        </Link>
      </div>

      {/* Prev arrow */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? '24px' : '6px',
              height: '2px',
              backgroundColor: i === current ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.45)',
              borderRadius: '1px',
            }}
          />
        ))}
      </div>
    </section>
  )
}
