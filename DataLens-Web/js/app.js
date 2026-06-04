/**
 * DataLens-Web - Application Controller
 * Main entry point: event binding, state management, UI orchestration
 */
const App = (() => {
  'use strict';

  // Application state
  let state = {
    data: null,
    format: null,
    currentView: 'graph',
    theme: 'dark',
    language: 'en',
    error: null
  };

  // DOM element references
  let els = {};

  // Sample data for demo
  const SAMPLE_DATA = {
    "project": "DataLens-Web",
    "version": "1.0.0",
    "description": "A lightweight data structure visualization engine",
    "features": [
      "JSON/YAML/XML/CSV/TOML parsing",
      "Interactive graph visualization",
      "Tree and table views",
      "Code generation",
      "Format conversion"
    ],
    "config": {
      "theme": "dark",
      "language": "en",
      "maxDepth": 10,
      "animation": true
    },
    "stats": {
      "stars": 1250,
      "forks": 89,
      "issues": 12,
      "contributors": 15,
      "isOpenSource": true,
      "license": null
    },
    "author": {
      "name": "DataLens Team",
      "email": "team@datalens.dev",
      "links": {
        "website": "https://datalens.dev",
        "github": "https://github.com/datalens",
        "docs": "https://docs.datalens.dev"
      }
    },
    "tags": ["visualization", "json", "developer-tools", "open-source"]
  };

  /**
   * Initialize the application
   */
  function init() {
    cacheElements();
    loadPreferences();
    applyTheme(state.theme);
    applyLanguage(state.language);
    bindEvents();
    initViews();
    updateStatus('ready');
    I18N.updateDOM();
  }

  /**
   * Cache DOM element references
   */
  function cacheElements() {
    els = {
      // Input
      textarea: document.getElementById('input-textarea'),
      fileInput: document.getElementById('file-input'),
      uploadArea: document.getElementById('upload-area'),
      formatSelect: document.getElementById('format-select'),
      parseBtn: document.getElementById('parse-btn'),
      sampleBtn: document.getElementById('sample-btn'),
      clearBtn: document.getElementById('clear-btn'),

      // Views
      graphTab: document.getElementById('tab-graph'),
      treeTab: document.getElementById('tab-tree'),
      tableTab: document.getElementById('tab-table'),
      graphPanel: document.getElementById('panel-graph'),
      treePanel: document.getElementById('panel-tree'),
      tablePanel: document.getElementById('panel-table'),
      graphCanvas: document.getElementById('graph-canvas'),
      treeContainer: document.getElementById('tree-container'),
      tableContainer: document.getElementById('table-container'),

      // Toolbar
      viewSearch: document.getElementById('view-search'),
      resetViewBtn: document.getElementById('reset-view-btn'),
      expandAllBtn: document.getElementById('expand-all-btn'),
      collapseAllBtn: document.getElementById('collapse-all-btn'),

      // Actions
      formatBtn: document.getElementById('action-format'),
      validateBtn: document.getElementById('action-validate'),
      convertBtn: document.getElementById('action-convert'),
      codegenBtn: document.getElementById('action-codegen'),
      exportBtn: document.getElementById('action-export'),

      // Header
      themeBtn: document.getElementById('theme-btn'),
      langBtns: document.querySelectorAll('.lang-btn'),

      // Status
      statusDot: document.getElementById('status-dot'),
      statusKeys: document.getElementById('status-keys'),
      statusDepth: document.getElementById('status-depth'),
      statusSize: document.getElementById('status-size'),
      statusType: document.getElementById('status-type'),
      statusMessage: document.getElementById('status-message'),

      // Toast
      toastContainer: document.getElementById('toast-container'),

      // Modal
      modalOverlay: document.getElementById('modal-overlay'),
      modalTitle: document.getElementById('modal-title'),
      modalBody: document.getElementById('modal-body'),
      modalFooter: document.getElementById('modal-footer'),
      modalClose: document.getElementById('modal-close'),
    };
  }

  /**
   * Initialize visualization views
   */
  function initViews() {
    Visualizer.GraphView.init(els.graphCanvas);
    Visualizer.TreeView.init(els.treeContainer);
    Visualizer.TableView.init(els.tableContainer);
  }

  /**
   * Bind all event listeners
   */
  function bindEvents() {
    // File upload
    els.uploadArea.addEventListener('click', () => els.fileInput.click());
    els.uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      els.uploadArea.classList.add('dragover');
    });
    els.uploadArea.addEventListener('dragleave', () => {
      els.uploadArea.classList.remove('dragover');
    });
    els.uploadArea.addEventListener('drop', handleFileDrop);
    els.fileInput.addEventListener('change', handleFileSelect);

    // Parse
    els.parseBtn.addEventListener('click', parseInput);
    els.sampleBtn.addEventListener('click', loadSample);
    els.clearBtn.addEventListener('click', clearInput);

    // View tabs
    els.graphTab.addEventListener('click', () => switchView('graph'));
    els.treeTab.addEventListener('click', () => switchView('tree'));
    els.tableTab.addEventListener('click', () => switchView('table'));

    // Toolbar
    els.viewSearch.addEventListener('input', handleSearch);
    els.resetViewBtn.addEventListener('click', () => {
      Visualizer.GraphView.resetView();
    });
    els.expandAllBtn.addEventListener('click', () => {
      Visualizer.TreeView.expandAll();
    });
    els.collapseAllBtn.addEventListener('click', () => {
      Visualizer.TreeView.collapseAll();
    });

    // Action buttons
    els.formatBtn.addEventListener('click', handleFormat);
    els.validateBtn.addEventListener('click', handleValidate);
    els.convertBtn.addEventListener('click', handleConvert);
    els.codegenBtn.addEventListener('click', handleCodegen);
    els.exportBtn.addEventListener('click', handleExport);

    // Theme toggle
    els.themeBtn.addEventListener('click', toggleTheme);

    // Language switcher
    els.langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        applyLanguage(lang);
        savePreferences();
      });
    });

    // Modal close
    els.modalClose.addEventListener('click', closeModal);
    els.modalOverlay.addEventListener('click', (e) => {
      if (e.target === els.modalOverlay) closeModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);

    // Window resize
    window.addEventListener('resize', debounce(() => {
      Visualizer.GraphView.resizeCanvas();
      if (state.data) Visualizer.GraphView.render();
    }, 200));
  }

  /**
   * Handle file drop event
   */
  function handleFileDrop(e) {
    e.preventDefault();
    els.uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }

  /**
   * Handle file select from input
   */
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) readFile(file);
  }

  /**
   * Read file contents
   */
  function readFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      els.textarea.value = e.target.result;
      // Auto-detect format from extension
      const ext = file.name.split('.').pop().toLowerCase();
      const formatMap = {
        json: 'json', yaml: 'yaml', yml: 'yaml',
        xml: 'xml', csv: 'csv', toml: 'toml'
      };
      if (formatMap[ext]) {
        els.formatSelect.value = formatMap[ext];
      }
      parseInput();
    };
    reader.readAsText(file);
  }

  /**
   * Parse the current input
   */
  function parseInput() {
    const text = els.textarea.value;
    const format = els.formatSelect.value;

    if (!text.trim()) {
      showToast(I18N.t('error.empty'), 'error');
      return;
    }

    const result = Parser.parse(text, format);

    if (result.error) {
      state.data = null;
      state.error = result.error;
      updateStatus('error');
      showToast(result.error, 'error');
      return;
    }

    state.data = result.data;
    state.format = result.format;
    state.error = null;

    updateStatus('parsed');
    renderCurrentView();
    showToast(I18N.t('status.parsed'), 'success');

    // Save last input
    try {
      localStorage.setItem('datalens_last_input', text);
    } catch (e) { /* ignore */ }
  }

  /**
   * Load sample data
   */
  function loadSample() {
    els.textarea.value = JSON.stringify(SAMPLE_DATA, null, 2);
    els.formatSelect.value = 'json';
    parseInput();
  }

  /**
   * Clear input
   */
  function clearInput() {
    els.textarea.value = '';
    state.data = null;
    state.format = null;
    state.error = null;
    updateStatus('ready');
    renderCurrentView();
  }

  /**
   * Switch between views
   */
  function switchView(view) {
    state.currentView = view;

    // Update tabs
    [els.graphTab, els.treeTab, els.tableTab].forEach(tab => tab.classList.remove('active'));
    document.getElementById('tab-' + view).classList.add('active');

    // Update panels
    [els.graphPanel, els.treePanel, els.tablePanel].forEach(panel => panel.classList.remove('active'));
    document.getElementById('panel-' + view).classList.add('active');

    // Show/hide toolbar buttons
    els.resetViewBtn.style.display = view === 'graph' ? '' : 'none';
    els.expandAllBtn.style.display = view === 'tree' ? '' : 'none';
    els.collapseAllBtn.style.display = view === 'tree' ? '' : 'none';

    // Re-render if data exists
    if (state.data) {
      renderCurrentView();
    }

    // Resize canvas when switching to graph
    if (view === 'graph') {
      setTimeout(() => {
        Visualizer.GraphView.resizeCanvas();
        if (state.data) Visualizer.GraphView.render();
      }, 50);
    }
  }

  /**
   * Render the current active view
   */
  function renderCurrentView() {
    const data = state.data;
    Visualizer.GraphView.renderData(data);
    Visualizer.TreeView.renderData(data);
    Visualizer.TableView.renderData(data);
  }

  /**
   * Handle search input
   */
  function handleSearch() {
    const term = els.viewSearch.value;
    switch (state.currentView) {
      case 'graph': Visualizer.GraphView.search(term); break;
      case 'tree':  Visualizer.TreeView.filter(term); break;
      case 'table': Visualizer.TableView.filter(term); break;
    }
  }

  /**
   * Handle format button
   */
  function handleFormat() {
    if (!state.data) {
      showToast(I18N.t('error.noData'), 'error');
      return;
    }
    const formatted = Transformer.prettyPrint(state.data);
    els.textarea.value = formatted;
    els.formatSelect.value = 'json';
    showToast(I18N.t('success.format'), 'success');
  }

  /**
   * Handle validate button
   */
  function handleValidate() {
    const text = els.textarea.value;
    const format = els.formatSelect.value;
    const result = Parser.validate(text, format);

    if (result.valid) {
      const stats = result.stats;
      showModal(I18N.t('success.validate'),
        '<div style="margin-bottom:12px;color:var(--accent-success);font-weight:600;">' +
        I18N.t('success.validate') + '</div>' +
        '<div class="diff-container">' +
        '<div class="diff-item unchanged"><span class="diff-path">Type:</span> <span class="diff-value">' + stats.type + '</span></div>' +
        '<div class="diff-item unchanged"><span class="diff-path">' + I18N.t('status.keys') + ':</span> <span class="diff-value">' + stats.keys + '</span></div>' +
        '<div class="diff-item unchanged"><span class="diff-path">' + I18N.t('status.depth') + ':</span> <span class="diff-value">' + stats.depth + '</span></div>' +
        '<div class="diff-item unchanged"><span class="diff-path">' + I18N.t('status.size') + ':</span> <span class="diff-value">' + formatBytes(stats.size) + '</span></div>' +
        '</div>'
      );
    } else {
      showToast(result.error, 'error');
    }
  }

  /**
   * Handle convert button
   */
  function handleConvert() {
    if (!state.data) {
      showToast(I18N.t('error.noData'), 'error');
      return;
    }

    const formats = ['json', 'yaml', 'xml', 'csv'];
    let html = '<div style="margin-bottom:12px;">' +
               '<label style="color:var(--text-secondary);font-size:12px;">' + I18N.t('convert.to') + '</label>' +
               '<div style="display:flex;gap:6px;margin-top:6px;">';

    formats.forEach(fmt => {
      html += '<button class="action-btn secondary" onclick="App.doConvert(\'' + fmt + '\')">' +
              I18N.t('convert.' + fmt) + '</button>';
    });

    html += '</div></div><div id="convert-result" class="code-display" style="display:none;"></div>';

    showModal(I18N.t('action.convert'), html);
  }

  /**
   * Perform conversion to specified format
   */
  function doConvert(format) {
    if (!state.data) return;
    const result = Transformer.convert(state.data, format);
    const el = document.getElementById('convert-result');
    if (el) {
      el.textContent = result;
      el.style.display = 'block';
    }
    showToast(I18N.t('success.convert'), 'success');
  }

  /**
   * Handle code generation button
   */
  function handleCodegen() {
    if (!state.data) {
      showToast(I18N.t('error.noData'), 'error');
      return;
    }

    const langs = [
      { id: 'typescript', label: I18N.t('codegen.typescript') },
      { id: 'go', label: I18N.t('codegen.go') },
      { id: 'python', label: I18N.t('codegen.python') },
      { id: 'schema', label: I18N.t('codegen.schema') },
      { id: 'rust', label: I18N.t('codegen.rust') }
    ];

    let html = '<div style="margin-bottom:12px;">' +
               '<label style="color:var(--text-secondary);font-size:12px;">' + I18N.t('codegen.lang') + '</label>' +
               '<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">';

    langs.forEach(lang => {
      html += '<button class="action-btn secondary" onclick="App.doCodegen(\'' + lang.id + '\')">' +
              lang.label + '</button>';
    });

    html += '</div></div>' +
            '<div style="margin-top:8px;display:flex;gap:6px;">' +
            '<button class="action-btn secondary" onclick="App.copyCodegen()" style="font-size:11px;">' + I18N.t('codegen.copy') + '</button>' +
            '<button class="action-btn secondary" onclick="App.downloadCodegen()" style="font-size:11px;">' + I18N.t('codegen.download') + '</button>' +
            '</div>' +
            '<div id="codegen-result" class="code-display" style="display:none;margin-top:8px;"></div>';

    showModal(I18N.t('codegen.title'), html);
  }

  let lastCodegenLang = '';
  let lastCodegenResult = '';

  /**
   * Perform code generation
   */
  function doCodegen(lang) {
    if (!state.data) return;
    lastCodegenLang = lang;
    lastCodegenResult = CodeGen.generate(state.data, lang, 'Root');
    const el = document.getElementById('codegen-result');
    if (el) {
      el.textContent = lastCodegenResult;
      el.style.display = 'block';
    }
    showToast(I18N.t('success.codegen'), 'success');
  }

  /**
   * Copy generated code to clipboard
   */
  function copyCodegen() {
    if (lastCodegenResult) {
      Exporter.copyToClipboard(lastCodegenResult).then(ok => {
        showToast(ok ? I18N.t('success.copy') : I18N.t('error.clipboard'), ok ? 'success' : 'error');
      });
    }
  }

  /**
   * Download generated code
   */
  function downloadCodegen() {
    if (!lastCodegenResult) return;
    const extMap = { typescript: 'ts', go: 'go', python: 'py', schema: 'json', rust: 'rs' };
    const ext = extMap[lastCodegenLang] || 'txt';
    Exporter.downloadFile(lastCodegenResult, 'datalens-generated.' + ext, 'text/plain');
  }

  /**
   * Handle export button
   */
  function handleExport() {
    if (!state.data) {
      showToast(I18N.t('error.noData'), 'error');
      return;
    }

    let html = '<div style="display:flex;flex-direction:column;gap:6px;">';

    if (state.currentView === 'graph') {
      html += '<button class="action-btn secondary" onclick="App.doExport(\'png\')" style="width:100%;text-align:left;padding:8px 12px;">' +
              I18N.t('export.png') + '</button>';
      html += '<button class="action-btn secondary" onclick="App.doExport(\'svg\')" style="width:100%;text-align:left;padding:8px 12px;">' +
              I18N.t('export.svg') + '</button>';
      html += '<hr style="border:none;border-top:1px solid var(--border-secondary);margin:4px 0;">';
    }

    ['json', 'yaml', 'xml', 'csv'].forEach(fmt => {
      html += '<button class="action-btn secondary" onclick="App.doExport(\'' + fmt + '\')" style="width:100%;text-align:left;padding:8px 12px;">' +
              I18N.t('export.' + fmt) + '</button>';
    });

    html += '<hr style="border:none;border-top:1px solid var(--border-secondary);margin:4px 0;">';
    html += '<button class="action-btn secondary" onclick="App.doExport(\'clipboard\')" style="width:100%;text-align:left;padding:8px 12px;">' +
            I18N.t('export.clipboard') + '</button>';
    html += '</div>';

    showModal(I18N.t('export.title'), html);
  }

  /**
   * Perform export
   */
  function doExport(type) {
    switch (type) {
      case 'png':
        Exporter.exportPNG(Visualizer.GraphView.getCanvas());
        showToast(I18N.t('success.export'), 'success');
        closeModal();
        break;
      case 'svg':
        Exporter.exportSVG();
        showToast(I18N.t('success.export'), 'success');
        closeModal();
        break;
      case 'clipboard':
        Exporter.copyToClipboard(JSON.stringify(state.data, null, 2)).then(ok => {
          showToast(ok ? I18N.t('success.copy') : I18N.t('error.clipboard'), ok ? 'success' : 'error');
        });
        closeModal();
        break;
      default:
        Exporter.exportData(state.data, type);
        showToast(I18N.t('success.export'), 'success');
        closeModal();
    }
  }

  /**
   * Toggle dark/light theme
   */
  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.theme);
    savePreferences();
    // Re-render graph with new colors
    if (state.data) {
      Visualizer.GraphView.render();
    }
  }

  /**
   * Apply theme to DOM
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (els.themeBtn) {
      els.themeBtn.textContent = theme === 'dark' ? I18N.t('theme.light') : I18N.t('theme.dark');
    }
  }

  /**
   * Apply language
   */
  function applyLanguage(lang) {
    I18N.setLang(lang);
    state.language = lang;

    // Update language buttons
    els.langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Update theme button text
    if (els.themeBtn) {
      els.themeBtn.textContent = state.theme === 'dark' ? I18N.t('theme.light') : I18N.t('theme.dark');
    }

    I18N.updateDOM();
  }

  /**
   * Handle keyboard shortcuts
   */
  function handleKeyboard(e) {
    // Ctrl+Enter: Parse
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      parseInput();
    }
    // Ctrl+S: Export
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleExport();
    }
    // Ctrl+D: Toggle theme
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      toggleTheme();
    }
    // Escape: Close modal
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  /**
   * Update status bar
   */
  function updateStatus(status) {
    if (!els.statusDot) return;

    els.statusDot.className = 'status-dot';
    switch (status) {
      case 'ready':
        els.statusDot.classList.add('idle');
        els.statusMessage.textContent = I18N.t('status.ready');
        els.statusKeys.textContent = '-';
        els.statusDepth.textContent = '-';
        els.statusSize.textContent = '-';
        els.statusType.textContent = '-';
        break;
      case 'parsed':
        els.statusDot.classList.remove('idle');
        els.statusMessage.textContent = I18N.t('status.parsed');
        if (state.data) {
          const stats = Parser.computeStats(state.data);
          els.statusKeys.textContent = stats.keys;
          els.statusDepth.textContent = stats.depth;
          els.statusSize.textContent = formatBytes(stats.size);
          els.statusType.textContent = stats.type;
        }
        break;
      case 'error':
        els.statusDot.classList.add('error');
        els.statusMessage.textContent = state.error || I18N.t('status.error');
        break;
    }
  }

  /**
   * Show toast notification
   */
  function showToast(message, type) {
    type = type || 'info';
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    els.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Show modal dialog
   */
  function showModal(title, bodyHTML, footerHTML) {
    els.modalTitle.textContent = title;
    els.modalBody.innerHTML = bodyHTML;
    if (footerHTML) {
      els.modalFooter.innerHTML = footerHTML;
      els.modalFooter.style.display = 'flex';
    } else {
      els.modalFooter.style.display = 'none';
    }
    els.modalOverlay.style.display = 'flex';
  }

  /**
   * Close modal dialog
   */
  function closeModal() {
    els.modalOverlay.style.display = 'none';
  }

  /**
   * Load user preferences from localStorage
   */
  function loadPreferences() {
    try {
      const prefs = JSON.parse(localStorage.getItem('datalens_prefs') || '{}');
      if (prefs.theme) state.theme = prefs.theme;
      if (prefs.language) state.language = prefs.language;

      // Restore last input
      const lastInput = localStorage.getItem('datalens_last_input');
      if (lastInput && els.textarea) {
        els.textarea.value = lastInput;
      }
    } catch (e) { /* ignore */ }
  }

  /**
   * Save user preferences to localStorage
   */
  function savePreferences() {
    try {
      localStorage.setItem('datalens_prefs', JSON.stringify({
        theme: state.theme,
        language: state.language
      }));
    } catch (e) { /* ignore */ }
  }

  /**
   * Format bytes to human-readable string
   */
  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0) + ' ' + units[i];
  }

  /**
   * Debounce utility
   */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  return {
    init,
    parseInput,
    switchView,
    toggleTheme,
    showToast,
    showModal,
    closeModal,
    doConvert,
    doCodegen,
    copyCodegen,
    downloadCodegen,
    doExport
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
