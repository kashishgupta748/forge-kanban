import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'

// ─── Axios Instance ───────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

// ─── Request Interceptor ──────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth token if stored
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// ─── Response Interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; detail?: string }>) => {
    if (!error.response) {
      toast.error('Network error – please check your connection.')
      return Promise.reject(error)
    }

    const { status, data } = error.response
    const message = data?.message ?? data?.detail ?? 'An unexpected error occurred.'

    switch (status) {
      case 400:
        toast.error(`Bad request: ${message}`)
        break
      case 401:
        toast.error('Unauthorized – please log in again.')
        localStorage.removeItem('auth_token')
        break
      case 403:
        toast.error('You don\'t have permission to do that.')
        break
      case 404:
        toast.error('Resource not found.')
        break
      case 422:
        toast.error(`Validation error: ${message}`)
        break
      case 429:
        toast.error('Too many requests – slow down a bit.')
        break
      case 500:
        toast.error('Server error – please try again later.')
        break
      default:
        toast.error(message)
    }

    return Promise.reject(error)
  },
)

export default apiClient
