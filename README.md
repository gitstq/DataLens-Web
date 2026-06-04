<p align="center">
  <a href="README.md">简体中文</a> | <a href="README.zh-TW.md">繁體中文</a> | <a href="README.en.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/size-168KB-orange" alt="Size">
  <img src="https://img.shields.io/badge/dependencies-zero-ff69b4" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/platforms-web%20%7C%20desktop%20%7C%20mobile-9cf" alt="Platforms">
</p>

<h1 align="center">🔍 DataLens-Web</h1>

<p align="center">
  <strong>轻量级数据结构可视化与智能分析引擎</strong><br>
  <em>Zero Dependencies · 5 Formats · 3 Views · Code Generation · Offline-First</em>
</p>

---

## 🎉 项目介绍

**DataLens-Web** 是一款零依赖的纯前端数据结构可视化与智能分析工具，旨在帮助开发者快速理解、分析和转换复杂的数据结构。

### 💡 灵感来源

在日常开发中，我们经常需要处理来自API响应、配置文件、日志系统等的复杂数据。理解嵌套层级深、字段众多的JSON/YAML/XML数据结构是一件耗时且容易出错的工作。DataLens-Web 正是为了解决这个痛点而诞生。

### 🌟 自研差异化亮点

- **🪶 超轻量**：总大小仅168KB，无需安装任何依赖，打开即用
- **🔒 隐私优先**：所有数据处理完全在本地完成，不上传任何数据到服务器
- **🌐 离线可用**：无需网络连接，断网环境也能正常使用
- **🎨 三种视图**：图形视图、树形视图、表格视图，满足不同分析场景
- **🔄 格式互转**：JSON、YAML、XML、CSV、TOML 五种格式自由转换
- **💻 代码生成**：一键生成 TypeScript、Go、Python、Rust 类型和 JSON Schema
- **🌐 多语言**：支持简体中文、繁体中文、English 三种界面语言

---

## ✨ 核心特性

### 📊 数据解析
- **JSON**：原生解析，完整支持 ECMAScript 标准
- **YAML**：轻量自研解析器，支持键值对、列表、嵌套结构、注释
- **XML**：基于 DOMParser，完整支持 XML 属性和命名空间
- **CSV**：自定义解析器，支持引号字段、多行字段、多种分隔符
- **TOML**：自研解析器，支持表、键值对、数组、内联表

### 🎨 可视化模式
| 视图模式 | 说明 |
|---------|------|
| 🕸️ **图形视图** | Canvas 渲染的交互式节点图，支持缩放、平移、展开/折叠 |
| 🌳 **树形视图** | DOM 渲染的可折叠树结构，支持搜索筛选、点击复制 |
| 📋 **表格视图** | 自动展平嵌套数据，支持列排序、分页、搜索 |

### 🔧 智能工具
- 🔍 **JSON Path 查询**：支持 `$.store.book[0].title` 风格路径查询
- 📊 **数据对比**：两个 JSON 结构的差异对比，高亮增删改
- 🔄 **格式转换**：五种格式之间自由互转
- 💻 **代码生成**：TypeScript 接口、Go 结构体、Python dataclass、Rust 结构体、JSON Schema
- 📤 **导出功能**：PNG/SVG 图片导出、格式化文本导出、剪贴板复制

### 🎯 用户体验
- 🌙 **主题切换**：深色/浅色主题一键切换
- 🌐 **多语言**：简体中文、繁体中文、English
- ⌨️ **快捷键**：`Ctrl+Enter` 解析 · `Ctrl+S` 导出 · `Ctrl+D` 切换主题
- 📱 **响应式**：完美适配桌面和移动设备
- 💾 **持久化**：自动保存主题、语言、上次输入到 localStorage

---

## 🚀 快速开始

### 环境要求

> 🎯 **零环境要求！** 只需要一个现代浏览器即可。

支持浏览器：
- Chrome 80+
- Firefox 78+
- Safari 14+
- Edge 80+

### 安装与运行

**方式一：直接打开（推荐）**

```bash
# 克隆仓库
git clone https://github.com/gitstq/DataLens-Web.git
cd DataLens-Web

# 直接在浏览器中打开
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

**方式二：本地服务器**

```bash
# 使用 Python
python3 -m http.server 8080

# 使用 Node.js
npx serve .

# 使用 PHP
php -S localhost:8080
```

然后在浏览器中访问 `http://localhost:8080`

### 快速体验

1. 📋 在左侧输入框粘贴 JSON 数据，或拖拽文件到上传区域
2. 🔄 点击「解析」按钮或按 `Ctrl+Enter`
3. 🎨 在右侧选择不同的视图模式查看数据结构
4. 🔍 使用搜索框快速定位关键字段
5. 💻 使用代码生成功能导出数据类型定义

---

## 📖 详细使用指南

### 输入数据

支持三种输入方式：
- **手动粘贴**：在文本区域直接粘贴数据
- **文件上传**：点击上传按钮或拖拽文件到上传区域
- **自动检测**：系统自动识别数据格式（JSON/YAML/XML/CSV/TOML）

### 图形视图操作

| 操作 | 说明 |
|------|------|
| 🖱️ **鼠标滚轮** | 缩放画布 |
| ✋ **鼠标拖拽** | 平移画布 |
| 👆 **单击节点** | 展开/折叠子节点 |
| 📌 **悬停节点** | 显示完整值提示 |
| 🔍 **搜索** | 高亮匹配节点 |

### 格式转换示例

```javascript
// JSON → YAML
// 输入: {"name": "DataLens", "version": "1.0.0"}
// 输出:
// name: DataLens
// version: 1.0.0

// JSON → TypeScript
// 输入: {"name": "string", "age": 30}
// 输出:
// interface RootObject {
//   name: string;
//   age: number;
// }
```

### JSON Path 查询

```
$.store              → 获取 store 对象
$.store.book         → 获取 book 数组
$.store.book[0]      → 获取第一本书
$.store.book[*].title → 获取所有书的标题
$..price             → 递归查找所有 price 字段
```

---

## 💡 设计思路与迭代规划

### 设计理念

DataLens-Web 遵循 **「极简至上」** 的设计哲学：

1. **零依赖原则**：不引入任何第三方库，所有功能均为自研实现，确保最大兼容性和最小体积
2. **隐私优先**：所有计算在浏览器本地完成，绝不上传用户数据
3. **渐进增强**：基础功能开箱即用，高级功能按需发现
4. **国际化原生**：从架构层面支持多语言，而非后期翻译

### 技术选型原因

| 技术 | 选择原因 |
|------|---------|
| Vanilla JS | 零依赖、最小体积、最大兼容性 |
| Canvas API | 高性能图形渲染，适合大数据量可视化 |
| CSS Variables | 主题切换零成本实现 |
| localStorage | 用户偏好持久化，无服务端依赖 |

### 后续迭代计划

- [ ] 🗂️ **v1.1**：增加 JSON Schema 验证功能
- [ ] 📊 **v1.2**：增加数据统计面板（类型分布、深度分析、大小估算）
- [ ] 🔌 **v1.3**：插件系统，支持自定义解析器和可视化器
- [ ] 🌐 **v2.0**：WebWorker 多线程解析，支持超大文件
- [ ] 📱 **v2.1**：PWA 支持，可安装为桌面/移动应用

---

## 📦 打包与部署指南

### 部署到 GitHub Pages

```bash
# 仓库已包含所有必要文件
# 在 GitHub 仓库设置中启用 GitHub Pages
# Settings → Pages → Source: main branch → / (root) → Save
```

### 部署到任何静态服务器

DataLens-Web 是纯静态文件，可以部署到任何支持静态文件托管的服务：

- **Nginx**：将文件复制到 `/usr/share/nginx/html/`
- **Apache**：将文件复制到 `/var/www/html/`
- **Vercel**：直接导入仓库，零配置部署
- **Netlify**：拖拽文件夹即可部署
- **Cloudflare Pages**：连接仓库，自动构建

### Docker 部署

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

```bash
docker build -t datalens-web .
docker run -p 8080:80 datalens-web
```

---

## 🤝 贡献指南

我们欢迎并感谢所有形式的贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

### 快速贡献流程

1. 🍴 Fork 本仓库
2. 🛠️ 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. ✅ 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 📤 推送分支 (`git push origin feature/amazing-feature`)
5. 🎉 创建 Pull Request

### 提交规范

遵循 Angular 提交规范：
- `feat`: 新增功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具链

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源。

```
MIT License

Copyright (c) 2025 DataLens-Web Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq">DataLens-Web Contributors</a><br>
  <sub>⭐ If you find this project helpful, please give it a star!</sub>
</p>
