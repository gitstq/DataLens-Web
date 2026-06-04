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
  <strong>輕量級資料結構視覺化與智慧分析引擎</strong><br>
  <em>Zero Dependencies · 5 Formats · 3 Views · Code Generation · Offline-First</em>
</p>

---

## 🎉 專案介紹

**DataLens-Web** 是一款零依賴的純前端資料結構視覺化與智慧分析工具，旨在幫助開發者快速理解、分析和轉換複雜的資料結構。

### 💡 靈感來源

在日常開發中，我們經常需要處理來自 API 回應、設定檔、日誌系統等的複雜資料。理解巢狀層級深、欄位眾多的 JSON/YAML/XML 資料結構是一件耗時且容易出錯的工作。DataLens-Web 正是為了解決這個痛點而誕生。

### 🌟 自研差異化亮點

- **🪶 超輕量**：總大小僅 168KB，無需安裝任何依賴，開啟即用
- **🔒 隱私優先**：所有資料處理完全在本地完成，不上傳任何資料到伺服器
- **🌐 離線可用**：無需網路連接，斷網環境也能正常使用
- **🎨 三種檢視**：圖形檢視、樹形檢視、表格檢視，滿足不同分析場景
- **🔄 格式互轉**：JSON、YAML、XML、CSV、TOML 五種格式自由轉換
- **💻 程式碼生成**：一鍵生成 TypeScript、Go、Python、Rust 型別和 JSON Schema
- **🌐 多語言**：支援簡體中文、繁體中文、English 三種介面語言

---

## ✨ 核心特性

### 📊 資料解析
- **JSON**：原生解析，完整支援 ECMAScript 標準
- **YAML**：輕量自研解析器，支援鍵值對、列表、巢狀結構、註解
- **XML**：基於 DOMParser，完整支援 XML 屬性和命名空間
- **CSV**：自訂解析器，支援引號欄位、多行欄位、多種分隔符
- **TOML**：自研解析器，支援表、鍵值對、陣列、行內表

### 🎨 視覺化模式
| 檢視模式 | 說明 |
|---------|------|
| 🕸️ **圖形檢視** | Canvas 渲染的互動式節點圖，支援縮放、平移、展開/折疊 |
| 🌳 **樹形檢視** | DOM 渲染的可折疊樹結構，支援搜尋篩選、點擊複製 |
| 📋 **表格檢視** | 自動展平巢狀資料，支援欄位排序、分頁、搜尋 |

### 🔧 智慧工具
- 🔍 **JSON Path 查詢**：支援 `$.store.book[0].title` 風格路徑查詢
- 📊 **資料對比**：兩個 JSON 結構的差異對比，高亮增刪改
- 🔄 **格式轉換**：五種格式之間自由互轉
- 💻 **程式碼生成**：TypeScript 介面、Go 結構體、Python dataclass、Rust 結構體、JSON Schema
- 📤 **匯出功能**：PNG/SVG 圖片匯出、格式化文字匯出、剪貼簿複製

### 🎯 使用者體驗
- 🌙 **主題切換**：深色/淺色主題一鍵切換
- 🌐 **多語言**：簡體中文、繁體中文、English
- ⌨️ **快捷鍵**：`Ctrl+Enter` 解析 · `Ctrl+S` 匯出 · `Ctrl+D` 切換主題
- 📱 **響應式**：完美適配桌面和行動裝置
- 💾 **持久化**：自動儲存主題、語言、上次輸入到 localStorage

---

## 🚀 快速開始

### 環境需求

> 🎯 **零環境需求！** 只需要一個現代瀏覽器即可。

支援瀏覽器：
- Chrome 80+
- Firefox 78+
- Safari 14+
- Edge 80+

### 安裝與執行

**方式一：直接開啟（推薦）**

```bash
# 複製倉庫
git clone https://github.com/gitstq/DataLens-Web.git
cd DataLens-Web

# 直接在瀏覽器中開啟
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

**方式二：本地伺服器**

```bash
# 使用 Python
python3 -m http.server 8080

# 使用 Node.js
npx serve .

# 使用 PHP
php -S localhost:8080
```

然後在瀏覽器中存取 `http://localhost:8080`

### 快速體驗

1. 📋 在左側輸入框貼上 JSON 資料，或拖曳檔案到上傳區域
2. 🔄 點擊「解析」按鈕或按 `Ctrl+Enter`
3. 🎨 在右側選擇不同的檢視模式查看資料結構
4. 🔍 使用搜尋框快速定位關鍵欄位
5. 💻 使用程式碼生成功能匯出資料型別定義

---

## 📖 詳細使用指南

### 輸入資料

支援三種輸入方式：
- **手動貼上**：在文字區域直接貼上資料
- **檔案上傳**：點擊上傳按鈕或拖曳檔案到上傳區域
- **自動偵測**：系統自動識別資料格式（JSON/YAML/XML/CSV/TOML）

### 圖形檢視操作

| 操作 | 說明 |
|------|------|
| 🖱️ **滑鼠滾輪** | 縮放畫布 |
| ✋ **滑鼠拖曳** | 平移畫布 |
| 👆 **點擊節點** | 展開/折疊子節點 |
| 📌 **懸停節點** | 顯示完整值提示 |
| 🔍 **搜尋** | 高亮匹配節點 |

### 格式轉換範例

```javascript
// JSON → YAML
// 輸入: {"name": "DataLens", "version": "1.0.0"}
// 輸出:
// name: DataLens
// version: 1.0.0

// JSON → TypeScript
// 輸入: {"name": "string", "age": 30}
// 輸出:
// interface RootObject {
//   name: string;
//   age: number;
// }
```

### JSON Path 查詢

```
$.store              → 取得 store 物件
$.store.book         → 取得 book 陣列
$.store.book[0]      → 取得第一本書
$.store.book[*].title → 取得所有書的標題
$..price             → 遞迴查找所有 price 欄位
```

---

## 💡 設計思路與迭代規劃

### 設計理念

DataLens-Web 遵循 **「極簡至上」** 的設計哲學：

1. **零依賴原則**：不引入任何第三方函式庫，所有功能均為自研實作，確保最大相容性和最小體積
2. **隱私優先**：所有計算在瀏覽器本地完成，絕不上傳使用者資料
3. **漸進增強**：基礎功能開箱即用，進階功能按需發現
4. **國際化原生**：從架構層面支援多語言，而非後期翻譯

### 技術選型原因

| 技術 | 選擇原因 |
|------|---------|
| Vanilla JS | 零依賴、最小體積、最大相容性 |
| Canvas API | 高效能圖形渲染，適合大量資料視覺化 |
| CSS Variables | 主題切換零成本實作 |
| localStorage | 使用者偏好持久化，無伺服端依賴 |

### 後續迭代計畫

- [ ] 🗂️ **v1.1**：增加 JSON Schema 驗證功能
- [ ] 📊 **v1.2**：增加資料統計面板（型別分佈、深度分析、大小估算）
- [ ] 🔌 **v1.3**：外掛系統，支援自訂解析器和視覺化器
- [ ] 🌐 **v2.0**：WebWorker 多執行緒解析，支援超大檔案
- [ ] 📱 **v2.1**：PWA 支援，可安裝為桌面/行動應用

---

## 📦 打包與部署指南

### 部署到 GitHub Pages

```bash
# 倉庫已包含所有必要檔案
# 在 GitHub 倉庫設定中啟用 GitHub Pages
# Settings → Pages → Source: main branch → / (root) → Save
```

### 部署到任何靜態伺服器

DataLens-Web 是純靜態檔案，可以部署到任何支援靜態檔案託管的服務：

- **Nginx**：將檔案複製到 `/usr/share/nginx/html/`
- **Apache**：將檔案複製到 `/var/www/html/`
- **Vercel**：直接匯入倉庫，零配置部署
- **Netlify**：拖曳資料夾即可部署
- **Cloudflare Pages**：連接倉庫，自動建置

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

## 🤝 貢獻指南

我們歡迎並感謝所有形式的貢獻！請閱讀 [CONTRIBUTING.md](CONTRIBUTING.md) 了解詳情。

### 快速貢獻流程

1. 🍴 Fork 本倉庫
2. 🛠️ 建立特性分支 (`git checkout -b feature/amazing-feature`)
3. ✅ 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 📤 推送分支 (`git push origin feature/amazing-feature`)
5. 🎉 建立 Pull Request

### 提交規範

遵循 Angular 提交規範：
- `feat`: 新增功能
- `fix`: 修復問題
- `docs`: 文件更新
- `style`: 程式碼格式
- `refactor`: 程式碼重構
- `test`: 測試相關
- `chore`: 建置/工具鏈

---

## 📄 開源協議

本專案基於 [MIT License](LICENSE) 開源。

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq">DataLens-Web Contributors</a><br>
  <sub>⭐ If you find this project helpful, please give it a star!</sub>
</p>
