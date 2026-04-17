/**
 * AIM MCP — Post-build script.
 * Prepends the MCP stdio guard to dist/index.js after TypeScript compilation.
 */

const fs = require('fs');
const path = require('path');

const distIndex = path.join(__dirname, '..', 'dist', 'index.js');

// Simple ASCII-only guard to avoid encoding issues with mixed UTF-8/UTF-16 files
const GUARD = [
  '// MCP STDIO GUARD - auto-prepended by scripts/postbuild.js',
  '// Redirects non-JSON stdout to stderr to protect JSON-RPC protocol.',
  'console.log   = function() { var a = Array.prototype.slice.call(arguments); process.stderr.write("[LOG] " + a.join(" ") + "\\n"); };',
  'console.warn  = function() { var a = Array.prototype.slice.call(arguments); process.stderr.write("[WARN] " + a.join(" ") + "\\n"); };',
  'console.info  = function() { var a = Array.prototype.slice.call(arguments); process.stderr.write("[INFO] " + a.join(" ") + "\\n"); };',
  'console.debug = function() { var a = Array.prototype.slice.call(arguments); process.stderr.write("[DBG] " + a.join(" ") + "\\n"); };',
  'var _ow = process.stdout.write.bind(process.stdout);',
  'process.stdout.write = function(chunk, enc, cb) {',
  '  var str = typeof chunk === "string" ? chunk : Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);',
  '  var t = str.trim();',
  '  if (t === "" || t[0] === "{" || t[0] === "[") return _ow(chunk, enc, cb);',
  '  process.stderr.write("[STDOUT_REDIRECT] " + str);',
  '  if (typeof enc === "function") enc(); else if (typeof cb === "function") cb();',
  '  return true;',
  '};',
  '',
].join('\n');

// Read as utf8 — tsc outputs UTF-8 by default
let content = fs.readFileSync(distIndex, 'utf8');

// Remove BOM if present
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}

// Remove any existing guard
if (content.includes('MCP STDIO GUARD')) {
  const guardEnd = content.indexOf('"use strict";');
  if (guardEnd > 0) {
    content = content.substring(guardEnd);
  }
}

// Prepend guard
fs.writeFileSync(distIndex, GUARD + content, 'utf8');
process.stderr.write('[postbuild] MCP stdio guard injected into dist/index.js\n');
