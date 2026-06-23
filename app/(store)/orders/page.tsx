'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCurrency } from '@/context/CurrencyContext'
import type { Order } from '@/types'

const STATUS_STEPS = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']

function StatusTimeline({ current }: { current: string }) {
  const idx = STATUS_STEPS.indexOf(current)
  return (
    <div className="flex items-center gap-0 mt-3">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-2.5 h-2.5 rounded-full border ${
                i <= idx ? 'bg-cta border-cta' : 'bg-white border-border'
              }`}
            />
            <span className="text-[9px] text-text-muted mt-1 whitespace-nowrap">{step}</span>
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div className={`w-8 h-px mb-3 ${i < idx ? 'bg-cta' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { formatPrice } = useCurrency()

  useEffect(() => {
    fetch('/api/order/userorders', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setOrders(d.orders as Order[]) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-sm text-text-muted">Loading orders…</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-playfair italic text-3xl mb-10">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-text-muted">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-text-muted mb-1">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {order.paymentMethod} ·{' '}
                    <span className={order.payment ? 'text-green-600' : 'text-amber-600'}>
                      {order.payment ? 'Paid' : 'Pending'}
                    </span>
                  </p>
                </div>
                <p className="text-sm font-medium">{formatPrice(order.amount)}</p>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 aspect-[3/4] bg-surface shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-text-primary">{item.name}</p>
                      <p className="text-xs text-text-muted">
                        Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <StatusTimeline current={order.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
