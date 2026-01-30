import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-500">
          Designed for developers. No AI integration. Pure local string manipulation.
        </p>
        <p className="text-xs text-slate-600 mt-2">
          &copy; {new Date().getFullYear()} Shell2JSON Utility
        </p>
      </div>
    </footer>
  );
};

export default Footer;