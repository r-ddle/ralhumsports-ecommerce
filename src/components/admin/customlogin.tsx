'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { CustomLogo } from './customlogo'

export const CustomLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Login failed')
      }

      // Payload sets the cookie on success (session-based auth)
      // Redirect to admin dashboard or desired page
      window.location.href = '/admin'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-brand-background">
      {/* Left Section: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 animate-fade-in-up">
        <div className="w-full max-w-md bg-brand-surface rounded-lg shadow-lg p-8 border border-brand-border">
          <div className="mb-6 flex justify-center">
            <CustomLogo />
          </div>
          <h1 className="text-3xl font-sans font-bold text-text-primary text-center mb-8">
            Welcome to Ralhum
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-text-primary">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 font-medium text-text-primary">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
            {error && <p className="text-red-600 text-center font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-accent text-white font-semibold rounded-md hover:bg-brand-accent-dark disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section: Banner (Desktop Only) */}
      <div className="hidden lg:block flex-1 relative">
        <Image
          src="/ralhumloginbanner.jpg"
          alt="Ralhum Login Banner"
          fill
          className="object-cover"
          quality={85}
        />
      </div>

      {/* Mobile Background Overlay */}
      <div className="lg:hidden absolute inset-0 -z-10">
        <Image
          src="/ralhumloginbanner.jpg"
          alt="Ralhum Login Background"
          fill
          className="object-cover opacity-20"
          quality={75}
        />
      </div>

      {/* Hide Payload Branding */}
      <style jsx>{`
        .payload-branding {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default CustomLogin
