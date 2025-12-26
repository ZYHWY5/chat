import type { ConnectionStatus, UseWebSocketOptions, WebSocketMessage, UserInfo } from '~/types/websocket'
import { MessageType } from '~/types/websocket'

/**
 * WebSocket Composable
 * 用于管理 WebSocket 连接
 */
export function useWebSocket(url?: string, options: UseWebSocketOptions = {}) {
  // 从配置中提取选项
  const {
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options

  // 状态管理
  const ws = ref<WebSocket | null>(null)
  const status = ref<ConnectionStatus>('disconnected')
  const error = ref<string>('')
  const reconnectAttempts = ref(0)
  const messages = ref<WebSocketMessage[]>([])

  /** 当前用户信息 */
  const userInfo = ref<UserInfo>({
    id: '',
    name: ''
  })

  // 定时器
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * 生成唯一 ID
   */
  // const generateId = () => {
  //   return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  // }

  /**
   * 初始化用户信息
   */
  const initUserInfo = (settingInfo: UserInfo) => {
    userInfo.value = settingInfo
  }

  /**
   * 修改用户名
   */
  const changeUserName = (userName: string) => {
    userInfo.value.name = userName
  }

  /**
   * 格式化时间
   */
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  /**
   * 补充消息id
   */
  const fixMessageId = (message: WebSocketMessage) => {
    messages.value.forEach((item: WebSocketMessage) => {
      if (item.fromUserId === message.fromUserId && !item.id && item.sentTime === message.sentTime) {
        item.id = message.id
      }
    })
  }

  /**
   * 添加消息到列表
   */
  const addMessage = (message: WebSocketMessage) => {
    messages.value.push(message)
  }

  /**
   * 清空重连定时器
   */
  const clearReconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  /**
   * 连接 WebSocket
   * @param wsUrl WebSocket 地址
   */
  const connect = (wsUrl?: string) => {
    const targetUrl = wsUrl || url

    // 验证 URL
    if (!targetUrl) {
      error.value = 'WebSocket URL 不能为空'
      status.value = 'error'
      return
    }

    // 如果已经连接，先断开
    if (ws.value) {
      disconnect()
    }

    try {
      status.value = 'connecting'
      error.value = ''

      console.log('🔌 正在连接:', targetUrl)
      ws.value = new WebSocket(targetUrl)

      // 连接成功
      ws.value.onopen = () => {
        console.log('✅ WebSocket 连接成功')
        status.value = 'connected'
        reconnectAttempts.value = 0
      }

      // 接收消息
      ws.value.onmessage = (event: MessageEvent) => {
        console.log('event', event)
        const message = JSON.parse(event.data)
        console.log('📨 收到消息:', message)
        
        // 忽略心跳响应
        // if (message.toLowerCase() === 'pong') {
        //   return
        // }

        /** 补充消息id */
        if (message.fromUserId === userInfo.value.id) {
          fixMessageId(message)
          return
        }

        if (message.type === MessageType.SYSTEM_SETTINGS) {
          initUserInfo(message.settingInfo)
          return
        }

        // 添加到消息列表
        addMessage(message)
      }

      // 连接错误
      ws.value.onerror = (event: Event) => {
        console.error('❌ WebSocket 错误:', event)
        error.value = 'WebSocket 连接错误'
        status.value = 'error'
      }

      // 连接关闭
      ws.value.onclose = (event: CloseEvent) => {
        console.log('🔌 WebSocket 连接关闭', event.code, event.reason)
        status.value = 'disconnected'

        // 自动重连
        if (autoReconnect && reconnectAttempts.value < maxReconnectAttempts) {
          reconnectAttempts.value++
          console.log(`🔄 尝试重连 (${reconnectAttempts.value}/${maxReconnectAttempts})...`)

          clearReconnect()
          reconnectTimer = setTimeout(() => {
            connect(targetUrl)
          }, reconnectInterval)
        } else if (reconnectAttempts.value >= maxReconnectAttempts) {
          error.value = `重连失败，已达到最大重连次数 (${maxReconnectAttempts})`
          status.value = 'error'
        }
      }
    } catch (err) {
      console.error('❌ 创建 WebSocket 失败:', err)
      error.value = err instanceof Error ? err.message : '未知错误'
      status.value = 'error'
    }
  }

  /**
   * 断开连接
   */
  const disconnect = () => {
    clearReconnect()

    if (ws.value) {
      console.log('🔌 断开 WebSocket 连接')
      ws.value.close()
      ws.value = null
    }

    status.value = 'disconnected'
    reconnectAttempts.value = 0
  }

  /**
   * 重置错误
   */
  const resetError = () => {
    error.value = ''
  }

  /**
   * 发送消息
   * @param message 消息内容
   */
  const sendMessage = (message: WebSocketMessage) => {
    if (!ws.value) {
      error.value = 'WebSocket 未连接'
      return false
    }

    if (ws.value.readyState !== WebSocket.OPEN) {
      error.value = 'WebSocket 连接未就绪'
      return false
    }

    try {
      ws.value.send(JSON.stringify(message))
      addMessage(message)
      return true
    } catch (err) {
      console.error('❌ 发送消息失败:', err)
      error.value = err instanceof Error ? err.message : '发送失败'
      return false
    }
  }

  /**
   * 清空消息列表
   */
  const clearMessages = () => {
    messages.value = []
  }

  // 组件卸载时自动断开连接
  onUnmounted(() => {
    disconnect()
  })

  return {
    // 状态
    ws,
    status,
    error,
    reconnectAttempts,
    messages,
    userInfo,

    // 方法
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    resetError,
    formatTime,
    initUserInfo,
    changeUserName,
  }
}

