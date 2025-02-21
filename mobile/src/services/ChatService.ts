import { useChatStore } from '../store/chatStore'
import { Agent, Message, ChatSession } from '../types'

export class ChatService {
  private webSocketService: any
  private errorService: any
  private storageService: any

  constructor(webSocketService: any, errorService: any, storageService: any) {
    this.webSocketService = webSocketService
    this.errorService = errorService
    this.storageService = storageService
  }

  // 创建新的聊天会话
  async createSession(agents: Agent[]) {
    try {
      // 先保存所有Agent
      for (const agent of agents) {
        await this.storageService.saveAgent(agent)
      }
      this.webSocketService.createSession(agents)
    } catch (error) {
      this.errorService.handleUnexpectedError(error)
    }
  }

  // 发送聊天消息
  async sendMessage(content: string) {
    try {
      const currentSession = this.getCurrentSession()
      if (!currentSession) {
        throw new Error('No active session')
      }

      const message = {
        content,
        senderId: 'user',
        type: 'text' as const,
        sessionId: currentSession.id,
        timestamp: Date.now(),
      }

      // 保存消息到本地存储
      await this.storageService.saveMessage(message)
      this.webSocketService.sendChatMessage(content)
    } catch (error) {
      this.errorService.handleMessageSendError(error)
    }
  }

  // 获取当前会话
  getCurrentSession(): ChatSession | null {
    return useChatStore.getState().currentSession
  }

  // 获取所有会话
  getSessions(): ChatSession[] {
    return useChatStore.getState().sessions
  }

  // 获取当前会话的消息
  getMessages(): Message[] {
    return useChatStore.getState().messages
  }

  // 清空当前会话的消息
  clearMessages() {
    useChatStore.getState().clearMessages()
  }

  // 更新会话信息
  async updateSession(session: ChatSession) {
    try {
      await this.storageService.updateSession(session)
      useChatStore.getState().updateSession(session)
    } catch (error) {
      this.errorService.handleUnexpectedError(error)
    }
  }

  // 切换当前会话
  switchSession(session: ChatSession | null) {
    try {
      useChatStore.getState().setCurrentSession(session)
      if (session === null) {
        this.clearMessages()
      }
    } catch (error) {
      this.errorService.handleUnexpectedError(error)
    }
  }
}