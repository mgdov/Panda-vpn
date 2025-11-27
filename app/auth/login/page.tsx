"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import AuthBackground from "@/components/shared/auth-background"
import AuthLogo from "@/components/shared/auth-logo"
import FormInput from "@/components/shared/form-input"
import PasswordInput from "@/components/shared/password-input"
import FormAlert from "@/components/shared/form-alert"
import FormSubmitButton from "@/components/shared/form-submit-button"
import SocialAuthButtons from "@/components/shared/social-auth-buttons"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const isDemoLogin = email === "demo@pandavpn.com" && password === "demo123"

      if (isDemoLogin) {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", email)
        setSuccess(true)
        setIsLoading(false)
        setTimeout(() => {
          router.push("/dashboard")
        }, 800)
        return
      }

      await apiClient.login({ email, password })

      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", email)

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка входа"
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <AuthBackground>
      <div className="relative z-10 w-full max-w-md space-y-6">
        <AuthLogo title="Добро пожаловать обратно" subtitle="Войдите в свой аккаунт" />

        <div className="rounded-xl border border-white/10 bg-white/10 p-5 shadow-lg shadow-black/30">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <span className="text-base">🔑</span>
            Тестовые данные для входа
          </div>
          <div className="space-y-2 text-xs font-medium text-gray-200">
            <p className="flex items-center gap-2">
              <span className="text-emerald-300">📧</span>
              <code className="rounded bg-slate-900/50 px-2 py-1 font-mono">demo@pandavpn.com</code>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-emerald-300">🔐</span>
              <code className="rounded bg-slate-900/50 px-2 py-1 font-mono">demo123</code>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-white/10 p-7 shadow-xl shadow-black/30 backdrop-blur-xl"
        >
          <FormInput
            label="Email адрес"
            icon="📧"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@pandavpn.com"
            showCheck
            required
          />

          <PasswordInput
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />

          {error && <FormAlert type="error" message={error} />}
          {success && <FormAlert type="success" message="✨ Вход выполнен! Перенаправление..." />}

          <FormSubmitButton
            isLoading={isLoading}
            loadingText="Вход..."
            disabled={!email || !password}
          >
            <span>⚡ Войти</span>
          </FormSubmitButton>
        </form>

        <SocialAuthButtons mode="login" />

        <p className="text-center text-sm font-medium text-gray-300">
          Нет аккаунта?{" "}
          <Link
            href="/auth/signup"
            className="text-green-400 hover:text-green-300 transition-colors duration-300 font-bold underline decoration-green-400/50 hover:decoration-green-400"
          >
            Создать аккаунт
          </Link>
        </p>

        <p className="text-center text-xs font-medium text-gray-400">
          Нажимая &ldquo;Войти&rdquo;, вы согласны с нашими условиями обслуживания
        </p>
      </div>
    </AuthBackground>
  )
}
