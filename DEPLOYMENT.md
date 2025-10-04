# 部署说明

## GitHub 仓库配置

1. **添加远程仓库**
   ```bash
   git remote add origin https://github.com/myourdream/worldtime-explorer.git
   ```

2. **推送代码**
   ```bash
   git push -u origin master
   ```

## Vercel 部署配置

### 1. 环境变量设置
在Vercel项目设置中添加以下环境变量：
- `VERCEL_TOKEN`: Vercel API Token
- `VERCEL_ORG_ID`: Vercel组织ID  
- `VERCEL_PROJECT_ID`: Vercel项目ID

### 2. GitHub Actions 配置
项目已包含 `.github/workflows/deploy.yml` 文件，配置了自动部署流程。

### 3. Vercel 项目配置
项目已包含 `vercel.json` 文件，配置了构建和部署设置。

## 手动部署步骤

### Web应用部署
1. 进入web目录
   ```bash
   cd web
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 构建项目
   ```bash
   npm run build
   ```

4. 部署到Vercel
   ```bash
   npx vercel --prod
   ```

## 项目结构说明

```
worldtime-explorer/
├── miniprogram/          # 微信小程序代码
├── web/                  # Web应用代码
├── shared/               # 共享代码
├── .github/workflows/    # GitHub Actions
├── vercel.json           # Vercel配置
└── README.md             # 项目说明
```

## 功能特性

### Web版本
- ✅ React + TypeScript + Tailwind CSS
- ✅ 实时时间显示
- ✅ 城市搜索功能
- ✅ 时区转换
- ✅ 收藏管理
- ✅ 响应式设计

### 微信小程序版本
- ✅ 原生小程序开发
- ✅ 云开发支持
- ✅ 完整功能对等

## 技术栈

- **前端**: React 18, TypeScript, Tailwind CSS
- **状态管理**: Zustand
- **构建工具**: Vite
- **部署**: Vercel
- **CI/CD**: GitHub Actions
