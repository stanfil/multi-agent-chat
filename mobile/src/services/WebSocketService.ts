import { useChatStore } from '../store/chatStore'
import { Agent } from '../types'

export class WebSocketService {
  private ws: WebSocket | null = null
  private readonly url: string
  private reconnectAttempts = 0
  private readonly maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null
  private heartbeatInterval: NodeJS.Timeout | null = null
  private readonly HEARTBEAT_INTERVAL = 30000 // 30秒发送一次心跳
  private readonly HEARTBEAT_TIMEOUT = 5000 // 5秒内没有收到pong就认为断开了
  private errorService: any

  constructor(errorService: any) {
    this.url = 'ws://localhost:3000'
    this.errorService = errorService
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        useChatStore.getState().setConnectionStatus(true)
        this.reconnectAttempts = 0
        this.startHeartbeat()
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        useChatStore.getState().setConnectionStatus(false)
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        this.errorService.handleWebSocketError(error)
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          this.errorService.handleMessageParseError(error)
        }
      }
    } catch (error) {
      this.errorService.handleConnectionError(error)
    }
  }

  private handleMessage(data: { type: string; data: any }) {
    const store = useChatStore.getState()
    
    try {
      switch (data.type) {
        case 'message': {
          const message = data.data
          if (message && typeof message === 'object' && message.content && message.senderId) {
            if (store.currentSession) {
              store.addMessage({
                id: message.id || Date.now().toString(),
                content: message.content,
                senderId: message.senderId,
                type: message.type || 'text',
                timestamp: message.timestamp || Date.now(),
                sessionId: store.currentSession.id,
              })
            }
          }
          break
        }
        case 'session_created': {
          console.log('Session created:', data.data.sessionId)
          const { sessionId, participants } = data.data
          const selectedAgents = store.agents.filter(agent => 
            participants?.includes(agent.id)
          )
          const newSession = {
            id: sessionId,
            title: selectedAgents.map(agent => agent.name).join(', '),
            participants: selectedAgents,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          store.setCurrentSession(newSession)
          store.addSession(newSession)
          break
        }
        case 'error':
          this.errorService.handleServerError(data.data.message)
          break
      }
    } catch (error) {
      this.errorService.handleMessageProcessError(error)
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.errorService.handleMaxReconnectError()
      return
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`)
      this.reconnectAttempts++
      this.connect()
    }, 1000 * Math.min(this.reconnectAttempts + 1, 5))
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.sendMessage({ type: 'ping' })
        
        // 设置超时检查
        const timeoutCheck = setTimeout(() => {
          console.log('Heartbeat timeout, reconnecting...')
          this.reconnect()
        }, this.HEARTBEAT_TIMEOUT)

        // 监听pong响应
        const pongHandler = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'pong') {
              clearTimeout(timeoutCheck)
              this.ws?.removeEventListener('message', pongHandler)
            }
          } catch (error) {
            this.errorService.handleMessageParseError(error)
          }
        }

        this.ws?.addEventListener('message', pongHandler)
      }
    }, this.HEARTBEAT_INTERVAL)
  }

  private reconnect() {
    this.disconnect()
    this.connect()
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  createSession(participants: Agent[]) {
    // 如果未连接，先尝试连接
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect()
    }

    // 确保连接就绪后再创建会话
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendMessage({
        type: 'create_session',
        data: { participants }
      })
    } else {
      // 等待连接就绪后再创建会话
      const checkConnection = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          clearInterval(checkConnection)
          this.sendMessage({
            type: 'create_session',
            data: { participants }
          })
        }
      }, 100) // 每100ms检查一次连接状态
    }
  }

  sendMessage(message: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.errorService.handleNotConnectedError()
      return
    }

    try {
      this.ws.send(JSON.stringify(message))
    } catch (error) {
      this.errorService.handleMessageSendError(error)
    }
  }

  sendChatMessage(content: string) {
    const store = useChatStore.getState()
    const currentSession = store.currentSession
    if (!currentSession) {
      this.errorService.handleNoActiveSessionError()
      return
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.errorService.handleNotConnectedError()
      return
    }

    const message = {
      content,
      senderId: 'user',
      type: 'text' as const,
      sessionId: currentSession.id,
    }

    this.sendMessage({
      type: 'message',
      data: {
        sessionId: currentSession.id,
        message,
      },
    })
  }
}