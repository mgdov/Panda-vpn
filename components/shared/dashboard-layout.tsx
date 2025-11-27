import type { ReactNode } from 'react'

interface DashboardLayoutProps {
    children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="relative min-h-screen flex bg-[#0e151b] overflow-x-hidden">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute -top-32 -left-32 w-[400px] h-[400px] bg-green-700/25 rounded-full blur-3xl opacity-50 z-0 animate-pulse" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-[350px] h-[350px] bg-green-400/15 rounded-full blur-2xl opacity-30 z-0" />

            {children}
        </div>
    )
}
