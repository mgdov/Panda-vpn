import Link from 'next/link'

interface AuthLogoProps {
    title: string
    subtitle?: string
}

export default function AuthLogo({ title, subtitle }: AuthLogoProps) {
    return (
        <Link href="/" className="block text-center mb-8 group cursor-pointer">
            <div className="inline-flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <div className="text-5xl animate-bounce group-hover:animate-none">
                    🐼
                </div>
            </div>
            <h1 className="text-4xl font-black bg-linear-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:drop-shadow-lg transition-all duration-300">
                Panda VPN
            </h1>
            <p className="text-base text-gray-300 font-medium group-hover:text-gray-200 transition-colors">
                {title}
            </p>
            {subtitle && (
                <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors">
                    {subtitle}
                </p>
            )}
        </Link>
    )
}
