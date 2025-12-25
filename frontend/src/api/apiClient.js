import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quickgpt_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient
