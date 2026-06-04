/**
 * DataLens-Web - Transformer Module
 * Format conversion, data formatting, JSON Path queries, diff
 */
const Transformer = (() => {
  'use strict';

  /* ============================================================
   * FORMAT CONVERSION
   * ============================================================ */

  /**
   * Convert data to target format string
   * @param {*} data - Parsed data
   * @param {string} targetFormat - 'json', 'yaml', 'xml', 'csv'
   * @returns {string}
   */
  function convert(data, targetFormat) {
    switch (targetFormat) {
      case 'json': return toJSON(data, true);
      case 'yaml': return toYAML(data, 0);
      case 'xml':  return toXML(data, 'root');
      case 'csv':  return toCSV(data);
      default: return toJSON(data, true);
    }
  }

  /**
   * Convert data to JSON string
   */
  function toJSON(data, pretty) {
    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  }

  /**
   * Convert data to YAML string
   */
  function toYAML(data, indent) {
    indent = indent || 0;
    const pad = '  '.repeat(indent);

    if (data === null || data === undefined) return pad + 'null\n';
    if (typeof data === 'boolean') return pad + (data ? 'true' : 'false') + '\n';
    if (typeof data === 'number') return pad + data + '\n';
    if (typeof data === 'string') {
      if (data.includes('\n') || data.includes(':') || data.includes('#') ||
          data.startsWith(' ') || data.startsWith('"') || data === '') {
        return pad + '"' + escapeYAMLString(data) + '"\n';
      }
      return pad + data + '\n';
    }

    if (Array.isArray(data)) {
      if (data.length === 0) return pad + '[]\n';
      let result = '';
      data.forEach(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const keys = Object.keys(item);
          if (keys.length > 0) {
            result += pad + '- ' + keys[0] + ': ' + formatYAMLValue(item[keys[0]]) + '\n';
            const rest = {};
            for (let i = 1; i < keys.length; i++) rest[keys[i]] = item[keys[i]];
            if (Object.keys(rest).length > 0) {
              result += toYAML(rest, indent + 1);
            }
          }
        } else {
          result += pad + '- ' + formatYAMLValue(item) + '\n';
        }
      });
      return result;
    }

    if (typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length === 0) return pad + '{}\n';
      let result = '';
      keys.forEach(key => {
        const val = data[key];
        if (typeof val === 'object' && val !== null) {
          result += pad + key + ':\n';
          result += toYAML(val, indent + 1);
        } else {
          result += pad + key + ': ' + formatYAMLValue(val) + '\n';
        }
      });
      return result;
    }

    return pad + String(data) + '\n';
  }

  function formatYAMLValue(val) {
    if (val === null) return 'null';
    if (typeof val === 'string') {
      if (val.includes(':') || val.includes('#') || val.includes('\n') ||
          val.startsWith(' ') || val === '' || val === 'true' || val === 'false') {
        return '"' + escapeYAMLString(val) + '"';
      }
      return val;
    }
    return String(val);
  }

  function escapeYAMLString(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  }

  /**
   * Convert data to XML string
   */
  function toXML(data, rootTag) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += objToXML(data, rootTag, 0);
    return xml;
  }

  function objToXML(data, tag, indent) {
    const pad = '  '.repeat(indent);

    if (data === null || data === undefined) {
      return pad + '<' + tag + ' xsi:nil="true"/>\n';
    }

    if (typeof data !== 'object') {
      return pad + '<' + tag + '>' + escapeXML(String(data)) + '</' + tag + '>\n';
    }

    if (Array.isArray(data)) {
      let result = '';
      data.forEach(item => {
        result += objToXML(item, 'item', indent);
      });
      return result;
    }

    const keys = Object.keys(data);
    if (keys.length === 0) {
      return pad + '<' + tag + '/>\n';
    }

    let result = pad + '<' + tag + '>\n';
    keys.forEach(key => {
      result += objToXML(data[key], sanitizeXMLTag(key), indent + 1);
    });
    result += pad + '</' + tag + '>\n';
    return result;
  }

  function escapeXML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;')
               .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
  }

  function sanitizeXMLTag(tag) {
    // XML tags must start with letter or underscore
    let sanitized = tag.replace(/[^a-zA-Z0-9_.-]/g, '_');
    if (/^[0-9]/.test(sanitized)) sanitized = '_' + sanitized;
    return sanitized || '_';
  }

  /**
   * Convert data to CSV string
   */
  function toCSV(data) {
    if (!Array.isArray(data)) {
      if (typeof data === 'object' && data !== null) {
        // Convert object to single-row or array of objects
        const entries = Object.entries(data);
        if (entries.length > 0 && typeof entries[0][1] === 'object' && entries[0][1] !== null) {
          data = entries.map(([k, v]) => ({ key: k, ...flattenForCSV(v) }));
        } else {
          data = entries.map(([k, v]) => ({ key: k, value: v }));
        }
      } else {
        return String(data);
      }
    }

    if (data.length === 0) return '';

    // Collect all columns
    const colSet = new Set();
    data.forEach(row => {
      if (typeof row === 'object' && row !== null) {
        Object.keys(row).forEach(k => colSet.add(k));
      }
    });
    const columns = Array.from(colSet);

    // Build CSV
    const lines = [];
    lines.push(columns.map(c => csvEscape(c)).join(','));

    data.forEach(row => {
      const vals = columns.map(col => {
        const val = row[col];
        if (val === undefined || val === null) return '';
        if (typeof val === 'object') return csvEscape(JSON.stringify(val));
        return csvEscape(String(val));
      });
      lines.push(vals.join(','));
    });

    return lines.join('\n');
  }

  function csvEscape(val) {
    if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
      return '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }

  function flattenForCSV(obj, prefix) {
    prefix = prefix || '';
    const result = {};
    for (const [key, val] of Object.entries(obj)) {
      const fullKey = prefix ? prefix + '.' + key : key;
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        Object.assign(result, flattenForCSV(val, fullKey));
      } else {
        result[fullKey] = val;
      }
    }
    return result;
  }

  /* ============================================================
   * DATA FORMATTING
   * ============================================================ */

  /**
   * Pretty print JSON
   */
  function prettyPrint(data) {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Minify JSON
   */
  function minify(data) {
    return JSON.stringify(data);
  }

  /**
   * Sort object keys recursively
   */
  function sortKeys(data) {
    if (Array.isArray(data)) return data.map(sortKeys);
    if (typeof data === 'object' && data !== null) {
      const sorted = {};
      Object.keys(data).sort().forEach(key => {
        sorted[key] = sortKeys(data[key]);
      });
      return sorted;
    }
    return data;
  }

  /**
   * Remove empty/null/undefined values recursively
   */
  function removeEmpty(data) {
    if (Array.isArray(data)) {
      return data.filter(v => v !== null && v !== undefined && v !== '').map(removeEmpty);
    }
    if (typeof data === 'object' && data !== null) {
      const cleaned = {};
      Object.entries(data).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
          cleaned[key] = removeEmpty(val);
        }
      });
      return cleaned;
    }
    return data;
  }

  /* ============================================================
   * JSON PATH QUERY
   * ============================================================ */

  /**
   * Query data using JSONPath-like syntax
   * Supports: $.key, $.key.subkey, $[0], $.key[0].subkey
   * @param {*} data - Parsed data
   * @param {string} path - JSONPath expression
   * @returns {*}
   */
  function queryPath(data, path) {
    if (!path || !path.startsWith('$')) {
      return data;
    }

    let current = data;
    const parts = path.substring(1).split(/\.|\[|\]/).filter(Boolean);

    for (const part of parts) {
      if (current === null || current === undefined) return undefined;

      if (/^\d+$/.test(part)) {
        // Array index
        if (Array.isArray(current)) {
          current = current[parseInt(part, 10)];
        } else {
          return undefined;
        }
      } else {
        // Object key
        if (typeof current === 'object' && !Array.isArray(current)) {
          current = current[part];
        } else {
          return undefined;
        }
      }
    }

    return current;
  }

  /* ============================================================
   * DATA COMPARISON (DIFF)
   * ============================================================ */

  /**
   * Compare two data structures and return diff result
   * @param {*} data1 - Original data
   * @param {*} data2 - Modified data
   * @returns {{ added: [], removed: [], changed: [], unchanged: [] }}
   */
  function diff(data1, data2) {
    const result = { added: [], removed: [], changed: [], unchanged: [] };
    compareValues(data1, data2, '$', result);
    return result;
  }

  function compareValues(v1, v2, path, result) {
    const type1 = Parser.getType(v1);
    const type2 = Parser.getType(v2);

    if (type1 !== type2) {
      result.changed.push({ path, from: v1, to: v2 });
      return;
    }

    if (type1 === 'object' && v1 !== null && v2 !== null) {
      const keys1 = Object.keys(v1);
      const keys2 = Object.keys(v2);

      // Find removed keys
      keys1.forEach(key => {
        if (!(key in v2)) {
          result.removed.push({ path: path + '.' + key, value: v1[key] });
        }
      });

      // Find added keys
      keys2.forEach(key => {
        if (!(key in v1)) {
          result.added.push({ path: path + '.' + key, value: v2[key] });
        }
      });

      // Compare common keys
      keys1.forEach(key => {
        if (key in v2) {
          compareValues(v1[key], v2[key], path + '.' + key, result);
        }
      });
      return;
    }

    if (type1 === 'array') {
      const len = Math.max(v1.length, v2.length);
      for (let i = 0; i < len; i++) {
        if (i >= v1.length) {
          result.added.push({ path: path + '[' + i + ']', value: v2[i] });
        } else if (i >= v2.length) {
          result.removed.push({ path: path + '[' + i + ']', value: v1[i] });
        } else {
          compareValues(v1[i], v2[i], path + '[' + i + ']', result);
        }
      }
      return;
    }

    // Primitive comparison
    if (v1 !== v2) {
      result.changed.push({ path, from: v1, to: v2 });
    } else {
      result.unchanged.push({ path, value: v1 });
    }
  }

  return {
    convert, toJSON, toYAML, toXML, toCSV,
    prettyPrint, minify, sortKeys, removeEmpty,
    queryPath, diff
  };
})();
