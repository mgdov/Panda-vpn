import { useState, useEffect } from 'react'
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

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = () => {
        const auth = localStorage.getItem('isAuthenticated')
        const email = localStorage.getItem('userEmail')

        if (auth === 'true' && email) {
            setAuthState({
                isAuthenticated: true,
                userEmail: email,
                isLoading: false,
            })
        } else {
            router.push('/auth/login')
        }
    }

    const logout = () => {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('userEmail')
        router.push('/')
    }

    return { ...authState, logout }
}
