import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { verifyPayHereWebhook } from '@/lib/payhere'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const merchantId = formData.get('merchant_id') as string
    const orderId = formData.get('order_id') as string
    const payhereAmount = formData.get('payhere_amount') as string
    const payhereCurrency = formData.get('payhere_currency') as string
    const statusCode = formData.get('status_code') as string
    const md5sig = formData.get('md5sig') as string

    const isValid = verifyPayHereWebhook(merchantId, orderId, payhereAmount, payhereCurrency, statusCode, md5sig)
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 })
    }

    if (statusCode === '2') {
      const orderDoc = await db.collection('orders').doc(orderId).get()
      if (orderDoc.exists) {
        const userId = orderDoc.data()?.userId as string
        await db.collection('orders').doc(orderId).update({ payment: true })
        await db.collection('users').doc(userId).set({ cartData: {} }, { merge: true })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
