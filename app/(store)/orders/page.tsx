'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCurrency } from '@/context/CurrencyContext'
import type { Order } from '@/types'

const STATUS_STEPS = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']

function StepIcon({ index, done, active }: { index: number; done: boolean; active: boolean }) {
  const color = done || active ? 'white' : '#a3a3a3'
  const icons = [
    <svg key="0" width="14" height="14" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>,
    <svg key="1" width="14" height="14" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>,
    <svg key="2" width="14" height="14" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>,
    <svg key="3" width="14" height="14" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="1" y="3" width="15" height="13" />
      <path d="M16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    </svg>,
    <svg key="4" width="14" height="14" fill="none" stroke={color} strokeWidth="2.2" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>,
  ]
  return icons[index]
}

function StatusTimeline({ current }: { current: string }) {
  const idx = STATUS_STEPS.indexOf(current)
  const progressPct = idx <= 0 ? 0 : (idx / (STATUS_STEPS.length - 1)) * 100

  return (
    <div className="mt-5 pt-5 border-t border-border">
      {/* Label row */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs tracking-widest uppercase text-text-muted">Order Status</span>
        <span className="text-xs font-medium text-text-primary">{current}</span>
      </div>

      {/* Thin animated progress bar */}
      <div className="w-full h-1 bg-border mb-5 overflow-hidden">
        <div
          className="h-full bg-cta transition-all duration-700 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step icons — scrollable on tiny screens */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex items-start min-w-max sm:min-w-0 sm:w-full">
          {STATUS_STEPS.map((step, i) => {
            const done = i < idx
            const active = i === idx
            const upcoming = i > idx
            return (
              <div key={step} className="flex items-center">
                {/* Step node */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                      ${done ? 'bg-cta' : ''}
                      ${active ? 'bg-cta ring-4 ring-cta/20 scale-110' : ''}
                      ${upcoming ? 'bg-surface border border-border' : ''}
                    `}
                  >
                    {done ? (
                      <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <StepIcon index={i} done={done} active={active} />
                    )}
                  </div>
                  <span
                    className={`text-[10px] text-center w-16 leading-tight
                      ${active ? 'text-text-primary font-semibold' : 'text-text-muted'}
                    `}
                  >
                    {step}
                  </span>
                </div>

                {/* Connector */}
                {i < STATUS_STEPS.length - 1 && (
                  <div className="w-10 sm:flex-1 h-px mx-1 mb-5 shrink-0 sm:shrink transition-colors duration-500"
                    style={{ background: i < idx ? 'var(--color-cta)' : 'var(--color-border)' }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { formatPrice } = useCurrency()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/order/userorders', { method: 'POST' })
      .then((r) => {
        if (r.status === 401) { router.push('/account?redirect=/orders'); return null }
        return r.json()
      })
      .then((d) => { if (d?.success) setOrders(d.orders as Order[]) })
      .finally(() => setLoading(false))
  }, [router])

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
              <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
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
