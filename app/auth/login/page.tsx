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
      await apiClient.login({ email, password })

      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", email)

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err: unknown) {
      setIsLoading(false)
      const errorMessage = err instanceof Error ? err.message : "Ошибка входа"
      setError(errorMessage)
    }
  }

  return (
    <AuthBackground>
      <div className="w-full max-w-md relative z-10">
        <AuthLogo
          title="Добро пожаловать обратно"
          subtitle="Войдите в свой аккаунт"
        />

        {/* Demo credentials info */}
        <div className="mb-8 p-4 bg-linear-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/30 backdrop-blur-xl hover:border-blue-500/50 transition-all duration-300">
          <p className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-lg">🔑</span>
            Тестовые учетные данные:
          </p>
          <div className="space-y-2 text-xs text-gray-200 ml-7">
            <p className="flex items-center gap-2">
              <span className="text-blue-400">📧</span>
              <code className="bg-slate-800/50 px-2 py-1 rounded font-mono">demo@pandavpn.com</code>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-blue-400">🔐</span>
              <code className="bg-slate-800/50 px-2 py-1 rounded font-mono">demo123</code>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-7 shadow-2xl"
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

        <p className="text-center text-sm text-gray-400 mt-6">
          Нет аккаунта?{" "}
          <Link
            href="/auth/signup"
            className="text-green-400 hover:text-green-300 transition-colors duration-300 font-bold underline decoration-green-400/50 hover:decoration-green-400"
          >
            Создать аккаунт
          </Link>
        </p>

        <p className="text-center text-xs text-gray-600 mt-4">
          Нажимая &ldquo;Войти&rdquo;, вы согласны с нашими условиями обслуживания
        </p>
      </div>
    </AuthBackground>
  )
}
