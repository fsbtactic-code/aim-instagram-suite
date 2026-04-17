/**
 * AIM MCP Preload - loaded via NODE_OPTIONS=--require BEFORE any other modules.
 * Protects the JSON-RPC stdio channel from non-JSON stdout pollution.
 * Also writes all stdout to a debug log if AIM_DEBUG_LOG env var is set.
 */

var fs_mod = require('fs');
var path_mod = require('path');

// Open debug log if configured
var debugLog = null;
if (process.env.AIM_DEBUG_LOG) {
  try {
    var logDir = path_mod.dirname(process.env.AIM_DEBUG_LOG);
    if (!fs_mod.existsSync(logDir)) fs_mod.mkdirSync(logDir, { recursive: true });
    debugLog = fs_mod.openSync(process.env.AIM_DEBUG_LOG, 'a');
    fs_mod.writeSync(debugLog, '\n\n=== AIM MCP SESSION START ' + new Date().toISOString() + ' ===\n');
  } catch(e) { debugLog = null; }
}

function dbgLog(label, str) {
  if (debugLog) {
    try { fs_mod.writeSync(debugLog, '[' + label + '] ' + str + (str.endsWith('\n') ? '' : '\n')); } catch(e) {}
  }
}

// 1. Override console methods -> write to debug log but drop from console to avoid MCP errors
console.log   = function() { var s = [].slice.call(arguments).join(' '); dbgLog('CONSOLE.LOG', s); };
console.warn  = function() { var s = [].slice.call(arguments).join(' '); dbgLog('CONSOLE.WARN', s); };
console.info  = function() { var s = [].slice.call(arguments).join(' '); dbgLog('CONSOLE.INFO', s); };
console.debug = function() { var s = [].slice.call(arguments).join(' '); dbgLog('CONSOLE.DEBUG', s); };

// 2. Intercept process.stdout.write - log everything passing through
var _ow = process.stdout.write.bind(process.stdout);
process.stdout.write = function(chunk, enc, cb) {
  var str = typeof chunk === 'string' ? chunk : Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
  var t = str.trim();

  // Log ALL stdout writes (including that which passes through)
  dbgLog('STDOUT_WRITE', JSON.stringify(str.substring(0, 200)));

  // Pass through: empty or valid JSON-RPC
  if (t === '') return _ow(chunk, enc, cb);
  if (t[0] === '{' || t[0] === '[') {
    if (t.includes('"jsonrpc"')) {
      return _ow(chunk, enc, cb);
    }
  }

  // Non-JSON -> drop it (do not pollute stderr which Claude sees as error)
  dbgLog('STDOUT_DROPPED', str);
  if (typeof enc === 'function') enc();
  else if (typeof cb === 'function') cb();
  return true;
};

dbgLog('PRELOAD', 'Preload complete, guards active');
