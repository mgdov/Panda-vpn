interface Feature {
    icon: string
    title: string
    description: string
    gradient: string
    shadow: string
}

const features: Feature[] = [
    {
        icon: "⚡",
        title: "Молниеносная скорость",
        description: "Премиальные сервера без ограничений пропускной способности для комфортного серфинга.",
        gradient: "from-emerald-500/20 via-emerald-500/0 to-transparent",
        shadow: "group-hover:shadow-emerald-500/30",
    },
    {
        icon: "🔒",
        title: "Военное шифрование",
        description: "AES-256 защищает ваши данные и не допускает утечек даже в общественных сетях.",
        gradient: "from-cyan-500/20 via-cyan-500/0 to-transparent",
        shadow: "group-hover:shadow-cyan-500/30",
    },
    {
        icon: "🌍",
        title: "Доступ к контенту",
        description: "Глобальная сеть узлов позволяет смотреть любимые сервисы без геоблокировок.",
        gradient: "from-amber-500/20 via-amber-500/0 to-transparent",
        shadow: "group-hover:shadow-amber-500/30",
    },
    {
        icon: "🛡️",
        title: "Kill Switch",
        description: "При обрыве соединения доступ блокируется, поэтому трафик не уйдет в открытый интернет.",
        gradient: "from-fuchsia-500/20 via-fuchsia-500/0 to-transparent",
        shadow: "group-hover:shadow-fuchsia-500/30",
    },
    {
        icon: "📱",
        title: "На всех устройствах",
        description: "Поддержка iOS, Android, Windows и macOS. Одна подписка — максимум свободы.",
        gradient: "from-sky-500/20 via-sky-500/0 to-transparent",
        shadow: "group-hover:shadow-sky-500/30",
    },
    {
        icon: "🚫",
        title: "Без логов",
        description: "Не храним историю соединений и не передаем данные третьим лицам. Конфиденциальность гарантирована.",
        gradient: "from-teal-500/20 via-teal-500/0 to-transparent",
        shadow: "group-hover:shadow-teal-500/30",
    },
]

export default function FeaturesSection() {
    return (
        <section className="relative py-16 sm:py-20">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 right-4 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-6 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="absolute inset-x-0 top-12 mx-auto h-px max-w-5xl bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
            </div>

            <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6">
                <div className="space-y-3 text-center">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-emerald-200/70">
                        <span className="text-base">✨</span>
                        Преимущества
                    </span>
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="gradient-text">Почему выбирают Panda VPN</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm font-medium text-gray-200 sm:text-base">
                        Компактный набор функций, который закрывает задачи безопасности и дарит стабильный доступ к любимому контенту.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.title} className="group relative">
                            <div className="absolute inset-0 rounded-2xl bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                            <div
                                className={`relative z-10 flex h-full flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/60 p-5 shadow-lg transition-all duration-300 sm:p-6 ${feature.shadow} group-hover:-translate-y-1 group-hover:border-emerald-400/40`}
                            >
                                <div className="flex items-center gap-3 text-lg">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-2xl sm:h-12 sm:w-12">
                                        {feature.icon}
                                    </span>
                                    <h3 className="text-base font-bold text-white sm:text-lg">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-gray-200 sm:text-[15px]">
                                    {feature.description}
                                </p>
                                <div className="mt-auto h-px w-full bg-white/5" />
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                                    <span className="text-base text-white">🐼</span>
                                    Panda VPN
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center text-sm font-medium text-gray-300">
                    Более <span className="font-bold text-white">10 000</span> клиентов уже перешли на защищенный интернет с Panda VPN.
                </div>
            </div>
        </section>
    )
}
