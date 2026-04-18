'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login, forgotPassword } from '@/app/actions/auth'
import { Zap } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await login(new FormData(e.currentTarget))
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function handleForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await forgotPassword(new FormData(e.currentTarget))
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setResetSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">HabitFlow</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {showForgot ? (
            <>
              <h1 className="text-2xl font-bold mb-1">Reset password</h1>
              <p className="text-gray-400 text-sm mb-6">
                Enter your email and we'll send a reset link.
              </p>

              {resetSent ? (
                <div className="text-sm text-green-400 bg-green-950/40 border border-green-900 rounded-lg px-3 py-3 text-center">
                  Check your email for a password reset link.
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-600"
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
                  >
                    {loading ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>
              )}

              <button
                onClick={() => { setShowForgot(false); setError(null); setResetSent(false) }}
                className="mt-4 text-sm text-gray-500 hover:text-gray-300 w-full text-center"
              >
                Back to sign in
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
              <p className="text-gray-400 text-sm mb-6">Sign in to your account</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setShowForgot(true); setError(null) }}
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-600"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          No account?{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
