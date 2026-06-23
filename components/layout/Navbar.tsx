'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import CurrencySwitcher from '@/components/ui/CurrencySwitcher'

const NAV_LINKS = [
  { label: 'New Arrivals', href: '/collection?category=New' },
  { label: 'Women', href: '/collection?category=Women' },
  { label: 'Collections', href: '/collection' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { getCartCount } = useCart()
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    if (!isHome) { setScrolled(true); return }
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const transparent = isHome && !scrolled
  const navBg = transparent ? 'bg-transparent' : 'bg-white border-b border-border'
  const textColor = transparent ? 'text-white' : 'text-text-primary'
  const logoColor = transparent ? 'text-white' : 'text-text-primary'

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className={`font-playfair italic text-2xl tracking-wide ${logoColor}`}>
            Amoi
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-xs tracking-[0.15em] uppercase hover:opacity-60 transition-opacity ${textColor}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div className={`flex items-center gap-5 ${textColor}`}>
            <div className="hidden sm:block">
              <CurrencySwitcher />
            </div>

            <Link href="/account" aria-label="Account" className="hover:opacity-60 transition-opacity">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <Link href="/cart" aria-label={`Cart (${getCartCount()})`} className="relative hover:opacity-60 transition-opacity">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-cta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-inter">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden hover:opacity-60 transition-opacity"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 h-16 border-b border-border">
            <span className="font-playfair italic text-2xl">Amoi</span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col items-center justify-center flex-1 gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-lg tracking-[0.2em] uppercase text-text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-4">
              <CurrencySwitcher />
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
