import React, { useState } from 'react';
import { Eye, Check, HelpCircle } from 'lucide-react';

export function CardView({
  card,
  onPick,
  isSuggested = false,
  isPicked = false,
  showCoachDetails = false,
  coachReason = '',
  size = 'medium' // 'small', 'medium', 'large'
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!card) return null;

  const currentImage = isFlipped && card.backImageUrl ? card.backImageUrl : card.imageUrl;

  const rarityBorders = {
    mythic: 'border-amber-400/90 shadow-amber-500/20 shadow-lg',
    rare: 'border-yellow-500/80 shadow-yellow-500/10 shadow-md',
    uncommon: 'border-slate-300/80',
    common: 'border-slate-700/60'
  };

  const breadColors = {
    B: 'bg-gradient-to-r from-red-600 to-amber-500 text-white',
    R: 'bg-red-600 text-white',
    E: 'bg-sky-500 text-white',
    A: 'bg-emerald-600 text-white',
    D: 'bg-slate-600 text-slate-200'
  };

  const breadNames = {
    B: 'BOMBA',
    R: 'REMOVAL',
    E: 'EVASIONE',
    A: 'AGGRO/CREATURA',
    D: 'SCARTO'
  };

  const sizeClasses = {
    small: 'w-full text-xs',
    medium: 'w-full text-sm',
    large: 'w-full text-base'
  };

  return (
    <>
      <div
        className={`group relative flex flex-col rounded-xl overflow-hidden border-2 transition-all duration-200 transform active:scale-95 sm:hover:-translate-y-1.5 sm:hover:shadow-2xl ${
          rarityBorders[card.rarity] || rarityBorders.common
        } ${isSuggested ? 'ring-2 sm:ring-4 ring-amber-400 ring-offset-1 sm:ring-offset-2 ring-offset-slate-900' : ''} ${
          sizeClasses[size]
        }`}
      >
        {/* Coach Suggestion Badge */}
        {isSuggested && (
          <div className="absolute top-2 left-2 z-20 bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-xs flex items-[#000] items-center gap-1 shadow-md">
            <span>✨ CONSIGLIATO</span>
          </div>
        )}

        {/* BREAD Badge */}
        {card.breadCategory && (
          <div
            className={`absolute top-2 right-2 z-20 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md ${
              breadColors[card.breadCategory] || 'bg-slate-700'
            }`}
            title={`Categoria BREAD: ${breadNames[card.breadCategory]}`}
          >
            {card.breadCategory}
          </div>
        )}

        {/* Card Image Container */}
        <div className="relative aspect-[488/680] w-full bg-slate-950 overflow-hidden cursor-pointer">
          <img
            src={currentImage}
            alt={card.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://cards.scryfall.io/large/back.jpg';
            }}
          />

          {/* Double faced card flip button */}
          {card.backImageUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
              className="absolute bottom-2 right-2 bg-slate-900/90 text-white p-1.5 rounded-full hover:bg-amber-500 transition-colors z-20"
              title="Gira carta"
            >
              🔄
            </button>
          )}

          {/* Quick Zoom Overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white p-1.5 rounded-full hover:bg-sky-500 z-20"
            title="Ingrandisci"
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Card Details Footer */}
        <div className="bg-slate-900/95 p-2 flex flex-col gap-1 border-t border-slate-800">
          <div className="flex justify-between items-center font-bold text-slate-100 truncate text-xs">
            <span className="truncate">{card.name}</span>
            <span className="text-amber-400 text-[11px] font-mono ml-1">{card.manaCost}</span>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span className="truncate">{card.typeLine?.split('—')[0]}</span>
            {card.power && card.toughness && (
              <span className="font-bold text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded">
                {card.power}/{card.toughness}
              </span>
            )}
          </div>

          {/* Action Pick Button */}
          {onPick && (
            <button
              onClick={() => onPick(card)}
              className={`mt-1.5 w-full py-2.5 sm:py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 ${
                isSuggested
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 active:from-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'bg-sky-600 active:bg-sky-500 text-white'
              }`}
            >
              <Check size={14} />
              <span>PICK</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal Zoom View */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 max-w-lg w-full flex flex-col md:flex-row gap-4 sm:gap-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-60 flex-shrink-0">
              <img
                src={currentImage}
                alt={card.name}
                className="w-full rounded-xl shadow-lg border border-slate-700"
              />
            </div>
            <div className="flex flex-col justify-between flex-1 gap-4">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{card.name}</h3>
                  <span className="text-amber-400 font-mono font-bold">{card.manaCost}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 italic">{card.typeLine}</p>
                <div className="my-3 p-3 bg-slate-950/60 rounded-lg text-sm text-slate-200 border border-slate-800 leading-relaxed whitespace-pre-line">
                  {card.oracleText || 'Nessun testo orale.'}
                </div>
                {card.power && (
                  <p className="text-sm font-bold text-amber-400">
                    Forza / Costituzione: {card.power}/{card.toughness}
                  </p>
                )}

                {/* BREAD Coach Note */}
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs mb-1">
                    <HelpCircle size={14} />
                    <span>VALUTAZIONE DRAFT (B.R.E.A.D.)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Categoria: <strong className="text-amber-300">{breadNames[card.breadCategory]}</strong>
                    {card.isRemoval && ' — Questa carta è un ottimo Removal!'}
                    {card.isEvasion && ' — Ha un\'abilità evasiva (Volare/Travolgere).'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {onPick && (
                  <button
                    onClick={() => {
                      onPick(card);
                      setShowModal(false);
                    }}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl transition-colors"
                  >
                    Scegli Questa Carta
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
