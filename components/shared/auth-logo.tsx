import Link from 'next/link'

interface AuthLogoProps {
    title: string
    subtitle?: string
}

export default function AuthLogo({ title, subtitle }: AuthLogoProps) {
    return (
        <Link href="/" className="mb-8 block text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-3xl text-white ring-1 ring-white/25">
                🐼
            </div>
            <h1 className="text-4xl font-black text-white sm:text-[44px]">
                <span className="gradient-text">Panda VPN</span>
            </h1>
            <p className="mt-4 text-base font-semibold text-gray-200">
                {title}
            </p>
            {subtitle && (
                <p className="mt-2 text-xs font-medium text-gray-400">
                    {subtitle}
                </p>
            )}
        </Link>
    )
}
