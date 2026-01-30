import React from 'react';
import { Terminal, FileJson } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 shadow-lg shadow-primary-500/20">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Shell2JSON
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-medium text-slate-400 border border-slate-700">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">Raw Script to JSON String Converter</p>
          </div>
        </div>
        
        <a 
          href="#" 
          className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <FileJson className="w-4 h-4" />
          <span>Docs</span>
        </a>
      </div>
    </header>
  );
};

export default Header;