import React, { useState } from 'react';
import { BookOpen, Sparkles, Layers, Users, Swords, HelpCircle, Globe, Menu, X } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export function Navbar({ activeTab, setActiveTab, coachMode, setCoachMode, lang = 'it', setLang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.it;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'academy', label: t.navAcademy, icon: BookOpen, color: 'amber' },
    { id: 'simulator', label: t.navSolo, icon: Sparkles, color: 'amber' },
    { id: 'multiplayer', label: t.navMultiplayer, icon: Users, color: 'indigo' },
    { id: 'deckbuilder', label: t.navDeckBuilder, icon: Layers, color: 'amber' },
    { id: 'match', label: t.navMatch, icon: Swords, color: 'rose' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleTabClick('academy')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">MTG</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-100 group-hover:text-amber-400 transition-colors flex items-center gap-2">
              {t.appTitle}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? `bg-${tab.color}-500/20 text-${tab.color}-400 border border-${tab.color}-500/30 shadow-inner`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            className="px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 font-extrabold text-xs flex items-center gap-1 transition-all"
            title="Switch Language"
          >
            <Globe size={13} className="text-amber-400" />
            <span className="uppercase">{lang === 'it' ? '🇮🇹' : '🇬🇧'}</span>
          </button>

          {/* Coach Mode Toggle (desktop only) */}
          <button
            onClick={() => setCoachMode(!coachMode)}
            className={`hidden md:flex px-3 py-1.5 rounded-xl text-xs font-bold items-center gap-1.5 transition-all border ${
              coachMode
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <HelpCircle size={14} />
            <span>Coach: {coachMode ? t.active : t.off}</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-3 space-y-1 animate-fadeIn">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Mobile Coach Toggle */}
          <button
            onClick={() => { setCoachMode(!coachMode); setMobileMenuOpen(false); }}
            className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all border mt-2 ${
              coachMode
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <HelpCircle size={18} />
            <span>Coach: {coachMode ? t.active : t.off}</span>
          </button>
        </div>
      )}
    </header>
  );
}
