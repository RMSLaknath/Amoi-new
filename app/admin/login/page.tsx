'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/user/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        router.push('/admin')
      } else {
        toast.error(data.message as string)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-playfair italic text-3xl text-text-primary">Amoi</h1>
          <p className="text-xs tracking-widest uppercase text-text-muted mt-1">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
