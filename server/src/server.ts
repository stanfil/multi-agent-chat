import Fastify from 'fastify'
import { WebSocketServer } from 'ws'
import dotenv from 'dotenv'

dotenv.config()

const fastify = Fastify({
  logger: true
})

// HTTP 路由
fastify.get('/', async () => {
  return { status: 'ok', version: '0.1.0' }
})

// WebSocket 服务器
const wss = new WebSocketServer({
  server: fastify.server,
  path: '/ws'
})

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('Received:', message.toString())
    ws.send(`Echo: ${message}`)
  })
})

// 启动服务
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    console.log(`Server running at http://localhost:3000`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()