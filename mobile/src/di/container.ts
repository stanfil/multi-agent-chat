import { createContainer, asClass, InjectionMode, Lifetime } from 'awilix'
import { WebSocketService } from '../services/WebSocketService'
import { ChatService } from '../services/ChatService'
import { ErrorService } from '../services/ErrorService'
import { StorageService } from '../services/StorageService'

// 创建依赖注入容器
const container = createContainer({
  injectionMode: InjectionMode.PROXY
})

// 注册服务
container.register({
  // WebSocket服务 - 单例模式
  webSocketService: asClass(WebSocketService, {
    lifetime: Lifetime.SINGLETON
  }),
  
  // 聊天服务
  chatService: asClass(ChatService, {
    lifetime: Lifetime.SINGLETON
  }),

  // 错误处理服务
  errorService: asClass(ErrorService, {
    lifetime: Lifetime.SINGLETON
  }),

  // 存储服务
  storageService: asClass(StorageService, {
    lifetime: Lifetime.SINGLETON
  })
})

export { container }