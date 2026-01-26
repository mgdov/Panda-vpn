import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '@/lib/api/config'

interface AuthState {
    isAuthenticated: boolean
    userEmail: string
    isLoading: boolean
}

export function useAuth() {
    const router = useRouter()
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        userEmail: '',
        isLoading: true,
    })

    const checkAuth = useCallback(() => {
        const auth = localStorage.getItem('isAuthenticated')
        const email = localStorage.getItem('userEmail')
        const token = localStorage.getItem(TOKEN_STORAGE_KEY)

        if (auth === 'true' && email && token) {
            setAuthState({
                isAuthenticated: true,
                userEmail: email,
                isLoading: false,
            })
        } else {
            localStorage.removeItem('isAuthenticated')
            localStorage.removeItem('userEmail')
            setAuthState(prev => ({ ...prev, isLoading: false }))
        }
    }, [])

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    const logout = useCallback(() => {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('userEmail')
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
        setAuthState({
            isAuthenticated: false,
            userEmail: '',
            isLoading: false,
        })
        router.push('/')
    }, [router])

    return { ...authState, logout }
}
