import type { ButtonHTMLAttributes } from 'react'

interface FormSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
    loadingText?: string
    children: React.ReactNode
}

export default function FormSubmitButton({
    isLoading,
    loadingText = 'Загрузка...',
    children,
    disabled,
    className = '',
    ...props
}: FormSubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={isLoading || disabled}
            className={`w-full mt-8 py-4 px-4 bg-linear-to-r from-green-500 via-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-base relative overflow-hidden group ${className}`}
            {...props}
        >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" />
            {isLoading ? (
                <>
                    <span className="animate-spin">⚡</span>
                    <span>{loadingText}</span>
                </>
            ) : (
                children
            )}
        </button>
    )
}
