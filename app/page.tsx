"use client"

import Link from "next/link"
import { ChevronRight, Shield, Zap, MessageCircle } from "lucide-react"
import PricingCard from "@/components/pricing-card"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="section-spacing container-wide">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20">
              <span className="text-xl md:text-2xl animate-pulse">✨</span>
              <span className="text-xs md:text-sm font-bold text-green-400 uppercase tracking-wider">Премиум защита</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
              <span className="text-white">Защита вашей</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-transparent bg-clip-text">
                конфиденциальности
              </span>{" "}
              <span className="inline-block animate-pulse">🔒</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
              <span className="text-2xl mr-2">🐼</span>
              <span className="font-medium text-white">Panda VPN</span> — безопасное соединение и полная анонимность в интернете.
              <span className="block mt-2 text-green-400 font-semibold">Защитите свои данные уже сегодня.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary flex items-center gap-2 justify-center text-base md:text-lg px-8 py-4 shadow-xl shadow-green-900/30 hover:shadow-green-900/50 transform hover:scale-105 transition-all">
                Начать сейчас 🚀 <ChevronRight size={22} />
              </Link>
              <Link href="#pricing" className="btn-secondary text-base md:text-lg px-8 py-4 transform hover:scale-105 transition-all">
                Узнать больше 👇
              </Link>
            </div>
          </div>
        </div>
      </section>      {/* Features Section */}
      <section className="section-spacing bg-card-bg border-t border-b border-border">
        <div className="container-wide">
          <div className="text-center mb-4">
            <span className="text-2xl md:text-3xl">⭐</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-white">Почему выбирают Panda VPN</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="relative group overflow-hidden rounded-xl transition-all duration-300 h-full">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-green-900/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              <div className="relative p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-xl hover:border-green-600/60 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-900/20 h-full flex flex-col">
                <div className="absolute -top-2 -right-2 text-4xl md:text-6xl opacity-10">⚡</div>
                <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-600 to-green-700 mb-4 shadow-lg">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 text-white">Максимальная скорость</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-grow">
                  Высокая пропускная способность без ограничений. Наслаждайтесь молниеносной скоростью.
                </p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-xl transition-all duration-300 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-green-900/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              <div className="relative p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-xl hover:border-green-600/60 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-900/20 h-full flex flex-col">
                <div className="absolute -top-2 -right-2 text-4xl md:text-6xl opacity-10">🛡️</div>
                <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-600 to-green-700 mb-4 shadow-lg">
                  <Shield className="text-white" size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 text-white">Абсолютная защита</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-grow">
                  Военное шифрование AES-256. Ваши данные в безопасности 24/7.
                </p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-xl transition-all duration-300 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-green-900/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              <div className="relative p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-xl hover:border-green-600/60 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-900/20 h-full flex flex-col">
                <div className="absolute -top-2 -right-2 text-4xl md:text-6xl opacity-10">💬</div>
                <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-600 to-green-700 mb-4 shadow-lg">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 text-white">24/7 Поддержка</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-grow">
                  Быстрая помощь на русском языке. Мы всегда рядом с вами.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-spacing container-wide">
        <div className="text-center mb-8 md:mb-16">
          <div className="flex justify-center mb-3">
            <span className="text-3xl md:text-4xl">💰</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">Выберите свою панду 🐼</h2>
          <p className="text-base md:text-lg text-muted-foreground">Гибкие тарифы для разных потребностей</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <PricingCard
            name="🍃 Малыш Панда"
            icon="🐼"
            price="299"
            description="Для начинающих пользователей"
            features={[
              "✓ 5 одновременных соединений",
              "✓ 100+ серверов по миру",
              "✓ 5 ГБ в месяц",
              "✓ Базовая поддержка",
            ]}
            highlighted={false}
          />

          <PricingCard
            name="💚 Панда Pro"
            icon="🐼‍⬛"
            price="599"
            description="Для опытных пользователей"
            features={[
              "✓ 20 одновременных соединений",
              "✓ 200+ серверов по миру",
              "✓ Неограниченная скорость",
              "✓ Приоритетная поддержка",
              "✓ Kill Switch",
            ]}
            highlighted={true}
          />

          <PricingCard
            name="👑 Панда Премиум"
            icon="🐼"
            price="999"
            description="Для профессионалов"
            features={[
              "✓ Неограниченные соединения",
              "✓ 500+ серверов по миру",
              "✓ Неограниченная скорость",
              "✓ VIP поддержка 24/7",
              "✓ Приватный DNS",
              "✓ Мультихоп шифрование",
            ]}
            highlighted={false}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-gradient-to-r from-green-950/30 via-black to-green-950/30 border-y border-accent/30 shadow-lg">
        <div className="container-wide text-center">
          <div className="mb-4 text-3xl md:text-4xl">🎉</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">Готовы присоединиться? 🔓</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">Первый месяц со скидкой 50% 🎁</p>
          <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-2">
            Создать аккаунт 🎯 <ChevronRight size={20} />
          </Link>
        </div>
      </section>
    </>
  )
}
