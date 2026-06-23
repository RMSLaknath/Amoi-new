import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAuthUser } from '@/lib/auth'
import { generatePayHereHash } from '@/lib/payhere'
import type { OrderItem } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { items, amount, address } = await req.json()

    const ref = await db.collection('orders').add({
      userId: auth.id,
      items,
      amount,
      address,
      status: 'Order Placed',
      paymentMethod: 'PayHere',
      payment: false,
      date: Date.now(),
    })

    const orderId = ref.id
    const amountStr = (amount as number).toFixed(2)
    const currency = 'LKR'
    const hash = generatePayHereHash(orderId, amountStr, currency)

    return NextResponse.json({
      success: true,
      paymentData: {
        merchant_id: process.env.PAYHERE_MERCHANT_ID,
        return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/orders`,
        cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/cart`,
        notify_url: process.env.PAYHERE_NOTIFY_URL,
        order_id: orderId,
        items: (items as OrderItem[]).map((i) => i.name).join(', '),
        currency,
        amount: amountStr,
        first_name: address.firstName,
        last_name: address.lastName,
        email: address.email,
        phone: address.phone,
        address: address.street,
        city: address.city,
        country: address.country,
        hash,
        sandbox: process.env.PAYHERE_SANDBOX === 'true' ? '1' : '0',
      },
    })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
