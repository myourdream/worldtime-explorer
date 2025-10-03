# 图标文件获取指南

## 🚨 当前状态
已临时移除TabBar图标配置，小程序现在可以正常运行。如需添加图标，请按照以下步骤操作。

## 📱 需要的图标文件

### TabBar 图标（必需）
- `images/home.png` - 首页图标
- `images/home-active.png` - 首页激活图标  
- `images/search.png` - 搜索图标
- `images/search-active.png` - 搜索激活图标
- `images/converter.png` - 转换图标
- `images/converter-active.png` - 转换激活图标

### 其他图标（可选）
- `images/share.png` - 分享图标

## 🎨 图标规格要求

### TabBar 图标
- **尺寸**: 81px × 81px
- **格式**: PNG
- **背景**: 透明
- **普通状态**: 使用灰色 (#7A7E83)
- **激活状态**: 使用主题色 (#667eea)

## 🔧 获取图标的方法

### 方法一：使用在线图标库（推荐）
1. 访问 [Iconfont](https://www.iconfont.cn/) 或 [Feather Icons](https://feathericons.com/)
2. 搜索关键词：
   - 首页：`home`, `house`, `homepage`
   - 搜索：`search`, `magnifying-glass`
   - 转换：`refresh`, `arrow-right-left`, `convert`
3. 下载PNG格式，尺寸调整为81×81px
4. 使用图片编辑工具调整颜色

### 方法二：使用微信开发者工具默认图标
1. 在微信开发者工具中，右键点击项目
2. 选择"新建" → "图片"
3. 选择"TabBar图标模板"
4. 系统会自动生成符合规范的图标

### 方法三：使用AI生成图标
1. 使用Midjourney、DALL-E等AI工具
2. 提示词示例：
   - "Simple home icon, 81x81px, transparent background, minimal style"
   - "Search magnifying glass icon, 81x81px, transparent background"
   - "Refresh arrow icon, 81x81px, transparent background"

### 方法四：使用图标字体
1. 下载Font Awesome或Material Icons字体
2. 使用在线工具转换为PNG图片
3. 调整尺寸和颜色

## 🛠️ 添加图标的步骤

### 1. 准备图标文件
按照上述方法获取6个图标文件，确保：
- 文件名正确
- 尺寸为81×81px
- 格式为PNG
- 背景透明

### 2. 放置图标文件
将图标文件放入 `images/` 目录：
```
images/
├── home.png
├── home-active.png
├── search.png
├── search-active.png
├── converter.png
├── converter-active.png
└── share.png (可选)
```

### 3. 恢复TabBar配置
在 `app.json` 中恢复图标配置：
```json
"tabBar": {
  "color": "#7A7E83",
  "selectedColor": "#667eea",
  "backgroundColor": "#ffffff",
  "borderStyle": "black",
  "list": [
    {
      "pagePath": "pages/index/index",
      "iconPath": "images/home.png",
      "selectedIconPath": "images/home-active.png",
      "text": "首页"
    },
    {
      "pagePath": "pages/city-search/city-search",
      "iconPath": "images/search.png",
      "selectedIconPath": "images/search-active.png",
      "text": "搜索"
    },
    {
      "pagePath": "pages/time-converter/time-converter",
      "iconPath": "images/converter.png",
      "selectedIconPath": "images/converter-active.png",
      "text": "转换"
    }
  ]
}
```

## 🎯 图标设计建议

### 设计风格
- **简洁明了**: 避免过于复杂的细节
- **风格统一**: 所有图标保持相同的设计风格
- **易于识别**: 在小尺寸下也能清晰识别

### 颜色方案
- **普通状态**: #7A7E83 (灰色)
- **激活状态**: #667eea (主题蓝紫色)
- **背景**: 透明

### 图标含义
- **首页**: 房子、主页符号
- **搜索**: 放大镜
- **转换**: 箭头、刷新符号

## ⚡ 快速解决方案

如果您想快速测试项目，可以：

1. **暂时使用文字TabBar**（当前状态）
   - 项目已经可以正常运行
   - TabBar只显示文字，没有图标

2. **使用emoji作为临时图标**
   - 创建简单的PNG文件
   - 使用emoji字符作为图标内容
   - 尺寸调整为81×81px

## 🔍 验证图标

添加图标后，请检查：
1. 图标文件是否存在
2. 文件名是否正确
3. 尺寸是否为81×81px
4. 在微信开发者工具中预览效果
5. 测试在不同设备上的显示效果

## 📞 需要帮助？

如果您在获取图标过程中遇到问题，可以：
1. 使用在线图标生成器
2. 联系设计师制作
3. 使用现有的开源图标库
4. 暂时保持文字TabBar状态

---

**注意**: 当前项目已经可以正常运行，图标是可选的增强功能。您可以先体验项目功能，后续再添加图标。
