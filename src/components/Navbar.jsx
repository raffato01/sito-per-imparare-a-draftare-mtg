import React from 'react';
import { BookOpen, Sparkles, Layers, HelpCircle } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, selectedSet, coachMode, setCoachMode }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('academy')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl font-black bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">MTG</span>
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-slate-100 group-hover:text-amber-400 transition-colors flex items-center gap-2">
              Draft Academy <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">IT</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Impara a draftare su Magic: The Gathering</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('academy')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'academy'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen size={16} />
            <span>Guida Draft</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'simulator'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles size={16} />
            <span>Simulatore Draft</span>
          </button>

          <button
            onClick={() => setActiveTab('deckbuilder')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'deckbuilder'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers size={16} />
            <span>Deck Builder</span>
          </button>
        </nav>

        {/* Coach Mode Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCoachMode(!coachMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              coachMode
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10 shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Attiva/Disattiva i consigli di pick in tempo reale"
          >
            <HelpCircle size={14} className={coachMode ? 'animate-bounce text-emerald-400' : ''} />
            <span className="hidden md:inline">Coach Assistant:</span>
            <span>{coachMode ? 'ATTIVO 💡' : 'OFF'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
