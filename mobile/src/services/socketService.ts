import { io, Socket } from 'socket.io-client'
import { Message } from '../types'
import { useChatStore } from '../store/chatStore'

class SocketService {
  private socket: Socket | null = null
  private readonly url: string

  constructor(url: string) {
    this.url = url
  }

  connect() {
    if (this.socket?.connected) return

    this.socket = io(this.url, {
      transports: ['websocket'],
      autoConnect: true,
    })

    this.socket.on('connect', () => {
      useChatStore.getState().setConnectionStatus(true)
      console.log('WebSocket connected')
    })

    this.socket.on('disconnect', () => {
      useChatStore.getState().setConnectionStatus(false)
      console.log('WebSocket disconnected')
    })

    this.socket.on('message', (message: Message) => {
      useChatStore.getState().addMessage(message)
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  sendMessage(message: Omit<Message, 'id' | 'timestamp'>) {
    if (!this.socket?.connected) {
      console.error('WebSocket not connected')
      return
    }

    this.socket.emit('message', message)
  }
}

export const socketService = new SocketService('http://localhost:3000'); 