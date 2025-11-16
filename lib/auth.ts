import { AuthResponse } from './api'

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_EMAIL_KEY = 'userEmail'
const TOKEN_EXPIRY_KEY = 'token_expiry'

// Token management
export const tokenManager = {
  setTokens(authResponse: AuthResponse) {
    if (typeof window === 'undefined') return

    localStorage.setItem(ACCESS_TOKEN_KEY, authResponse.access_token)
    localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refresh_token)
    localStorage.setItem(USER_EMAIL_KEY, authResponse.user.email)
    
    // Calculate expiry timestamp
    const expiryTime = Date.now() + authResponse.expires_in * 1000
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
  },

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  getUserEmail(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(USER_EMAIL_KEY)
  },

  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true
    
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
    if (!expiryTime) return true
    
    return Date.now() >= parseInt(expiryTime)
  },

  clearTokens() {
    if (typeof window === 'undefined') return

    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_EMAIL_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
    localStorage.removeItem('isAuthenticated')
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    
    const accessToken = this.getAccessToken()
    return !!accessToken && !this.isTokenExpired()
  },
}

// Auto-refresh token before expiry
export async function setupTokenRefresh() {
  if (typeof window === 'undefined') return

  const checkAndRefresh = async () => {
    const refreshToken = tokenManager.getRefreshToken()
    if (!refreshToken) return

    // Refresh 1 minute before expiry
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
    if (!expiryTime) return

    const timeUntilExpiry = parseInt(expiryTime) - Date.now()
    if (timeUntilExpiry < 60000) {
      // Less than 1 minute, refresh now
      try {
        const { authAPI } = await import('./api')
        const response = await authAPI.refresh({ refresh_token: refreshToken })
        tokenManager.setTokens(response)
      } catch (error) {
        console.error('Token refresh failed:', error)
        tokenManager.clearTokens()
        window.location.href = '/auth/login'
      }
    }
  }

  // Check every 30 seconds
  setInterval(checkAndRefresh, 30000)
  
  // Check immediately
  checkAndRefresh()
}
