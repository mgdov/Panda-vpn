"use client"

import Link from "next/link"
import { Menu, X, User } from "lucide-react"
import { useState, useEffect } from "react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Проверяем авторизацию на клиенте
    const authStatus = localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(authStatus)
  }, [])

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-green-500/20 shadow-2xl">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl text-white hover:scale-105 transition-all duration-300 group">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🐼</span>
            <span className="gradient-text">Panda VPN</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            <Link href="/about" className="relative text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-medium group">
              <span className="flex items-center gap-2">
                📚 О нас
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="" className="relative text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-medium group">
              <span className="flex items-center gap-2">
                📰 Статьи и блог
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="" className="relative text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-medium group">
              <span className="flex items-center gap-2">
                🤝 Отзывы
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/faq" className="relative text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-medium group">
              <span className="flex items-center gap-2">
                ❓ FAQ
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard" className="relative px-6 py-2.5 bg-linear-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm">
                <User size={16} />
                Личный кабинет
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="relative text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-medium group">
                  <span className="flex items-center gap-2">
                    🔑 Вход
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/auth/signup" className="relative px-6 py-2.5 bg-linear-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 text-sm">
                  🚀 Начать
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white hover:text-accent transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Sidebar Menu - Opens from the right */}
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

        {/* Overlay for mobile menu */}
        {isOpen && <div className="fixed inset-0 bg-black/70 md:hidden z-30 top-14" onClick={() => setIsOpen(false)}></div>}
      </div>
    </nav>
  )
}
