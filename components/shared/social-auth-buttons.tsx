"use client"

import { useEffect, useState } from "react"
import TelegramLoginButton from "./telegram-login-button"
import TelegramMobileButton from "./telegram-mobile-button"

interface SocialAuthButtonsProps {
    mode: 'login' | 'signup'
}

export default function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        // Определяем, мобильное ли устройство
        const checkMobile = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            setIsMobile(mobile)
        }
        
        checkMobile()
        // Перепроверяем при изменении размера окна
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Bot username: @panda_vpnp_bot (из токена бота в .env)
    const botName = "panda_vpnp_bot"

    // Для мобильных устройств используем кнопку с deep link
    // Для десктопа - стандартный виджет
    if (isMobile) {
        return <TelegramMobileButton mode={mode} botName={botName} />
    }

    return <TelegramLoginButton mode={mode} botName={botName} />
}
