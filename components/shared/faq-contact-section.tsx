import { MessageSquare } from "lucide-react"

export default function FAQContactSection() {
    return (
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-center shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                <MessageSquare size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white sm:text-xl">Не нашли ответ?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-300">
                Напишите нам в поддержку — ответим быстро и поможем настроить Panda VPN под ваши задачи.
            </p>
            <a
                href="https://web.telegram.org/@mgdov"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/40"
            >
                <MessageSquare size={16} />
                Написать в поддержку
            </a>
        </div>
    )
}
