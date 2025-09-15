# WebAuthn 身份验证示例项目

这是一个基于 WebAuthn 标准的现代身份验证实现，使用 Next.js 作为前端，NestJS 作为后端。该项目展示了如何使用生物识别（如指纹、面部识别）或硬件安全密钥进行无密码身份验证。

## 🚀 项目特性

- **无密码认证**: 使用生物识别或硬件安全密钥
- **高安全性**: 基于公钥密码学，防止钓鱼攻击
- **现代技术栈**: Next.js + NestJS + TypeScript
- **完整流程**: 注册和登录功能完整实现
- **响应式设计**: 支持桌面和移动设备

## 📋 技术栈

### 前端
- [Next.js](https://nextjs.org/) - React 全栈框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Sonner](https://sonner.emilkowal.ski/) - 优雅的 toast 通知组件

### 后端
- [NestJS](https://nestjs.com/) - Node.js 企业级框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- [@simplewebauthn/server](https://github.com/MasterKale/SimpleWebAuthn) - WebAuthn 服务器端库
- [Express](https://expressjs.com/) - Web 应用框架（NestJS 内置）

## 🛠️ 安装与运行

### 前置要求
- Node.js 18+ 
- pnpm (推荐) 或 npm

### 安装依赖

```bash
# 安装前端依赖
cd frontend
pnpm install

# 安装后端依赖
cd backend
pnpm install
```

### 启动应用

```bash
# 启动后端服务 (端口 3001)
cd backend
pnpm run start:dev

# 启动前端服务 (端口 3000)
cd frontend
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📖 使用说明

### 1. 用户注册
1. 在输入框中输入用户名
2. 点击"注册"按钮
3. 系统会提示使用生物识别或安全密钥进行注册
4. 完成注册后，该凭证将保存在系统中

### 2. 用户登录
1. 在输入框中输入已注册的用户名
2. 点击"登录"按钮
3. 系统会提示使用之前注册的生物识别或安全密钥
4. 验证成功后完成登录

## 🔧 工作原理

### 注册流程
1. **挑战码生成**: 前端向后端请求注册挑战码
2. **凭证创建**: 使用 WebAuthn API 创建新的公钥凭证
3. **响应验证**: 后端验证注册响应的合法性
4. **凭证存储**: 验证通过后，将凭证信息存储在服务器

### 登录流程
1. **挑战码生成**: 前端向后端请求登录挑战码
2. **身份断言**: 使用 WebAuthn API 获取身份验证断言
3. **签名验证**: 后端验证签名的有效性
4. **登录确认**: 验证通过后，确认用户身份

## 🎯 核心文件说明

### 前端核心文件
- `pages/index.tsx` - 主页面，包含注册和登录逻辑
- `components/login-form.tsx` - 登录表单组件
- `lib/utils.ts` - 工具函数（Base64 转换等）

### 后端核心文件
- `src/app.service.ts` - WebAuthn 核心业务逻辑
- `src/app.controller.ts` - API 路由控制器
- `src/app.module.ts` - 应用模块配置

## 🔒 安全特性

### 防重放攻击
- 每次认证都使用随机挑战码
- 挑战码一次性使用，防止重放

### 防钓鱼攻击
- 凭证与特定域名绑定
- 私钥从不离开用户设备

### 强加密
- 使用椭圆曲线数字签名算法 (ECDSA)
- 符合 FIDO2 和 W3C WebAuthn 标准

## 🐛 开发说明

### 环境变量
在 `frontend/.env.local` 中配置：
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 数据存储
当前实现使用内存存储（仅用于演示），生产环境应该：
- 使用数据库存储用户凭证
- 添加会话管理
- 实现用户管理功能

## 📝 API 接口

### 注册相关
- `POST /api/register-challenge` - 获取注册挑战码
- `POST /api/register-response` - 验证注册响应

### 登录相关
- `POST /api/login-challenge` - 获取登录挑战码
- `POST /api/login-response` - 验证登录响应

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License

## 🔗 相关资源

- [WebAuthn 官方文档](https://www.w3.org/TR/webauthn/)
- [FIDO2 联盟](https://fidoalliance.org/)
- [SimpleWebAuthn 文档](https://simplewebauthn.dev/)
- [NestJS 文档](https://docs.nestjs.com/)
- [Next.js 文档](https://nextjs.org/docs) 
