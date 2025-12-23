<script setup lang="ts">
const route = useRoute()
const router = useRouter()

// 获取 WebSocket URL
const wsUrl = ref(route.query.url as string || '')

// 如果没有 URL，返回首页
if (!wsUrl.value) {
  router.push('/')
}

// 使用 WebSocket
const { connect, disconnect, status, error, messages, sendMessage, formatTime } = useWebSocket()

// 消息输入
const messageInput = ref('')

// 消息列表容器引用
const messagesContainer = ref<HTMLElement | null>(null)

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  scrollToBottom()
})

// 连接状态文本
const statusText = computed(() => {
  switch (status.value) {
    case 'connecting':
      return '连接中...'
    case 'connected':
      return '已连接'
    case 'disconnected':
      return '未连接'
    case 'error':
      return '连接错误'
    default:
      return '未知'
  }
})

// 连接状态颜色
const statusColor = computed(() => {
  switch (status.value) {
    case 'connected':
      return 'status-connected'
    case 'connecting':
      return 'status-connecting'
    case 'error':
      return 'status-error'
    default:
      return 'status-disconnected'
  }
})

// 挂载时连接
onMounted(() => {
  if (wsUrl.value) {
    connect(wsUrl.value)
  }
})

// 返回首页
const goBack = () => {
  disconnect()
  router.push('/')
}

// 发送消息
const send = () => {
  if (!messageInput.value.trim()) return

  sendMessage(messageInput.value.trim())
  messageInput.value = ''
}
</script>

<template>
  <div class="chat-container">
    <div class="background-gradient" />
    
    <div class="chat-wrapper">
      <!-- 聊天卡片 -->
      <div class="chat-card">
        <!-- 顶部栏 -->
        <div class="chat-header">
          <div class="header-left">
            <button class="back-button" @click="goBack">
              <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="connection-info">
              <div class="connection-status">
                <span :class="['status-dot', statusColor]"></span>
                <span class="status-text">{{ statusText }}</span>
              </div>
              <div class="connection-url">{{ wsUrl }}</div>
            </div>
          </div>
          <button class="disconnect-button" @click="disconnect" :disabled="status !== 'connected'">
            断开连接
          </button>
        </div>

        <!-- 消息列表 -->
        <div ref="messagesContainer" class="messages-container">
          <div class="messages-list">
            <!-- 空状态 -->
            <div v-if="messages.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p class="empty-text">暂无消息</p>
              <p class="empty-hint">发送一条消息开始聊天吧</p>
            </div>

            <!-- 消息列表 -->
            <div
              v-for="message in messages"
              :key="message.id"
              :class="['message', message.type === 'sent' ? 'message-sent' : 'message-received']"
            >
              <div class="message-content">
                <p class="message-text">{{ message.content }}</p>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- 输入框 -->
        <div class="input-container">
          <input
            v-model="messageInput"
            type="text"
            placeholder="输入消息..."
            class="message-input"
            @keyup.enter="send()"
            :disabled="status !== 'connected'"
          />
          <button
            class="send-button"
            @click="send()"
            :disabled="!messageInput.trim() || status !== 'connected'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1rem;
}

.background-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 1;
}

.dark .background-gradient {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.chat-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 56rem;
  height: calc(100vh - 2rem);
  max-height: 50rem;
}

.chat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.6s ease-out;
  overflow: hidden;
}

.dark .chat-card {
  background: rgba(30, 30, 46, 0.95);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 顶部栏 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dark .chat-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.back-button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.back-button:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateX(-2px);
}

.back-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #667eea;
}

.connection-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-connected {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
  animation: pulse-dot 2s ease-in-out infinite;
}

.status-connecting {
  background: #f59e0b;
  animation: pulse-dot 1s ease-in-out infinite;
}

.status-error {
  background: #ef4444;
}

.status-disconnected {
  background: #6b7280;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .status-text {
  color: #f9fafb;
}

.connection-url {
  font-size: 0.75rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .connection-url {
  color: #9ca3af;
}

.disconnect-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.disconnect-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.disconnect-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 消息区域 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 20rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
  color: #9ca3af;
  stroke-width: 1.5;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .empty-text {
  color: #9ca3af;
}

.empty-hint {
  font-size: 0.875rem;
  color: #9ca3af;
}

.dark .empty-hint {
  color: #6b7280;
}

/* 消息样式 */
.message {
  display: flex;
  margin-bottom: 0.75rem;
}

.message-sent {
  justify-content: flex-end;
}

.message-received {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
}

.message-sent .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message-received .message-content {
  background: rgba(0, 0, 0, 0.05);
  color: #1f2937;
  border-bottom-left-radius: 0.25rem;
}

.dark .message-received .message-content {
  background: rgba(255, 255, 255, 0.1);
  color: #f9fafb;
}

.message-text {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
  display: block;
}

/* 错误提示 */
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-top: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
  font-size: 0.875rem;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* 输入框 */
.input-container {
  display: flex;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.dark .input-container {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  background: white;
  color: #1f2937;
  transition: all 0.2s ease;
  outline: none;
}

.dark .message-input {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f9fafb;
}

.message-input:focus {
  border-color: #667eea;
}

.message-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message-input::placeholder {
  color: #9ca3af;
}

.send-button {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .chat-container {
    padding: 0;
  }

  .chat-wrapper {
    height: 100vh;
    max-height: none;
  }

  .chat-card {
    border-radius: 0;
  }

  .chat-header {
    padding: 1rem;
  }

  .connection-url {
    font-size: 0.7rem;
  }

  .disconnect-button {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }

  .message-content {
    max-width: 85%;
  }
}
</style>