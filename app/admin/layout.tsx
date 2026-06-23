'use client'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
