#!/bin/bash
# 世界时间查看器 - 自动化测试脚本

echo "🌍 世界时间查看器 - 自动化测试"
echo "=================================="

# 检查Node.js版本
echo "📋 检查环境..."
node_version=$(node --version)
echo "Node.js版本: $node_version"

# 检查是否在正确的目录
if [ ! -f "web/package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

echo "✅ 项目目录检查通过"

# 进入web目录
cd web

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已安装"
fi

# 类型检查
echo "🔍 运行类型检查..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ 类型检查失败"
    exit 1
fi
echo "✅ 类型检查通过"

# 代码检查
echo "🔍 运行代码检查..."
npm run lint
if [ $? -ne 0 ]; then
    echo "⚠️  代码检查发现问题，尝试自动修复..."
    npm run lint -- --fix
fi
echo "✅ 代码检查完成"

# 构建测试
echo "🏗️  测试构建..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi
echo "✅ 构建成功"

# 检查构建产物
if [ ! -d "dist" ]; then
    echo "❌ 构建产物不存在"
    exit 1
fi

echo "📊 构建产物检查:"
echo "  - dist/index.html: $(ls -la dist/index.html 2>/dev/null && echo "✅" || echo "❌")"
echo "  - dist/assets/: $(ls -la dist/assets/ 2>/dev/null && echo "✅" || echo "❌")"

# 启动开发服务器进行功能测试
echo "🚀 启动开发服务器进行功能测试..."
echo "服务器将在 http://localhost:3000 启动"
echo "请在浏览器中测试以下功能:"
echo "  ✅ 页面加载"
echo "  ✅ 实时时间显示"
echo "  ✅ 城市搜索"
echo "  ✅ 时区转换"
echo "  ✅ 收藏功能"
echo "  ✅ 响应式设计"
echo ""
echo "按 Ctrl+C 停止服务器"

# 启动开发服务器
npm run dev
