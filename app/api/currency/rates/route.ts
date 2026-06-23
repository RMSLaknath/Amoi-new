import { NextResponse } from 'next/server'
import { getExchangeRates } from '@/lib/currency'

export async function GET() {
  try {
    const rates = await getExchangeRates()
    return NextResponse.json({ success: true, rates })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch exchange rates' },
      { status: 500 }
    )
  }
}
