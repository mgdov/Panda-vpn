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
import PasswordConfirmInput from "@/components/shared/password-confirm-input"
import PasswordStrengthIndicator, { calculatePasswordStrength } from "@/components/shared/password-strength-indicator"
import FormAlert from "@/components/shared/form-alert"
import FormSubmitButton from "@/components/shared/form-submit-button"
import SocialAuthButtons from "@/components/shared/social-auth-buttons"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const strength = calculatePasswordStrength(password)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (strength.score < 2) {
      setError("Пароль должен быть надежнее. Используйте заглавные буквы, цифры и специальные символы.")
      return
    }

    if (!passwordsMatch) {
      setError("Пароли не совпадают")
      return
    }

    setIsLoading(true)

    try {
      await apiClient.register({ email, password })

      // После регистрации показываем форму верификации
      setShowVerification(true)
      setIsLoading(false)
    } catch (err: unknown) {
      setIsLoading(false)
      const errorMessage = err instanceof Error ? err.message : "Ошибка регистрации"
      setError(errorMessage)
    }
  }

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (verificationCode.length !== 6) {
      setError("Код верификации должен содержать 6 цифр")
      return
    }

    setIsVerifying(true)

    try {
      await apiClient.verifyEmail({ email, code: verificationCode })
      
      // Токены уже сохранены в apiClient.verifyEmail()
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", email)

      // Перенаправляем на dashboard
      router.push("/dashboard")
    } catch (err: unknown) {
      setIsVerifying(false)
      const errorMessage = err instanceof Error ? err.message : "Неверный код верификации"
      setError(errorMessage)
    }
  }

  const handleResendCode = async () => {
    setError("")
    try {
      await apiClient.resendVerification({ email })
      setError("") // Очищаем ошибки
      // Можно показать успешное сообщение
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Не удалось отправить код повторно"
      setError(errorMessage)
    }
  }

  // Если показываем форму верификации
  if (showVerification) {
    return (
      <AuthBackground>
        <div className="w-full max-w-md relative z-10">
          <AuthLogo
            title="Подтвердите email"
            subtitle="Мы отправили код на {email}"
          />

          <form
            onSubmit={handleVerifyEmail}
            className="space-y-5 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-7 shadow-2xl"
          >
            <div className="text-center mb-4">
              <p className="text-gray-300 text-sm mb-2">
                Введите 6-значный код, который мы отправили на
              </p>
              <p className="text-green-400 font-semibold">{email}</p>
            </div>

            <FormInput
              label="Код верификации"
              icon="🔐"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              required
              className="text-center text-2xl tracking-widest font-mono"
            />

            {error && <FormAlert type="error" message={error} />}

            <FormSubmitButton
              isLoading={isVerifying}
              loadingText="Проверка..."
              disabled={verificationCode.length !== 6}
            >
              <span>✓ Подтвердить</span>
            </FormSubmitButton>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-green-400 hover:text-green-300 transition-colors underline"
              >
                Отправить код повторно
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Не получили письмо? Проверьте папку &quot;Спам&quot; или{" "}
            <button
              onClick={handleResendCode}
              className="text-green-400 hover:text-green-300 transition-colors font-bold underline"
            >
              отправьте код повторно
            </button>
          </p>
        </div>
      </AuthBackground>
    )
  }

  // Форма регистрации
  return (
    <AuthBackground>
      <div className="w-full max-w-md relative z-10">
        <AuthLogo
          title="Присоединяйтесь к нам"
          subtitle="Создайте аккаунт за 30 секунд"
        />

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
            placeholder="your@email.com"
            showCheck
            required
          />

          <div>
            <PasswordInput
              label="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Мин. 8 символов"
              required
            />
            <PasswordStrengthIndicator password={password} />
          </div>

          <PasswordConfirmInput
            label="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Повторите пароль"
            passwordMatch={passwordsMatch}
            showMatchIndicator
            required
          />

          {error && <FormAlert type="error" message={error} />}

          <FormSubmitButton
            isLoading={isLoading}
            loadingText="Регистрация..."
            disabled={!email || !password || !confirmPassword || !passwordsMatch || strength.score < 2}
          >
            <span>⚡ Создать аккаунт</span>
          </FormSubmitButton>
        </form>

        <SocialAuthButtons mode="signup" />

        <p className="text-center text-sm text-gray-400 mt-6">
          Уже есть аккаунт?{" "}
          <Link
            href="/auth/login"
            className="text-green-400 hover:text-green-300 transition-colors duration-300 font-bold underline decoration-green-400/50 hover:decoration-green-400"
          >
            Войти
          </Link>
        </p>

        <p className="text-center text-xs text-gray-600 mt-4">
          Создав аккаунт, вы согласны с условиями обслуживания
        </p>
      </div>
    </AuthBackground>
  )
}
