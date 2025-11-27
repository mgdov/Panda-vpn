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
      <section className="relative z-10 py-16 sm:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 left-1/3 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-teal-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center space-y-5">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-gray-100 ring-1 ring-green-500/35">
            <span className="text-base">🐼</span>
            О нас
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="gradient-text">Panda VPN</span> — сервис, созданный людьми для людей
          </h1>
          <p className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-gray-200 sm:text-base">
            Мы собрали команду, чтобы каждый мог чувствовать себя защищенным в сети и свободно работать с любимым
            контентом, где бы он ни находился.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4 px-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-bold text-gray-100 ring-1 ring-green-500/30">
                <Shield size={14} className="text-emerald-300" />
                Наша миссия
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Свободный и безопасный интернет для каждого
              </h2>
              <p className="max-w-xl text-sm font-medium leading-relaxed text-gray-200 sm:text-base">
                Panda VPN строится вокруг идеи приватности по умолчанию. Мы создаем инструменты, которые защищают ваши
                данные и упрощают доступ к информации без гео-ограничений.
              </p>
              <ul className="space-y-2 text-sm font-medium text-gray-100 sm:text-base">
                {[
                  "Надежное шифрование и строгая политика отсутствия логов",
                  "Высокая скорость подключения на каждом сервере",
                  "Команда поддержки, которая отвечает быстро и по делу",
                  "Гибкие протоколы под любые сценарии использования",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 leading-snug">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span className="font-semibold text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex justify-center">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-slate-900/60 shadow-lg shadow-black/40 ring-1 ring-white/10 sm:h-56 sm:w-56">
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-emerald-500/10 to-transparent blur-2xl" />
                <span className="relative text-6xl drop-shadow-2xl">🐼</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-bold text-gray-100 ring-1 ring-green-500/30">
            <span className="text-base">⭐</span>
            Наши ценности
          </div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Что делает Panda VPN особенным</h2>
          <p className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-gray-200 sm:text-base">
            Мы опираемся на принципы прозрачности, скорости и заботы о пользователях. Каждый релиз проходит проверку на
            соответствие этим трем столпам.
          </p>
        </div>

        <div className="container-wide mt-10">
          <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Приватность",
                desc: "Ваши подключения остаются известными только вам. Мы не храним логи и не отслеживаем действия.",
                accent: "from-emerald-500 to-emerald-600",
              },
              {
                icon: Zap,
                title: "Скорость",
                desc: "Оптимизация серверов и умные маршруты дают стабильный пинг и высокую пропускную способность.",
                accent: "from-sky-500 to-sky-600",
              },
              {
                icon: Globe,
                title: "Стабильность",
                desc: "Инфраструктура с резервированием по всему миру обеспечивает 99.9% времени без простоев.",
                accent: "from-violet-500 to-violet-600",
              },
            ].map(({ icon: Icon, title, desc, accent }) => (
              <div key={title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${accent} text-white shadow-lg shadow-black/20 transition-transform duration-300 group-hover:-translate-y-1`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-gray-200">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-bold text-gray-100 ring-1 ring-green-500/30">
            <Users size={16} className="text-emerald-300" />
            Команда
          </div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Люди, которые стоят за сервисом</h2>
          <p className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-gray-200 sm:text-base">
            Мы любим технологии и делаем Panda VPN практичным. Поддержка отвечает на русском, разработчики выпускают
            обновления каждую неделю, а безопасность остается в основе каждого решения.
          </p>

          <div className="flex items-center justify-center gap-4 text-3xl text-white sm:text-4xl">
            <span className="rounded-xl bg-white/5 px-4 py-3 shadow-lg shadow-black/30">👨‍💻</span>
            <span className="rounded-xl bg-white/5 px-4 py-3 shadow-lg shadow-black/30">👩‍💻</span>
            <span className="rounded-xl bg-white/5 px-4 py-3 shadow-lg shadow-black/30">🔒</span>
          </div>
        </div>
      </section>
    </>
  )
}
