import { WebSocketServer } from 'ws'
import dayjs from 'dayjs'

// 消息类型定义（对应 app/types/websocket.ts 中的 MessageType）
const MessageType = {
  USER: 'user',
  SYSTEM: 'system',
  SYSTEM_SETTINGS: 'system_settings'
}

// 创建 WebSocket 服务器，监听 8080 端口
const PORT = 8080
const wss = new WebSocketServer({ port: PORT })

console.log(`🚀 WebSocket 服务器启动成功！`)
console.log(`📡 监听端口: ${PORT}`)
console.log(`🔗 本地连接: ws://localhost:${PORT}`)
console.log(`\n等待客户端连接...\n`)

// 连接计数器
let connectionCount = 0

/** 消息id */
let messageId = 0

// 监听客户端连接
wss.on('connection', (ws, req) => {
  connectionCount++
  const clientId = connectionCount
  const clientIp = req.socket.remoteAddress

  console.log(`✅ 客户端 #${clientId} 已连接 (IP: ${clientIp})`)
  console.log(`👥 当前在线: ${wss.clients.size} 人\n`)

  // 发送系统设置消息 分配id  只发送给最新连接的客户端
  ws.send(JSON.stringify({
    id: (messageId++).toString(),
    type: MessageType.SYSTEM_SETTINGS,
    settingInfo: {
      id: clientId.toString(),
      name: `用户${clientId}`
    }
  }))

  /** 发送欢迎消息给所有客户端 */
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN = 1
      client.send(JSON.stringify({
        id: (messageId++).toString(),
        type: MessageType.SYSTEM,
        content: `用户${clientId}加入聊天`,
        sentTime: dayjs().format('MM/DD HH:mm'),
      }))
    }
  })

  // 监听客户端消息
  ws.on('message', (data) => {
    const message = JSON.parse(data)
    console.log(`📨 收到客户端 #${clientId} 消息:`, message)

    // 处理心跳
    // if (message.toLowerCase() === 'ping') {
    //   ws.send('pong')
    //   console.log(`💓 回复心跳给客户端 #${clientId}\n`)
    //   return
    // }

    // 广播消息给所有客户端
    // const broadcastMessage = `客户端 #${clientId}: ${message}`
    // console.log(`📢 广播消息: ${broadcastMessage}`)

    /** 给消息分配消息id */
    message.id = (messageId++).toString()
    
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN = 1
        client.send(JSON.stringify(message))
      }
    })
  })

  // 监听连接关闭
  ws.on('close', () => {
    console.log(`❌ 客户端 #${clientId} 已断开`)
    connectionCount--
    console.log(`👥 当前在线: ${wss.clients.size} 人\n`)
  })

  // 监听错误
  ws.on('error', (error) => {
    console.error(`⚠️  客户端 #${clientId} 发生错误:`, error.message, '\n')
  })
})

// 监听服务器错误
wss.on('error', (error) => {
  console.error('❌ WebSocket 服务器错误:', error)
})

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n\n🛑 正在关闭 WebSocket 服务器...')
  wss.close(() => {
    console.log('✅ 服务器已关闭')
    process.exit(0)
  })
})

