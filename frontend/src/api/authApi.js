import apiClient from './apiClient'

export const logout = async () => {
  const response = await apiClient.post('/api/auth/logout')
  return response.data
}
