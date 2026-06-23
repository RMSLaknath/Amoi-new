import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import Providers from './providers'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Amoi Fashion',
  description: 'Premium fashion from Sri Lanka',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-inter antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
