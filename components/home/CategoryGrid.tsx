import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
  { label: 'Women', href: '/collection?category=Women', image: '/categories/women.jpg', bg: 'bg-stone-200' },
  { label: 'Men', href: '/collection?category=Men', image: '/categories/men.jpg', bg: 'bg-zinc-300' },
  { label: 'Kids', href: '/collection?category=Kids', image: '/categories/kids.jpg', bg: 'bg-neutral-200' },
  { label: 'New Arrivals', href: '/collection?category=New', image: '/categories/new.jpg', bg: 'bg-slate-200' },
]

export default function CategoryGrid() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="font-playfair italic text-3xl text-center mb-12">Shop by Category</h2>
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
