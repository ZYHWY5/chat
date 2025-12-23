<script setup lang="ts">
const router = useRouter()
const websocketUrl = ref('')

const handleConnect = () => {
  if (!websocketUrl.value) {
    return
  }
  
  router.push({
    path: '/chat',
    query: {
      url: websocketUrl.value.trim()
    }
  })
}
</script>

<template>
  <div class="container">
    <div class="background-gradient" />
    
    <div class="content-wrapper">
      <div class="card">
        <!-- 图标 -->
        <div class="icon-wrapper">
          <div class="icon-bg">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <!-- 标题 -->
        <div class="header">
          <h1 class="title">
            WebSocket 连接
          </h1>
          <p class="subtitle">
            请输入公网 WebSocket 地址
          </p>
        </div>

        <!-- 输入表单 -->
        <div class="form">
          <input
            v-model="websocketUrl"
            type="url"
            placeholder="wss://example.ngrok.io"
            size="xl"
            class="input-field"
          />

          <button
            class="connect-button"
            @click="handleConnect"
            :disabled="!websocketUrl"
          >
            <span class="button-text">连接</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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

.content-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 28rem;
  padding: 1.5rem;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.6s ease-out;
}

.dark .card {
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

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.icon-bg {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

.dark .icon-bg {
  background: linear-gradient(135deg, #4c6ef5 0%, #5f3dc4 100%);
  box-shadow: 0 8px 20px rgba(76, 110, 245, 0.4);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.icon {
  width: 2rem;
  height: 2rem;
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.dark .title {
  color: #f9fafb;
}

.subtitle {
  font-size: 0.95rem;
  color: #6b7280;
}

.dark .subtitle {
  color: #9ca3af;
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-field {
  display: inline-block;
  transition: all 0.3s ease;
}

.input-field:focus-within {
  transform: translateY(-2px);
}

.connect-button {
  display: inline-block;
  width: 100%;
  transition: all 0.3s ease;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.connect-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.connect-button:not(:disabled):active {
  transform: translateY(0);
}

.button-text {
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .card {
    padding: 2rem 1.5rem;
  }
  
  .title {
    font-size: 1.75rem;
  }
}
</style>