"use client"

import Link from "next/link"
import { Menu, X, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const navItems = [
  {
    id: "reviews",
    label: "Отзывы",
    emoji: "🤝",
    subtitle: "Собираем истории пользователей",
    stage: "Этап: верификация и монтаж",
    comingSoon: true,
  },
  {
    id: "articles",
    label: "Блог | Статьи",
    emoji: "📰",
    subtitle: "Ведем подготовку статей и гайдов",
    stage: "Этап: дизайн и редактура",
    comingSoon: true,
  },
  {
    id: "faq",
    label: "Ответы на вопросы",
    emoji: "❓",
    href: "/faq",
  },
  {
    id: "about",
    label: "О нас",
    emoji: "📚",
    href: "/about",
  },
]

interface ComingSoonButtonProps {
  emoji: string
  label: string
}

function ComingSoonButton({ emoji, label }: ComingSoonButtonProps) {
  return (
    <button
      type="button"
      className="relative text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-medium group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 rounded-lg px-1"
    >
      <span className="flex items-center gap-2">
        {emoji} {label}
      </span>
      <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r from-green-400 to-emerald-400 transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
      <div className="pointer-events-none absolute left-1/2 top-full mt-5 w-56 -translate-x-1/2 opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100">
        <div className="rounded-2xl border border-emerald-200/30 bg-[#06130f]/95 p-3 shadow-2xl shadow-emerald-900/50 backdrop-blur text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-100/80">Раздел в разработке</p>
        </div>
      </div>
    </button>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const scrollPositionRef = useRef(0)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(authStatus)
  }, [])

  useEffect(() => {
    if (typeof document === "undefined") {
      return
    }

    const body = document.body
    const html = document.documentElement

    if (isOpen) {
      scrollPositionRef.current = window.scrollY
      body.dataset.scrollLock = "true"
      body.style.top = `-${scrollPositionRef.current}px`
      body.style.position = "fixed"
      body.style.width = "100%"
      body.style.overflow = "hidden"
      html.style.overflow = "hidden"
    } else {
      body.dataset.scrollLock = "false"
      body.style.position = ""
      body.style.top = ""
      body.style.width = ""
      body.style.overflow = ""
      html.style.overflow = ""
      window.scrollTo(0, scrollPositionRef.current)
    }

    return () => {
      if (body.dataset.scrollLock === "true") {
        body.style.position = ""
        body.style.top = ""
        body.style.width = ""
        body.style.overflow = ""
        html.style.overflow = ""
        window.scrollTo(0, scrollPositionRef.current)
      }
    }
  }, [isOpen])

  return (
    <>
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

            <div className="hidden min-[1090px]:flex flex-1 items-center justify-end gap-6 xl:gap-10">
              <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-3 text-sm font-medium">
                {navItems.map((item) => (
                  item.comingSoon ? (
                    <div key={item.id} className="shrink-0">
                      <ComingSoonButton emoji={item.emoji!} label={item.label} />
                    </div>
                  ) : (
                    <Link
                      key={item.id}
                      href={item.href!}
                      className="relative text-gray-300 hover:text-green-400 transition-all duration-300 group"
                    >
                      <span className="flex items-center gap-2">{item.emoji} {item.label}</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
                    </Link>
                  )
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-5 border-l border-white/10 pl-6">
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
                      className="relative px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-0.5 text-xs"
                    >
                      🚀 Попробовать бесплатно
                    </Link>
                  </>
                )}
              </div>
            </div>

            <button
              className="text-white hover:text-accent transition-colors min-[1090px]:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 min-[1090px]:hidden z-60" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 right-0 h-full w-64 bg-background border-l border-accent/30 z-70 transition-transform duration-300 ease-in-out min-[1090px]:hidden shadow-2xl translate-x-0 opacity-100 pointer-events-auto">
            <div className="p-5 space-y-3 h-full flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-sm font-semibold text-white/80">Меню</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
                  aria-label="Закрыть меню"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {navItems.map((item) => (
                  item.comingSoon ? (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70"
                    >
                      <span>
                        {item.emoji} {item.label}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.35em] text-emerald-200/80">Скоро</span>
                    </div>
                  ) : (
                    <Link
                      key={item.id}
                      href={item.href!}
                      className="block py-2.5 hover:text-accent transition-colors duration-300 text-white hover:bg-accent/10 rounded-lg px-3 text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center gap-2">{item.emoji} {item.label}</span>
                    </Link>
                  )
                ))}

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
                      className="block mt-3 btn-primary w-full text-center py-2 text-xs"
                      onClick={() => setIsOpen(false)}
                    >
                      🚀 Попробовать бесплатно
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
