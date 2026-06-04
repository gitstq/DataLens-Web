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
  <strong>Lightweight Data Structure Visualization & Intelligent Analysis Engine</strong><br>
  <em>Zero Dependencies · 5 Formats · 3 Views · Code Generation · Offline-First</em>
</p>

---

## 🎉 About

**DataLens-Web** is a zero-dependency, pure frontend data structure visualization and intelligent analysis tool designed to help developers quickly understand, analyze, and transform complex data structures.

### 💡 Inspiration

In daily development, we frequently deal with complex data from API responses, configuration files, and logging systems. Understanding deeply nested JSON/YAML/XML data structures with numerous fields is time-consuming and error-prone. DataLens-Web was born to solve exactly this pain point.

### 🌟 Differentiation Highlights

- **🪶 Ultra-Lightweight**: Only 168KB total — no dependencies to install, open and use instantly
- **🔒 Privacy-First**: All data processing happens entirely in your browser — nothing is ever uploaded to any server
- **🌐 Offline-Ready**: Works without any network connection — fully functional in air-gapped environments
- **🎨 Three View Modes**: Graph View, Tree View, and Table View for different analysis scenarios
- **🔄 Format Conversion**: Free conversion between JSON, YAML, XML, CSV, and TOML
- **💻 Code Generation**: One-click generation of TypeScript, Go, Python, Rust types and JSON Schema
- **🌐 Multi-Language**: Supports English, 简体中文, and 繁體中文

---

## ✨ Core Features

### 📊 Data Parsing
- **JSON**: Native parsing with full ECMAScript standard support
- **YAML**: Lightweight custom parser supporting key-value pairs, lists, nested structures, and comments
- **XML**: DOMParser-based with full attribute and namespace support
- **CSV**: Custom parser handling quoted fields, multiline fields, and various delimiters
- **TOML**: Custom parser supporting tables, key-value pairs, arrays, and inline tables

### 🎨 Visualization Modes
| View Mode | Description |
|-----------|-------------|
| 🕸️ **Graph View** | Interactive node graph rendered on Canvas with zoom, pan, and expand/collapse |
| 🌳 **Tree View** | Collapsible tree structure rendered in DOM with search filtering and click-to-copy |
| 📋 **Table View** | Auto-flattened nested data with sortable columns, pagination, and search |

### 🔧 Smart Tools
- 🔍 **JSON Path Query**: Support for `$.store.book[0].title` style path queries
- 📊 **Data Comparison**: Diff two JSON structures with highlighted additions, deletions, and changes
- 🔄 **Format Conversion**: Free conversion between all five supported formats
- 💻 **Code Generation**: TypeScript interfaces, Go structs, Python dataclasses, Rust structs, JSON Schema
- 📤 **Export**: PNG/SVG image export, formatted text export, clipboard copy

### 🎯 User Experience
- 🌙 **Theme Toggle**: Switch between dark and light themes with one click
- 🌐 **Multi-Language**: English, 简体中文, 繁體中文
- ⌨️ **Keyboard Shortcuts**: `Ctrl+Enter` to parse · `Ctrl+S` to export · `Ctrl+D` to toggle theme
- 📱 **Responsive**: Perfectly adapts to desktop and mobile devices
- 💾 **Persistence**: Automatically saves theme, language, and last input to localStorage

---

## 🚀 Quick Start

### Requirements

> 🎯 **Zero requirements!** All you need is a modern web browser.

Supported browsers:
- Chrome 80+
- Firefox 78+
- Safari 14+
- Edge 80+

### Installation & Running

**Option 1: Direct Open (Recommended)**

```bash
# Clone the repository
git clone https://github.com/gitstq/DataLens-Web.git
cd DataLens-Web

# Open directly in your browser
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

**Option 2: Local Server**

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8080
```

Then visit `http://localhost:8080` in your browser.

### Quick Experience

1. 📋 Paste JSON data in the left input panel, or drag & drop a file onto the upload area
2. 🔄 Click the "Parse" button or press `Ctrl+Enter`
3. 🎨 Select different view modes on the right to explore the data structure
4. 🔍 Use the search box to quickly locate specific fields
5. 💻 Use the code generation feature to export type definitions

---

## 📖 Detailed Usage Guide

### Input Methods

Three input methods are supported:
- **Manual Paste**: Paste data directly into the text area
- **File Upload**: Click the upload button or drag & drop files onto the upload area
- **Auto-Detection**: The system automatically identifies the data format (JSON/YAML/XML/CSV/TOML)

### Graph View Controls

| Action | Description |
|--------|-------------|
| 🖱️ **Mouse Wheel** | Zoom the canvas |
| ✋ **Mouse Drag** | Pan the canvas |
| 👆 **Click Node** | Expand/collapse child nodes |
| 📌 **Hover Node** | Show full value tooltip |
| 🔍 **Search** | Highlight matching nodes |

### Format Conversion Examples

```javascript
// JSON → YAML
// Input:  {"name": "DataLens", "version": "1.0.0"}
// Output:
// name: DataLens
// version: 1.0.0

// JSON → TypeScript
// Input:  {"name": "string", "age": 30}
// Output:
// interface RootObject {
//   name: string;
//   age: number;
// }
```

### JSON Path Queries

```
$.store              → Get the store object
$.store.book         → Get the book array
$.store.book[0]      → Get the first book
$.store.book[*].title → Get all book titles
$..price             → Recursively find all price fields
```

---

## 💡 Design Philosophy & Roadmap

### Design Principles

DataLens-Web follows the philosophy of **"Minimalism First"**:

1. **Zero Dependencies**: No third-party libraries — all features are custom-built for maximum compatibility and minimum size
2. **Privacy First**: All computation happens locally in the browser — user data is never uploaded
3. **Progressive Enhancement**: Core features work out of the box; advanced features are discoverable
4. **Native Internationalization**: Multi-language support is built into the architecture, not bolted on later

### Technology Choices

| Technology | Reason |
|-------------|--------|
| Vanilla JS | Zero dependencies, minimal size, maximum compatibility |
| Canvas API | High-performance graphics rendering for large datasets |
| CSS Variables | Zero-cost theme switching implementation |
| localStorage | User preference persistence without server dependency |

### Roadmap

- [ ] 🗂️ **v1.1**: Add JSON Schema validation
- [ ] 📊 **v1.2**: Add data statistics panel (type distribution, depth analysis, size estimation)
- [ ] 🔌 **v1.3**: Plugin system for custom parsers and visualizers
- [ ] 🌐 **v2.0**: WebWorker multi-threaded parsing for large files
- [ ] 📱 **v2.1**: PWA support — installable as desktop/mobile app

---

## 📦 Deployment Guide

### Deploy to GitHub Pages

```bash
# The repository already contains all necessary files
# Enable GitHub Pages in your repository settings
# Settings → Pages → Source: main branch → / (root) → Save
```

### Deploy to Any Static Server

DataLens-Web consists of pure static files and can be deployed to any static hosting service:

- **Nginx**: Copy files to `/usr/share/nginx/html/`
- **Apache**: Copy files to `/var/www/html/`
- **Vercel**: Import the repository directly — zero-config deployment
- **Netlify**: Drag and drop the folder to deploy
- **Cloudflare Pages**: Connect the repository for automatic builds

### Docker Deployment

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

## 🤝 Contributing

We welcome and appreciate contributions of all forms! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Quick Contribution Workflow

1. 🍴 Fork this repository
2. 🛠️ Create a feature branch (`git checkout -b feature/amazing-feature`)
3. ✅ Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🎉 Create a Pull Request

### Commit Convention

Follow the Angular commit convention:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code formatting
- `refactor`: Code restructuring
- `test`: Test-related
- `chore`: Build/tooling

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq">DataLens-Web Contributors</a><br>
  <sub>⭐ If you find this project helpful, please give it a star!</sub>
</p>
