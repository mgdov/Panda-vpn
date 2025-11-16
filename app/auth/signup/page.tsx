"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"

interface PasswordStrength {
  score: number
  label: string
  color: string
}

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const calculatePasswordStrength = (pwd: string): PasswordStrength => {
    let score = 0

    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (pwd.length >= 16) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score++

    if (score <= 2) return { score, label: "Слабый", color: "from-red-500 to-red-600" }
    if (score <= 4) return { score, label: "Средний", color: "from-yellow-500 to-yellow-600" }
    return { score, label: "Надежный", color: "from-green-500 to-emerald-600" }
  }

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

    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", email)

      setSuccess(true)
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="pointer-events-none fixed -top-40 -right-40 w-[500px] h-[500px] bg-linear-to-br from-green-600/30 to-emerald-600/20 rounded-full blur-3xl opacity-60 z-0 animate-pulse" />
      <div className="pointer-events-none fixed -bottom-40 -left-40 w-[450px] h-[450px] bg-linear-to-tr from-blue-600/20 to-cyan-600/10 rounded-full blur-3xl opacity-50 z-0" />
      <div className="pointer-events-none fixed top-1/2 right-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-l from-purple-600/10 to-pink-600/10 rounded-full blur-3xl opacity-40 z-0 animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="block text-center mb-8 group cursor-pointer">
          <div className="inline-flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
            <div className="text-5xl animate-bounce group-hover:animate-none" style={{ animationDelay: "0s" }}>
              🐼
            </div>

          </div>
          <h1 className="text-4xl font-black bg-linear-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:drop-shadow-lg transition-all duration-300">
            Panda VPN
          </h1>
          <p className="text-base text-gray-300 font-medium group-hover:text-gray-200 transition-colors">Присоединяйтесь к нам</p>
          <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors">Создайте аккаунт за 30 секунд</p>
        </Link>

        <form onSubmit={handleSubmit} className="space-y-5 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-7 shadow-2xl">
          <div>
            <label className="flex text-sm font-bold text-white mb-3 items-center gap-2">
              <span className="text-lg">📧</span>
              Email адрес
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3.5 text-sm bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 hover:border-white/30 hover:bg-white/10 backdrop-blur-sm shadow-lg"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 opacity-0 transition-opacity duration-300" style={{ opacity: email ? 1 : 0 }}>
                ✓
              </div>
            </div>
          </div>

          <div>
            <label className="flex text-sm font-bold text-white mb-3 items-center gap-2">
              <span className="text-lg">🔐</span>
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Мин. 8 символов"
                className="w-full px-4 py-3.5 text-sm bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 hover:border-white/30 hover:bg-white/10 backdrop-blur-sm shadow-lg pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-linear-to-r ${strength.color} transition-all duration-300`}
                        style={{ width: strength.score > i * 2.5 ? "100%" : "0%" }}
                      />
                    </div>
                  ))}
                </div>
                <p className={`text-xs font-bold text-transparent bg-linear-to-r ${strength.color} bg-clip-text`}>
                  Надежность: {strength.label} ({strength.score}/7)
                </p>
              </div>
            )}

            {!password && (
              <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                  <span>💡 Требования к паролю:</span>
                </p>
                <div className="space-y-1 ml-2 text-xs text-gray-400">
                  <p className="flex items-center gap-2">
                    <span>📏</span>
                    <span>Минимум 8 символов (лучше 12+)</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>🔤</span>
                    <span>Заглавные (A-Z) и строчные (a-z) буквы</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>🔢</span>
                    <span>Цифры (0-9)</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>🔣</span>
                    <span>Спецсимволы (!@#$%^&* и т.д.)</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="flex text-sm font-bold text-white mb-3 items-center gap-2">
              <span className="text-lg">✓</span>
              Подтвердите пароль
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                className="w-full px-4 py-3.5 text-sm bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 hover:border-white/30 hover:bg-white/10 backdrop-blur-sm shadow-lg pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {confirmPassword && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  {passwordsMatch ? <CheckCircle2 size={20} className="text-green-400" /> : <AlertCircle size={20} className="text-red-400" />}
                </div>
              )}
            </div>
            {confirmPassword && !passwordsMatch && <p className="text-xs text-red-400 mt-2">Пароли не совпадают</p>}
          </div>

          {error && (
            <div className="p-3.5 bg-linear-to-r from-red-500/20 to-red-600/20 border border-red-500/50 rounded-xl flex items-start gap-3 animate-pulse">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-linear-to-r from-green-500/20 to-emerald-600/20 border border-green-500/50 rounded-xl flex items-start gap-3 animate-pulse">
              <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
              <p className="text-xs text-green-200">✨ Регистрация выполнена! Перенаправление...</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password || !confirmPassword || !passwordsMatch || strength.score < 2}
            className="w-full mt-8 py-4 px-4 bg-linear-to-r from-green-500 via-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-base relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" />
            {isLoading ? (
              <>
                <span className="animate-spin">⚡</span>
                <span>Регистрация...</span>
              </>
            ) : (
              <>
                <span>⚡ Создать аккаунт</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Уже есть аккаунт?{" "}
          <Link href="/auth/login" className="text-green-400 hover:text-green-300 transition-colors duration-300 font-bold underline decoration-green-400/50 hover:decoration-green-400">
            Войти
          </Link>
        </p>

        <p className="text-center text-xs text-gray-600 mt-4">
          Создав аккаунт, вы согласны с условиями обслуживания
        </p>
      </div>
    </div>
  )
}
