'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useCart } from '@/context/CartContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type Tab = 'signin' | 'register' | 'forgot'
interface AuthedUser { name: string; email: string }

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function Spinner({ small }: { small?: boolean }) {
  const size = small ? 'w-4 h-4 border' : 'w-5 h-5 border-2'
  return <div className={`${size} border-cta border-t-transparent rounded-full animate-spin`} />
}

function AccountContent() {
  const [tab, setTab] = useState<Tab>('signin')
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [authedUser, setAuthedUser] = useState<AuthedUser | null | undefined>(undefined)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/'
  const { syncCart, mergeGuestCart } = useCart()

  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')

  useEffect(() => {
    fetch('/api/user/me')
      .then((r) => r.json())
      .then((d) => setAuthedUser(d.success ? (d.user as AuthedUser) : null))
      .catch(() => setAuthedUser(null))
  }, [])

  const afterAuth = async () => {
    await mergeGuestCart()
    await syncCart()
    router.push(redirectTo)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      })
      const data = await res.json()
      if (data.success) { toast.success('Welcome back!'); await afterAuth() }
      else toast.error(data.message as string)
    } finally { setLoading(false) }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      })
      const data = await res.json()
      if (data.success) { toast.success('Account created!'); await afterAuth() }
      else toast.error(data.message as string)
    } finally { setLoading(false) }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()
      toast.info(data.message as string)
    } finally { setLoading(false) }
  }

  const handleGoogleSignIn = async () => {
    setGLoading(true)
    try {
      const { signInWithPopup } = await import('firebase/auth')
      const { clientAuth, googleProvider } = await import('@/lib/firebase-client')
      const result = await signInWithPopup(clientAuth, googleProvider)
      const idToken = await result.user.getIdToken()
      const res = await fetch('/api/user/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      const data = await res.json()
      if (data.success) { toast.success('Signed in with Google!'); await afterAuth() }
      else toast.error((data.message as string) ?? 'Google sign-in failed')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // user dismissed — silent
      } else if (code === 'auth/popup-blocked') {
        toast.error('Popup was blocked by your browser. Please allow popups for this site.')
      } else if (code === 'auth/operation-not-allowed') {
        toast.error('Google sign-in is not enabled yet. Enable it in Firebase Console → Authentication → Sign-in method.')
      } else {
        console.error('Google sign-in error:', err)
        toast.error(`Sign-in failed: ${code || 'unknown error'}`)
      }
    } finally { setGLoading(false) }
  }

  const handleLogout = async () => {
    await fetch('/api/user/logout', { method: 'POST' }).catch(() => null)
    router.push('/')
    router.refresh()
  }

  if (authedUser === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // ─── Logged-in dashboard ───────────────────────────────────────────────────
  if (authedUser !== null) {
    const initials = authedUser.name
      .split(' ')
      .map((w: string) => w[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2)

    return (
      <div className="min-h-[70vh] max-w-2xl mx-auto px-4 sm:px-6 py-16">
        {/* Profile */}
        <div className="flex items-center gap-5 mb-12">
          <div className="w-14 h-14 rounded-full bg-cta flex items-center justify-center text-white font-medium text-lg tracking-wide shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-playfair italic text-2xl text-text-primary">{authedUser.name}</p>
            <p className="text-sm text-text-muted mt-0.5">{authedUser.email}</p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Link
            href="/orders"
            className="group border border-border hover:border-text-primary transition-colors p-6 bg-white"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                className="text-text-muted group-hover:text-text-primary transition-colors">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="13" y2="16" />
              </svg>
              <span className="text-xs tracking-widest uppercase text-text-secondary">My Orders</span>
            </div>
            <p className="text-sm text-text-muted">View full order history</p>
          </Link>

          <Link
            href="/orders"
            className="group border border-border hover:border-text-primary transition-colors p-6 bg-white"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                className="text-text-muted group-hover:text-text-primary transition-colors">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-xs tracking-widest uppercase text-text-secondary">Track My Order</span>
            </div>
            <p className="text-sm text-text-muted">Check real-time delivery status</p>
          </Link>
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    )
  }

  // ─── Auth view ─────────────────────────────────────────────────────────────
  const tabClass = (t: Tab) =>
    `text-xs tracking-[0.15em] uppercase pb-2 border-b-2 transition-colors ${
      tab === t
        ? 'border-cta text-text-primary'
        : 'border-transparent text-text-muted hover:text-text-primary'
    }`

  return (
    <div className="min-h-[80vh] grid grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-cta px-14 py-20">
        <p className="font-playfair italic text-3xl text-white">Amoi</p>
        <div>
          <p className="font-playfair italic text-5xl text-white leading-tight mb-6">
            Style that<br />tells your story.
          </p>
          <p className="text-white/50 text-sm tracking-wider leading-relaxed max-w-xs">
            Handcrafted women's couture from Sri Lanka — designed for every chapter of your life.
          </p>
        </div>
        <p className="text-white/30 text-xs tracking-widest uppercase">Women's Couture · Sri Lanka</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-8 py-16 bg-white">
        <div className="w-full max-w-sm">
          {/* Tabs */}
          <div className="flex gap-6 mb-8">
            <button className={tabClass('signin')} onClick={() => setTab('signin')}>Sign In</button>
            <button className={tabClass('register')} onClick={() => setTab('register')}>Create Account</button>
            {tab === 'forgot' && (
              <button className={tabClass('forgot')}>Forgot Password</button>
            )}
          </div>

          {/* Google */}
          {tab !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={gLoading}
                className="w-full flex items-center justify-center gap-3 border border-border hover:border-text-primary transition-colors py-3 text-sm text-text-primary mb-5 disabled:opacity-60"
              >
                {gLoading ? <Spinner small /> : <GoogleIcon />}
                Continue with Google
              </button>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-text-muted tracking-wider">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </>
          )}

          {/* Sign In */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-5">
              <Input label="Email" type="email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} required />
              <div>
                <Input label="Password" type="password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} required />
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="mt-2 text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          )}

          {/* Register */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <Input label="Full Name" value={regName} onChange={(e) => setRegName(e.target.value)} required />
              <Input label="Email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
              <Input label="Password" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>
          )}

          {/* Forgot */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-5">
              <p className="text-sm text-text-secondary leading-relaxed">
                Enter your email and we&apos;ll send a reset link valid for 1 hour.
              </p>
              <Input label="Email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </Button>
              <button
                type="button"
                onClick={() => setTab('signin')}
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                ← Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-cta border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  )
}
