'use client'
import { useCurrency } from '@/context/CurrencyContext'
import Button from '@/components/ui/Button'

const DELIVERY_THRESHOLD = 10000
const DELIVERY_FEE = 350

interface Props {
  subtotal: number
  ctaLabel: string
  onCta: () => void
  ctaDisabled?: boolean
}

export default function OrderSummary({ subtotal, ctaLabel, onCta, ctaDisabled }: Props) {
  const { formatPrice } = useCurrency()
  const delivery = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = subtotal + delivery

  return (
    <div className="border border-border p-6 space-y-4">
      <h2 className="text-sm tracking-widest uppercase font-medium">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Delivery</span>
          <span>{delivery === 0 ? 'Free' : formatPrice(delivery)}</span>
        </div>
        {delivery === 0 && (
          <p className="text-xs text-green-600">Free shipping applied</p>
        )}
        <div className="border-t border-border pt-3 flex justify-between font-medium text-text-primary">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <Button fullWidth onClick={onCta} disabled={ctaDisabled}>
        {ctaLabel}
      </Button>

      {delivery > 0 && (
        <p className="text-xs text-text-muted text-center">
          Add {formatPrice(DELIVERY_THRESHOLD - subtotal)} more for free shipping
        </p>
      )}
    </div>
  )
}
