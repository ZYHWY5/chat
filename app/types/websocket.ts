/**
 * WebSocket 消息类型
 */
export enum MessageType {
  USER = 'user',
  SYSTEM = 'system',
  SYSTEM_SETTINGS = 'system_settings'
}

/** 用户信息 */
export interface UserInfo {
  id: string
  name: string
}

/**
 * WebSocket 消息
 */
export interface WebSocketMessage {
  id?: string
  type: MessageType
  fromUserId?: string
  fromUserName?: string
  content: string
  sentTime: string
  settingInfo?: {
    id: string
    name: string
  }
}

/**
 * WebSocket 连接状态
 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

/**
 * WebSocket 配置选项
 */
export interface UseWebSocketOptions {
  /** 心跳间隔（毫秒），默认 30000 (30秒) */
  heartbeatInterval?: number
  /** 重连间隔（毫秒），默认 3000 (3秒) */
  reconnectInterval?: number
  /** 最大重连次数，默认 5 */
  maxReconnectAttempts?: number
  /** 心跳消息内容，默认 'ping' */
  heartbeatMessage?: string
  /** 自动重连，默认 true */
  autoReconnect?: boolean
}


