import { WebSocketServer } from 'ws'

// 创建 WebSocket 服务器，监听 8080 端口
const PORT = 8080
const wss = new WebSocketServer({ port: PORT })

console.log(`🚀 WebSocket 服务器启动成功！`)
console.log(`📡 监听端口: ${PORT}`)
console.log(`🔗 本地连接: ws://localhost:${PORT}`)
console.log(`\n等待客户端连接...\n`)

// 连接计数器
let connectionCount = 0

// 监听客户端连接
wss.on('connection', (ws, req) => {
  connectionCount++
  const clientId = connectionCount
  const clientIp = req.socket.remoteAddress

  console.log(`✅ 客户端 #${clientId} 已连接 (IP: ${clientIp})`)
  console.log(`👥 当前在线: ${wss.clients.size} 人\n`)

  // 发送欢迎消息
  ws.send(`欢迎连接！你是第 ${clientId} 个客户端`)

  // 监听客户端消息
  ws.on('message', (data) => {
    const message = data.toString()
    console.log(`📨 收到客户端 #${clientId} 消息:`, message)

    // 处理心跳
    if (message.toLowerCase() === 'ping') {
      ws.send('pong')
      console.log(`💓 回复心跳给客户端 #${clientId}\n`)
      return
    }

    // 广播消息给所有客户端
    const broadcastMessage = `客户端 #${clientId}: ${message}`
    console.log(`📢 广播消息: ${broadcastMessage}`)
    
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN = 1
        client.send(broadcastMessage)
      }
    })
    console.log()
  })

  // 监听连接关闭
  ws.on('close', () => {
    console.log(`❌ 客户端 #${clientId} 已断开`)
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

