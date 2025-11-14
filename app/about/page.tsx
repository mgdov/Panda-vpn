import Navbar from "@/components/navbar"
import { CheckCircle, Shield, Zap, Users, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Декоративные элементы */}
      <div className="pointer-events-none fixed -top-32 -left-32 w-[400px] h-[400px] bg-green-700/20 rounded-full blur-3xl opacity-40 z-0 animate-pulse" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[350px] h-[350px] bg-green-400/10 rounded-full blur-2xl opacity-25 z-0" />

      {/* Hero Section */}
      <section className="py-12 md:py-16 container-wide relative z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-linear-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20">
              <span className="text-xl">🐼</span>
              <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">О нас</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 md:mb-4 text-center bg-linear-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">О Panda VPN</h1>
          <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8 leading-relaxed text-center">
            Мы создали <span className="text-green-400 font-semibold">Panda VPN</span>, чтобы каждый смог получить безопасный и надежный доступ в интернет без опасений за свою
            приватность.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16 bg-linear-to-br from-slate-900/60 to-black/40 border-y border-green-700/20 backdrop-blur-sm relative z-10">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="px-4">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-green-900/30 border border-green-600/40 rounded-full">
                <Shield size={14} className="text-green-400" />
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Наша миссия</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 md:mb-4 bg-linear-to-r from-white to-green-300 bg-clip-text text-transparent">Защита и свобода для всех</h2>
              <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4 leading-relaxed">
                Panda VPN работает над тем, чтобы защитить конфиденциальность пользователей в интернете и обеспечить
                безопасный доступ к информации без цензуры.
              </p>

              <ul className="space-y-2 md:space-y-3">
                {[
                  "Надежное шифрование данных",
                  "Быстрые и стабильные серверы",
                  "Строгая политика невмешательства",
                  "Поддержка различных протоколов",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 rounded-lg bg-linear-to-br from-green-600/30 to-green-700/30 flex items-center justify-center border border-green-600/40 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="text-green-400 flex-shrink-0" size={16} />
                    </div>
                    <span className="text-xs md:text-sm text-gray-200 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center order-first lg:order-last relative">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-linear-to-br from-green-600/20 to-green-900/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="text-6xl md:text-7xl lg:text-8xl relative drop-shadow-2xl hover:scale-110 transition-transform duration-300">🐼</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 container-wide relative z-10">
        <div className="text-center mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-linear-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20">
            <span className="text-xl">⭐</span>
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Ценности</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 bg-linear-to-r from-white to-green-300 bg-clip-text text-transparent">Наши ценности</h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-2xl mx-auto">Принципы, которыми мы руководствуемся каждый день</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 px-4">
          {[
            {
              icon: Shield,
              title: "Приватность",
              desc: "Ваши данные — ваши. Мы не собираем логи и не отслеживаем активность.",
              color: "from-green-600 to-green-700"
            },
            {
              icon: Zap,
              title: "Скорость",
              desc: "Оптимизированные серверы обеспечивают максимальную производительность.",
              color: "from-blue-600 to-blue-700"
            },
            {
              icon: Globe,
              title: "Надежность",
              desc: "99.9% uptime гарантирует постоянное соединение когда оно вам нужно.",
              color: "from-purple-600 to-purple-700"
            },
          ].map((value, i) => {
            const Icon = value.icon
            return (
              <div key={i} className="relative group overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-linear-to-br from-green-600/10 to-green-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-5 md:p-6 bg-linear-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-xl hover:border-green-600/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-900/30">
                  <div className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-linear-to-br ${value.color} mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3 text-white">{value.title}</h3>
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{value.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16 bg-linear-to-br from-slate-900/60 to-black/40 border-y border-green-700/20 backdrop-blur-sm relative z-10">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-linear-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20">
            <Users size={18} className="text-green-400" />
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Команда</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 bg-linear-to-r from-white to-green-300 bg-clip-text text-transparent">Создано с любовью</h2>
          <p className="text-xs md:text-sm text-gray-300 mb-5 md:mb-6 max-w-2xl mx-auto leading-relaxed">
            Наша команда состоит из опытных разработчиков и специалистов по безопасности, которые работают над тем, чтобы ваш интернет был <span className="text-green-400 font-semibold">безопасным и свободным</span>.
          </p>
          <div className="flex justify-center gap-3 text-4xl md:text-5xl">
            <span className="hover:scale-125 transition-transform duration-300 drop-shadow-lg cursor-pointer">👨‍💻</span>
            <span className="hover:scale-125 transition-transform duration-300 drop-shadow-lg cursor-pointer">👩‍💻</span>
            <span className="hover:scale-125 transition-transform duration-300 drop-shadow-lg cursor-pointer">🔒</span>
          </div>
        </div>
      </section>
    </>
  )
}
