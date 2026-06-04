/**
 * DataLens-Web - Visualizer Module
 * Graph View (Canvas), Tree View (DOM), Table View (DOM)
 */
const Visualizer = (() => {
  'use strict';

  // Color palette for data types
  const TYPE_COLORS = {
    string:  '#4ade80',  // green
    number:  '#60a5fa',  // blue
    boolean: '#fb923c',  // orange
    null:    '#9ca3af',  // gray
    array:   '#c084fc',  // purple
    object:  '#f87171',  // red
    root:    '#fbbf24'   // yellow for root
  };

  const TYPE_COLORS_LIGHT = {
    string:  '#16a34a',
    number:  '#2563eb',
    boolean: '#ea580c',
    null:    '#6b7280',
    array:   '#9333ea',
    object:  '#dc2626',
    root:    '#d97706'
  };

  /* ============================================================
   * GRAPH VIEW - Canvas-based interactive node graph
   * ============================================================ */
  const GraphView = (() => {
    let canvas, ctx;
    let nodes = [];
    let edges = [];
    let scale = 1;
    let offsetX = 0, offsetY = 0;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let hoveredNode = null;
    let searchTerm = '';
    let animationId = null;

    const NODE_W = 140;
    const NODE_H = 36;
    const NODE_R = 8;
    const H_GAP = 60;
    const V_GAP = 24;

    /**
     * Initialize graph view
     */
    function init(canvasEl) {
      canvas = canvasEl;
      ctx = canvas.getContext('2d');
      resizeCanvas();
      bindEvents();
    }

    /**
     * Resize canvas to fill container
     */
    function resizeCanvas() {
      if (!canvas) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /**
     * Bind mouse/touch events
     */
    function bindEvents() {
      canvas.addEventListener('wheel', onWheel, { passive: false });
      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseup', onMouseUp);
      canvas.addEventListener('mouseleave', onMouseUp);
      canvas.addEventListener('click', onClick);
      // Touch support
      canvas.addEventListener('touchstart', onTouchStart, { passive: false });
      canvas.addEventListener('touchmove', onTouchMove, { passive: false });
      canvas.addEventListener('touchend', onTouchEnd);
    }

    function onWheel(e) {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.1, Math.min(5, scale * delta));
      const factor = newScale / scale;

      offsetX = mx - factor * (mx - offsetX);
      offsetY = my - factor * (my - offsetY);
      scale = newScale;
      render();
    }

    function onMouseDown(e) {
      isDragging = true;
      dragStartX = e.clientX - offsetX;
      dragStartY = e.clientY - offsetY;
      canvas.style.cursor = 'grabbing';
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (isDragging) {
        offsetX = e.clientX - dragStartX;
        offsetY = e.clientY - dragStartY;
        render();
        return;
      }

      // Hit test for hover
      const node = hitTest(mx, my);
      if (node !== hoveredNode) {
        hoveredNode = node;
        canvas.style.cursor = node ? 'pointer' : 'grab';
        render();
      }
    }

    function onMouseUp() {
      isDragging = false;
      canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    }

    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const node = hitTest(mx, my);
      if (node && node.children && node.children.length > 0) {
        node.collapsed = !node.collapsed;
        render();
      }
    }

    // Touch handlers
    let lastTouchDist = 0;
    function onTouchStart(e) {
      if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX - offsetX;
        dragStartY = e.touches[0].clientY - offsetY;
      } else if (e.touches.length === 2) {
        isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.sqrt(dx * dx + dy * dy);
      }
      e.preventDefault();
    }

    function onTouchMove(e) {
      if (e.touches.length === 1 && isDragging) {
        offsetX = e.touches[0].clientX - dragStartX;
        offsetY = e.touches[0].clientY - dragStartY;
        render();
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastTouchDist > 0) {
          const factor = dist / lastTouchDist;
          scale = Math.max(0.1, Math.min(5, scale * factor));
          render();
        }
        lastTouchDist = dist;
      }
      e.preventDefault();
    }

    function onTouchEnd() {
      isDragging = false;
      lastTouchDist = 0;
    }

    /**
     * Hit test: find node at canvas coordinates
     */
    function hitTest(mx, my) {
      const x = (mx - offsetX) / scale;
      const y = (my - offsetY) / scale;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (x >= n.x && x <= n.x + n.w && y >= n.y && y <= n.y + n.h) {
          return n;
        }
      }
      return null;
    }

    /**
     * Build node tree from data
     */
    function buildNodes(data, key, depth, parentId) {
      const id = nodes.length;
      const type = Parser.getType(data);
      const hasChildren = (type === 'object' && Object.keys(data).length > 0) ||
                          (type === 'array' && data.length > 0);

      let displayValue = String(key);
      if (type !== 'object' && type !== 'array') {
        let val = String(data);
        if (val.length > 20) val = val.substring(0, 18) + '...';
        displayValue = key + ': ' + val;
      }

      const node = {
        id, key, type, depth,
        value: data,
        displayValue,
        x: 0, y: 0, w: NODE_W, h: NODE_H,
        collapsed: depth > 2,
        children: [],
        parentId,
        highlighted: false
      };
      nodes.push(node);

      if (hasChildren && !node.collapsed) {
        const entries = type === 'array'
          ? data.map((v, i) => [String(i), v])
          : Object.entries(data);

        entries.forEach(([k, v]) => {
          const childId = nodes.length;
          node.children.push(childId);
          buildNodes(v, k, depth + 1, id);
        });
      }

      return id;
    }

    /**
     * Layout nodes using a simple tree layout algorithm
     */
    function layoutNodes() {
      if (nodes.length === 0) return;

      // Calculate subtree widths
      function calcWidth(nodeId) {
        const node = nodes[nodeId];
        if (node.children.length === 0 || node.collapsed) {
          node._width = node.w;
          return node.w;
        }
        let total = 0;
        node.children.forEach(cid => {
          total += calcWidth(cid);
        });
        total += (node.children.length - 1) * H_GAP;
        node._width = Math.max(node.w, total);
        return node._width;
      }

      // Position nodes
      function position(nodeId, x, y) {
        const node = nodes[nodeId];
        node.x = x + (node._width - node.w) / 2;
        node.y = y;

        if (node.children.length > 0 && !node.collapsed) {
          let cx = x;
          node.children.forEach(cid => {
            position(cid, cx, y + node.h + V_GAP);
            cx += nodes[cid]._width + H_GAP;
          });
        }
      }

      calcWidth(0);
      position(0, 0, 0);
    }

    /**
     * Build edges from parent-child relationships
     */
    function buildEdges() {
      edges = [];
      nodes.forEach(node => {
        if (node.parentId !== undefined && node.parentId !== null) {
          edges.push({
            from: node.parentId,
            to: node.id
          });
        }
      });
    }

    /**
     * Render the graph
     */
    function render() {
      if (!ctx) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // Draw edges
      edges.forEach(edge => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        if (!from || !to) return;

        const isHighlighted = from.highlighted && to.highlighted;
        ctx.beginPath();
        ctx.strokeStyle = isHighlighted
          ? 'rgba(251, 191, 36, 0.8)'
          : 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = isHighlighted ? 2 : 1;

        const x1 = from.x + from.w / 2;
        const y1 = from.y + from.h;
        const x2 = to.x + to.w / 2;
        const y2 = to.y;

        // Bezier curve
        const midY = (y1 + y2) / 2;
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1, midY, x2, midY, x2, y2);
        ctx.stroke();
      });

      // Draw nodes
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      nodes.forEach(node => {
        const color = (isDark ? TYPE_COLORS : TYPE_COLORS_LIGHT)[node.type] || TYPE_COLORS.root;
        const isHovered = hoveredNode === node;
        const isHighlighted = node.highlighted;

        // Node background
        ctx.beginPath();
        roundRect(ctx, node.x, node.y, node.w, node.h, NODE_R);
        ctx.fillStyle = isHovered ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.9)';
        ctx.fill();

        // Border
        ctx.strokeStyle = isHighlighted ? '#fbbf24' : color;
        ctx.lineWidth = isHighlighted ? 2.5 : (isHovered ? 2 : 1);
        ctx.stroke();

        // Type indicator dot
        ctx.beginPath();
        ctx.arc(node.x + 10, node.y + node.h / 2, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Text
        ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
        ctx.font = '12px "SF Mono", "Fira Code", "Consolas", monospace';
        ctx.textBaseline = 'middle';

        const text = node.displayValue;
        const maxTextWidth = node.w - 28;
        let displayText = text;
        if (ctx.measureText(text).width > maxTextWidth) {
          while (ctx.measureText(displayText + '...').width > maxTextWidth && displayText.length > 0) {
            displayText = displayText.slice(0, -1);
          }
          displayText += '...';
        }
        ctx.fillText(displayText, node.x + 20, node.y + node.h / 2);

        // Collapse indicator
        if (node.children && node.children.length > 0) {
          const ix = node.x + node.w - 14;
          const iy = node.y + node.h / 2;
          ctx.beginPath();
          ctx.arc(ix, iy, 6, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(203, 213, 225, 0.8)';
          ctx.fill();
          ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(node.collapsed ? '+' : '-', ix, iy);
          ctx.textAlign = 'start';
        }
      });

      // Tooltip for hovered node
      if (hoveredNode) {
        drawTooltip(hoveredNode, w, h);
      }

      ctx.restore();
    }

    /**
     * Draw tooltip near hovered node
     */
    function drawTooltip(node, canvasW, canvasH) {
      const val = node.value;
      let text = '';
      if (typeof val === 'object' && val !== null) {
        text = JSON.stringify(val, null, 2);
        if (text.length > 500) text = text.substring(0, 500) + '\n...';
      } else {
        text = String(val);
      }

      const lines = text.split('\n');
      const lineH = 16;
      const padding = 8;
      const maxW = Math.max(...lines.map(l => ctx.measureText(l).width)) + padding * 2;
      const boxH = lines.length * lineH + padding * 2;

      let tx = node.x + node.w + 10;
      let ty = node.y;

      // Keep tooltip on screen
      const screenTx = tx * scale + offsetX;
      const screenTy = ty * scale + offsetY;
      if (screenTx + maxW * scale > canvasW) tx = node.x - maxW - 10;
      if (screenTy + boxH * scale > canvasH) ty = canvasH / scale - boxH - 10;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.lineWidth = 1;
      roundRect(ctx, tx, ty, maxW, boxH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px "SF Mono", "Fira Code", "Consolas", monospace';
      lines.forEach((line, i) => {
        ctx.fillText(line, tx + padding, ty + padding + (i + 1) * lineH - 2);
      });
    }

    /**
     * Draw rounded rectangle path
     */
    function roundRect(ctx, x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    /**
     * Load data and render
     */
    function renderData(data) {
      nodes = [];
      edges = [];

      if (data === null || data === undefined) {
        render();
        return;
      }

      // Create root node
      const rootKey = Array.isArray(data) ? 'root (array)' : 'root (object)';
      buildNodes(data, rootKey, 0, null);
      layoutNodes();
      buildEdges();

      // Center the view
      if (nodes.length > 0) {
        const rect = canvas.parentElement.getBoundingClientRect();
        const bounds = getNodesBounds();
        const bw = bounds.maxX - bounds.minX;
        const bh = bounds.maxY - bounds.minY;

        scale = Math.min(
          (rect.width - 40) / Math.max(bw, 1),
          (rect.height - 40) / Math.max(bh, 1),
          1.5
        );
        scale = Math.max(0.2, scale);

        offsetX = (rect.width - bw * scale) / 2 - bounds.minX * scale;
        offsetY = (rect.height - bh * scale) / 2 - bounds.minY * scale + 20;
      }

      render();
    }

    /**
     * Get bounding box of all nodes
     */
    function getNodesBounds() {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      nodes.forEach(n => {
        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + n.w);
        maxY = Math.max(maxY, n.y + n.h);
      });
      return { minX, minY, maxX, maxY };
    }

    /**
     * Search and highlight matching nodes
     */
    function search(term) {
      searchTerm = term.toLowerCase();
      nodes.forEach(n => {
        n.highlighted = searchTerm && (
          n.key.toLowerCase().includes(searchTerm) ||
          (typeof n.value === 'string' && n.value.toLowerCase().includes(searchTerm))
        );
      });
      render();
    }

    /**
     * Reset view to center
     */
    function resetView() {
      if (nodes.length === 0) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const bounds = getNodesBounds();
      const bw = bounds.maxX - bounds.minX;
      const bh = bounds.maxY - bounds.minY;

      scale = Math.min(
        (rect.width - 40) / Math.max(bw, 1),
        (rect.height - 40) / Math.max(bh, 1),
        1.5
      );
      scale = Math.max(0.2, scale);

      offsetX = (rect.width - bw * scale) / 2 - bounds.minX * scale;
      offsetY = (rect.height - bh * scale) / 2 - bounds.minY * scale + 20;
      render();
    }

    /**
     * Get canvas element for export
     */
    function getCanvas() {
      return canvas;
    }

    return { init, renderData, search, resetView, resizeCanvas, getCanvas, render };
  })();

  /* ============================================================
   * TREE VIEW - DOM-based collapsible tree
   * ============================================================ */
  const TreeView = (() => {
    let container;

    /**
     * Initialize tree view
     */
    function init(containerEl) {
      container = containerEl;
    }

    /**
     * Render data as a tree
     */
    function renderData(data) {
      container.innerHTML = '';

      if (data === null || data === undefined) {
        container.innerHTML = '<div class="tree-empty">No data</div>';
        return;
      }

      const tree = buildTree(data, 'root', 0);
      container.appendChild(tree);
    }

    /**
     * Build tree DOM from data
     */
    function buildTree(data, key, depth) {
      const type = Parser.getType(data);
      const item = document.createElement('div');
      item.className = 'tree-item';
      item.style.paddingLeft = (depth * 20) + 'px';

      const header = document.createElement('div');
      header.className = 'tree-header';

      const hasChildren = (type === 'object' && Object.keys(data).length > 0) ||
                          (type === 'array' && data.length > 0);

      // Toggle arrow
      const arrow = document.createElement('span');
      arrow.className = 'tree-arrow' + (hasChildren ? '' : ' tree-arrow-leaf');
      arrow.textContent = hasChildren ? '\u25B6' : '\u2022';
      header.appendChild(arrow);

      // Key
      const keyEl = document.createElement('span');
      keyEl.className = 'tree-key';
      keyEl.textContent = key;
      header.appendChild(keyEl);

      // Type badge
      const badge = document.createElement('span');
      badge.className = 'tree-type tree-type-' + type;
      badge.textContent = type;
      header.appendChild(badge);

      // Value (for primitives)
      if (type !== 'object' && type !== 'array') {
        const valEl = document.createElement('span');
        valEl.className = 'tree-value tree-value-' + type;
        valEl.textContent = formatValue(data);
        header.appendChild(valEl);

        // Click to copy
        valEl.style.cursor = 'pointer';
        valEl.title = I18N.t('tree.copy');
        valEl.addEventListener('click', (e) => {
          e.stopPropagation();
          copyToClipboard(String(data));
        });
      }

      // Count for objects/arrays
      if (type === 'object') {
        const count = Object.keys(data).length;
        const countEl = document.createElement('span');
        countEl.className = 'tree-count';
        countEl.textContent = '{' + count + '}';
        header.appendChild(countEl);
      } else if (type === 'array') {
        const countEl = document.createElement('span');
        countEl.className = 'tree-count';
        countEl.textContent = '[' + data.length + ']';
        header.appendChild(countEl);
      }

      item.appendChild(header);

      // Children container
      if (hasChildren) {
        const children = document.createElement('div');
        children.className = 'tree-children';

        const entries = type === 'array'
          ? data.map((v, i) => [String(i), v])
          : Object.entries(data);

        entries.forEach(([k, v]) => {
          children.appendChild(buildTree(v, k, depth + 1));
        });

        item.appendChild(children);

        // Toggle on click
        header.addEventListener('click', () => {
          const isCollapsed = children.style.display === 'none';
          children.style.display = isCollapsed ? 'block' : 'none';
          arrow.textContent = isCollapsed ? '\u25B6' : '\u25BC';
          arrow.classList.toggle('tree-arrow-open', isCollapsed);
        });

        // Default: collapse if deep
        if (depth > 2) {
          children.style.display = 'none';
        } else {
          arrow.textContent = '\u25BC';
          arrow.classList.add('tree-arrow-open');
        }
      }

      return item;
    }

    /**
     * Format a value for display
     */
    function formatValue(val) {
      if (val === null) return 'null';
      if (typeof val === 'string') {
        if (val.length > 100) return '"' + val.substring(0, 97) + '..."';
        return '"' + val + '"';
      }
      return String(val);
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          App.showToast(I18N.t('success.copy'));
        });
      }
    }

    /**
     * Expand all tree nodes
     */
    function expandAll() {
      container.querySelectorAll('.tree-children').forEach(el => {
        el.style.display = 'block';
      });
      container.querySelectorAll('.tree-arrow').forEach(el => {
        el.textContent = '\u25BC';
        el.classList.add('tree-arrow-open');
      });
    }

    /**
     * Collapse all tree nodes
     */
    function collapseAll() {
      container.querySelectorAll('.tree-children').forEach(el => {
        el.style.display = 'none';
      });
      container.querySelectorAll('.tree-arrow:not(.tree-arrow-leaf)').forEach(el => {
        el.textContent = '\u25B6';
        el.classList.remove('tree-arrow-open');
      });
    }

    /**
     * Filter tree by search term
     */
    function filter(term) {
      const items = container.querySelectorAll('.tree-item');
      if (!term) {
        items.forEach(item => item.style.display = '');
        return;
      }
      const lower = term.toLowerCase();
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(lower)) {
          item.style.display = '';
          // Show parents
          let parent = item.parentElement;
          while (parent && parent !== container) {
            if (parent.classList && parent.classList.contains('tree-children')) {
              parent.style.display = 'block';
            }
            parent = parent.parentElement;
          }
        } else {
          item.style.display = 'none';
        }
      });
    }

    return { init, renderData, expandAll, collapseAll, filter };
  })();

  /* ============================================================
   * TABLE VIEW - Flatten nested data into table
   * ============================================================ */
  const TableView = (() => {
    let container;
    let tableData = [];
    let columns = [];
    let currentPage = 1;
    let pageSize = 50;
    let sortCol = -1;
    let sortAsc = true;

    /**
     * Initialize table view
     */
    function init(containerEl) {
      container = containerEl;
    }

    /**
     * Render data as a table
     */
    function renderData(data) {
      container.innerHTML = '';
      currentPage = 1;
      sortCol = -1;
      sortAsc = true;

      if (!data) {
        container.innerHTML = '<div class="table-empty">No data</div>';
        return;
      }

      // Flatten data
      if (Array.isArray(data)) {
        tableData = data;
      } else if (typeof data === 'object') {
        // If object, treat each key as a row or wrap in array
        const entries = Object.entries(data);
        if (entries.length > 0 && typeof entries[0][1] === 'object' && entries[0][1] !== null) {
          tableData = entries.map(([k, v]) => ({ _key: k, ...flattenObject(v) }));
        } else {
          tableData = entries.map(([k, v]) => ({ key: k, value: v }));
        }
      } else {
        tableData = [{ value: data }];
      }

      // Detect columns
      const colSet = new Set();
      tableData.forEach(row => {
        if (typeof row === 'object' && row !== null) {
          Object.keys(row).forEach(k => colSet.add(k));
        }
      });
      columns = Array.from(colSet);

      renderTable();
    }

    /**
     * Flatten a nested object into dot-separated keys
     */
    function flattenObject(obj, prefix) {
      prefix = prefix || '';
      const result = {};
      for (const [key, val] of Object.entries(obj)) {
        const fullKey = prefix ? prefix + '.' + key : key;
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          Object.assign(result, flattenObject(val, fullKey));
        } else {
          result[fullKey] = Array.isArray(val) ? JSON.stringify(val) : val;
        }
      }
      return result;
    }

    /**
     * Render the table with current page and sort
     */
    function renderTable() {
      container.innerHTML = '';

      if (columns.length === 0) {
        container.innerHTML = '<div class="table-empty">No data</div>';
        return;
      }

      // Sort data
      let sortedData = [...tableData];
      if (sortCol >= 0 && sortCol < columns.length) {
        const col = columns[sortCol];
        sortedData.sort((a, b) => {
          let va = a[col], vb = b[col];
          if (va === undefined) va = '';
          if (vb === undefined) vb = '';
          if (typeof va === 'number' && typeof vb === 'number') {
            return sortAsc ? va - vb : vb - va;
          }
          va = String(va);
          vb = String(vb);
          return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        });
      }

      // Pagination
      const totalPages = Math.ceil(sortedData.length / pageSize);
      const start = (currentPage - 1) * pageSize;
      const end = Math.min(start + pageSize, sortedData.length);
      const pageData = sortedData.slice(start, end);

      // Build table
      const table = document.createElement('table');
      table.className = 'data-table';

      // Header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      columns.forEach((col, idx) => {
        const th = document.createElement('th');
        th.textContent = col;
        th.className = 'table-header-cell';
        if (idx === sortCol) {
          th.classList.add(sortAsc ? 'sort-asc' : 'sort-desc');
        }
        th.addEventListener('click', () => {
          if (sortCol === idx) {
            sortAsc = !sortAsc;
          } else {
            sortCol = idx;
            sortAsc = true;
          }
          renderTable();
        });
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Body
      const tbody = document.createElement('tbody');
      pageData.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
          const td = document.createElement('td');
          const val = row[col];
          if (val === undefined || val === null) {
            td.textContent = '-';
            td.className = 'table-cell-null';
          } else if (typeof val === 'object') {
            td.textContent = JSON.stringify(val);
            td.className = 'table-cell-object';
          } else {
            td.textContent = String(val);
            td.className = 'table-cell-' + typeof val;
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      container.appendChild(table);

      // Pagination
      if (totalPages > 1) {
        const pagination = document.createElement('div');
        pagination.className = 'table-pagination';

        const info = document.createElement('span');
        info.className = 'table-page-info';
        info.textContent = I18N.t('table.page') + ' ' + currentPage + ' ' +
                           I18N.t('table.of') + ' ' + totalPages +
                           ' (' + sortedData.length + ' ' + I18N.t('table.rows') + ')';
        pagination.appendChild(info);

        const prevBtn = document.createElement('button');
        prevBtn.textContent = I18N.t('table.prev');
        prevBtn.className = 'table-page-btn';
        prevBtn.disabled = currentPage <= 1;
        prevBtn.addEventListener('click', () => {
          if (currentPage > 1) { currentPage--; renderTable(); }
        });
        pagination.appendChild(prevBtn);

        const nextBtn = document.createElement('button');
        nextBtn.textContent = I18N.t('table.next');
        nextBtn.className = 'table-page-btn';
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.addEventListener('click', () => {
          if (currentPage < totalPages) { currentPage++; renderTable(); }
        });
        pagination.appendChild(nextBtn);

        container.appendChild(pagination);
      }
    }

    /**
     * Filter table rows by search term
     */
    function filter(term) {
      if (!term) {
        renderData(tableData.length === 0 ? null : tableData);
        return;
      }
      const lower = term.toLowerCase();
      const filtered = tableData.filter(row => {
        return Object.values(row).some(v =>
          String(v).toLowerCase().includes(lower)
        );
      });
      // Temporarily replace and re-render
      const origData = tableData;
      tableData = filtered;
      renderTable();
      tableData = origData;
    }

    return { init, renderData, filter };
  })();

  return { GraphView, TreeView, TableView, TYPE_COLORS, TYPE_COLORS_LIGHT };
})();
