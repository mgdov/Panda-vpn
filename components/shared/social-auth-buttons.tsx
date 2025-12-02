"use client"

import TelegramLoginButton from "./telegram-login-button"

interface SocialAuthButtonsProps {
    mode: 'login' | 'signup'
}

export default function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
    // Используем Telegram Login Widget
    // Bot username: @panda_vpnp_bot (из токена бота в .env)
    return (
        <TelegramLoginButton 
            mode={mode}
            botName="panda_vpnp_bot"
        />
    )
}
