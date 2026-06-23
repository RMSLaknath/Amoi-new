import Link from 'next/link'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-[calc(100vh-41px)] w-full bg-cta flex items-end overflow-hidden"
      style={{
        backgroundImage: 'url(/hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 px-8 sm:px-12 pb-16 text-white">
        <p className="text-xs tracking-[0.4em] uppercase mb-4 opacity-80">New Season Arrivals</p>
        <h1 className="font-playfair italic text-5xl sm:text-6xl leading-tight mb-8">
          Dressed for<br />Every Moment
        </h1>
        <Link
          href="/collection"
          className="inline-block bg-white text-cta px-10 py-3 text-xs tracking-[0.2em] uppercase hover:bg-cta hover:text-white border border-white transition-colors"
        >
          Explore the Collection
        </Link>
      </div>
    </section>
  )
}
