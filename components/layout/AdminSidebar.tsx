'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" />
        <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3 3h7v7H3z" /><path d="M14 3h7v7h-7z" /><path d="M3 14h7v7H3z" />
        <path d="M17.5 17.5m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/user/logout', { method: 'POST' }).catch(() => null)
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-cta text-white flex flex-col">
      <div className="px-6 py-8 border-b border-white/10">
        <p className="font-playfair italic text-2xl">Amoi</p>
        <p className="text-xs text-white/40 mt-1 tracking-wider uppercase">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV.map((item) => {
          const active =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  )
}
