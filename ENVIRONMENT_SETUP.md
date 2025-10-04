# 🌍 世界时间查看器 - 完整环境搭建指南

## 📋 项目概述

基于微信小程序"世界时间查看器"开发的Web版本，支持实时时间显示、城市搜索、时区转换等功能。

## 🏗️ 项目结构

```
worldtime-explorer/
├── miniprogram/          # 微信小程序代码
├── web/                  # Web应用代码
├── shared/               # 共享代码
├── .github/workflows/    # GitHub Actions
├── vercel.json           # Vercel配置
└── 文档文件
```

## 🚀 环境搭建步骤

### 1. 开发环境搭建

#### 1.1 系统要求
- Node.js 18+ 
- npm 或 pnpm
- Git
- 现代浏览器（Chrome、Firefox、Safari、Edge）

#### 1.2 克隆项目
```bash
git clone https://github.com/myourdream/worldtime-explorer.git
cd worldtime-explorer
```

#### 1.3 安装依赖
```bash
# 进入Web应用目录
cd web

# 安装依赖
npm install
# 或使用pnpm（推荐）
pnpm install
```

#### 1.4 启动开发服务器
```bash
# 启动开发服务器
npm run dev
# 或
pnpm dev

# 服务器将在 http://localhost:3000 启动
```

#### 1.5 验证开发环境
- 打开浏览器访问 http://localhost:3000
- 检查页面是否正常加载
- 测试各个功能：
  - ✅ 实时时间显示
  - ✅ 城市搜索
  - ✅ 时区转换
  - ✅ 收藏功能

### 2. 测试环境搭建

#### 2.1 构建生产版本
```bash
# 在web目录下
npm run build
# 或
pnpm build

# 构建完成后，dist目录将包含生产文件
```

#### 2.2 预览生产版本
```bash
# 预览构建结果
npm run preview
# 或
pnpm preview

# 预览服务器将在 http://localhost:4173 启动
```

#### 2.3 运行测试
```bash
# 类型检查
npm run type-check
# 或
pnpm type-check

# 代码检查
npm run lint
# 或
pnpm lint
```

#### 2.4 手动测试清单
- [ ] 页面加载正常
- [ ] 时间实时更新
- [ ] 城市搜索功能
- [ ] 时区转换功能
- [ ] 收藏功能
- [ ] 响应式设计
- [ ] 浏览器兼容性

### 3. 生产环境部署

#### 3.1 Vercel部署（推荐）

##### 3.1.1 安装Vercel CLI
```bash
npm install -g vercel
# 或
pnpm add -g vercel
```

##### 3.1.2 登录Vercel
```bash
vercel login
```

##### 3.1.3 部署到Vercel
```bash
# 在项目根目录
vercel

# 按照提示配置：
# - 项目名称：worldtime-explorer
# - 构建目录：web
# - 输出目录：web/dist
# - 安装命令：cd web && npm install
# - 构建命令：cd web && npm run build
```

##### 3.1.4 配置环境变量
在Vercel项目设置中添加：
```
NODE_VERSION=18
```

#### 3.2 GitHub Actions自动部署

##### 3.2.1 配置GitHub Secrets
在GitHub仓库设置中添加以下Secrets：
- `VERCEL_TOKEN`: Vercel API Token
- `VERCEL_ORG_ID`: Vercel组织ID
- `VERCEL_PROJECT_ID`: Vercel项目ID

##### 3.2.2 推送代码触发部署
```bash
git add .
git commit -m "feat: 更新功能"
git push origin main
```

##### 3.2.3 检查部署状态
- 访问GitHub Actions页面
- 查看部署工作流状态
- 检查Vercel部署日志

#### 3.3 其他部署方式

##### 3.3.1 Netlify部署
```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod --dir=web/dist
```

##### 3.3.2 静态服务器部署
```bash
# 构建项目
cd web && npm run build

# 使用任何静态服务器
# 例如：serve
npm install -g serve
serve -s dist -l 3000
```

## 🔧 开发工具配置

### 1. VS Code推荐插件
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

### 2. 代码格式化配置
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🐛 常见问题解决

### 1. 依赖安装问题
```bash
# 清除缓存
npm cache clean --force
# 或
pnpm store prune

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

### 2. 构建失败
```bash
# 检查TypeScript错误
npm run type-check

# 检查代码规范
npm run lint

# 修复自动修复的问题
npm run lint -- --fix
```

### 3. 端口冲突
```bash
# 修改端口
npm run dev -- --port 3001
```

### 4. 时区显示问题
- 检查浏览器时区设置
- 确认系统时间正确
- 验证时区数据完整性

## 📊 性能优化

### 1. 构建优化
- 启用代码分割
- 压缩资源文件
- 优化图片资源
- 启用Gzip压缩

### 2. 运行时优化
- 使用React.memo优化组件
- 实现虚拟滚动（如果城市列表很长）
- 缓存API响应
- 优化重渲染

## 🔍 监控和调试

### 1. 开发调试
```bash
# 启用详细日志
DEBUG=vite:* npm run dev

# 检查网络请求
# 使用浏览器开发者工具Network面板
```

### 2. 生产监控
- 使用Vercel Analytics
- 配置错误监控（如Sentry）
- 性能监控
- 用户行为分析

## 📱 移动端适配

### 1. 响应式设计
- 使用Tailwind CSS响应式类
- 测试不同屏幕尺寸
- 优化触摸交互

### 2. PWA支持
```bash
# 添加PWA支持
npm install -D vite-plugin-pwa
```

## 🔐 安全考虑

### 1. 内容安全策略
- 配置CSP头部
- 防止XSS攻击
- 验证用户输入

### 2. 数据保护
- 本地存储加密
- 敏感信息保护
- 隐私政策遵循

## 📈 扩展功能

### 1. 功能扩展
- 添加更多城市
- 支持多语言
- 时间提醒功能
- 自定义主题

### 2. 技术升级
- 升级到最新React版本
- 添加单元测试
- 实现服务端渲染
- 添加离线支持

## 📞 技术支持

### 1. 问题反馈
- GitHub Issues
- 邮件联系
- 微信交流群

### 2. 贡献指南
- Fork项目
- 创建功能分支
- 提交Pull Request
- 代码审查

---

**🎉 恭喜！您已成功搭建了世界时间查看器的完整开发环境！**
