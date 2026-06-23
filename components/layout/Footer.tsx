import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-cta text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-playfair italic text-2xl mb-4">Amoi</p>
            <p className="text-xs text-white/60 leading-relaxed">
              Handcrafted women's fashion for the modern Sri Lankan woman. Elegance in every stitch.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase mb-5 text-white/60">Company</h3>
            <ul className="space-y-3">
              {[{ label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map(
                (l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm hover:text-white/60 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase mb-5 text-white/60">Customer</h3>
            <ul className="space-y-3">
              {[
                { label: 'My Orders', href: '/orders' },
                { label: 'My Account', href: '/account' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white/60 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase mb-5 text-white/60">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: 'New Arrivals', href: '/collection?sort=newest' },
                { label: 'Women', href: '/collection?category=Women' },
                { label: 'All Collections', href: '/collection' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white/60 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Amoi Fashion. All rights reserved.
          </p>
          <p className="text-xs text-white/40">Made in Sri Lanka</p>
        </div>
      </div>
    </footer>
  )
}
