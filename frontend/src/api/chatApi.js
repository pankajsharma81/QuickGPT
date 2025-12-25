import apiClient from './apiClient'

export const sendMessage = async (message, chatId) => {
  const response = await apiClient.post('/api/chat', {
    message,
    chatId
  })
  return response.data
}

export const getHistory = async (chatId) => {
  const response = await apiClient.get('/api/chat/history', {
    params: chatId ? { chatId } : undefined
  })
  return response.data
}

export const getChats = async () => {
  const response = await apiClient.get('/api/chat/session')
  return response.data
}

export const createChat = async (title) => {
  const response = await apiClient.post('/api/chat/session', { title })
  return response.data
}
