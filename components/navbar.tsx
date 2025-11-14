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
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-accent/30 shadow-lg shadow-green-900/10">
      <div className="container-wide">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white hover:text-accent transition-colors duration-300">
            <span className="text-2xl">🐼</span>
            <span>Panda VPN</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="hover:text-accent transition-colors duration-300 text-white text-sm">
              📚 О нас
            </Link>
            <Link href="/faq" className="hover:text-accent transition-colors duration-300 text-white text-sm">
              ❓ FAQ
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
                <User size={16} />
                Личный кабинет
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-accent transition-colors duration-300 text-white text-sm">
                  🔑 Вход
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm px-4 py-2">
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
