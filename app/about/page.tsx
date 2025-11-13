import Navbar from "@/components/navbar"
import { CheckCircle, Shield, Zap, Users, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Декоративные элементы */}
      <div className="pointer-events-none fixed -top-32 -left-32 w-[500px] h-[500px] bg-green-700/20 rounded-full blur-3xl opacity-50 z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] bg-green-400/10 rounded-full blur-2xl opacity-30 z-0" />

      {/* Hero Section */}
      <section className="section-spacing container-wide relative z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20">
              <span className="text-2xl">🐼</span>
              <span className="text-xs md:text-sm font-bold text-green-400 uppercase tracking-wider">О нас</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 md:mb-6 text-center bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">О Panda VPN</h1>
          <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-12 leading-relaxed text-center">
            Мы создали <span className="text-green-400 font-bold">Panda VPN</span> чтобы каждый смог получить безопасный и надежный доступ в интернет без опасений за свою
            приватность.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-spacing bg-gradient-to-br from-slate-900/60 to-black/40 border-y border-green-700/20 backdrop-blur-sm relative z-10">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="px-4">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-green-900/30 border border-green-600/40 rounded-full">
                <Shield size={16} className="text-green-400" />
                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Наша миссия</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 md:mb-6 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">Защита и свобода для всех</h2>
              <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-4 md:mb-6 leading-relaxed">
                Panda VPN работает над тем, чтобы защитить конфиденциальность пользователей в интернете и обеспечить
                безопасный доступ к информации без цензуры.
              </p>

              <ul className="space-y-3 md:space-y-4">
                {[
                  "Надежное шифрование данных",
                  "Быстрые и стабильные серверы",
                  "Строгая политика невмешательства",
                  "Поддержка различных протоколов",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600/30 to-green-700/30 flex items-center justify-center border border-green-600/40 group-hover:scale-110 transition-transform">
                      <CheckCircle className="text-green-400 flex-shrink-0" size={18} />
                    </div>
                    <span className="text-sm md:text-base text-gray-200 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center order-first lg:order-last relative">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-green-900/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="text-7xl md:text-8xl lg:text-9xl relative drop-shadow-2xl hover:scale-110 transition-transform duration-300">🐼</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-spacing container-wide relative z-10">
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20">
            <span className="text-2xl">⭐</span>
            <span className="text-xs md:text-sm font-bold text-green-400 uppercase tracking-wider">Ценности</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">Наши ценности</h2>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">Принципы, которыми мы руководствуемся каждый день</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 px-4">
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
              <div key={i} className="relative group overflow-hidden rounded-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-2xl hover:border-green-600/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-green-900/30">
                  <div className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${value.color} mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">{value.title}</h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">{value.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="section-spacing bg-gradient-to-br from-slate-900/60 to-black/40 border-y border-green-700/20 backdrop-blur-sm relative z-10">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20">
            <Users size={20} className="text-green-400" />
            <span className="text-xs md:text-sm font-bold text-green-400 uppercase tracking-wider">Команда</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">Создано с любовью</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Наша команда состоит из опытных разработчиков и специалистов по безопасности, которые работают над тем, чтобы ваш интернет был <span className="text-green-400 font-bold">безопасным и свободным</span>.
          </p>
          <div className="flex justify-center gap-4 text-5xl md:text-6xl">
            <span className="hover:scale-125 transition-transform duration-300 drop-shadow-lg">👨‍💻</span>
            <span className="hover:scale-125 transition-transform duration-300 drop-shadow-lg">👩‍💻</span>
            <span className="hover:scale-125 transition-transform duration-300 drop-shadow-lg">🔒</span>
          </div>
        </div>
      </section>
    </>
  )
}
