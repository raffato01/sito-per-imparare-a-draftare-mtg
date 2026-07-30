import React, { useState } from 'react';
import { generateRoomCode } from '../../services/multiplayerService';
import { TRANSLATIONS } from '../../data/translations';
import { Users, Sparkles, Copy, Check, ArrowRight, UserPlus, Dices, Hash } from 'lucide-react';

export function MultiplayerLobby({ onStartMultiplayerDraft, onCancel, lang = 'it' }) {
  const [roomCode, setRoomCode] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [nickname, setNickname] = useState('');
  const [seatIndex, setSeatIndex] = useState(0); // which seat am I?
  const [playerCount, setPlayerCount] = useState(8);
  const [copiedCode, setCopiedCode] = useState(false);
  const [mode, setMode] = useState(null); // 'create' | 'join' | null

  const t = TRANSLATIONS[lang] || TRANSLATIONS.it;

  const handleCreateRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setSeatIndex(0); // host is always seat 0
    setMode('created');
  };

  const handleJoinRoom = () => {
    if (!roomCodeInput.trim()) return;
    setRoomCode(roomCodeInput.trim().toUpperCase());
    setMode('joined');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLaunchDraft = () => {
    onStartMultiplayerDraft({
      roomCode,
      seatIndex,
      playerCount,
      nickname: nickname.trim() || (seatIndex === 0 ? 'Host' : 'Player')
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
          <Users size={14} />
          <span>{lang === 'it' ? 'MULTIPLAYER — CODICE STANZA CONDIVISO' : 'MULTIPLAYER — SHARED ROOM CODE'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
          {lang === 'it' ? 'Drafta con i ' : 'Draft with your '}
          <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
            {lang === 'it' ? 'Tuoi Amici' : 'Friends'}
          </span>
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          {lang === 'it'
            ? 'Condividi il Codice Stanza con i tuoi amici. Lo stesso codice genera le stesse identiche bustine su ogni dispositivo! Dopo aver draftato, confrontate i mazzi e sfidate nella Match Arena.'
            : 'Share the Room Code with your friends. The same code generates the exact same booster packs on every device! After drafting, compare decks and battle in the Match Arena.'}
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Dices size={16} />
          <span>{lang === 'it' ? 'Come Funziona' : 'How It Works'}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: '1',
              it: 'L\'Host crea una stanza e condivide il codice a 6 caratteri con gli amici.',
              en: 'The Host creates a room and shares the 6-character code with friends.'
            },
            {
              step: '2',
              it: 'Ogni giocatore sceglie un Posto al tavolo diverso (Seat 0, 1, 2...) e inserisce il codice.',
              en: 'Each player picks a different table Seat (Seat 0, 1, 2...) and enters the code.'
            },
            {
              step: '3',
              it: 'Tutti premono "Avvia Draft" nello stesso momento: le bustine saranno identiche! I posti vuoti sono Bot IA.',
              en: 'Everyone presses "Start Draft" at the same time: packs are identical! Empty seats are AI Bots.'
            }
          ].map((item) => (
            <div key={item.step} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                {item.step}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'it' ? item.it : item.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Nickname Input */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <label className="text-xs font-bold text-slate-400 block">
          {lang === 'it' ? 'Il tuo Nickname:' : 'Your Nickname:'}
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={lang === 'it' ? 'Inserisci il tuo nome...' : 'Enter your name...'}
          className="w-full sm:w-72 bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      {/* Create or Join */}
      {!mode || mode === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Create Room */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                {lang === 'it' ? 'Crea Nuova Stanza' : 'Create New Room'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'it'
                  ? 'Genera un codice unico e condividilo con i tuoi amici.'
                  : 'Generate a unique code and share it with your friends.'}
              </p>
            </div>
            <button
              onClick={handleCreateRoom}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <UserPlus size={16} />
              <span>{lang === 'it' ? 'CREA STANZA' : 'CREATE ROOM'}</span>
            </button>
          </div>

          {/* Join Room */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                {lang === 'it' ? 'Entra con Codice' : 'Join with Code'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'it'
                  ? 'Inserisci il codice a 6 caratteri ricevuto dall\'Host.'
                  : 'Enter the 6-character code from the Host.'}
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                maxLength={6}
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="w-full uppercase font-mono text-center tracking-[0.3em] bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-4 text-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={handleJoinRoom}
                disabled={roomCodeInput.trim().length < 4}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <ArrowRight size={16} />
                <span>{lang === 'it' ? 'ENTRA NELLA STANZA' : 'JOIN ROOM'}</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Active Room Configuration */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {/* Room Code Banner */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                {lang === 'it' ? 'Codice Stanza:' : 'Room Code:'}
              </span>
              <div className="text-4xl font-black font-mono text-amber-400 tracking-[0.3em] mt-1">
                {roomCode}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {lang === 'it'
                  ? 'Condividi questo codice con i tuoi amici!'
                  : 'Share this code with your friends!'}
              </span>
            </div>
            <button
              onClick={copyCode}
              className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all"
            >
              {copiedCode ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copiedCode ? (lang === 'it' ? 'COPIATO!' : 'COPIED!') : (lang === 'it' ? 'COPIA CODICE' : 'COPY CODE')}</span>
            </button>
          </div>

          {/* Seat Selection */}
          <div className="space-y-3">
            <label className="text-xs font-black tracking-wider text-slate-400 uppercase block">
              <Hash size={14} className="inline mr-1" />
              {lang === 'it' ? 'Scegli il tuo Posto al Tavolo:' : 'Choose your Table Seat:'}
            </label>
            <p className="text-[11px] text-slate-500">
              {lang === 'it'
                ? 'Ogni amico deve scegliere un posto DIVERSO. I posti non occupati da umani saranno Bot IA.'
                : 'Each friend must choose a DIFFERENT seat. Unoccupied seats will be AI Bots.'}
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {Array.from({ length: playerCount }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSeatIndex(idx)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    seatIndex === idx
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30 shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <div className="text-lg font-black">{idx === seatIndex ? '👤' : '🪑'}</div>
                  <div className="text-[10px] font-bold mt-0.5">Seat {idx + 1}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Table Size */}
          <div className="space-y-3">
            <label className="text-xs font-black tracking-wider text-slate-400 uppercase block">
              {lang === 'it' ? 'Dimensione Tavolo:' : 'Table Size:'}
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              <button
                onClick={() => { setPlayerCount(8); if (seatIndex >= 8) setSeatIndex(0); }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  playerCount === 8
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span className="font-extrabold text-sm">8 {lang === 'it' ? 'Giocatori' : 'Players'}</span>
              </button>
              <button
                onClick={() => { setPlayerCount(6); if (seatIndex >= 6) setSeatIndex(0); }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  playerCount === 6
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span className="font-extrabold text-sm">6 {lang === 'it' ? 'Giocatori' : 'Players'}</span>
              </button>
            </div>
          </div>

          {/* Launch Controls */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => { setMode(null); setRoomCode(''); }}
              className="px-4 py-2 bg-slate-800 text-slate-400 font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors"
            >
              ← {lang === 'it' ? 'Indietro' : 'Back'}
            </button>

            <button
              onClick={handleLaunchDraft}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transform hover:scale-105 transition-all"
            >
              <span>{lang === 'it' ? 'AVVIA DRAFT' : 'START DRAFT'}</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      )}

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-300 font-bold transition-colors"
        >
          ← {lang === 'it' ? 'Torna al Menu Principale' : 'Back to Main Menu'}
        </button>
      </div>

    </div>
  );
}
