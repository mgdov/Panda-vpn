import { Key } from "lucide-react"

interface StatsGridProps {
    keysCount: number
}

export default function StatsGrid({ keysCount }: StatsGridProps) {
    return (
        <div className="max-w-md grid grid-cols-1 gap-3 mb-6 md:mb-8">
            <div className="group p-5 bg-linear-to-br from-green-900/40 to-slate-900/60 backdrop-blur-md rounded-xl border border-green-700/30 shadow-lg hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-2">
                    <Key size={24} className="text-green-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-2xl font-black text-white">{keysCount}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">Активных ключей</span>
            </div>
        </div>
    )
}
