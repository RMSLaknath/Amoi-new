import Link from 'next/link'
import { db, snapToArr } from '@/lib/firebase'
import type { Order } from '@/types'

export default async function AdminDashboard() {
  let productCount = 0
  let orderCount = 0
  let revenue = 0
  let recentOrders: Order[] = []

  try {
    const [productSnap, orderSnap] = await Promise.all([
      db.collection('products').get(),
      db.collection('orders').orderBy('date', 'desc').get(),
    ])

    productCount = productSnap.size
    const allOrders = snapToArr<Order>(orderSnap)
    orderCount = allOrders.length

    // Count COD orders + confirmed PayHere orders
    revenue = allOrders
      .filter((o) => o.payment === true || o.paymentMethod === 'COD')
      .reduce((sum, o) => sum + (o.amount ?? 0), 0)

    recentOrders = allOrders.slice(0, 5)
  } catch {
    // DB unavailable
  }

  const stats = [
    {
      label: 'Products',
      value: productCount.toLocaleString(),
      href: '/admin/products',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
    {
      label: 'Orders',
      value: orderCount.toLocaleString(),
      href: '/admin/orders',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
      ),
    },
    {
      label: 'Revenue',
      value: `Rs. ${revenue.toLocaleString('en-LK')}`,
      href: '/admin/orders',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ]

  const statusColor: Record<string, string> = {
    'Order Placed': 'bg-slate-400',
    'Packing': 'bg-amber-400',
    'Shipped': 'bg-blue-400',
    'Out for delivery': 'bg-orange-400',
    'Delivered': 'bg-green-500',
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-playfair italic text-4xl text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">Welcome back, Admin</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group bg-white border border-border hover:border-text-primary transition-colors p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs tracking-widest uppercase text-text-muted">{s.label}</span>
              <span className="text-text-muted group-hover:text-text-primary transition-colors">{s.icon}</span>
            </div>
            <p className="font-playfair italic text-2xl text-text-primary">{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          href="/admin/products/add"
          className="inline-flex items-center gap-2 bg-cta text-white text-xs tracking-widest uppercase px-5 py-3 hover:bg-opacity-80 transition-colors"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </Link>
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 border border-border text-xs tracking-widest uppercase px-5 py-3 hover:border-text-primary transition-colors"
        >
          Manage Categories
        </Link>
      </div>

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-widest uppercase text-text-secondary">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-text-muted hover:text-text-primary transition-colors">
              View all →
            </Link>
          </div>
          <div className="bg-white border border-border">
            {recentOrders.map((order, i) => (
              <div
                key={order._id}
                className={`flex items-center justify-between px-5 py-4 ${i < recentOrders.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 shrink-0 ${statusColor[order.status] ?? 'bg-text-muted'}`} />
                  <div>
                    <p className="text-sm text-text-primary">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-primary">Rs. {order.amount.toLocaleString('en-LK')}</p>
                  <p className="text-xs text-text-muted mt-0.5">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
