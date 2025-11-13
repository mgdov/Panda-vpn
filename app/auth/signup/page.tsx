"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Пароли не совпадают")
      return
    }
    setIsLoading(true)
    // API call would go here
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <div className="text-4xl md:text-5xl mb-3 md:mb-4">🐼</div>
          <h1 className="text-2xl md:text-3xl font-bold">Panda VPN</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">Создайте свой аккаунт</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-input-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-input-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium mb-2">Подтвердите пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-input-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full text-sm md:text-base">
            {isLoading ? "Загрузка..." : "Создать аккаунт"}
          </button>
        </form>

        {/* Link to login */}
        <p className="text-center text-xs md:text-sm text-muted-foreground mt-4 md:mt-6">
          Уже есть аккаунт?{" "}
          <Link href="/auth/login" className="text-accent hover:opacity-80 transition">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
