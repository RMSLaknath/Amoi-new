import crypto from 'crypto'

function hashSecret(secret: string): string {
  return crypto.createHash('md5').update(secret).digest('hex').toUpperCase()
}

export function generatePayHereHash(orderId: string, amount: string, currency: string): string {
  const merchantId = process.env.PAYHERE_MERCHANT_ID!
  const hashedSecret = hashSecret(process.env.PAYHERE_MERCHANT_SECRET!)

  return crypto
    .createHash('md5')
    .update(merchantId + orderId + amount + currency + hashedSecret)
    .digest('hex')
    .toUpperCase()
}

export function verifyPayHereWebhook(
  merchantId: string,
  orderId: string,
  payhereAmount: string,
  payhereCurrency: string,
  statusCode: string,
  md5sig: string
): boolean {
  const hashedSecret = hashSecret(process.env.PAYHERE_MERCHANT_SECRET!)

  const expected = crypto
    .createHash('md5')
    .update(merchantId + orderId + payhereAmount + payhereCurrency + statusCode + hashedSecret)
    .digest('hex')
    .toUpperCase()

  return expected === md5sig.toUpperCase()
}
