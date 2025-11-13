"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // API call would go here
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <div className="text-4xl md:text-5xl mb-3 md:mb-4">⚡</div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Panda VPN</h1>
          <p className="text-sm md:text-base text-gray-300 mt-2">Введите учетные данные</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-white mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full text-sm md:text-base">
            {isLoading ? "Загрузка..." : "Войти"}
          </button>
        </form>

        {/* Link to signup */}
        <p className="text-center text-xs md:text-sm text-gray-400 mt-4 md:mt-6">
          Нет аккаунта?{" "}
          <Link href="/auth/signup" className="text-green-400 hover:text-green-300 transition">
            Создать аккаунт
          </Link>
        </p>
      </div>
    </div>
  )
}
