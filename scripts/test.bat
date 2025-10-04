@echo off
REM 世界时间查看器 - Windows自动化测试脚本

echo 🌍 世界时间查看器 - 自动化测试
echo ==================================

REM 检查Node.js版本
echo 📋 检查环境...
node --version
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

REM 检查是否在正确的目录
if not exist "web\package.json" (
    echo ❌ 错误: 请在项目根目录运行此脚本
    pause
    exit /b 1
)

echo ✅ 项目目录检查通过

REM 进入web目录
cd web

REM 检查依赖是否安装
if not exist "node_modules" (
    echo 📦 安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装
)

REM 类型检查
echo 🔍 运行类型检查...
npm run type-check
if %errorlevel% neq 0 (
    echo ❌ 类型检查失败
    pause
    exit /b 1
)
echo ✅ 类型检查通过

REM 代码检查
echo 🔍 运行代码检查...
npm run lint
if %errorlevel% neq 0 (
    echo ⚠️  代码检查发现问题，尝试自动修复...
    npm run lint -- --fix
)
echo ✅ 代码检查完成

REM 构建测试
echo 🏗️  测试构建...
npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)
echo ✅ 构建成功

REM 检查构建产物
if not exist "dist" (
    echo ❌ 构建产物不存在
    pause
    exit /b 1
)

echo 📊 构建产物检查:
if exist "dist\index.html" (
    echo   - dist\index.html: ✅
) else (
    echo   - dist\index.html: ❌
)

if exist "dist\assets" (
    echo   - dist\assets\: ✅
) else (
    echo   - dist\assets\: ❌
)

REM 启动开发服务器进行功能测试
echo 🚀 启动开发服务器进行功能测试...
echo 服务器将在 http://localhost:3000 启动
echo 请在浏览器中测试以下功能:
echo   ✅ 页面加载
echo   ✅ 实时时间显示
echo   ✅ 城市搜索
echo   ✅ 时区转换
echo   ✅ 收藏功能
echo   ✅ 响应式设计
echo.
echo 按 Ctrl+C 停止服务器

REM 启动开发服务器
npm run dev
