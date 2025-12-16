import { MessageSquare } from "lucide-react"

const comingSoonSections = [
    {
        icon: "📰",
        title: "Статьи и блог",
        description: "Готовим подборки, обзоры и глубокие разборы по приватности",
        highlight: "Собираем лучшие инсайты от нашей команды и приглашенных экспертов",
    },
    {
        icon: "🤝",
        title: "Отзывы",
        description: "Скоро поделимся историями пользователей и независимыми обзорами",
        highlight: "Публикуем честные отзывы и реальные сценарии использования PandaVPN",
    },
]

export default function DashboardSupportTab() {
    return (
        <div className="flex flex-col items-center justify-center py-8 md:py-10">
            <div className="text-center mb-6">
                <div className="text-5xl mb-3 animate-float">💬</div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Свяжитесь с нами</h2>
                <p className="text-gray-400 text-xs md:text-sm">Наша команда поддержки всегда готова помочь</p>
            </div>

            <a
                href="https://t.me/pandavpn_help"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center justify-center gap-2.5 px-6 py-3 text-sm md:text-base font-semibold shadow-lg shadow-green-600/40 hover:shadow-xl hover:shadow-green-600/60 hover:scale-105 transition-all duration-300 rounded-lg w-full max-w-sm group"
            >
                <MessageSquare size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                Написать в Telegram
            </a>

            <div className="mt-6 p-3 bg-green-900/20 border border-green-500/50 rounded-lg w-full max-w-sm hover:scale-105 transition-transform duration-300">
                <p className="text-xs md:text-sm text-green-400 text-center font-medium flex items-center justify-center gap-2">
                    <span className="text-lg animate-pulse">⚡</span>
                    Быстрая поддержка 24/7
                </p>
            </div>

            <div className="mt-10 w-full grid gap-5 max-w-4xl md:grid-cols-2">
                {comingSoonSections.map((section) => (
                    <div
                        key={section.title}
                        className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-[#071811]/90 px-6 py-7 shadow-2xl shadow-emerald-900/30 transition-all duration-500 group hover:-translate-y-1 hover:border-emerald-300/60"
                    >
                        <div className="pointer-events-none absolute -right-16 -top-10 h-36 w-36 rounded-full bg-emerald-500/30 blur-3xl transition-opacity duration-500 group-hover:opacity-70" />
                        <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-lime-500/10 blur-[120px]" />

                        <div className="relative flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl drop-shadow-lg">{section.icon}</span>
                                <div>
                                    <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/80">Скоро</p>
                                    <p className="text-2xl font-semibold text-white leading-tight">{section.title}</p>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-100">
                                <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
                                В разработке
                            </span>
                        </div>

                        <p className="relative mt-4 text-sm text-emerald-100/80 leading-relaxed">
                            {section.description}
                        </p>

                        <div className="relative mt-6 rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-sm text-emerald-50/90 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-xl shadow-inner shadow-emerald-500/40">
                                ✨
                            </span>
                            <p className="leading-relaxed">{section.highlight}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
