/**
 * DataLens-Web - Code Generation Module
 * Generate TypeScript interfaces, Go structs, Python dataclasses,
 * JSON Schema, and Rust structs from JSON data
 */
const CodeGen = (() => {
  'use strict';

  /**
   * Generate code from parsed data
   * @param {*} data - Parsed JSON data
   * @param {string} language - 'typescript', 'go', 'python', 'schema', 'rust'
   * @param {string} [rootName] - Name for the root type
   * @returns {string}
   */
  function generate(data, language, rootName) {
    rootName = rootName || 'Root';

    switch (language) {
      case 'typescript': return generateTypeScript(data, rootName);
      case 'go':         return generateGo(data, rootName);
      case 'python':     return generatePython(data, rootName);
      case 'schema':     return generateSchema(data, rootName);
      case 'rust':       return generateRust(data, rootName);
      default:           return generateTypeScript(data, rootName);
    }
  }

  /**
   * Infer type information from data
   */
  function inferTypes(data, name) {
    const type = Parser.getType(data);

    if (type === 'string')  return { name, type: 'string' };
    if (type === 'number')  return { name, type: 'number' };
    if (type === 'boolean') return { name, type: 'boolean' };
    if (type === 'null')    return { name, type: 'null' };

    if (type === 'array') {
      if (data.length === 0) {
        return { name, type: 'array', itemType: 'unknown' };
      }
      // Infer item type from first element
      const itemTypes = new Set(data.map(item => Parser.getType(item)));
      if (itemTypes.size === 1) {
        const itemType = data[0];
        const itemInferred = inferTypes(itemType, capitalize(name) + 'Item');
        return { name, type: 'array', itemType: itemInferred };
      }
      return { name, type: 'array', itemType: 'unknown' };
    }

    if (type === 'object') {
      const properties = {};
      const required = [];

      Object.entries(data).forEach(([key, val]) => {
        const propType = inferTypes(val, toPascalCase(key));
        properties[key] = propType;
        if (val !== null && val !== undefined) {
          required.push(key);
        }
      });

      return { name, type: 'object', properties, required };
    }

    return { name, type: 'unknown' };
  }

  /* ============================================================
   * TYPESCRIPT
   * ============================================================ */
  function generateTypeScript(data, rootName) {
    const typeInfo = inferTypes(data, rootName);
    const lines = [];
    const visited = new Set();

    function emitInterface(info) {
      if (visited.has(info.name) || info.type !== 'object' || !info.properties) return;
      visited.add(info.name);

      lines.push('export interface ' + info.name + ' {');
      Object.entries(info.properties).forEach(([key, prop]) => {
        const optional = info.required && info.required.includes(key) ? '' : '?';
        let typeStr = tsType(prop);
        lines.push('  ' + key + optional + ': ' + typeStr + ';');
        if (prop.type === 'object' && prop.properties) {
          emitInterface(prop);
        }
        if (prop.type === 'array' && prop.itemType && prop.itemType.type === 'object') {
          emitInterface(prop.itemType);
        }
      });
      lines.push('}');
      lines.push('');
    }

    emitInterface(typeInfo);
    return lines.join('\n');
  }

  function tsType(info) {
    switch (info.type) {
      case 'string':  return 'string';
      case 'number':  return 'number';
      case 'boolean': return 'boolean';
      case 'null':    return 'null';
      case 'array':
        if (info.itemType) {
          if (info.itemType.type === 'object') return info.itemType.name + '[]';
          return tsType(info.itemType) + '[]';
        }
        return 'any[]';
      case 'object':  return info.name;
      default:        return 'any';
    }
  }

  /* ============================================================
   * GO
   * ============================================================ */
  function generateGo(data, rootName) {
    const typeInfo = inferTypes(data, rootName);
    const lines = ['package main', ''];
    const visited = new Set();

    function emitStruct(info) {
      if (visited.has(info.name) || info.type !== 'object' || !info.properties) return;
      visited.add(info.name);

      lines.push('type ' + info.name + ' struct {');
      Object.entries(info.properties).forEach(([key, prop]) => {
        const goField = capitalize(key);
        let typeStr = goType(prop);
        const jsonTag = '`json:"' + key + '"`';
        lines.push('\t' + goField + ' ' + typeStr + ' ' + jsonTag);
        if (prop.type === 'object' && prop.properties) {
          emitStruct(prop);
        }
        if (prop.type === 'array' && prop.itemType && prop.itemType.type === 'object') {
          emitStruct(prop.itemType);
        }
      });
      lines.push('}');
      lines.push('');
    }

    emitStruct(typeInfo);
    return lines.join('\n');
  }

  function goType(info) {
    switch (info.type) {
      case 'string':  return 'string';
      case 'number':  return 'float64';
      case 'boolean': return 'bool';
      case 'null':    return 'interface{}';
      case 'array':
        if (info.itemType) {
          if (info.itemType.type === 'object') return '[]' + info.itemType.name;
          return '[]' + goType(info.itemType);
        }
        return '[]interface{}';
      case 'object':  return info.name;
      default:        return 'interface{}';
    }
  }

  /* ============================================================
   * PYTHON
   * ============================================================ */
  function generatePython(data, rootName) {
    const typeInfo = inferTypes(data, rootName);
    const lines = ['from dataclasses import dataclass', 'from typing import List, Optional, Any', ''];
    const visited = new Set();

    function emitDataclass(info) {
      if (visited.has(info.name) || info.type !== 'object' || !info.properties) return;
      visited.add(info.name);

      lines.push('@dataclass');
      lines.push('class ' + info.name + ':');
      const entries = Object.entries(info.properties);
      if (entries.length === 0) {
        lines.push('    pass');
      }
      entries.forEach(([key, prop]) => {
        const pyField = toSnakeCase(key);
        let typeStr = pyType(prop);
        const isOptional = info.required && info.required.includes(key);
        if (isOptional) typeStr = 'Optional[' + typeStr + '] = None';
        lines.push('    ' + pyField + ': ' + typeStr);
        if (prop.type === 'object' && prop.properties) {
          emitDataclass(prop);
        }
        if (prop.type === 'array' && prop.itemType && prop.itemType.type === 'object') {
          emitDataclass(prop.itemType);
        }
      });
      lines.push('');
    }

    emitDataclass(typeInfo);
    return lines.join('\n');
  }

  function pyType(info) {
    switch (info.type) {
      case 'string':  return 'str';
      case 'number':  return 'float';
      case 'boolean': return 'bool';
      case 'null':    return 'None';
      case 'array':
        if (info.itemType) {
          if (info.itemType.type === 'object') return 'List[' + info.itemType.name + ']';
          return 'List[' + pyType(info.itemType) + ']';
        }
        return 'List[Any]';
      case 'object':  return info.name;
      default:        return 'Any';
    }
  }

  /* ============================================================
   * JSON SCHEMA
   * ============================================================ */
  function generateSchema(data, rootName) {
    const typeInfo = inferTypes(data, rootName);
    const schema = buildSchema(typeInfo);
    schema['$schema'] = 'http://json-schema.org/draft-07/schema#';
    schema['title'] = rootName;
    return JSON.stringify(schema, null, 2);
  }

  function buildSchema(info) {
    switch (info.type) {
      case 'string':  return { type: 'string' };
      case 'number':  return { type: 'number' };
      case 'boolean': return { type: 'boolean' };
      case 'null':    return { type: 'null' };
      case 'array':
        if (info.itemType) {
          return { type: 'array', items: buildSchema(info.itemType) };
        }
        return { type: 'array', items: {} };
      case 'object': {
        const schema = { type: 'object' };
        if (info.properties) {
          schema.properties = {};
          Object.entries(info.properties).forEach(([key, prop]) => {
            schema.properties[key] = buildSchema(prop);
          });
          if (info.required && info.required.length > 0) {
            schema.required = info.required;
          }
        }
        return schema;
      }
      default: return {};
    }
  }

  /* ============================================================
   * RUST
   * ============================================================ */
  function generateRust(data, rootName) {
    const typeInfo = inferTypes(data, rootName);
    const lines = ['#![allow(non_snake_case)]', 'use serde::{Deserialize, Serialize};', ''];
    const visited = new Set();

    function emitStruct(info) {
      if (visited.has(info.name) || info.type !== 'object' || !info.properties) return;
      visited.add(info.name);

      lines.push('#[derive(Debug, Clone, Serialize, Deserialize)]');
      lines.push('pub struct ' + info.name + ' {');
      Object.entries(info.properties).forEach(([key, prop]) => {
        const rustField = toSnakeCase(key);
        let typeStr = rustType(prop);
        const rename = key !== rustField ? ' #[serde(rename = "' + key + '")]' : '';
        lines.push('    pub ' + rustField + ': ' + typeStr + ',' + rename);
        if (prop.type === 'object' && prop.properties) {
          emitStruct(prop);
        }
        if (prop.type === 'array' && prop.itemType && prop.itemType.type === 'object') {
          emitStruct(prop.itemType);
        }
      });
      lines.push('}');
      lines.push('');
    }

    emitStruct(typeInfo);
    return lines.join('\n');
  }

  function rustType(info) {
    switch (info.type) {
      case 'string':  return 'String';
      case 'number':  return 'f64';
      case 'boolean': return 'bool';
      case 'null':    return 'Option<serde_json::Value>';
      case 'array':
        if (info.itemType) {
          if (info.itemType.type === 'object') return 'Vec<' + info.itemType.name + '>';
          return 'Vec<' + rustType(info.itemType) + '>';
        }
        return 'Vec<serde_json::Value>';
      case 'object':  return info.name;
      default:        return 'serde_json::Value';
    }
  }

  /* ============================================================
   * UTILITY FUNCTIONS
   * ============================================================ */

  function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function toPascalCase(str) {
    return str.split(/[_\-\s]+/).map(s => capitalize(s)).join('');
  }

  function toSnakeCase(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  }

  return { generate, inferTypes };
})();
