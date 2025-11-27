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
            className={`group relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-green-500 via-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/45 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${className}`}
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
