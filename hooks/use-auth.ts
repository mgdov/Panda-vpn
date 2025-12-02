import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

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

        if (auth === 'true' && email) {
            setAuthState({
                isAuthenticated: true,
                userEmail: email,
                isLoading: false,
            })
        } else {
            setAuthState(prev => ({ ...prev, isLoading: false }))
        }
    }, [])

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    const logout = useCallback(() => {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setAuthState({
            isAuthenticated: false,
            userEmail: '',
            isLoading: false,
        })
        router.push('/')
    }, [router])

    return { ...authState, logout }
}
