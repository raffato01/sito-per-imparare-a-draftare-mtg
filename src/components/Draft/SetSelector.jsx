import React, { useState } from 'react';
import { PRESET_SETS } from '../../data/presetSets';
import { Users, Sparkles, ArrowRight, RefreshCw, Flame } from 'lucide-react';

export function SetSelector({ onStartDraft, isLoading, errorMessage }) {
  const [selectedSetCode, setSelectedSetCode] = useState('fdn');
  const [playerCount, setPlayerCount] = useState(8);
  const [customSetCode, setCustomSetCode] = useState('');

  const handleStart = () => {
    const setCodeToUse = customSetCode.trim().toLowerCase() || selectedSetCode;
    onStartDraft({ setCode: setCodeToUse, playerCount });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
          Configura il tuo <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">Tavolo da Draft</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Scegli un'espansione e il numero di giocatori al tavolo (8 o 6). La nostra IA simulerà gli altri giocatori!
        </p>
      </div>

      {/* Error Banner if API fails */}
      {errorMessage && (
        <div className="p-4 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-rose-200 text-sm text-center">
          {errorMessage}
        </div>
      )}

      {/* Preset Sets Grid */}
      <div className="space-y-4">
        <label className="text-xs font-black tracking-wider text-slate-400 uppercase block text-center">
          1. Seleziona l'Espansione MTG
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PRESET_SETS.map((set) => {
            const isSelected = selectedSetCode === set.code && !customSetCode;
            return (
              <div
                key={set.code}
                onClick={() => {
                  setSelectedSetCode(set.code);
                  setCustomSetCode('');
                }}
                className={`group relative cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-3xl">{set.icon}</div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      set.difficulty === 'Principiante'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : set.difficulty === 'Medio'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {set.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-100 text-base group-hover:text-amber-400 transition-colors">
                    {set.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {set.description}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 flex justify-between">
                  <span>Anno: {set.releaseYear}</span>
                  <span className="uppercase font-bold text-amber-500">[{set.code}]</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Scryfall Code Option (Including Upcoming / Spoiler Sets!) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
          <Flame size={18} className="animate-pulse text-amber-500" />
          <span>SET IN USCITA & SPOILER SEASON 🚀</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Puoi draftare anche i set non ancora usciti!</strong> Non appena le carte vengono svelate dalla Wizards of the Coast, Scryfall le inserisce nei suoi database. Inserisci il codice a 3 o 4 lettere del set (es. <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">fin</code> per Final Fantasy, <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">tds</code> per Tarkir Dragonstorm, <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">woe</code>, <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">mkm</code>):
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <input
            type="text"
            maxLength={6}
            placeholder="es. fin, tds, woe..."
            value={customSetCode}
            onChange={(e) => setCustomSetCode(e.target.value)}
            className="w-full sm:w-48 uppercase font-mono text-center bg-slate-950 border border-slate-700 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          {customSetCode && (
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
              Set personalizzato attivo: [{customSetCode.toUpperCase()}]
            </span>
          )}
        </div>
      </div>

      {/* Table Player Count Selection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <label className="text-xs font-black tracking-wider text-slate-400 uppercase block text-center">
          2. Scegli le Dimensioni del Tavolo
        </label>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <button
            onClick={() => setPlayerCount(8)}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              playerCount === 8
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={24} />
            <span className="font-extrabold text-base">Tavolo da 8</span>
            <span className="text-[10px] text-slate-400">Standard MTG (Tu + 7 Bot)</span>
          </button>

          <button
            onClick={() => setPlayerCount(6)}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              playerCount === 6
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={24} />
            <span className="font-extrabold text-base">Tavolo da 6</span>
            <span className="text-[10px] text-slate-400">Partita Veloce (Tu + 5 Bot)</span>
          </button>
        </div>
      </div>

      {/* Launch Draft Button */}
      <div className="text-center pt-2">
        <button
          onClick={handleStart}
          disabled={isLoading}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-lg shadow-2xl shadow-amber-500/25 flex items-center justify-center gap-3 mx-auto transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin" size={22} />
              <span>Preparazione Bustine...</span>
            </>
          ) : (
            <>
              <span>APRI LE BUSTINE E INIZIA IL DRAFT</span>
              <ArrowRight size={22} />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
