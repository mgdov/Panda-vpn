import { Key } from "lucide-react"

interface StatsGridProps {
    keysCount: number
}

export default function StatsGrid({ keysCount }: StatsGridProps) {
    return (
        <div className="max-w-md grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="group p-6 bg-linear-to-br from-green-900/40 to-slate-900/60 backdrop-blur-md rounded-2xl border border-green-700/30 shadow-xl hover:shadow-2xl hover:shadow-green-600/30 transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                    <Key size={28} className="text-green-400" />
                    <span className="text-3xl font-black text-white">{keysCount}</span>
                </div>
                <span className="text-sm text-gray-400 font-medium">Активных ключей</span>
            </div>
        </div>
    )
}
