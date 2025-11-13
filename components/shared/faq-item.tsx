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
        <div className="relative group overflow-hidden rounded-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className={`relative border rounded-2xl transition-all duration-300 ${isOpen ? 'border-green-600/60 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl shadow-green-900/20' : 'border-green-700/30 bg-gradient-to-br from-slate-900/60 to-slate-800/60 hover:border-green-600/50'}`}>
                <button
                    onClick={onToggle}
                    className="w-full p-5 md:p-6 text-left transition flex items-center justify-between gap-4"
                >
                    <span className="font-bold text-sm md:text-base text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600/30 to-green-700/30 flex items-center justify-center border border-green-600/40 shrink-0">
                            <HelpCircle className="text-green-400" size={16} />
                        </div>
                        {item.question}
                    </span>
                    <ChevronDown
                        size={20}
                        className={`text-green-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {isOpen && (
                    <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-green-700/20">
                        <p className="text-sm md:text-base text-gray-300 leading-relaxed mt-4">{item.answer}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
