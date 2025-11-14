import { ChevronDown, HelpCircle } from "lucide-react"

export interface FAQItem {
    question: string
    answer: string
}

interface FAQItemComponentProps {
    item: FAQItem
    isOpen: boolean
    onToggle: () => void
}

export default function FAQItemComponent({ item, isOpen, onToggle }: FAQItemComponentProps) {
    return (
        <div className="relative group overflow-hidden rounded-xl transition-all duration-300">
            <div className="absolute inset-0 bg-linear-to-br from-green-600/10 to-green-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className={`relative border rounded-xl transition-all duration-300 ${isOpen ? 'border-green-600/60 bg-linear-to-br from-slate-900 to-slate-800 shadow-xl shadow-green-900/20' : 'border-green-700/30 bg-linear-to-br from-slate-900/60 to-slate-800/60 hover:border-green-600/50'}`}>
                <button
                    onClick={onToggle}
                    className="w-full p-4 md:p-5 text-left transition flex items-center justify-between gap-3 group/btn"
                >
                    <span className="font-semibold text-xs md:text-sm text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-green-600/30 to-green-700/30 flex items-center justify-center border border-green-600/40 shrink-0 group-hover/btn:scale-110 transition-transform duration-300">
                            <HelpCircle className="text-green-400" size={14} />
                        </div>
                        {item.question}
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-green-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {isOpen && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-green-700/20">
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed mt-3">{item.answer}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
