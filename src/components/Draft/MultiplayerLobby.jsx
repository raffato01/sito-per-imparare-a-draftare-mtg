import React, { useState, useEffect } from 'react';
import { multiplayerInstance } from '../../services/multiplayerService';
import { Users, Sparkles, Copy, Check, ArrowRight, ShieldCheck, UserPlus, RefreshCw } from 'lucide-react';

export function MultiplayerLobby({ onStartMultiplayerDraft, onCancel }) {
  const [nickname, setNickname] = useState('Giocatore 1');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [activeRoomCode, setActiveRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [targetSeats, setTargetSeats] = useState(8);
  
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    multiplayerInstance.onStateChange((state) => {
      if (state && state.players) {
        setConnectedPlayers(state.players);
      }
    });

    return () => {
      // Cleanup on unmount
    };
  }, []);

  const handleCreateRoom = async () => {
    if (!nickname.trim()) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await multiplayerInstance.createRoom(nickname);
      setActiveRoomCode(res.roomCode);
      setIsHost(true);
      setConnectedPlayers([{ nickname: nickname.trim(), isHost: true }]);
    } catch (err) {
      setErrorMessage('Errore durante la creazione della stanza WebRTC.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!nickname.trim() || !roomCodeInput.trim()) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await multiplayerInstance.joinRoom(nickname, roomCodeInput);
      setActiveRoomCode(res.roomCode);
      setIsHost(false);
    } catch (err) {
      setErrorMessage('Impossibile connettersi alla stanza. Verifica il codice inserito.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(activeRoomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const botCount = Math.max(0, targetSeats - connectedPlayers.length);

  const handleLaunchDraft = () => {
    onStartMultiplayerDraft({
      roomCode: activeRoomCode,
      players: connectedPlayers,
      botCount,
      targetSeats
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
          <Users size={14} />
          <span>MODALITÀ MULTIPLAYER P2P (SERVERLESS)</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
          Drafta Live con i <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">Tuoi Amici</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Crea una stanza e condividi il codice a 6 caratteri. I posti vuoti al tavolo verranno riempiti dai Bot IA!
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-rose-200 text-sm text-center">
          {errorMessage}
        </div>
      )}

      {/* Screen 1: Room Creation / Join Form */}
      {!activeRoomCode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Create Room */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-white">Crea Nuova Stanza</h3>
              <p className="text-xs text-slate-400">
                Diventa l'Host del tavolo, scegli il set e condividi il codice invito con i tuoi amici.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Il tuo Nickname:</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Inserisci il tuo nome..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleCreateRoom}
                disabled={isLoading || !nickname.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <UserPlus size={16} />}
                <span>CREA STANZA CON CODICE</span>
              </button>
            </div>
          </div>

          {/* Card 2: Join Room */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-white">Entra in una Stanza</h3>
              <p className="text-xs text-slate-400">
                Inserisci il codice a 6 caratteri fornito dall'Host per entrare nel draft.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Il tuo Nickname:</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Inserisci il tuo nome..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Codice Stanza (es. 8X9A21):</label>
                <input
                  type="text"
                  maxLength={8}
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="CODICE STANZA"
                  className="w-full uppercase font-mono text-center tracking-widest bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handleJoinRoom}
                disabled={isLoading || !nickname.trim() || !roomCodeInput.trim()}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                <span>ENTRA NELLA STANZA</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Screen 2: Active Room Lobby */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {/* Room Code Display Banner */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Codice Invito Stanza:</span>
              <div className="text-3xl font-black font-mono text-amber-400 tracking-widest mt-0.5">
                {activeRoomCode}
              </div>
            </div>

            <button
              onClick={copyRoomCode}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all"
            >
              {copiedCode ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copiedCode ? 'CODICE COPIATO!' : 'COPIA CODICE INVITO'}</span>
            </button>
          </div>

          {/* Connected Players & Bots List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Giocatori al Tavolo ({connectedPlayers.length + botCount} / {targetSeats})</span>
              <span>{botCount} Bot IA Aggiunti Automaticamente</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Connected Human Players */}
              {connectedPlayers.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-950 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    👤
                  </div>
                  <div className="truncate">
                    <span className="font-extrabold text-white block truncate">{p.nickname}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {p.isHost ? 'Host Stanza' : 'Giocatore Reale'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Auto-filled Bots */}
              {Array.from({ length: botCount }).map((_, idx) => (
                <div
                  key={`bot-${idx}`}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-3 text-xs opacity-60"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-slate-400 flex items-center justify-center font-bold">
                    🤖
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block">Bot IA {idx + 1}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Automatico</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Launch Controls for Host */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-slate-800 text-slate-400 font-bold text-xs rounded-xl hover:bg-slate-700"
            >
              Esci dalla Stanza
            </button>

            {isHost ? (
              <button
                onClick={handleLaunchDraft}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transform hover:scale-105 transition-all"
              >
                <span>AVVIA DRAFT MULTIPLAYER AL TAVOLO</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <div className="text-xs text-amber-400 font-bold flex items-center gap-2">
                <RefreshCw className="animate-spin" size={14} />
                <span>In attesa che l'Host avvii il draft...</span>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
