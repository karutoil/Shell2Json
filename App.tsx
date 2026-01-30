import React from 'react';
import Header from './components/Header';
import ShellConverter from './components/ShellConverter';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-primary-500/30">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <ShellConverter />
      </main>
      <Footer />
    </div>
  );
};

export default App;