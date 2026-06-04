/**
 * DataLens-Web - Exporter Module
 * Export graph as PNG/SVG, data as various formats, clipboard
 */
const Exporter = (() => {
  'use strict';

  /**
   * Export graph canvas as PNG
   */
  function exportPNG(canvas) {
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'datalens-graph.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  /**
   * Export graph as SVG (reconstruct from canvas data)
   */
  function exportSVG() {
    // Get the graph view canvas and create an SVG representation
    const canvas = document.getElementById('graph-canvas');
    if (!canvas) return;

    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    let svg = '<?xml version="1.0" encoding="UTF-8"?>\n';
    svg += '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">\n';
    svg += '<rect width="100%" height="100%" fill="#0f172a"/>\n';

    // Create a simple SVG snapshot by drawing the canvas content as an image
    const dataUrl = canvas.toDataURL('image/png');
    svg += '<image href="' + dataUrl + '" width="' + w + '" height="' + h + '"/>\n';
    svg += '</svg>';

    downloadFile(svg, 'datalens-graph.svg', 'image/svg+xml');
  }

  /**
   * Export data as formatted string in specified format
   */
  function exportData(data, format) {
    let content, ext, mime;

    switch (format) {
      case 'json':
        content = Transformer.toJSON(data, true);
        ext = 'json';
        mime = 'application/json';
        break;
      case 'yaml':
        content = Transformer.toYAML(data, 0);
        ext = 'yaml';
        mime = 'text/yaml';
        break;
      case 'xml':
        content = Transformer.toXML(data, 'root');
        ext = 'xml';
        mime = 'application/xml';
        break;
      case 'csv':
        content = Transformer.toCSV(data);
        ext = 'csv';
        mime = 'text/csv';
        break;
      default:
        content = Transformer.toJSON(data, true);
        ext = 'json';
        mime = 'application/json';
    }

    downloadFile(content, 'datalens-export.' + ext, mime);
  }

  /**
   * Copy text to clipboard
   */
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (e) {
      console.error('Clipboard error:', e);
      return false;
    }
  }

  /**
   * Download a file
   */
  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return { exportPNG, exportSVG, exportData, copyToClipboard, downloadFile };
})();
