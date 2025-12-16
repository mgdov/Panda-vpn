"use client"

import Link from "next/link"
import { Menu, X, User } from "lucide-react"
import { useEffect, useState } from "react"

const comingSoonLinks = [
  {
    id: "articles",
    emoji: "📰",
    label: "Статьи и блог",
    subtitle: "Ведем подготовку статей и гайдов",
    stage: "Этап: дизайн и редактура",
  },
  {
    id: "reviews",
    emoji: "🤝",
    label: "Отзывы",
    subtitle: "Собираем истории пользователей",
    stage: "Этап: верификация и монтаж",
  },
]

interface ComingSoonButtonProps {
  emoji: string
  label: string
  subtitle: string
  stage: string
}

function ComingSoonButton({ emoji, label, subtitle, stage }: ComingSoonButtonProps) {
  return (
    <button
      type="button"
      className="relative text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-medium group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 rounded-lg px-1"
    >
      <span className="flex items-center gap-2">
        {emoji} {label}
      </span>
      <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r from-green-400 to-emerald-400 transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
      <div className="pointer-events-none absolute left-1/2 top-full mt-5 w-64 -translate-x-1/2 opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100">
        <div className="rounded-2xl border border-emerald-200/30 bg-[#06130f]/95 p-4 shadow-2xl shadow-emerald-900/50 backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-100/80">Раздел в разработке</p>
          <p className="mt-1 text-sm text-white font-semibold">{subtitle}</p>
          <div className="mt-3 flex items-center gap-2 text-[12px] text-emerald-200/80">
            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
            {stage}
          </div>
        </div>
      </div>
    </button>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(authStatus)
  }, [])

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-green-500/20 shadow-2xl">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-xl text-white hover:scale-105 transition-all duration-300 group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🐼</span>
            <span className="gradient-text">Panda VPN</span>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            <Link
              href="/about"
              className="relative text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-medium group"
            >
              <span className="flex items-center gap-2">📚 О нас</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
            </Link>

            {comingSoonLinks.map((link) => (
              <ComingSoonButton key={link.id} {...link} />
            ))}

            <Link
              href="/faq"
              className="relative text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-medium group"
            >
              <span className="flex items-center gap-2">❓ FAQ</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
            </Link>

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="relative px-6 py-2.5 bg-linear-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm"
              >
                <User size={16} />
                Личный кабинет
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="relative text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-medium group"
                >
                  <span className="flex items-center gap-2">🔑 Вход</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  href="/auth/signup"
                  className="relative px-6 py-2.5 bg-linear-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 text-sm"
                >
                  🚀 Начать
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white hover:text-accent transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div
          className={`fixed top-14 right-0 h-[calc(100vh-3.5rem)] w-64 bg-background border-l border-accent/30 z-40 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} md:hidden shadow-2xl`}
        >
          <div className="p-5 space-y-3">
            <Link
              href="/about"
              className="block py-2.5 hover:text-accent transition-colors duration-300 text-white hover:bg-accent/10 rounded-lg px-3 text-sm"
              onClick={() => setIsOpen(false)}
            >
              📚 О нас
            </Link>

            {comingSoonLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70"
              >
                <span>
                  {link.emoji} {link.label}
                </span>
                <span className="text-[11px] uppercase tracking-[0.35em] text-emerald-200/80">Скоро</span>
              </div>
            ))}

            <Link
              href="/faq"
              className="block py-2.5 hover:text-accent transition-colors duration-300 text-white hover:bg-accent/10 rounded-lg px-3 text-sm"
              onClick={() => setIsOpen(false)}
            >
              ❓ FAQ
            </Link>

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="mt-3 btn-primary w-full text-center py-2.5 flex items-center justify-center gap-2 text-sm"
                onClick={() => setIsOpen(false)}
              >
                <User size={16} />
                Личный кабинет
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block py-2.5 hover:text-accent transition-colors duration-300 text-white hover:bg-accent/10 rounded-lg px-3 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  🔑 Вход
                </Link>
                <Link
                  href="/auth/signup"
                  className="block mt-3 btn-primary w-full text-center py-2.5 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  🚀 Начать
                </Link>
              </>
            )}
          </div>
        </div>

        {isOpen && <div className="fixed inset-0 bg-black/70 md:hidden z-30 top-14" onClick={() => setIsOpen(false)} />}
      </div>
    </nav>
  )
}
