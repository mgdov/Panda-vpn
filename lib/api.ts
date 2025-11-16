// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://103.74.92.81:8000'

// API Types
export interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_expires_at: string
  user: {
    id: string
    email: string
    roles: string[]
  }
  roles: string[]
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RefreshRequest {
  refresh_token: string
}

export interface User {
  id: string
  email: string
  roles: string[]
}

export interface Node {
  id: string
  name: string
  status: string
  location?: string
  load?: number
}

export interface Tariff {
  id: string
  code: string
  name: string
  price: number
  duration: string
  features: string[]
  popular?: boolean
}

export interface Client {
  id: string
  protocol: string
  transport: string
  flow?: string
  node_id?: string
  created_at: string
  status: string
}

export interface CreateClientRequest {
  protocol: string
  transport: string
  flow?: string
  node_id?: string
}

export interface PaymentRequest {
  tariff_code: string
  payment_method: string
  return_url: string
}

export interface BillingState {
  client_id: string
  status: string
  expires_at: string
  balance: number
}

export interface ProfileData {
  user: User
  subscription?: {
    status: string
    expires_at: string
    tariff: Tariff
  }
  stats?: {
    upload: number
    download: number
    total: number
  }
}

// API Error
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Helper function to get auth headers
function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw new APIError(response.status, error.message || 'Request failed', error)
  }
  
  return response.json()
}

// Auth API
export const authAPI = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<AuthResponse>(response)
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<AuthResponse>(response)
  },

  async refresh(data: RefreshRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<AuthResponse>(response)
  },

  async logout(refreshToken: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    await handleResponse(response)
  },
}

// Public API
export const publicAPI = {
  async getNodes(): Promise<Node[]> {
    const response = await fetch(`${API_BASE_URL}/nodes`)
    return handleResponse<Node[]>(response)
  },

  async getTariffs(): Promise<Tariff[]> {
    const response = await fetch(`${API_BASE_URL}/tariffs`)
    return handleResponse<Tariff[]>(response)
  },

  async getConfig(clientId: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/configs/${clientId}`)
    return handleResponse<string>(response)
  },
}

// User API
export const userAPI = {
  async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: getAuthHeaders(token),
    })
    return handleResponse<User>(response)
  },

  async getMyClients(token: string): Promise<Client[]> {
    const response = await fetch(`${API_BASE_URL}/me/clients`, {
      headers: getAuthHeaders(token),
    })
    return handleResponse<Client[]>(response)
  },

  async createClient(token: string, data: CreateClientRequest): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/me/clients`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    })
    return handleResponse<Client>(response)
  },

  async revokeClient(token: string, clientId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/me/clients/${clientId}/revoke`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    })
    await handleResponse(response)
  },
}

// Payment API
export const paymentAPI = {
  async createPayment(token: string, data: PaymentRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/payments/create`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async getPayment(token: string, paymentId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
      headers: getAuthHeaders(token),
    })
    return handleResponse(response)
  },
}

// Billing API
export const billingAPI = {
  async getBillingState(token: string, clientId: string): Promise<BillingState> {
    const response = await fetch(`${API_BASE_URL}/billing/state/${clientId}`, {
      headers: getAuthHeaders(token),
    })
    return handleResponse<BillingState>(response)
  },

  async getHistory(token: string, page = 1, limit = 20): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/billing/history?page=${page}&limit=${limit}`,
      {
        headers: getAuthHeaders(token),
      }
    )
    return handleResponse(response)
  },
}

// Profile API
export const profileAPI = {
  async getProfile(token: string): Promise<ProfileData> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: getAuthHeaders(token),
    })
    return handleResponse<ProfileData>(response)
  },

  async getKeys(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/profile/keys`, {
      headers: getAuthHeaders(token),
    })
    return handleResponse(response)
  },

  async getUsage(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/profile/usage`, {
      headers: getAuthHeaders(token),
    })
    return handleResponse(response)
  },
}

// VPN API
export const vpnAPI = {
  async getVPNConfig(token: string, clientId: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/vpn/config/${clientId}`, {
      headers: getAuthHeaders(token),
    })
    return handleResponse<string>(response)
  },

  async renewSubscription(token: string, clientId: string, duration: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/vpn/renew`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ client_id: clientId, duration }),
    })
    return handleResponse(response)
  },

  async topUpSubscription(token: string, clientId: string, amount: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/vpn/topup`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ client_id: clientId, amount }),
    })
    return handleResponse(response)
  },
}
