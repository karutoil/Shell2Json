import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  Copy, 
  Check, 
  Trash2, 
  Settings2,
  RefreshCw,
  Code2
} from 'lucide-react';

enum Mode {
  ENCODE = 'ENCODE',
  DECODE = 'DECODE'
}

const ShellConverter: React.FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.ENCODE);
  const [input, setInput] = useState<string>('');
  const [keyName, setKeyName] = useState<string>('installScript');
  const [addTrailingComma, setAddTrailingComma] = useState<boolean>(true);
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Default example script for initial state
  useEffect(() => {
    const exampleScript = `#!/bin/sh
set -e

echo '[Catalyst] Starting installation...'
mkdir -p {{SERVER_DIR}}
cd {{SERVER_DIR}}

# Download Logic
if command -v wget >/dev/null 2>&1; then
  wget -q -O server.jar https://example.com/server.jar
fi

echo 'Installation complete!'`;
    setInput(exampleScript);
  }, []);

  const handleEncode = useCallback(() => {
    try {
      if (!input) {
        setOutput('');
        return;
      }
      
      // JSON.stringify adds the surrounding quotes and escapes contents
      const escapedValue = JSON.stringify(input);
      
      // Construct the final key-value pair
      let result = `"${keyName}": ${escapedValue}`;
      if (addTrailingComma) {
        result += ',';
      }
      
      setOutput(result);
      setError(null);
    } catch (err) {
      setError("Failed to encode string.");
    }
  }, [input, keyName, addTrailingComma]);

  const handleDecode = useCallback(() => {
    try {
      if (!input.trim()) {
        setOutput('');
        return;
      }

      let textToParse = input.trim();

      // Remove trailing comma if present
      if (textToParse.endsWith(',')) {
        textToParse = textToParse.slice(0, -1);
      }

      // Check if input is in "key": "value" format
      // Regex looks for: optional quote, key, optional quote, colon, then captures the rest
      const keyPairMatch = textToParse.match(/^\s*"?([^"]+)"?\s*:\s*(.*)/s);
      
      let jsonString = textToParse;
      
      if (keyPairMatch) {
        // If it looks like a key-value pair, try to grab the value part
        // keyPairMatch[1] is the key
        // keyPairMatch[2] is the value
        setKeyName(keyPairMatch[1]); 
        jsonString = keyPairMatch[2];
      }

      // Try to parse the JSON string
      const parsed = JSON.parse(jsonString);
      setOutput(parsed);
      setError(null);
    } catch (err) {
      // Fallback: maybe they pasted just the raw escaped content inside quotes
      try {
        if (input.startsWith('"') && input.endsWith('"')) {
           const parsed = JSON.parse(input);
           setOutput(parsed);
           setError(null);
        } else {
           throw new Error("Invalid JSON");
        }
      } catch (e) {
        setError("Invalid JSON string format. Please ensure input is a valid JSON string or key-value pair.");
        setOutput('');
      }
    }
  }, [input]);

  // Auto-convert whenever dependencies change
  useEffect(() => {
    if (mode === Mode.ENCODE) {
      handleEncode();
    } else {
      handleDecode();
    }
  }, [input, keyName, addTrailingComma, mode, handleEncode, handleDecode]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const toggleMode = () => {
    // When switching modes, swap input and output if valid
    if (output && !error) {
      setInput(output);
      // Mode switch happens, useEffect triggers conversion
    } else {
      setInput('');
      setOutput('');
    }
    setMode(mode === Mode.ENCODE ? Mode.DECODE : Mode.ENCODE);
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
      {/* Input Section */}
      <div className="flex flex-col gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-slate-800 p-1.5 rounded-md text-slate-400">
               {mode === Mode.ENCODE ? <Code2 size={16} /> : <Settings2 size={16} />}
             </div>
             <h2 className="font-semibold text-slate-200">
               {mode === Mode.ENCODE ? 'Input: Raw Shell Script' : 'Input: JSON Line'}
             </h2>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setInput('')}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                title="Clear Input"
             >
                <Trash2 size={16} />
             </button>
          </div>
        </div>

        <textarea 
          className="flex-grow w-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 resize-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-700 leading-relaxed"
          placeholder={mode === Mode.ENCODE ? "#!/bin/sh\n\necho 'Paste your script here...'" : '"key": "escaped string..."'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />

        {/* Configuration Bar */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
           <div className="flex items-center gap-2">
             <label htmlFor="keyName" className="text-xs font-medium text-slate-500 uppercase tracking-wider">JSON Key</label>
             <input 
               id="keyName"
               type="text" 
               value={keyName}
               onChange={(e) => setKeyName(e.target.value)}
               className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-primary-400 focus:border-primary-500 outline-none w-32"
             />
           </div>

           {mode === Mode.ENCODE && (
             <label className="flex items-center gap-2 cursor-pointer group">
               <div className="relative">
                 <input 
                   type="checkbox" 
                   checked={addTrailingComma}
                   onChange={(e) => setAddTrailingComma(e.target.checked)}
                   className="sr-only peer"
                 />
                 <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
               </div>
               <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">Trailing Comma</span>
             </label>
           )}

           <div className="ml-auto">
             <button 
               onClick={toggleMode}
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-all border border-slate-700 hover:border-slate-600"
             >
               <RefreshCw size={12} />
               <span>Switch to {mode === Mode.ENCODE ? 'Decode' : 'Encode'}</span>
             </button>
           </div>
        </div>
      </div>

      {/* Center Action (Mobile Only) */}
      <div className="lg:hidden flex justify-center -my-2 z-10">
        <div className="bg-slate-800 p-2 rounded-full shadow-lg border border-slate-700">
           <ArrowDown className="text-slate-400" size={24} />
        </div>
      </div>

      {/* Output Section */}
      <div className="flex flex-col gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         
         <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-slate-800 p-1.5 rounded-md text-slate-400">
               <Settings2 size={16} />
             </div>
             <h2 className="font-semibold text-slate-200">
                {mode === Mode.ENCODE ? 'Output: JSON Line' : 'Output: Raw Script'}
             </h2>
          </div>
          
          <button 
            onClick={copyToClipboard}
            disabled={!!error || !output}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              copied 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Result'}</span>
          </button>
        </div>

        <div className="relative flex-grow">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-sm">
                <p className="text-red-400 font-medium mb-1">Conversion Error</p>
                <p className="text-xs text-red-300/70">{error}</p>
              </div>
            </div>
          ) : (
            <textarea 
              readOnly
              className="w-full h-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-emerald-400 resize-none focus:outline-none cursor-text leading-relaxed selection:bg-emerald-500/20"
              value={output}
            />
          )}
        </div>

        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 flex justify-between items-center text-xs text-slate-500">
          <span>{output.length} characters</span>
          {mode === Mode.ENCODE && (
            <span className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Ready to paste into JSON
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShellConverter;