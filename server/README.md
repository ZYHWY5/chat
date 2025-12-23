# WebSocket 服务器

简单的 WebSocket 服务器，用于测试客户端连接。

## 快速开始

### 1. 安装依赖

```bash
pnpm add ws
```

### 2. 启动服务器

```bash
pnpm ws:server
```

服务器将在 **3000 端口**启动：
- 本地地址: `ws://localhost:3000`

### 3. 启动前端开发服务器

```bash
# 在另一个终端窗口
pnpm dev --port 8080
```

访问 `http://localhost:8080`，输入 `ws://localhost:3000` 即可连接。

## 功能特性

### ✅ 支持的功能

- **多客户端连接** - 支持多个客户端同时连接
- **消息广播** - 将消息广播给所有在线客户端
- **心跳检测** - 支持 ping/pong 心跳机制
- **连接状态** - 实时显示在线客户端数量
- **详细日志** - 显示连接、消息、断开等日志

### 📝 消息处理

- 客户端发送 `ping` → 服务器回复 `pong`
- 其他消息会广播给所有在线客户端

## 使用 ngrok 暴露到公网

### 1. 启动 ngrok

```bash
# 在第三个终端窗口
ngrok http 3000
```

### 2. 获取公网地址

ngrok 会显示类似输出：
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### 3. 在前端使用公网地址

将 `https://abc123.ngrok.io` 中的 `https` 改为 `wss`：
```
wss://abc123.ngrok.io
```

在前端页面输入这个地址即可连接！

## 测试建议

### 单机测试
1. 启动服务器: `pnpm ws:server`
2. 启动前端: `pnpm dev --port 8080`
3. 浏览器访问: `http://localhost:8080`
4. 输入连接地址: `ws://localhost:3000`

### 多人测试（使用 ngrok）
1. 启动服务器: `pnpm ws:server`
2. 启动 ngrok: `ngrok http 3000`
3. 将 ngrok 地址分享给朋友
4. 朋友访问你的前端页面，输入 `wss://your-ngrok-url`

## 停止服务器

按 `Ctrl + C` 停止服务器

