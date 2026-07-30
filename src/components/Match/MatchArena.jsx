import React, { useState } from 'react';
import { Heart, Plus, Minus, ShieldAlert, Sparkles, RefreshCw, Download, RotateCw, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

export function MatchArena({ maindeck = [], playerNickname = 'Tu', opponentNickname = 'Avversario' }) {
  const [myLife, setMyLife] = useState(20);
  const [oppLife, setOppLife] = useState(20);
  const [myPoison, setMyPoison] = useState(0);
  const [oppPoison, setOppPoison] = useState(0);
  const [turnCount, setTurnCount] = useState(1);
  const [activePhase, setActivePhase] = useState('Main 1'); // 'Untap', 'Draw', 'Main 1', 'Combat', 'Main 2', 'End'

  // Battlefield state
  const [library, setLibrary] = useState([...maindeck].sort(() => 0.5 - Math.random()));
  const [hand, setHand] = useState([]);
  const [battlefield, setBattlefield] = useState([]); // { card, isTapped }
  const [graveyard, setGraveyard] = useState([]);

  // Draw 7 cards for starting hand
  const drawStartingHand = () => {
    const shuffled = [...maindeck].sort(() => 0.5 - Math.random());
    setHand(shuffled.slice(0, 7));
    setLibrary(shuffled.slice(7));
    setBattlefield([]);
    setGraveyard([]);
    setMyLife(20);
    setOppLife(20);
    setMyPoison(0);
    setOppPoison(0);
    setTurnCount(1);
    confetti({ particleCount: 40, spread: 60 });
  };

  // Draw 1 card
  const drawCard = () => {
    if (library.length === 0) return;
    const top = library[0];
    setLibrary(prev => prev.slice(1));
    setHand(prev => [...prev, top]);
  };

  // Play card to battlefield
  const playCardToBattlefield = (cardIndex) => {
    const card = hand[cardIndex];
    setHand(prev => prev.filter((_, idx) => idx !== cardIndex));
    setBattlefield(prev => [...prev, { ...card, boardId: Math.random().toString(), isTapped: false }]);
  };

  // Toggle Tap/Untap card on battlefield
  const toggleTapCard = (boardId) => {
    setBattlefield(prev =>
      prev.map(item => item.boardId === boardId ? { ...item, isTapped: !item.isTapped } : item)
    );
  };

  // Move card to graveyard
  const sendToGraveyard = (boardId) => {
    const cardObj = battlefield.find(b => b.boardId === boardId);
    if (!cardObj) return;
    setBattlefield(prev => prev.filter(b => b.boardId !== boardId));
    setGraveyard(prev => [...prev, cardObj]);
  };

  // Untap all permanent cards
  const untapAll = () => {
    setBattlefield(prev => prev.map(item => ({ ...item, isTapped: false })));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      
      {/* Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles size={16} />
            <span>Modalità Partita 1v1 — Campo da Gioco</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            {playerNickname} vs {opponentNickname}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={drawStartingHand}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow hover:brightness-110 flex items-center gap-1.5"
          >
            <RefreshCw size={14} />
            <span>PESCA MANO INIZIALE (7 CARTE)</span>
          </button>

          <button
            onClick={untapAll}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5"
          >
            <RotateCw size={14} />
            <span>Stappa Tutto</span>
          </button>
        </div>
      </div>

      {/* Dual Life Counter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Opponent Life Counter (Top) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Avversario</span>
            <h3 className="text-xl font-black text-rose-400">{opponentNickname}</h3>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Veleno: {oppPoison}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setOppLife(l => l + 1)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl font-bold"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => setOppLife(l => Math.max(0, l - 1))}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-xl font-bold"
              >
                <Minus size={16} />
              </button>
            </div>

            <div className="text-4xl font-black text-white font-mono bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800 shadow-inner flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500/20" size={28} />
              <span>{oppLife}</span>
            </div>
          </div>
        </div>

        {/* My Life Counter (Bottom) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">I Tuoi Punti Vita</span>
            <h3 className="text-xl font-black text-amber-400">{playerNickname}</h3>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Veleno: {myPoison}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setMyLife(l => l + 1)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl font-bold"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => setMyLife(l => Math.max(0, l - 1))}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-xl font-bold"
              >
                <Minus size={16} />
              </button>
            </div>

            <div className="text-4xl font-black text-white font-mono bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800 shadow-inner flex items-center gap-2">
              <Heart className="text-amber-500 fill-amber-500/20" size={28} />
              <span>{myLife}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Battlefield Area */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-black text-base text-slate-200">
            Campo di Battaglia Virtuale ({battlefield.length} Permanenti in Gioco)
          </h3>
          <span className="text-xs text-slate-400">Clicca su una carta per Tapparla/Stapparla</span>
        </div>

        {/* Board Cards Grid */}
        <div className="min-h-[160px] flex flex-wrap gap-4 items-center">
          {battlefield.length === 0 ? (
            <div className="w-full text-center text-xs text-slate-500 py-10 border border-dashed border-slate-800/80 rounded-2xl">
              Il tuo campo di battaglia è vuoto. Gioca terre o creature dalla tua mano sottostante!
            </div>
          ) : (
            battlefield.map((item) => (
              <div
                key={item.boardId}
                onClick={() => toggleTapCard(item.boardId)}
                className={`relative group cursor-pointer transition-transform duration-300 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-900 w-32 ${
                  item.isTapped ? 'rotate-90 scale-95 opacity-80 border-amber-500' : 'hover:-translate-y-1'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full aspect-[488/680] object-cover"
                />
                <div className="p-1.5 bg-slate-950 text-[10px] font-bold text-white truncate flex justify-between">
                  <span className="truncate">{item.name}</span>
                  {item.isTapped && <span className="text-amber-400 font-mono">TAPPATA</span>}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sendToGraveyard(item.boardId);
                  }}
                  className="absolute top-1 right-1 bg-rose-600/90 text-white p-1 rounded-full text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Invia al cimitero"
                >
                  💀
                </button>
              </div>
            ))
          )}
        </div>

        {/* Hand & Library Bar */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-amber-400">La tua Mano ({hand.length} carte)</span>
            <div className="flex items-center gap-4 text-slate-400 font-mono">
              <span>Mazzo: {library.length} carte</span>
              <span>Cimitero: {graveyard.length} carte</span>
              <button
                onClick={drawCard}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold"
              >
                + Pesca 1 Carta
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-3 pb-2 pt-1">
            {hand.map((card, idx) => (
              <div
                key={idx}
                onClick={() => playCardToBattlefield(idx)}
                className="flex-shrink-0 w-28 cursor-pointer group relative rounded-xl border border-slate-700 bg-slate-900 overflow-hidden transition-transform hover:-translate-y-2 hover:border-amber-400"
              >
                <img src={card.imageUrl} alt={card.name} className="w-full aspect-[488/680] object-cover" />
                <div className="p-1 bg-slate-950 text-[10px] font-bold text-white truncate text-center">
                  Gioca
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
