import Fastify from 'fastify'
import { WebSocket, WebSocketServer } from 'ws'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import { AIService } from './services/aiService'
import { defaultConfig } from './config'
import {
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionAssistantMessageParam,
} from 'openai/resources/chat/completions'
import cors from '@fastify/cors'
import { getRandomResponse } from './mock/responses'

dotenv.config()

const isMockMode = process.env.NODE_ENV === 'mock'

// 类型定义
interface Message {
  id?: string
  content: string
  senderId: string
  type: 'text' | 'image' | 'system'
  timestamp?: number
  replyTo?: string
}

interface Session {
  id: string
  participants: Agent[]
  messages: Message[]
}

interface Agent {
  id: string
  name: string
  avatar: string
  avatarImage?: string
  description: string
  personality: string
  expertise: string[]
}

// 全局变量
const sessions = new Map<string, Session>()
const connections = new Map<string, WebSocket>()

// 初始化AI服务
const aiService = !isMockMode
  ? new AIService({
      apiKey: process.env.AI_SERVICE_API_KEY || '',
      baseUrl: process.env.AI_SERVICE_BASE_URL || defaultConfig.baseUrl,
      model: process.env.AI_SERVICE_MODEL || defaultConfig.model,
    })
  : null

const fastify = Fastify({
  logger: true,
})

// 配置 CORS
void fastify.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})

// HTTP 路由
fastify.get('/', async () => {
  return { status: 'ok', version: '0.1.0' }
})

// WebSocket 服务器
const wss = new WebSocketServer({
  server: fastify.server,
})

// 生成 AI 回复
async function generateAIResponse(
  session: Session,
  agent: Agent,
  message: Message
): Promise<string> {
  if (isMockMode) {
    // 在 mock 模式下，返回随机响应
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟延迟
    return `[${agent.name}] ${getRandomResponse()}`
  }

  if (!aiService) {
    throw new Error('AI service not initialized')
  }

  const systemPrompt = `你是 ${agent.name}，${agent.description}。
个性特征：${agent.personality}
专业领域：${agent.expertise.join('、')}

请以第一人称回复用户的消息，保持角色特征的一致性。回复要简洁自然。`

  const systemMessage: ChatCompletionSystemMessageParam = {
    role: 'system',
    content: systemPrompt,
  }

  const conversationMessages = session.messages
    .filter((msg) => msg.type === 'text')
    .map((msg) => {
      if (msg.senderId === 'user') {
        return {
          role: 'user',
          content: msg.content,
        } as ChatCompletionUserMessageParam
      } else {
        return {
          role: 'assistant',
          content: msg.content,
        } as ChatCompletionAssistantMessageParam
      }
    })

  return await aiService.generateResponse([systemMessage, ...conversationMessages])
}

// 广播消息给所有连接的客户端
function broadcastMessage(sessionId: string, message: Message) {
  const session = sessions.get(sessionId)
  if (!session) return

  session.messages.push(message)

  connections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'message', data: message }))
    }
  })
}

// 心跳检测配置
const HEARTBEAT_INTERVAL = 30000 // 30秒发送一次心跳
const HEARTBEAT_TIMEOUT = 5000 // 5秒内没有收到pong就认为断开了

// WebSocket 连接处理
wss.on('connection', (ws) => {
  console.log('New client connected')
  const clientId = uuidv4()
  connections.set(clientId, ws)
  let isAlive = true

  // 设置心跳检测
  const heartbeat = setInterval(() => {
    if (!isAlive) {
      console.log('Client heartbeat timeout:', clientId)
      clearInterval(heartbeat)
      ws.terminate()
      return
    }
    isAlive = false
    ws.send(JSON.stringify({ type: 'ping' }))
  }, HEARTBEAT_INTERVAL)

  // 发送连接成功消息
  ws.send(JSON.stringify({ type: 'connected', data: { clientId } }))

  ws.on('message', async (rawMessage) => {
    try {
      const { type, data } = JSON.parse(rawMessage.toString())
      console.log('Received message:', { type, data })

      switch (type) {
        case 'pong':
          isAlive = true
          break

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }))
          break

        case 'create_session': {
          const { participants } = data
          const sessionId = uuidv4()
          sessions.set(sessionId, {
            id: sessionId,
            participants,
            messages: [],
          })
          ws.send(
            JSON.stringify({
              type: 'session_created',
              data: {
                sessionId,
                participants: participants.map((p: Agent) => p.id),
              },
            })
          )
          break
        }

        case 'message': {
          const { sessionId, message } = data
          const session = sessions.get(sessionId)
          if (!session) {
            ws.send(JSON.stringify({ type: 'error', data: { message: 'Session not found' } }))
            return
          }

          // 添加消息 ID 和时间戳
          const fullMessage: Message = {
            ...message,
            id: uuidv4(),
            timestamp: Date.now(),
          }

          // 广播用户消息
          broadcastMessage(sessionId, fullMessage)

          // 让每个 AI 助手生成回复
          for (const agent of session.participants) {
            try {
              const response = await generateAIResponse(session, agent, fullMessage)
              const aiMessage: Message = {
                id: uuidv4(),
                content: response,
                senderId: agent.id,
                type: 'text',
                timestamp: Date.now(),
              }
              broadcastMessage(sessionId, aiMessage)
            } catch (error) {
              console.error(`Error generating response for agent ${agent.name}:`, error)
              ws.send(
                JSON.stringify({
                  type: 'error',
                  data: { message: `生成 ${agent.name} 的回复时出错` },
                })
              )
            }
          }
          break
        }
      }
    } catch (error) {
      console.error('Error processing message:', error)
      ws.send(JSON.stringify({ type: 'error', data: { message: 'Invalid message format' } }))
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected:', clientId)
    clearInterval(heartbeat)
    connections.delete(clientId)
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

// 启动服务
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('Server running at http://localhost:3000')
    console.log('WebSocket server running at ws://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
