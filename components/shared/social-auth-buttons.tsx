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
        <div className="mt-6 space-y-3">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-[#0e151b] text-gray-400">или продолжить с</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {/* Google */}
                <button
                    type="button"
                    onClick={() => handleSocialAuth('Google')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 group"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span className="text-sm font-medium text-gray-200 hidden sm:inline">Google</span>
                </button>

                {/* VK */}
                <button
                    type="button"
                    onClick={() => handleSocialAuth('VK')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 group"
                >
                    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                        <path d="M0 23.04C0 12.1788 0 6.74826 3.37413 3.37413C6.74826 0 12.1788 0 23.04 0H24.96C35.8212 0 41.2517 0 44.6259 3.37413C48 6.74826 48 12.1788 48 23.04V24.96C48 35.8212 48 41.2517 44.6259 44.6259C41.2517 48 35.8212 48 24.96 48H23.04C12.1788 48 6.74826 48 3.37413 44.6259C0 41.2517 0 35.8212 0 24.96V23.04Z" fill="#0077FF" />
                        <path d="M25.54 34.5801C14.6 34.5801 8.3601 27.0801 8.1001 14.6001H13.5801C13.7601 23.7601 17.8001 27.6401 21.0801 28.4401V14.6001H26.1602V22.5001C29.3802 22.1601 32.7602 18.5601 33.8802 14.6001H38.9602C38.0402 19.4801 34.4402 23.0801 31.8802 24.5601C34.4402 25.7601 38.5602 28.9001 40.1202 34.5801H34.4802C33.2802 30.7801 30.1802 27.8401 26.1602 27.4401V34.5801H25.54Z" fill="white" />
                    </svg>
                    <span className="text-sm font-medium text-gray-200 hidden sm:inline">VK</span>
                </button>

                {/* Telegram */}
                <button
                    type="button"
                    onClick={() => handleSocialAuth('Telegram')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 group"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#26A5E4">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-200 hidden sm:inline">Telegram</span>
                </button>
            </div>
        </div>
    )
}
