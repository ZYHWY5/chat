# WebSocket Project

基于 Nuxt 3 + Nuxt UI 的纯净开发模板。

## 技术栈

- [Nuxt 3](https://nuxt.com/) - Vue.js 框架
- [Nuxt UI](https://ui.nuxt.com/) - UI 组件库
- TypeScript
- ESLint

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 开发环境

启动开发服务器（默认端口 3000）：

```bash
pnpm dev
```

指定端口启动（例如 8080）：

```bash
pnpm dev --port 8080
```

### 生产构建

构建生产环境：

```bash
pnpm build
```

预览生产构建：

```bash
pnpm preview
```

### 代码检查

```bash
pnpm lint
```

### 类型检查

```bash
pnpm typecheck
```

## 项目结构

```
app/
├── app.vue          # 应用根组件
├── app.config.ts    # 应用配置
└── pages/           # 页面目录
    └── index.vue    # 首页
```

## 文档

- [Nuxt 3 文档](https://nuxt.com/docs)
- [Nuxt UI 文档](https://ui.nuxt.com/docs)
- [部署文档](https://nuxt.com/docs/getting-started/deployment)
