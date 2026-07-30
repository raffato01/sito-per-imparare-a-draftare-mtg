import React from 'react';
import { BookOpen, Sparkles, Layers, Users, Swords, HelpCircle, Globe } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export function Navbar({ activeTab, setActiveTab, coachMode, setCoachMode, lang = 'it', setLang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.it;

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
              {t.appTitle} <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30 uppercase">{lang}</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('academy')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'academy'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen size={16} />
            <span>{t.navAcademy}</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'simulator'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles size={16} />
            <span>{t.navSolo}</span>
          </button>

          <button
            onClick={() => setActiveTab('multiplayer')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'multiplayer'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Users size={16} />
            <span>{t.navMultiplayer}</span>
          </button>

          <button
            onClick={() => setActiveTab('deckbuilder')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'deckbuilder'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers size={16} />
            <span>{t.navDeckBuilder}</span>
          </button>

          <button
            onClick={() => setActiveTab('match')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'match'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Swords size={16} />
            <span>{t.navMatch}</span>
          </button>
        </nav>

        {/* Controls: Language Switcher & Coach Mode */}
        <div className="flex items-center gap-2">
          
          {/* Language Toggle Button */}
          <button
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 font-extrabold text-xs flex items-center gap-1.5 transition-all"
            title="Switch Language / Cambia Lingua"
          >
            <Globe size={14} className="text-amber-400" />
            <span className="uppercase">{lang === 'it' ? '🇮🇹 IT' : '🇬🇧 EN'}</span>
          </button>

          {/* Coach Mode Toggle */}
          <button
            onClick={() => setCoachMode(!coachMode)}
            className={`hidden md:flex px-3 py-1.5 rounded-xl text-xs font-bold items-center gap-1.5 transition-all border ${
              coachMode
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10 shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle size={14} className={coachMode ? 'animate-bounce text-emerald-400' : ''} />
            <span>Coach: {coachMode ? t.active : t.off}</span>
          </button>

        </div>

      </div>
    </header>
  );
}
