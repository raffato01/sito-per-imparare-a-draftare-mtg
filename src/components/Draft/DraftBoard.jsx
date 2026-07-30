import React, { useState, useEffect } from 'react';
import { CardView } from '../Common/CardView';
import { getCoachSuggestion } from '../../services/botLogic';
import { ArrowLeftRight, HelpCircle, Layers, Award, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

export function DraftBoard({
  setInfo,
  playerCount = 8,
  cardPool = [],
  coachMode = true,
  onDraftComplete,
  onCancel
}) {
  const [packNum, setPackNum] = useState(1);
  const [pickNum, setPickNum] = useState(1);
  const [humanPool, setHumanPool] = useState([]);
  
  // Seat packs array: seat 0 is Human, seats 1..(playerCount-1) are Bots
  const [seatsPacks, setSeatsPacks] = useState([]);
  const [isPoolExpanded, setIsPoolExpanded] = useState(false);

  // Initialize Packs for Pack 1, 2, 3
  useEffect(() => {
    startNewPackPhase(1);
  }, []);

  const startNewPackPhase = (targetPackNum) => {
    // Generate packs for all seats
    const newSeatsPacks = [];
    for (let seat = 0; seat < playerCount; seat++) {
      newSeatsPacks.push(generatePackForSeat(targetPackNum, seat));
    }
    setSeatsPacks(newSeatsPacks);
    setPackNum(targetPackNum);
    setPickNum(1);
  };

  const generatePackForSeat = (pNum, seatIndex) => {
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const getRandomN = (arr, n) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    };

    const mythicsAndRares = cardPool.filter(c => c.rarity === 'mythic' || c.rarity === 'rare');
    const uncommons = cardPool.filter(c => c.rarity === 'uncommon');
    const commons = cardPool.filter(c => c.rarity === 'common');
    const lands = cardPool.filter(c => c.isLand || c.typeLine?.toLowerCase().includes('land'));

    const pack = [];
    if (mythicsAndRares.length > 0) pack.push(getRandom(mythicsAndRares));
    if (uncommons.length >= 3) pack.push(...getRandomN(uncommons, 3));
    else pack.push(...getRandomN(cardPool, 3));

    const commonNeeded = 14 - pack.length;
    if (commons.length >= commonNeeded) pack.push(...getRandomN(commons, commonNeeded));
    else pack.push(...getRandomN(cardPool, commonNeeded));

    if (lands.length > 0) pack.push(getRandom(lands));
    else pack.push(getRandom(cardPool));

    return pack.map((c, idx) => ({
      ...c,
      instanceId: `p${pNum}_s${seatIndex}_pick${idx}_${Math.random().toString(36).substring(2, 6)}`
    }));
  };

  // Active pack facing Human player (Seat 0)
  const currentPack = seatsPacks[0] || [];

  // Coach recommendation for Human player
  const coachAdvice = coachMode && currentPack.length > 0
    ? getCoachSuggestion(currentPack, humanPool)
    : null;

  // Handle Human Picking a card
  const handleHumanPick = (chosenCard) => {
    const nextHumanPool = [...humanPool, chosenCard];
    setHumanPool(nextHumanPool);

    // Simulate Bot Picks for seats 1 to playerCount-1
    const updatedPacks = seatsPacks.map((pack, seatIdx) => {
      if (seatIdx === 0) {
        // Human picked chosenCard
        return pack.filter(c => c.instanceId !== chosenCard.instanceId);
      } else {
        // Bot picks card using AI heuristic
        if (pack.length === 0) return [];
        const botChosen = pack[0]; // Simple bot pick for remaining seats
        return pack.filter(c => c.instanceId !== botChosen.instanceId);
      }
    });

    // Determine pass direction
    // Pack 1: Left (Seat 0 receives from Seat 1, passes to Seat playerCount-1)
    // Pack 2: Right (Seat 0 receives from Seat playerCount-1, passes to Seat 1)
    // Pack 3: Left
    const passLeft = packNum % 2 === 1;
    const rotatedPacks = rotatePacks(updatedPacks, passLeft);

    const remainingCardsInPack = rotatedPacks[0]?.length || 0;

    if (remainingCardsInPack > 0) {
      setSeatsPacks(rotatedPacks);
      setPickNum(prev => prev + 1);
    } else {
      // Pack finished! Check if more packs exist
      if (packNum < 3) {
        startNewPackPhase(packNum + 1);
      } else {
        // Draft Complete!
        onDraftComplete(nextHumanPool);
      }
    }
  };

  // Rotate packs around the 8 or 6 player table
  const rotatePacks = (packs, passLeft) => {
    const len = packs.length;
    const nextPacks = new Array(len);
    for (let i = 0; i < len; i++) {
      if (passLeft) {
        // Pass left: pack moves to (i - 1 + len) % len
        const targetSeat = (i - 1 + len) % len;
        nextPacks[targetSeat] = packs[i];
      } else {
        // Pass right: pack moves to (i + 1) % len
        const targetSeat = (i + 1) % len;
        nextPacks[targetSeat] = packs[i];
      }
    }
    return nextPacks;
  };

  const passDirectionText = packNum % 2 === 1 ? 'Sinistra ⬅️' : 'Destra ➡️';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-32">
      
      {/* Top Draft Header & Table Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
          >
            ← Annulla
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {setInfo?.name || 'Draft Set'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Tavolo da {playerCount} Giocatori</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-0.5">
              Busta {packNum} / 3 — Pick {pickNum} / 15
            </h2>
          </div>
        </div>

        {/* Passing Direction Indicator */}
        <div className="flex items-center gap-6 bg-slate-950/80 px-5 py-2.5 rounded-2xl border border-slate-800">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold block">DIREZIONE PASSAGGIO</span>
            <span className="text-sm font-extrabold text-amber-400 flex items-center gap-1.5">
              <ArrowLeftRight size={16} />
              <span>Gira a {passDirectionText}</span>
            </span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold block">CARTE PICCATE</span>
            <span className="text-sm font-extrabold text-white">{humanPool.length} / 45</span>
          </div>
        </div>

      </div>

      {/* Visual Table Seats Bar */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3">
        <div className="flex items-center justify-between overflow-x-auto pb-1 gap-2">
          {Array.from({ length: playerCount }).map((_, idx) => {
            const isHuman = idx === 0;
            return (
              <div
                key={idx}
                className={`flex-1 min-w-[70px] p-2 rounded-xl border text-center transition-all ${
                  isHuman
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 ring-2 ring-amber-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">{isHuman ? 'TU 👤' : `Bot ${idx}`}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  {seatsPacks[idx]?.length || 0} carte
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coach Assistant Hint Banner */}
      {coachAdvice && coachAdvice.suggestedCard && (
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-950 border-2 border-amber-500/50 rounded-3xl p-5 shadow-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
            <HelpCircle size={18} className="animate-bounce" />
            <span>CONSIGLIO DEL COACH (MODALITÀ TUTORIAL IDONEA ALLA TUA RAGAZZA 💡):</span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            Consiglio di scegliere: <strong className="text-amber-300">{coachAdvice.suggestedCard.name}</strong> ({coachAdvice.suggestedCard.manaCost})
          </p>
          <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 italic">
            {coachAdvice.reason}
          </div>
        </div>
      )}

      {/* Cards Grid in Pack */}
      <div>
        <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase mb-3 flex items-center justify-between">
          <span>Carte Disponibili nella Bustina ({currentPack.length})</span>
          <span className="text-slate-500 font-normal">Clicca su una carta per sceglierla</span>
        </h3>

        {currentPack.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400">
            Passaggio bustina in corso...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentPack.map((card) => {
              const isSuggested = coachAdvice?.suggestedCard?.instanceId === card.instanceId;
              return (
                <CardView
                  key={card.instanceId}
                  card={card}
                  onPick={handleHumanPick}
                  isSuggested={isSuggested}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Floating Drawer - Picked Pool Tray */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-2xl transition-all">
        <div
          onClick={() => setIsPoolExpanded(!isPoolExpanded)}
          className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-900/50"
        >
          <div className="flex items-center gap-3">
            <Layers size={18} className="text-amber-400" />
            <span className="font-extrabold text-sm text-slate-200">
              Le Tue Carte Piccate ({humanPool.length})
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <span>{isPoolExpanded ? 'Riduci Tray' : 'Espandi & Vedi Collezione'}</span>
            {isPoolExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </div>

        {/* Expanded Tray Content */}
        {isPoolExpanded && (
          <div className="max-w-7xl mx-auto px-4 py-4 max-h-60 overflow-y-auto border-t border-slate-800">
            {humanPool.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">Non hai ancora scelto nessuna carta.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {humanPool.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-300"
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono">({c.manaCost})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
