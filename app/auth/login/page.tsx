"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { login as apiLogin, setAuth } from "@/lib/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const auth = await apiLogin(email, password)
      setAuth(auth)
      window.location.href = "/dashboard"
    } catch (err: any) {
      const errorMessage = err?.message || err?.payload?.message || err?.payload?.error || "Ошибка входа"
      setError(errorMessage)
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="pointer-events-none fixed -top-32 -left-32 w-[400px] h-[400px] bg-green-700/20 rounded-full blur-3xl opacity-40 z-0 animate-pulse" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[350px] h-[350px] bg-green-400/10 rounded-full blur-2xl opacity-25 z-0" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-5 md:mb-6">
          <div className="text-3xl md:text-4xl mb-2 animate-float">⚡</div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Panda VPN</h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1.5">Введите учетные данные</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Demo credentials info */}
        <div className="mb-4 md:mb-5 p-3 md:p-4 bg-green-900/20 border border-green-500/50 rounded-lg hover:border-green-500/70 transition-all duration-300 hover:scale-105">
          <p className="text-xs md:text-sm text-white mb-1.5 font-semibold">🔑 Тестовые данные для входа:</p>
          <div className="space-y-1 text-xs md:text-sm text-gray-300">
            <p><strong>Email:</strong> demo@pandavpn.com</p>
            <p><strong>Пароль:</strong> demo123</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-white mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-white mb-1.5">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full text-sm md:text-base hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            {isLoading ? "Загрузка..." : "Войти"}
          </button>
        </form>

        {/* Link to signup */}
        <p className="text-center text-xs md:text-sm text-gray-400 mt-4 md:mt-5">
          Нет аккаунта?{" "}
          <Link href="/auth/signup" className="text-green-400 hover:text-green-300 transition-colors duration-300 font-medium">
            Создать аккаунт
          </Link>
        </p>
      </div>
    </div>
  )
}
