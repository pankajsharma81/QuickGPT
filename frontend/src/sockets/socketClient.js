import { io } from 'socket.io-client'

const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3000'

let socketInstance = null

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      withCredentials: true
    })
  }
  return socketInstance
}

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect()
    socketInstance = null
  }
}
