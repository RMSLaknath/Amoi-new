'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface Props {
  params: Promise<{ token: string }>
}

export default function ResetPasswordPage({ params }: Props) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return }

    setLoading(true)
    try {
      const { token } = await params
      const res = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Password reset! Please sign in.')
        router.push('/account')
      } else {
        toast.error(data.message as string)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-16 pb-20 px-4">
      <div className="w-full max-w-md">
        <h1 className="font-playfair italic text-2xl mb-2">Reset Password</h1>
        <p className="text-sm text-text-secondary mb-10">Enter your new password below.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <Button type="submit" fullWidth disabled={loading}>{loading ? 'Resetting…' : 'Reset Password'}</Button>
        </form>
      </div>
    </div>
  )
}
