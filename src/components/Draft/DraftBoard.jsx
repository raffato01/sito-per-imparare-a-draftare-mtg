import React, { useState, useEffect } from 'react';
import { CardView } from '../Common/CardView';
import { getCoachSuggestion, botPickCard } from '../../services/botLogic';
import { generateSeededPacks } from '../../services/multiplayerService';
import { TRANSLATIONS } from '../../data/translations';
import { ArrowLeftRight, HelpCircle, Layers, ChevronUp, ChevronDown } from 'lucide-react';

export function DraftBoard({
  setInfo,
  playerCount = 8,
  cardPool = [],
  coachMode = true,
  difficulty = 'normal',
  roomCode = null,
  seatIndex = 0,
  onDraftComplete,
  onCancel,
  lang = 'it'
}) {
  const [packNum, setPackNum] = useState(1);
  const [pickNum, setPickNum] = useState(1);
  const [humanPool, setHumanPool] = useState([]);
  
  // Human seat: in multiplayer mode uses seatIndex, in solo mode always 0
  const humanSeat = roomCode ? seatIndex : 0;
  
  // Seat packs array: one pack per seat
  const [seatsPacks, setSeatsPacks] = useState([]);
  const [botPools, setBotPools] = useState(() => Array.from({ length: playerCount }, () => []));
  const [isPoolExpanded, setIsPoolExpanded] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.it;

  // Initialize Packs for Pack 1, 2, 3
  useEffect(() => {
    startNewPackPhase(1);
  }, []);

  const startNewPackPhase = (targetPackNum) => {
    let newSeatsPacks;
    
    if (roomCode && cardPool.length > 0) {
      // MULTIPLAYER: deterministic seeded packs (same on every device)
      newSeatsPacks = generateSeededPacks(cardPool, roomCode, playerCount, targetPackNum);
    } else {
      // SOLO: random packs
      newSeatsPacks = [];
      for (let seat = 0; seat < playerCount; seat++) {
        newSeatsPacks.push(generateRandomPack(targetPackNum, seat));
      }
    }
    
    setSeatsPacks(newSeatsPacks);
    setPackNum(targetPackNum);
    setPickNum(1);
  };

  const generateRandomPack = (pNum, seat) => {
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const getRandomN = (arr, n) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    };

    const mythicsAndRares = cardPool.filter(c => c.rarity === 'mythic' || c.rarity === 'rare');
    const uncommons = cardPool.filter(c => c.rarity === 'uncommon');
    const commons = cardPool.filter(c => c.rarity === 'common');

    const pack = [];
    if (mythicsAndRares.length > 0) pack.push(getRandom(mythicsAndRares));
    if (uncommons.length >= 3) pack.push(...getRandomN(uncommons, 3));
    else pack.push(...getRandomN(cardPool, 3));

    const commonNeeded = 15 - pack.length;
    if (commons.length >= commonNeeded) pack.push(...getRandomN(commons, commonNeeded));
    else pack.push(...getRandomN(cardPool, commonNeeded));

    return pack.map((c, idx) => ({
      ...c,
      instanceId: `p${pNum}_s${seat}_pick${idx}_${Math.random().toString(36).substring(2, 6)}`
    }));
  };

  // Active pack facing Human player (at humanSeat)
  const currentPack = seatsPacks[humanSeat] || [];

  // Coach recommendation for Human player
  const coachAdvice = coachMode && currentPack.length > 0
    ? getCoachSuggestion(currentPack, humanPool, lang)
    : null;

  // Handle Human Picking a card
  const handleHumanPick = (chosenCard) => {
    const nextHumanPool = [...humanPool, chosenCard];
    setHumanPool(nextHumanPool);

    // Simulate Bot Picks for all seats except humanSeat
    const nextBotPools = [...botPools];

    const updatedPacks = seatsPacks.map((pack, seatIdx) => {
      if (seatIdx === humanSeat) {
        return pack.filter(c => c.instanceId !== chosenCard.instanceId);
      } else {
        if (pack.length === 0) return [];
        const botChosen = botPickCard(pack, nextBotPools[seatIdx] || [], packNum, pickNum, difficulty);
        const cardToPick = botChosen || pack[0];
        nextBotPools[seatIdx] = [...(nextBotPools[seatIdx] || []), cardToPick];
        return pack.filter(c => c.instanceId !== cardToPick.instanceId);
      }
    });

    setBotPools(nextBotPools);

    const passLeft = packNum % 2 === 1;
    const rotatedPacks = rotatePacks(updatedPacks, passLeft);

    const remainingCardsInPack = rotatedPacks[humanSeat]?.length || 0;

    if (remainingCardsInPack > 0) {
      setSeatsPacks(rotatedPacks);
      setPickNum(prev => prev + 1);
    } else {
      if (packNum < 3) {
        startNewPackPhase(packNum + 1);
      } else {
        onDraftComplete(nextHumanPool);
      }
    }
  };

  const rotatePacks = (packs, passLeft) => {
    const len = packs.length;
    const nextPacks = new Array(len);
    for (let i = 0; i < len; i++) {
      if (passLeft) {
        const targetSeat = (i - 1 + len) % len;
        nextPacks[targetSeat] = packs[i];
      } else {
        const targetSeat = (i + 1) % len;
        nextPacks[targetSeat] = packs[i];
      }
    }
    return nextPacks;
  };

  const passDirectionText = packNum % 2 === 1 ? t.passLeft : t.passRight;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fadeIn pb-28 sm:pb-32">
      
      {/* Top Draft Header & Table Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onCancel}
            className="px-2.5 py-1.5 bg-slate-800 active:bg-slate-600 text-slate-300 text-[11px] font-bold rounded-lg transition-colors shrink-0"
          >
            ←
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 truncate">
                {setInfo?.name || 'Draft'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {playerCount}P · {difficulty.toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white mt-0.5">
              {t.pack} {packNum}/3 — {t.pick} {pickNum}/15
            </h2>
          </div>
        </div>

        {/* Passing Direction Indicator */}
        <div className="flex items-center gap-4 sm:gap-6 bg-slate-950/80 px-3 sm:px-5 py-2 rounded-xl sm:rounded-2xl border border-slate-800 w-full sm:w-auto justify-center">
          <div className="text-center">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold block">{t.passDirection}</span>
            <span className="text-xs sm:text-sm font-extrabold text-amber-400 flex items-center gap-1">
              <ArrowLeftRight size={14} />
              <span>{passDirectionText}</span>
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold block">{t.cardsPicked}</span>
            <span className="text-xs sm:text-sm font-extrabold text-white">{humanPool.length}/45</span>
          </div>
        </div>

      </div>

      {/* Visual Table Seats Bar */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl sm:rounded-2xl p-2 sm:p-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max sm:min-w-0">
          {Array.from({ length: playerCount }).map((_, idx) => {
            const isHuman = idx === humanSeat;
            return (
              <div
                key={idx}
                className={`flex-1 min-w-[52px] sm:min-w-[70px] p-1.5 sm:p-2 rounded-lg sm:rounded-xl border text-center transition-all ${
                  isHuman
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 ring-1 sm:ring-2 ring-amber-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[10px] sm:text-xs font-bold">{isHuman ? '👤' : `🤖${idx}`}</div>
                <div className="text-[9px] text-slate-500 font-mono">
                  {seatsPacks[idx]?.length || 0}
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
            <span>{t.coachTipHeader}</span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            {t.coachRecommendCard} <strong className="text-amber-300">{coachAdvice.suggestedCard.name}</strong> ({coachAdvice.suggestedCard.manaCost})
          </p>
          <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 italic">
            {coachAdvice.reason}
          </div>
        </div>
      )}

      {/* Cards Grid in Pack */}
      <div>
        <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase mb-3 flex items-center justify-between">
          <span>{t.availableCards} ({currentPack.length})</span>
          <span className="text-slate-500 font-normal">{t.clickToPick}</span>
        </h3>

        {currentPack.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400">
            Passing pack...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
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
              {t.yourPickedPool} ({humanPool.length})
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <span>{isPoolExpanded ? t.collapseTray : t.expandTray}</span>
            {isPoolExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </div>

        {/* Expanded Tray Content */}
        {isPoolExpanded && (
          <div className="max-w-7xl mx-auto px-4 py-4 max-h-60 overflow-y-auto border-t border-slate-800">
            {humanPool.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No cards picked yet.</p>
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
