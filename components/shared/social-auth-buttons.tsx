import { toast } from "sonner"

interface SocialAuthButtonsProps {
    mode: 'login' | 'signup'
}

export default function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
    const handleSocialAuth = (provider: string) => {
        // TODO: Implement OAuth flow
        console.log(`${mode} with ${provider}`)
        toast.info(`Авторизация через ${provider}`, {
            description: 'Будет доступна в следующей версии',
            duration: 3000,
        })
    }

    const text = mode === 'login' ? 'Войти' : 'Зарегистрироваться'

    return (
        <div className="mt-6 space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-[#0e151b] text-gray-400">или продолжить с</span>
                </div>
            </div>

            {/* Telegram - единственная кнопка, увеличенная */}
            <button
                type="button"
                onClick={() => handleSocialAuth('Telegram')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-[#2AABEE]/10 to-[#229ED9]/10 hover:from-[#2AABEE]/20 hover:to-[#229ED9]/20 border border-[#2AABEE]/30 hover:border-[#2AABEE]/50 rounded-xl transition-all duration-300 group"
            >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#26A5E4">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
                <span className="text-base font-semibold text-gray-100 group-hover:text-white transition-colors">
                    {text} через Telegram
                </span>
            </button>
        </div>
    )
}
