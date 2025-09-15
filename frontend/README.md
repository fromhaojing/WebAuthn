# WebAuthn 前端应用

这是一个基于 Next.js 的 WebAuthn 前端应用，提供现代化的无密码身份验证用户界面。支持生物识别和硬件安全密钥认证。

## 快速开始

### 环境配置

在项目根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 启动开发服务器

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
frontend/
├── pages/
│   ├── index.tsx          # 主页面
│   └── api/              # API 路由（如果需要）
├── components/
│   └── login-form.tsx    # 登录表单组件
├── lib/
│   └── utils.ts          # 工具函数
├── styles/
│   └── globals.css       # 全局样式
└── public/               # 静态资源
```

## 主要功能

- **用户注册**: 通过 WebAuthn API 注册新用户
- **用户登录**: 使用生物识别或硬件密钥登录
- **实时反馈**: 使用 Sonner 提供优雅的通知反馈
- **响应式设计**: 适配桌面和移动设备

## 技术特性

- **TypeScript**: 完整的类型安全
- **Tailwind CSS**: 现代化的样式方案
- **WebAuthn API**: 现代无密码认证
- **组件化**: 可复用的组件架构

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
