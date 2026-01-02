// API Client cho CRUD cơ bản (không dùng JWT token)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface FetchOptions extends RequestInit {
  requireAuth?: boolean
}

export async function apiClient(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = false, headers = {}, ...restOptions } = options

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  }

  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: finalHeaders,
    })

    return response
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Helper methods
export const api = {
  get: (endpoint: string, options?: FetchOptions) =>
    apiClient(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, data?: any, options?: FetchOptions) =>
    apiClient(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint: string, data?: any, options?: FetchOptions) =>
    apiClient(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint: string, options?: FetchOptions) =>
    apiClient(endpoint, { ...options, method: "DELETE" }),
}
