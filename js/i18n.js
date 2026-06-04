/**
 * DataLens-Web - Internationalization Module
 * Provides translations for EN, zh-CN, zh-TW
 */
const I18N = (() => {
  'use strict';

  const strings = {
    'en': {
      // Header
      'app.title': 'DataLens',
      'app.subtitle': 'Data Structure Visualizer',
      'theme.dark': 'Dark',
      'theme.light': 'Light',
      'lang.en': 'EN',
      'lang.zh': '中文',
      'lang.tw': '繁體',

      // Input Panel
      'input.title': 'Input Data',
      'input.placeholder': 'Paste your data here (JSON, YAML, XML, CSV, TOML)...',
      'input.upload': 'Drop file here or click to upload',
      'input.upload.hint': 'Supports .json, .yaml, .yml, .xml, .csv, .toml',
      'input.format': 'Format',
      'input.format.auto': 'Auto Detect',
      'input.format.json': 'JSON',
      'input.format.yaml': 'YAML',
      'input.format.xml': 'XML',
      'input.format.csv': 'CSV',
      'input.format.toml': 'TOML',
      'input.sample': 'Load Sample',
      'input.clear': 'Clear',

      // View Tabs
      'view.graph': 'Graph View',
      'view.tree': 'Tree View',
      'view.table': 'Table View',

      // Actions
      'action.parse': 'Parse',
      'action.format': 'Format',
      'action.validate': 'Validate',
      'action.convert': 'Convert',
      'action.codegen': 'Generate Code',
      'action.export': 'Export',

      // Convert Target
      'convert.to': 'Convert To',
      'convert.json': 'JSON',
      'convert.yaml': 'YAML',
      'convert.xml': 'XML',
      'convert.csv': 'CSV',

      // Code Generation
      'codegen.title': 'Code Generation',
      'codegen.lang': 'Language',
      'codegen.typescript': 'TypeScript',
      'codegen.go': 'Go',
      'codegen.python': 'Python',
      'codegen.schema': 'JSON Schema',
      'codegen.rust': 'Rust',
      'codegen.copy': 'Copy Code',
      'codegen.download': 'Download',

      // Export
      'export.title': 'Export',
      'export.png': 'Export as PNG',
      'export.svg': 'Export as SVG',
      'export.json': 'Export as JSON',
      'export.yaml': 'Export as YAML',
      'export.xml': 'Export as XML',
      'export.csv': 'Export as CSV',
      'export.clipboard': 'Copy to Clipboard',

      // Status Bar
      'status.keys': 'Keys',
      'status.depth': 'Depth',
      'status.size': 'Size',
      'status.type': 'Type',
      'status.ready': 'Ready',
      'status.parsed': 'Parsed successfully',
      'status.error': 'Error',
      'status.noData': 'No data loaded',

      // Graph View
      'graph.zoom': 'Scroll to zoom',
      'graph.pan': 'Drag to pan',
      'graph.expand': 'Click to expand',
      'graph.collapse': 'Click to collapse',
      'graph.search': 'Search nodes...',
      'graph.reset': 'Reset View',

      // Tree View
      'tree.expand': 'Expand All',
      'tree.collapse': 'Collapse All',
      'tree.copy': 'Copy Value',
      'tree.search': 'Filter...',

      // Table View
      'table.sort': 'Click to sort',
      'table.sort.asc': 'Ascending',
      'table.sort.desc': 'Descending',
      'table.prev': 'Previous',
      'table.next': 'Next',
      'table.page': 'Page',
      'table.of': 'of',
      'table.rows': 'rows',
      'table.search': 'Search...',

      // Errors
      'error.parse': 'Parse error',
      'error.invalid.json': 'Invalid JSON format',
      'error.invalid.yaml': 'Invalid YAML format',
      'error.invalid.xml': 'Invalid XML format',
      'error.invalid.csv': 'Invalid CSV format',
      'error.invalid.toml': 'Invalid TOML format',
      'error.noData': 'No data to parse',
      'error.empty': 'Input is empty',
      'error.line': 'Line',
      'error.column': 'Column',
      'error.unsupported': 'Unsupported format',
      'error.export': 'Export failed',
      'error.clipboard': 'Failed to copy to clipboard',

      // Success
      'success.format': 'Formatted successfully',
      'success.validate': 'Validation passed',
      'success.convert': 'Converted successfully',
      'success.export': 'Exported successfully',
      'success.copy': 'Copied to clipboard',
      'success.codegen': 'Code generated successfully',

      // Diff
      'diff.title': 'Data Comparison',
      'diff.input1': 'Original Data',
      'diff.input2': 'Modified Data',
      'diff.compare': 'Compare',
      'diff.added': 'Added',
      'diff.removed': 'Removed',
      'diff.changed': 'Changed',
      'diff.unchanged': 'Unchanged',
      'diff.noDiff': 'No differences found',

      // Keyboard Shortcuts
      'shortcuts.title': 'Keyboard Shortcuts',
      'shortcuts.parse': 'Ctrl+Enter - Parse',
      'shortcuts.export': 'Ctrl+S - Export',
      'shortcuts.theme': 'Ctrl+D - Toggle Theme',

      // Misc
      'loading': 'Loading...',
      'close': 'Close',
      'ok': 'OK',
      'cancel': 'Cancel',
      'confirm': 'Confirm',
      'yes': 'Yes',
      'no': 'No'
    },

    'zh-CN': {
      'app.title': 'DataLens',
      'app.subtitle': '数据结构可视化分析引擎',
      'theme.dark': '深色',
      'theme.light': '浅色',
      'lang.en': 'EN',
      'lang.zh': '中文',
      'lang.tw': '繁體',

      'input.title': '输入数据',
      'input.placeholder': '在此粘贴数据（JSON、YAML、XML、CSV、TOML）...',
      'input.upload': '拖放文件到此处或点击上传',
      'input.upload.hint': '支持 .json、.yaml、.yml、.xml、.csv、.toml',
      'input.format': '格式',
      'input.format.auto': '自动检测',
      'input.format.json': 'JSON',
      'input.format.yaml': 'YAML',
      'input.format.xml': 'XML',
      'input.format.csv': 'CSV',
      'input.format.toml': 'TOML',
      'input.sample': '加载示例',
      'input.clear': '清空',

      'view.graph': '图形视图',
      'view.tree': '树形视图',
      'view.table': '表格视图',

      'action.parse': '解析',
      'action.format': '格式化',
      'action.validate': '验证',
      'action.convert': '转换',
      'action.codegen': '生成代码',
      'action.export': '导出',

      'convert.to': '转换为',
      'convert.json': 'JSON',
      'convert.yaml': 'YAML',
      'convert.xml': 'XML',
      'convert.csv': 'CSV',

      'codegen.title': '代码生成',
      'codegen.lang': '语言',
      'codegen.typescript': 'TypeScript',
      'codegen.go': 'Go',
      'codegen.python': 'Python',
      'codegen.schema': 'JSON Schema',
      'codegen.rust': 'Rust',
      'codegen.copy': '复制代码',
      'codegen.download': '下载',

      'export.title': '导出',
      'export.png': '导出为 PNG',
      'export.svg': '导出为 SVG',
      'export.json': '导出为 JSON',
      'export.yaml': '导出为 YAML',
      'export.xml': '导出为 XML',
      'export.csv': '导出为 CSV',
      'export.clipboard': '复制到剪贴板',

      'status.keys': '键数',
      'status.depth': '深度',
      'status.size': '大小',
      'status.type': '类型',
      'status.ready': '就绪',
      'status.parsed': '解析成功',
      'status.error': '错误',
      'status.noData': '未加载数据',

      'graph.zoom': '滚轮缩放',
      'graph.pan': '拖拽平移',
      'graph.expand': '点击展开',
      'graph.collapse': '点击折叠',
      'graph.search': '搜索节点...',
      'graph.reset': '重置视图',

      'tree.expand': '全部展开',
      'tree.collapse': '全部折叠',
      'tree.copy': '复制值',
      'tree.search': '筛选...',

      'table.sort': '点击排序',
      'table.sort.asc': '升序',
      'table.sort.desc': '降序',
      'table.prev': '上一页',
      'table.next': '下一页',
      'table.page': '第',
      'table.of': '页，共',
      'table.rows': '行',
      'table.search': '搜索...',

      'error.parse': '解析错误',
      'error.invalid.json': '无效的 JSON 格式',
      'error.invalid.yaml': '无效的 YAML 格式',
      'error.invalid.xml': '无效的 XML 格式',
      'error.invalid.csv': '无效的 CSV 格式',
      'error.invalid.toml': '无效的 TOML 格式',
      'error.noData': '没有可解析的数据',
      'error.empty': '输入为空',
      'error.line': '行',
      'error.column': '列',
      'error.unsupported': '不支持的格式',
      'error.export': '导出失败',
      'error.clipboard': '复制到剪贴板失败',

      'success.format': '格式化成功',
      'success.validate': '验证通过',
      'success.convert': '转换成功',
      'success.export': '导出成功',
      'success.copy': '已复制到剪贴板',
      'success.codegen': '代码生成成功',

      'diff.title': '数据对比',
      'diff.input1': '原始数据',
      'diff.input2': '修改后数据',
      'diff.compare': '对比',
      'diff.added': '新增',
      'diff.removed': '删除',
      'diff.changed': '变更',
      'diff.unchanged': '未变更',
      'diff.noDiff': '未发现差异',

      'shortcuts.title': '快捷键',
      'shortcuts.parse': 'Ctrl+Enter - 解析',
      'shortcuts.export': 'Ctrl+S - 导出',
      'shortcuts.theme': 'Ctrl+D - 切换主题',

      'loading': '加载中...',
      'close': '关闭',
      'ok': '确定',
      'cancel': '取消',
      'confirm': '确认',
      'yes': '是',
      'no': '否'
    },

    'zh-TW': {
      'app.title': 'DataLens',
      'app.subtitle': '資料結構視覺化分析引擎',
      'theme.dark': '深色',
      'theme.light': '淺色',
      'lang.en': 'EN',
      'lang.zh': '中文',
      'lang.tw': '繁體',

      'input.title': '輸入資料',
      'input.placeholder': '在此貼上資料（JSON、YAML、XML、CSV、TOML）...',
      'input.upload': '拖放檔案至此處或點擊上傳',
      'input.upload.hint': '支援 .json、.yaml、.yml、.xml、.csv、.toml',
      'input.format': '格式',
      'input.format.auto': '自動偵測',
      'input.format.json': 'JSON',
      'input.format.yaml': 'YAML',
      'input.format.xml': 'XML',
      'input.format.csv': 'CSV',
      'input.format.toml': 'TOML',
      'input.sample': '載入範例',
      'input.clear': '清空',

      'view.graph': '圖形檢視',
      'view.tree': '樹狀檢視',
      'view.table': '表格檢視',

      'action.parse': '解析',
      'action.format': '格式化',
      'action.validate': '驗證',
      'action.convert': '轉換',
      'action.codegen': '產生程式碼',
      'action.export': '匯出',

      'convert.to': '轉換為',
      'convert.json': 'JSON',
      'convert.yaml': 'YAML',
      'convert.xml': 'XML',
      'convert.csv': 'CSV',

      'codegen.title': '程式碼產生',
      'codegen.lang': '語言',
      'codegen.typescript': 'TypeScript',
      'codegen.go': 'Go',
      'codegen.python': 'Python',
      'codegen.schema': 'JSON Schema',
      'codegen.rust': 'Rust',
      'codegen.copy': '複製程式碼',
      'codegen.download': '下載',

      'export.title': '匯出',
      'export.png': '匯出為 PNG',
      'export.svg': '匯出為 SVG',
      'export.json': '匯出為 JSON',
      'export.yaml': '匯出為 YAML',
      'export.xml': '匯出為 XML',
      'export.csv': '匯出為 CSV',
      'export.clipboard': '複製到剪貼簿',

      'status.keys': '鍵數',
      'status.depth': '深度',
      'status.size': '大小',
      'status.type': '類型',
      'status.ready': '就緒',
      'status.parsed': '解析成功',
      'status.error': '錯誤',
      'status.noData': '未載入資料',

      'graph.zoom': '滾輪縮放',
      'graph.pan': '拖曳平移',
      'graph.expand': '點擊展開',
      'graph.collapse': '點擊摺疊',
      'graph.search': '搜尋節點...',
      'graph.reset': '重置檢視',

      'tree.expand': '全部展開',
      'tree.collapse': '全部摺疊',
      'tree.copy': '複製值',
      'tree.search': '篩選...',

      'table.sort': '點擊排序',
      'table.sort.asc': '升冪',
      'table.sort.desc': '降冪',
      'table.prev': '上一頁',
      'table.next': '下一頁',
      'table.page': '第',
      'table.of': '頁，共',
      'table.rows': '行',
      'table.search': '搜尋...',

      'error.parse': '解析錯誤',
      'error.invalid.json': '無效的 JSON 格式',
      'error.invalid.yaml': '無效的 YAML 格式',
      'error.invalid.xml': '無效的 XML 格式',
      'error.invalid.csv': '無效的 CSV 格式',
      'error.invalid.toml': '無效的 TOML 格式',
      'error.noData': '沒有可解析的資料',
      'error.empty': '輸入為空',
      'error.line': '行',
      'error.column': '列',
      'error.unsupported': '不支援的格式',
      'error.export': '匯出失敗',
      'error.clipboard': '複製到剪貼簿失敗',

      'success.format': '格式化成功',
      'success.validate': '驗證通過',
      'success.convert': '轉換成功',
      'success.export': '匯出成功',
      'success.copy': '已複製到剪貼簿',
      'success.codegen': '程式碼產生成功',

      'diff.title': '資料比對',
      'diff.input1': '原始資料',
      'diff.input2': '修改後資料',
      'diff.compare': '比對',
      'diff.added': '新增',
      'diff.removed': '刪除',
      'diff.changed': '變更',
      'diff.unchanged': '未變更',
      'diff.noDiff': '未發現差異',

      'shortcuts.title': '快捷鍵',
      'shortcuts.parse': 'Ctrl+Enter - 解析',
      'shortcuts.export': 'Ctrl+S - 匯出',
      'shortcuts.theme': 'Ctrl+D - 切換主題',

      'loading': '載入中...',
      'close': '關閉',
      'ok': '確定',
      'cancel': '取消',
      'confirm': '確認',
      'yes': '是',
      'no': '否'
    }
  };

  let currentLang = 'en';

  /**
   * Get a translated string by key
   * @param {string} key - The i18n key
   * @param {string} [lang] - Optional language override
   * @returns {string} The translated string or the key itself if not found
   */
  function t(key, lang) {
    const l = lang || currentLang;
    const dict = strings[l] || strings['en'];
    return dict[key] || strings['en'][key] || key;
  }

  /**
   * Set the current language
   * @param {string} lang - Language code ('en', 'zh-CN', 'zh-TW')
   */
  function setLang(lang) {
    if (strings[lang]) {
      currentLang = lang;
    }
  }

  /**
   * Get the current language
   * @returns {string} Current language code
   */
  function getLang() {
    return currentLang;
  }

  /**
   * Get available languages
   * @returns {string[]} Available language codes
   */
  function getLanguages() {
    return Object.keys(strings);
  }

  /**
   * Update all elements with data-i18n attribute
   */
  function updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = t(key);
    });
  }

  return { t, setLang, getLang, getLanguages, updateDOM, strings };
})();
