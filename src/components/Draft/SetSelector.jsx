import React, { useState } from 'react';
import { PRESET_SETS } from '../../data/presetSets';
import { TRANSLATIONS } from '../../data/translations';
import { Users, Flame, ArrowRight, RefreshCw, Bot, ShieldAlert, Sparkles } from 'lucide-react';

export function SetSelector({ onStartDraft, isLoading, errorMessage, lang = 'it' }) {
  const [selectedSetCode, setSelectedSetCode] = useState('fdn');
  const [playerCount, setPlayerCount] = useState(8);
  const [difficulty, setDifficulty] = useState('normal'); // 'easy', 'normal', 'hard'
  const [customSetCode, setCustomSetCode] = useState('');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.it;

  const handleStart = () => {
    const setCodeToUse = customSetCode.trim().toLowerCase() || selectedSetCode;
    onStartDraft({ setCode: setCodeToUse, playerCount, difficulty });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
          {t.selectSetTitle}
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          {t.selectSetDesc}
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-rose-200 text-sm text-center">
          {errorMessage}
        </div>
      )}

      {/* Step 1: Preset Sets Grid */}
      <div className="space-y-4">
        <label className="text-xs font-black tracking-wider text-slate-400 uppercase block text-center">
          {t.step1Set}
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
                  <span>Year: {set.releaseYear}</span>
                  <span className="uppercase font-bold text-amber-500">[{set.code}]</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Bot AI Difficulty Selection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <label className="text-xs font-black tracking-wider text-slate-400 uppercase block text-center flex items-center justify-center gap-2">
          <Bot size={16} className="text-amber-400" />
          <span>{t.stepAiDiff}</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div
            onClick={() => setDifficulty('easy')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-1.5 ${
              difficulty === 'easy'
                ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-white">
              <span>{t.diffEasy}</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.diffEasyDesc}
            </p>
          </div>

          <div
            onClick={() => setDifficulty('normal')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-1.5 ${
              difficulty === 'normal'
                ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-white">
              <span>{t.diffNormal}</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.diffNormalDesc}
            </p>
          </div>

          <div
            onClick={() => setDifficulty('hard')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-1.5 ${
              difficulty === 'hard'
                ? 'bg-rose-500/20 border-rose-500 ring-2 ring-rose-500/30 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-white">
              <span>{t.diffHard}</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.diffHardDesc}
            </p>
          </div>

        </div>
      </div>

      {/* Custom Scryfall Code Option */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
          <Flame size={18} className="animate-pulse text-amber-500" />
          <span>{t.customSetTitle}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {t.customSetDesc}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <input
            type="text"
            maxLength={6}
            placeholder="e.g. fin, tds, woe..."
            value={customSetCode}
            onChange={(e) => setCustomSetCode(e.target.value)}
            className="w-full sm:w-48 uppercase font-mono text-center bg-slate-950 border border-slate-700 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-amber-500"
          />
          {customSetCode && (
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
              Active Set Code: [{customSetCode.toUpperCase()}]
            </span>
          )}
        </div>
      </div>

      {/* Step 3: Table Player Count Selection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <label className="text-xs font-black tracking-wider text-slate-400 uppercase block text-center">
          {t.step2Table}
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
            <span className="font-extrabold text-base">{t.table8}</span>
            <span className="text-[10px] text-slate-400">{t.table8Sub}</span>
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
            <span className="font-extrabold text-base">{t.table6}</span>
            <span className="text-[10px] text-slate-400">{t.table6Sub}</span>
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
              <span>{t.loadingBooster}</span>
            </>
          ) : (
            <>
              <span>{t.btnLaunch}</span>
              <ArrowRight size={22} />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
