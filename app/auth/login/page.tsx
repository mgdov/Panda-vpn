"use client"

import type React from "react"
import Link from "next/link"
import { useState, useCallback } from "react"
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
      const errorMessage = err instanceof Error ? err.message : "Ошибка входа"
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [email, password, router])

  return (
    <AuthBackground>
      <div className="relative z-10 w-full max-w-md space-y-6">
        <AuthLogo title="Добро пожаловать обратно" subtitle="Войдите в свой аккаунт" />

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
            placeholder="your@email.com"
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
