import Navbar from "@/components/navbar"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="section-spacing container-wide">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-center lg:text-left">О Panda VPN</h1>
          <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-12 leading-relaxed text-center lg:text-left">
            Мы создали Panda VPN чтобы каждый смог получить безопасный и надежный доступ в интернет без опасений за свою
            приватность.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-spacing bg-card-bg border-y border-border">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">Наша миссия</h2>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-6 leading-relaxed">
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
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-accent flex-shrink-0" size={20} />
                    <span className="text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center order-first lg:order-last">
              <div className="text-6xl md:text-8xl lg:text-9xl">🐼</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-spacing container-wide">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 px-4">Наши ценности</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
          {[
            { title: "Приватность", desc: "Ваши данные — ваши. Мы не собираем логи и не отслеживаем активность." },
            { title: "Скорость", desc: "Оптимизированные серверы обеспечивают максимальную производительность." },
            { title: "Надежность", desc: "99.9% uptime гарантирует постоянное соединение когда оно вам нужно." },
          ].map((value, i) => (
            <div key={i} className="p-6 md:p-8 border border-border rounded-lg hover:border-accent/50 transition">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-accent">{value.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
