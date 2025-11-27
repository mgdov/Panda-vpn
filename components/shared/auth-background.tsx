import type { ReactNode } from 'react'

interface AuthBackgroundProps {
    children: ReactNode
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Decorative blobs */}
            <div className="pointer-events-none fixed -top-40 -left-40 w-[500px] h-[500px] bg-linear-to-br from-green-600/30 to-emerald-600/20 rounded-full blur-3xl opacity-60 z-0 animate-pulse" />
            <div className="pointer-events-none fixed -bottom-40 -right-40 w-[450px] h-[450px] bg-linear-to-tl from-blue-600/20 to-cyan-600/10 rounded-full blur-3xl opacity-50 z-0" />
            <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl opacity-40 z-0 animate-pulse" />

            {children}
        </div>
    )
}
