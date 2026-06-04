/**
 * DataLens-Web - Parser Module
 * Supports JSON, YAML, XML, CSV, TOML parsing with auto-detection
 */
const Parser = (() => {
  'use strict';

  /**
   * Parse input text into a JavaScript value
   * @param {string} text - Raw input text
   * @param {string} [format] - Explicit format hint ('json','yaml','xml','csv','toml')
   * @returns {{ data: *, format: string, error: string|null }}
   */
  function parse(text, format) {
    if (!text || !text.trim()) {
      return { data: null, format: null, error: I18N.t('error.empty') };
    }

    const trimmed = text.trim();
    const detectedFormat = format && format !== 'auto' ? format : detectFormat(trimmed);

    if (!detectedFormat) {
      return { data: null, format: null, error: I18N.t('error.unsupported') };
    }

    try {
      let data;
      switch (detectedFormat) {
        case 'json':  data = parseJSON(trimmed); break;
        case 'yaml':  data = parseYAML(trimmed); break;
        case 'xml':   data = parseXML(trimmed); break;
        case 'csv':   data = parseCSV(trimmed); break;
        case 'toml':  data = parseTOML(trimmed); break;
        default:
          return { data: null, format: detectedFormat, error: I18N.t('error.unsupported') };
      }
      return { data, format: detectedFormat, error: null };
    } catch (e) {
      return { data: null, format: detectedFormat, error: e.message };
    }
  }

  /**
   * Auto-detect the format of input text
   * @param {string} text
   * @returns {string|null}
   */
  function detectFormat(text) {
    // JSON: starts with { or [
    if (/^[\[\{]/.test(text)) {
      try { JSON.parse(text); return 'json'; } catch(e) { /* not json */ }
    }
    // XML: starts with < or <?xml
    if (/^<\??xml|^<[a-zA-Z]/.test(text)) {
      try { new DOMParser().parseFromString(text, 'text/xml'); return 'xml'; } catch(e) { /* not xml */ }
    }
    // CSV: check for comma/tab/semicolon separated lines with consistent columns
    if (/^"[^"]*"|^([^\t,;]+[\t,;])/.test(text)) {
      const lines = text.split('\n').slice(0, 5);
      if (lines.length >= 2) {
        const delimiters = [',', '\t', ';'];
        for (const d of delimiters) {
          const counts = lines.map(l => l.split(d).length);
          if (counts.every(c => c === counts[0]) && counts[0] > 1) return 'csv';
        }
      }
    }
    // TOML: check for [table] or key = value patterns
    if (/^\[.*\]\s*$|^\w+\s*=\s*/m.test(text)) {
      // Distinguish TOML from YAML by checking for = signs (TOML) vs : signs (YAML)
      const hasEquals = /^\w+\s*=\s*/m.test(text);
      const hasColon = /^\s*\w+:\s/m.test(text);
      if (hasEquals && !hasColon) return 'toml';
    }
    // YAML: check for key: value patterns
    if (/^\s*[-\w]+:\s/m.test(text) || /^-\s/m.test(text)) {
      return 'yaml';
    }
    // Fallback: try JSON again (might be a single value)
    try { JSON.parse(text); return 'json'; } catch(e) { /* give up */ }

    return null;
  }

  /**
   * Parse JSON text
   */
  function parseJSON(text) {
    const result = JSON.parse(text);
    if (result === undefined) throw new Error(I18N.t('error.invalid.json'));
    return result;
  }

  /**
   * Lightweight YAML parser
   * Supports: key-value pairs, nested objects, lists, comments, multiline strings
   */
  function parseYAML(text) {
    const lines = text.split('\n');
    const root = {};
    const stack = [{ indent: -1, obj: root }];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) { i++; continue; }

      // Calculate indentation
      const indent = line.search(/\S/);
      if (indent < 0) { i++; continue; }

      // Pop stack to find parent
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1].obj;

      // List item: "- value" or "- key: value"
      if (trimmed.startsWith('- ')) {
        const itemContent = trimmed.substring(2).trim();
        const currentIndent = indent;

        // Ensure parent has an array
        const arrKey = '__array__';
        if (!Array.isArray(parent)) {
          // This is a list at root or under a key
          // We need to figure out the array context
          // If parent is an object, the list is a value of some key
          // This case is handled below in the key: - value pattern
        }

        if (Array.isArray(parent)) {
          // We're adding to an existing array
          if (itemContent.includes(': ') || (itemContent.endsWith(':') && !itemContent.startsWith('"'))) {
            // "- key: value" pattern
            const colonIdx = itemContent.indexOf(':');
            const key = itemContent.substring(0, colonIdx).trim();
            const val = itemContent.substring(colonIdx + 1).trim();
            const newObj = {};
            parent.push(newObj);
            stack.push({ indent: currentIndent, obj: newObj });

            if (val) {
              newObj[key] = parseYAMLValue(val);
            } else {
              newObj[key] = {};
              // Check next lines for nested content
              if (i + 1 < lines.length) {
                const nextIndent = lines[i + 1].search(/\S/);
                if (nextIndent > currentIndent) {
                  stack.push({ indent: currentIndent + 2, obj: newObj[key] });
                }
              }
            }
          } else {
            parent.push(parseYAMLValue(itemContent));
          }
        }
        i++; continue;
      }

      // Key-value pair: "key: value" or "key:"
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx > 0) {
        const key = trimmed.substring(0, colonIdx).trim();
        let val = trimmed.substring(colonIdx + 1).trim();

        // Remove inline comments (but not inside strings)
        if (val && !val.startsWith('"') && !val.startsWith("'")) {
          const commentIdx = val.indexOf(' #');
          if (commentIdx >= 0) val = val.substring(0, commentIdx).trim();
        }

        if (!val) {
          // Check if next lines are a list (indented with - )
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            const nextTrimmed = nextLine.trim();
            const nextIndent = nextLine.search(/\S/);

            if (nextTrimmed.startsWith('- ') && nextIndent > indent) {
              // This key has a list value
              const arr = [];
              parent[key] = arr;
              stack.push({ indent: indent, obj: arr });
              i++; continue;
            } else if (nextIndent > indent) {
              // Nested object
              const newObj = {};
              parent[key] = newObj;
              stack.push({ indent: indent, obj: newObj });
              i++; continue;
            } else {
              parent[key] = null;
            }
          } else {
            parent[key] = null;
          }
        } else if (val === '|' || val === '>') {
          // Multiline string
          let multiline = [];
          i++;
          while (i < lines.length) {
            const ml = lines[i];
            const mlIndent = ml.search(/\S/);
            if (mlIndent <= indent && ml.trim()) break;
            multiline.push(ml.trim());
            i++;
          }
          parent[key] = val === '>' ? multiline.join(' ') : multiline.join('\n');
          continue;
        } else if (val.startsWith('[')) {
          // Inline array
          parent[key] = parseYAMLInlineArray(val);
        } else if (val.startsWith('{')) {
          // Inline object
          parent[key] = parseYAMLInlineObject(val);
        } else {
          parent[key] = parseYAMLValue(val);
        }
      }
      i++;
    }

    return root;
  }

  /**
   * Parse a YAML scalar value
   */
  function parseYAMLValue(val) {
    if (val === 'null' || val === '~' || val === '') return null;
    if (val === 'true' || val === 'yes' || val === 'on') return true;
    if (val === 'false' || val === 'no' || val === 'off') return false;

    // Quoted string
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      return val.slice(1, -1);
    }

    // Number
    if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(val)) {
      return parseFloat(val);
    }

    return val;
  }

  /**
   * Parse an inline YAML array like [1, 2, 3]
   */
  function parseYAMLInlineArray(str) {
    const inner = str.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map(s => parseYAMLValue(s.trim()));
  }

  /**
   * Parse an inline YAML object like {a: 1, b: 2}
   */
  function parseYAMLInlineObject(str) {
    const inner = str.slice(1, -1).trim();
    if (!inner) return {};
    const obj = {};
    inner.split(',').forEach(pair => {
      const idx = pair.indexOf(':');
      if (idx > 0) {
        const key = pair.substring(0, idx).trim();
        const val = pair.substring(idx + 1).trim();
        obj[key] = parseYAMLValue(val);
      }
    });
    return obj;
  }

  /**
   * Parse XML text into a JavaScript object
   */
  function parseXML(text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');

    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      throw new Error(I18N.t('error.invalid.xml') + ': ' + errorNode.textContent.substring(0, 100));
    }

    return xmlNodeToObj(doc.documentElement);
  }

  /**
   * Convert an XML DOM node to a JavaScript object
   */
  function xmlNodeToObj(node) {
    // If it's a text node
    if (node.nodeType === 3) {
      const val = node.textContent.trim();
      if (!val) return null;
      // Try to parse as number or boolean
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (!isNaN(val) && val !== '') return Number(val);
      return val;
    }

    const obj = {};

    // Attributes
    if (node.attributes && node.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        obj['@attributes'][attr.name] = attr.value;
      }
    }

    // Child nodes
    if (node.hasChildNodes()) {
      const children = {};
      let hasElementChildren = false;
      let hasTextContent = false;

      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === 3) {
          const text = child.textContent.trim();
          if (text) hasTextContent = true;
        } else if (child.nodeType === 1) {
          hasElementChildren = true;
          const childName = child.nodeName;
          const childObj = xmlNodeToObj(child);

          if (children[childName] !== undefined) {
            // Multiple children with same name -> array
            if (!Array.isArray(children[childName])) {
              children[childName] = [children[childName]];
            }
            children[childName].push(childObj);
          } else {
            children[childName] = childObj;
          }
        }
      }

      if (hasElementChildren) {
        Object.assign(obj, children);
      } else if (hasTextContent) {
        const text = node.textContent.trim();
        // If only text content and no attributes, return the text directly
        if (Object.keys(obj).length === 0) {
          if (text === 'true') return true;
          if (text === 'false') return false;
          if (!isNaN(text) && text !== '') return Number(text);
          return text;
        }
        obj['#text'] = text;
      }
    }

    // If the node has a tag name, wrap it
    if (node.nodeType === 1 && Object.keys(obj).length > 0) {
      return obj;
    }
    return obj;
  }

  /**
   * Parse CSV text into an array of objects
   * Handles quoted fields, multiline values, different delimiters
   */
  function parseCSV(text) {
    // Detect delimiter
    const firstLine = text.split('\n')[0];
    let delimiter = ',';
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semiCount = (firstLine.match(/;/g) || []).length;

    if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';
    else if (semiCount > commaCount) delimiter = ';';

    const rows = parseCSVRows(text, delimiter);
    if (rows.length < 2) return rows;

    const headers = rows[0];
    const data = [];

    for (let i = 1; i < rows.length; i++) {
      if (rows[i].length === 1 && rows[i][0] === '') continue; // skip empty rows

      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        const val = rows[i][j] !== undefined ? rows[i][j] : '';
        const key = headers[j].trim();
        if (!key) continue;
        obj[key] = parseCSVValue(val);
      }
      data.push(obj);
    }

    return data;
  }

  /**
   * Parse CSV value with type inference
   */
  function parseCSVValue(val) {
    if (val === '' || val == null) return null;
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (!isNaN(val) && val.trim() !== '') return Number(val);
    return val.trim();
  }

  /**
   * Parse CSV text into rows of fields, handling quoted fields and multiline values
   */
  function parseCSVRows(text, delimiter) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    let i = 0;

    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i += 2;
          continue;
        } else if (char === '"') {
          // End of quoted field
          inQuotes = false;
          i++;
          continue;
        } else {
          currentField += char;
          i++;
          continue;
        }
      }

      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      }

      if (char === delimiter) {
        currentRow.push(currentField);
        currentField = '';
        i++;
        continue;
      }

      if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentField);
        currentField = '';
        rows.push(currentRow);
        currentRow = [];
        i += 2;
        continue;
      }

      if (char === '\n' || char === '\r') {
        currentRow.push(currentField);
        currentField = '';
        rows.push(currentRow);
        currentRow = [];
        i++;
        continue;
      }

      currentField += char;
      i++;
    }

    // Handle last field/row
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField);
      rows.push(currentRow);
    }

    return rows;
  }

  /**
   * Basic TOML parser
   * Supports tables, key-value pairs, arrays, strings, numbers, booleans
   */
  function parseTOML(text) {
    const result = {};
    const lines = text.split('\n');
    let currentTable = result;
    let currentPath = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Skip empty lines and comments
      if (!line || line.startsWith('#')) continue;

      // Table header [path.to.table]
      const tableMatch = line.match(/^\[([^\[\]]+)\]$/);
      if (tableMatch) {
        const path = tableMatch[1].trim().split('.');
        currentTable = result;
        currentPath = path;

        for (const key of path) {
          if (!currentTable[key]) currentTable[key] = {};
          currentTable = currentTable[key];
        }
        continue;
      }

      // Array of tables [[path.to.table]]
      const arrayTableMatch = line.match(/^\[\[([^\[\]]+)\]\]$/);
      if (arrayTableMatch) {
        const path = arrayTableMatch[1].trim().split('.');
        currentTable = result;
        currentPath = path;

        for (let j = 0; j < path.length - 1; j++) {
          const key = path[j];
          if (!currentTable[key]) currentTable[key] = {};
          currentTable = currentTable[key];
        }

        const lastKey = path[path.length - 1];
        if (!Array.isArray(currentTable[lastKey])) {
          currentTable[lastKey] = [];
        }
        const newItem = {};
        currentTable[lastKey].push(newItem);
        currentTable = newItem;
        continue;
      }

      // Key-value pair
      const kvMatch = line.match(/^([^\s=]+)\s*=\s*(.*)$/);
      if (kvMatch) {
        const key = kvMatch[1].trim();
        const val = kvMatch[2].trim();
        currentTable[key] = parseTOMLValue(val);
      }
    }

    return result;
  }

  /**
   * Parse a TOML value
   */
  function parseTOMLValue(val) {
    // String
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      return val.slice(1, -1);
    }
    // Triple-quoted string
    if (val.startsWith('"""') || val.startsWith("'''")) {
      const quote = val.substring(0, 3);
      return val.slice(3, -3);
    }
    // Multi-line literal string
    if (val.startsWith('"""')) {
      return val.slice(3, -3);
    }

    // Array
    if (val.startsWith('[')) {
      return parseTOMLArray(val);
    }

    // Inline table
    if (val.startsWith('{')) {
      const inner = val.slice(1, -1).trim();
      const obj = {};
      inner.split(',').forEach(pair => {
        const idx = pair.indexOf('=');
        if (idx > 0) {
          obj[pair.substring(0, idx).trim()] = parseTOMLValue(pair.substring(idx + 1).trim());
        }
      });
      return obj;
    }

    // Boolean
    if (val === 'true') return true;
    if (val === 'false') return false;

    // Null
    if (val === 'nil' || val === 'null') return null;

    // Number (integer)
    if (/^-?\d+$/.test(val)) return parseInt(val, 10);

    // Number (float)
    if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);

    // Number with exponent
    if (/^-?\d+(\.\d+)?[eE][+-]?\d+$/.test(val)) return parseFloat(val);

    // Hex number
    if (/^0x[0-9a-fA-F]+$/.test(val)) return parseInt(val, 16);

    // Date/time (return as string)
    if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val;

    return val;
  }

  /**
   * Parse a TOML array
   */
  function parseTOMLArray(str) {
    const inner = str.slice(1, -1).trim();
    if (!inner) return [];
    const items = [];
    let current = '';
    let depth = 0;
    let inStr = false;
    let strChar = '';

    for (let i = 0; i < inner.length; i++) {
      const c = inner[i];
      if (inStr) {
        current += c;
        if (c === strChar) inStr = false;
        continue;
      }
      if (c === '"' || c === "'") {
        inStr = true;
        strChar = c;
        current += c;
        continue;
      }
      if (c === '[') { depth++; current += c; continue; }
      if (c === ']') { depth--; current += c; continue; }
      if (c === ',' && depth === 0) {
        items.push(parseTOMLValue(current.trim()));
        current = '';
        continue;
      }
      current += c;
    }
    if (current.trim()) items.push(parseTOMLValue(current.trim()));
    return items;
  }

  /**
   * Validate data and return validation result
   * @param {string} text
   * @param {string} [format]
   * @returns {{ valid: boolean, error: string|null, stats: object }}
   */
  function validate(text, format) {
    const result = parse(text, format);
    if (result.error) {
      return { valid: false, error: result.error, stats: null };
    }
    return {
      valid: true,
      error: null,
      stats: computeStats(result.data)
    };
  }

  /**
   * Compute statistics about parsed data
   */
  function computeStats(data, depth) {
    depth = depth || 0;
    const stats = { keys: 0, depth: depth, size: 0, type: getType(data) };

    if (data === null || data === undefined) {
      stats.size = 4; // null
      return stats;
    }

    if (typeof data === 'string') {
      stats.size = data.length * 2; // rough UTF-16 size
      return stats;
    }

    if (typeof data === 'number' || typeof data === 'boolean') {
      stats.size = 8;
      return stats;
    }

    if (Array.isArray(data)) {
      stats.keys = data.length;
      stats.size = 8; // array overhead
      for (const item of data) {
        const child = computeStats(item, depth + 1);
        stats.keys += child.keys;
        stats.size += child.size;
        if (child.depth > stats.depth) stats.depth = child.depth;
      }
      return stats;
    }

    if (typeof data === 'object') {
      const keys = Object.keys(data);
      stats.keys = keys.length;
      stats.size = 8; // object overhead
      for (const key of keys) {
        stats.size += key.length * 2; // key size
        const child = computeStats(data[key], depth + 1);
        stats.keys += child.keys;
        stats.size += child.size;
        if (child.depth > stats.depth) stats.depth = child.depth;
      }
      return stats;
    }

    return stats;
  }

  /**
   * Get the type name of a value
   */
  function getType(val) {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  }

  return { parse, detectFormat, validate, computeStats, getType };
})();
