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
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-accent/30 shadow-lg shadow-green-900/10">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white hover:text-accent transition">
            <span className="text-3xl">🐼</span>
            <span>Panda VPN</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="hover:text-accent transition text-white">
              📚 О нас
            </Link>
            <Link href="/faq" className="hover:text-accent transition text-white">
              ❓ FAQ
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard" className="btn-primary flex items-center gap-2">
                <User size={18} />
                Личный кабинет
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-accent transition text-white">
                  🔑 Вход
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  🚀 Начать
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Sidebar Menu - Opens from the right */}
        <div
          className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-background border-l border-accent/30 z-40 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} md:hidden shadow-2xl`}
        >
          <div className="p-6 space-y-4">
            <Link
              href="/about"
              className="block py-3 hover:text-accent transition text-white hover:bg-accent/10 rounded-lg px-4"
              onClick={() => setIsOpen(false)}
            >
              📚 О нас
            </Link>
            <Link
              href="/faq"
              className="block py-3 hover:text-accent transition text-white hover:bg-accent/10 rounded-lg px-4"
              onClick={() => setIsOpen(false)}
            >
              ❓ FAQ
            </Link>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="mt-4 btn-primary w-full text-center py-3 flex items-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} />
                Личный кабинет
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block py-3 hover:text-accent transition text-white hover:bg-accent/10 rounded-lg px-4"
                  onClick={() => setIsOpen(false)}
                >
                  🔑 Вход
                </Link>
                <Link
                  href="/auth/signup"
                  className="block mt-4 btn-primary w-full text-center py-3"
                  onClick={() => setIsOpen(false)}
                >
                  🚀 Начать
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isOpen && <div className="fixed inset-0 bg-black/70 md:hidden z-30 top-16" onClick={() => setIsOpen(false)}></div>}
      </div>
    </nav>
  )
}
