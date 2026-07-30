import React, { useState, useEffect } from 'react';
import { BASIC_LANDS } from '../../data/presetSets';
import { buildSmartDeck, analyzeUserDeck } from '../../services/deckCoachLogic';
import confetti from 'canvas-confetti';
import { Sparkles, Layers, Plus, Minus, Download, ClipboardCopy, Check, CheckCircle2, Bot, Wand2 } from 'lucide-react';

export function DeckBuilder({ draftedPool = [], onResetDraft, lang = 'it' }) {
  const [maindeck, setMaindeck] = useState([]);
  const [sideboard, setSideboard] = useState([]);
  const [landCounts, setLandCounts] = useState({ W: 0, U: 0, B: 0, R: 0, G: 0 });
  const [copiedArena, setCopiedArena] = useState(false);
  const [coachAnalysis, setCoachAnalysis] = useState(null);

  const isIT = lang === 'it';

  useEffect(() => {
    if (draftedPool && draftedPool.length > 0) {
      setSideboard([...draftedPool]);
      setMaindeck([]);
    }
  }, [draftedPool]);

  // Update live coach evaluation when deck changes
  useEffect(() => {
    if (maindeck.length > 0) {
      const evaluation = analyzeUserDeck(maindeck, landCounts, lang);
      setCoachAnalysis(evaluation);
    } else {
      setCoachAnalysis(null);
    }
  }, [maindeck, landCounts, lang]);

  // Smart Auto-Build Deck with Coach Assistant
  const handleAutoBuildDeck = () => {
    if (!draftedPool || draftedPool.length === 0) return;
    const result = buildSmartDeck(draftedPool, lang);
    setMaindeck(result.maindeckSpells);
    setSideboard(result.sideboardSpells);
    setLandCounts(result.landCounts);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
  };

  const moveToMaindeck = (card) => {
    setSideboard(prev => prev.filter(c => c.instanceId !== card.instanceId));
    setMaindeck(prev => [...prev, card]);
  };

  const moveToSideboard = (card) => {
    setMaindeck(prev => prev.filter(c => c.instanceId !== card.instanceId));
    setSideboard(prev => [...prev, card]);
  };

  const autoAddLands = () => {
    const spellCount = maindeck.length;
    const landsNeeded = Math.max(0, 40 - spellCount);
    if (landsNeeded === 0) return;

    const colorSymbols = { W: 0, U: 0, B: 0, R: 0, G: 0 };
    maindeck.forEach(card => {
      if (card.colors) {
        card.colors.forEach(c => {
          if (colorSymbols[c] !== undefined) colorSymbols[c]++;
        });
      }
    });

    const totalSymbols = Object.values(colorSymbols).reduce((a, b) => a + b, 0);
    const newLands = { W: 0, U: 0, B: 0, R: 0, G: 0 };

    if (totalSymbols === 0) {
      newLands.W = Math.ceil(landsNeeded / 2);
      newLands.U = landsNeeded - newLands.W;
    } else {
      let allocated = 0;
      const sorted = Object.entries(colorSymbols).sort((a, b) => b[1] - a[1]);
      sorted.forEach(([col, count]) => {
        if (count > 0 && allocated < landsNeeded) {
          const share = Math.round((count / totalSymbols) * landsNeeded);
          newLands[col] = share;
          allocated += share;
        }
      });
      const diff = landsNeeded - Object.values(newLands).reduce((a, b) => a + b, 0);
      if (diff !== 0 && sorted[0]) {
        newLands[sorted[0][0]] = Math.max(0, newLands[sorted[0][0]] + diff);
      }
    }

    setLandCounts(newLands);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  const updateLandCount = (color, delta) => {
    setLandCounts(prev => ({ ...prev, [color]: Math.max(0, prev[color] + delta) }));
  };

  const totalBasicLands = Object.values(landCounts).reduce((a, b) => a + b, 0);
  const totalDeckCards = maindeck.length + totalBasicLands;
  const creaturesCount = maindeck.filter(c => c.isCreature).length;
  const nonCreaturesCount = maindeck.filter(c => !c.isCreature && !c.isLand).length;

  const curveCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, '6+': 0 };
  maindeck.forEach(c => {
    const cmc = c.cmc || 0;
    if (cmc >= 6) curveCounts['6+']++;
    else curveCounts[cmc]++;
  });
  const maxCurveVal = Math.max(1, ...Object.values(curveCounts));

  // Build Arena-format text
  const buildArenaText = () => {
    let text = '// Deck - MTG Draft Academy\n\n';
    const cardCounts = {};
    maindeck.forEach(c => {
      const key = c.name;
      if (!cardCounts[key]) cardCounts[key] = { qty: 0, setCode: c.setCode || '', num: c.collectorNumber || '' };
      cardCounts[key].qty++;
    });
    Object.entries(cardCounts).forEach(([name, d]) => {
      text += d.setCode && d.num
        ? `${d.qty} ${name} (${d.setCode.toUpperCase()}) ${d.num}\n`
        : `${d.qty} ${name}\n`;
    });

    // Lands
    text += '\n';
    Object.entries(landCounts).forEach(([col, qty]) => {
      if (qty > 0) text += `${qty} ${BASIC_LANDS[col].type}\n`;
    });

    // Sideboard
    if (sideboard.length > 0) {
      text += '\n// Sideboard\n';
      const sideCounts = {};
      sideboard.forEach(c => {
        const key = c.name;
        if (!sideCounts[key]) sideCounts[key] = { qty: 0, setCode: c.setCode || '', num: c.collectorNumber || '' };
        sideCounts[key].qty++;
      });
      Object.entries(sideCounts).forEach(([name, d]) => {
        text += d.setCode && d.num
          ? `${d.qty} ${name} (${d.setCode.toUpperCase()}) ${d.num}\n`
          : `${d.qty} ${name}\n`;
      });
    }
    return text;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(buildArenaText()).then(() => {
      setCopiedArena(true);
      setTimeout(() => setCopiedArena(false), 2500);
    });
  };

  const downloadArenaTxt = () => {
    const blob = new Blob([buildArenaText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mtg_draft_deck.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles size={16} />
              <span>{isIT ? 'Fase Finale — Deckbuilding Assistito' : 'Final Phase — Assisted Deckbuilding'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {isIT ? 'Costruisci il Mazzo da 40 Carte' : 'Build your 40-Card Deck'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isIT
                ? 'Sposta le carte dal Pool al Mazzo, oppure lascia che il Coach crei il mazzo ideale per te!'
                : 'Move cards from Pool to Deck, or let the Coach build the optimal deck for you!'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* SMART AUTO-BUILD COACH BUTTON */}
            <button
              onClick={handleAutoBuildDeck}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
            >
              <Wand2 size={16} />
              <span>{isIT ? '✨ ASSISTENTE COACH: COSTRUISCI MAZZO IDEALE' : '✨ COACH ASSISTANT: BUILD OPTIMAL DECK'}</span>
            </button>

            <button
              onClick={autoAddLands}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 transition-colors active:scale-95"
            >
              <Sparkles size={15} />
              <span>{isIT ? 'CALCOLA TERRE' : 'AUTO LANDS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Arena Export Card */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
          <Download size={16} />
          <span>{isIT ? 'Esporta su MTG Arena' : 'Export to MTG Arena'}</span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
          {isIT
            ? 'Copia la lista e incollala su MTG Arena (Mazzi → Importa), oppure scarica il file .txt.'
            : 'Copy the list and paste into MTG Arena (Decks → Import), or download the .txt file.'}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {copiedArena ? <Check size={15} className="text-emerald-300" /> : <ClipboardCopy size={15} />}
            <span>{copiedArena ? '✅' : (isIT ? 'COPIA PER ARENA' : 'COPY FOR ARENA')}</span>
          </button>
          <button
            onClick={downloadArenaTxt}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-colors active:scale-95"
          >
            <Download size={15} />
            <span>.txt</span>
          </button>
        </div>

        {maindeck.length > 0 && (
          <details className="group">
            <summary className="text-[11px] text-indigo-400 font-bold cursor-pointer hover:text-indigo-300">
              {isIT ? '📋 Anteprima lista Arena...' : '📋 Preview Arena list...'}
            </summary>
            <pre className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] sm:text-[11px] text-slate-300 font-mono max-h-40 overflow-y-auto whitespace-pre-wrap">
              {buildArenaText()}
            </pre>
          </details>
        )}
      </div>

      {/* Stats & Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Stats & Coach Analysis */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Deck Counter */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-200">
                {isIT ? 'Carte Mazzo' : 'Deck Cards'}
              </span>
              <span className={`text-lg font-black px-3 py-1 rounded-xl border ${
                totalDeckCards === 40
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-2 ring-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {totalDeckCards}/40
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-bold text-[10px]">{isIT ? 'Creature' : 'Creatures'}</span>
                <span className="text-sm font-black text-amber-400">{creaturesCount}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-bold text-[10px]">{isIT ? 'Magie' : 'Spells'}</span>
                <span className="text-sm font-black text-sky-400">{nonCreaturesCount}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-bold text-[10px]">{isIT ? 'Terre' : 'Lands'}</span>
                <span className="text-sm font-black text-emerald-400">{totalBasicLands}</span>
              </div>
            </div>

            {/* Land Controls */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                {isIT ? 'Terre Base' : 'Basic Lands'}
              </span>
              {Object.entries(BASIC_LANDS).map(([col, landObj]) => (
                <div key={col} className="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                  <span className="font-bold text-slate-300 text-[11px]">{landObj.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateLandCount(col, -1)} className="p-1 rounded bg-slate-800 active:bg-slate-600 text-slate-300">
                      <Minus size={11} />
                    </button>
                    <span className="w-5 text-center font-mono font-bold text-white text-xs">{landCounts[col]}</span>
                    <button onClick={() => updateLandCount(col, 1)} className="p-1 rounded bg-slate-800 active:bg-slate-600 text-slate-300">
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mana Curve */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
            <h4 className="font-extrabold text-xs text-slate-300 uppercase">
              {isIT ? 'Curva di Mana' : 'Mana Curve'}
            </h4>
            <div className="flex items-end justify-between h-24 sm:h-32 pt-3 px-1 bg-slate-950/60 rounded-xl border border-slate-800">
              {Object.entries(curveCounts).map(([cost, count]) => {
                const h = (count / maxCurveVal) * 100;
                return (
                  <div key={cost} className="flex flex-col items-center flex-1 h-full justify-end gap-0.5">
                    <span className="text-[9px] font-mono text-amber-400 font-bold">{count}</span>
                    <div
                      style={{ height: `${Math.max(6, h)}%` }}
                      className="w-full max-w-[20px] bg-gradient-to-t from-amber-600 to-yellow-400 rounded-t-sm transition-all"
                    />
                    <span className="text-[9px] font-mono text-slate-500">{cost}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Coach Evaluation Feedback */}
          {coachAnalysis && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Bot size={18} className="text-amber-400" />
                <span>{isIT ? 'ANALISI COACH MAZZO:' : 'DECK COACH ANALYSIS:'}</span>
              </div>

              <div className="space-y-2">
                {coachAnalysis.tips.map((tip, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] leading-relaxed text-slate-200">
                    {tip.text}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right: Card Lists */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Maindeck */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Layers size={16} className="text-amber-400" />
                <span>{isIT ? `Mazzo (${maindeck.length})` : `Deck (${maindeck.length})`}</span>
              </h3>
              <span className="text-[10px] text-slate-500">{isIT ? 'Tap per rimuovere' : 'Tap to remove'}</span>
            </div>

            {maindeck.length === 0 ? (
              <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-xl text-xs">
                {isIT ? 'Mazzo vuoto. Clicca su "Costruisci Mazzo Ideale" o aggiungi carte dal Pool!' : 'Empty deck. Click "Build Optimal Deck" or add cards from Pool!'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
                {maindeck.map(card => (
                  <div
                    key={card.instanceId}
                    onClick={() => moveToSideboard(card)}
                    className="group cursor-pointer p-2 bg-slate-950 hover:bg-slate-900 active:bg-slate-800 border border-slate-800 hover:border-rose-500/50 rounded-lg transition-all flex items-center justify-between text-xs"
                  >
                    <div className="truncate min-w-0">
                      <span className="font-bold text-slate-200 group-hover:text-rose-400 block truncate text-[11px]">{card.name}</span>
                      <span className="text-[9px] text-slate-500 block truncate">{card.typeLine?.split('—')[0]}</span>
                    </div>
                    <span className="text-amber-400 font-mono text-[10px] font-bold ml-1 shrink-0">{card.manaCost}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sideboard / Pool */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-sm text-slate-100">
                {isIT ? `Pool (${sideboard.length})` : `Pool (${sideboard.length})`}
              </h3>
              <span className="text-[10px] text-slate-500">{isIT ? 'Tap per aggiungere' : 'Tap to add'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
              {sideboard.map(card => (
                <div
                  key={card.instanceId}
                  onClick={() => moveToMaindeck(card)}
                  className="group cursor-pointer p-2 bg-slate-950/80 hover:bg-slate-900 active:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-lg transition-all flex items-center justify-between text-xs opacity-75 hover:opacity-100"
                >
                  <div className="truncate min-w-0">
                    <span className="font-bold text-slate-300 group-hover:text-emerald-400 block truncate text-[11px]">{card.name}</span>
                    <span className="text-[9px] text-slate-500 block truncate">{card.typeLine?.split('—')[0]}</span>
                  </div>
                  <span className="text-amber-400 font-mono text-[10px] font-bold ml-1 shrink-0">{card.manaCost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
