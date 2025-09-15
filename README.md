# WebAuthn 身份验证示例项目

线上示例：https://webauthn.hjverse.com

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

### 环境变量

创建 `frontend/.env.local` 配置：

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

创建 `backend/.env.local` 配置：

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
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

## 📝 API 接口

### 注册相关

- `POST /api/register-challenge` - 获取注册挑战码
- `POST /api/register-response` - 验证注册响应

### 登录相关

- `POST /api/login-challenge` - 获取登录挑战码
- `POST /api/login-response` - 验证登录响应
