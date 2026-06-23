import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
  {
    label: 'New Arrivals',
    href: '/collection?sort=newest',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85',
    bg: 'bg-stone-100',
  },
  {
    label: 'Dresses',
    href: '/collection?subcategory=Dresses',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85',
    bg: 'bg-neutral-100',
  },
  {
    label: 'Collections',
    href: '/collection?category=Women',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85',
    bg: 'bg-stone-200',
  },
  {
    label: 'All Styles',
    href: '/collection',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1800&q=85',
    bg: 'bg-zinc-100',
  },
]

export default function CategoryGrid() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="font-playfair italic text-3xl text-center mb-3">Dive The Collections</h2>
      <p className="text-sm text-text-muted text-center mb-12 tracking-wider">Curated styles for every occasion</p>
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {CATEGORIES.map((cat) => (
          <Link key={cat.href} href={cat.href} className="group relative overflow-hidden aspect-[4/3]">
            <div className={`absolute inset-0 ${cat.bg}`} />
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-white">
              <h3 className="font-playfair text-xl mb-3">{cat.label}</h3>
              <span className="text-xs tracking-[0.2em] uppercase border-b border-white pb-0.5">
                View All
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
