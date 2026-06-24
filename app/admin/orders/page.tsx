'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import type { Order } from '@/types'

const STATUSES = [
  'Order Placed',
  'Packing',
  'Shipped',
  'Out for delivery',
  'Delivered',
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/order/list', { method: 'POST' })
        if (res.status === 401) { router.push('/admin/login'); return }
        const data = await res.json()
        if (data.success) setOrders(data.orders as Order[])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [router])

  const handleStatusChange = async (orderId: string, status: string) => {
    const res = await fetch('/api/order/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    })
    if (res.status === 401) { router.push('/admin/login'); return }
    const data = await res.json()
    if (data.success) {
      setOrders((prev) =>
        prev.map((o) => {
          if (o._id !== orderId) return o
          const payment = status === 'Delivered' && o.paymentMethod === 'COD' ? true : o.payment
          return { ...o, status, payment }
        }),
      )
      toast.success('Status updated')
    } else {
      toast.error(data.message as string)
    }
  }

  const handleTogglePayment = async (orderId: string, current: boolean) => {
    const payment = !current
    const res = await fetch('/api/order/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, payment }),
    })
    if (res.status === 401) { router.push('/admin/login'); return }
    const data = await res.json()
    if (data.success) {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, payment } : o)),
      )
      toast.success(payment ? 'Marked as paid' : 'Marked as pending')
    } else {
      toast.error(data.message as string)
    }
  }

  const statusDot = (status: string) => {
    const colors: Record<string, string> = {
      'Order Placed': 'bg-text-muted',
      'Packing': 'bg-amber-400',
      'Shipped': 'bg-blue-400',
      'Out for delivery': 'bg-orange-400',
      'Delivered': 'bg-green-500',
    }
    return colors[status] ?? 'bg-text-muted'
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-playfair italic text-3xl text-text-primary">Orders</h1>
        <p className="text-sm text-text-muted mt-1">{orders.length} total</p>
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-text-muted">No orders yet.</p>
      ) : (
        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal">Order</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal hidden md:table-cell">Customer</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal hidden sm:table-cell">Amount</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal hidden lg:table-cell">Payment</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal hidden lg:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-text-muted font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-border last:border-0 hover:bg-surface transition-colors align-middle">
                  <td className="px-4 py-4">
                    <p className="font-mono text-xs text-text-muted">{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-text-secondary mt-0.5">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                    <div className="text-xs text-text-muted mt-0.5 hidden sm:block">
                      {order.items.slice(0, 2).map((item, i) => (
                        <span key={i}>{item.name}{i < Math.min(order.items.length, 2) - 1 ? ', ' : ''}</span>
                      ))}
                      {order.items.length > 2 && <span>…</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-text-secondary hidden md:table-cell">
                    <p>{order.address.firstName} {order.address.lastName}</p>
                    <p className="text-xs text-text-muted">{order.address.email}</p>
                    <p className="text-xs text-text-muted">{order.address.city}, {order.address.country}</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <p className="text-text-primary">Rs. {order.amount.toLocaleString('en-LK')}</p>
                    <p className="text-xs text-text-muted">{order.paymentMethod}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <button
                      onClick={() => handleTogglePayment(order._id, order.payment)}
                      title="Click to toggle payment status"
                      className={`inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70 ${
                        order.payment ? 'text-green-600' : 'text-text-muted'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 inline-block ${order.payment ? 'bg-green-500' : 'bg-text-muted'}`} />
                      {order.payment ? 'Paid' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-text-muted hidden lg:table-cell">
                    {new Date(order.date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 shrink-0 ${statusDot(order.status)}`} />
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-transparent border border-border text-xs text-text-primary px-2 py-1.5 focus:outline-none focus:border-text-primary cursor-pointer min-w-[130px]"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
