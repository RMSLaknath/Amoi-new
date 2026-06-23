'use client'
import { CartProvider } from '@/context/CartContext'
import { CurrencyProvider } from '@/context/CurrencyContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CurrencyProvider>
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
          draggable={false}
          toastClassName="!rounded-none !font-inter !text-sm"
        />
      </CurrencyProvider>
    </CartProvider>
  )
}
