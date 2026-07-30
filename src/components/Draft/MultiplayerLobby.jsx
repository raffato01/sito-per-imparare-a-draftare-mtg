import React, { useState, useEffect } from 'react';
import { generateRoomCode, realtimeMultiplayerInstance } from '../../services/multiplayerService';
import { TRANSLATIONS } from '../../data/translations';
import { Users, Sparkles, Copy, Check, ArrowRight, UserPlus, Hash, Radio, Loader2 } from 'lucide-react';

export function MultiplayerLobby({ onStartMultiplayerDraft, onCancel, lang = 'it' }) {
  const [roomCode, setRoomCode] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [nickname, setNickname] = useState('Giocatore');
  const [seatIndex, setSeatIndex] = useState(0);
  const [playerCount, setPlayerCount] = useState(8);
  
  const [isHost, setIsHost] = useState(false);
  const [mode, setMode] = useState(null); // 'inRoom' | null
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = TRANSLATIONS[lang] || TRANSLATIONS.it;
  const isIT = lang === 'it';

  // Listen to live player state and auto-start draft signal
  useEffect(() => {
    const unsubState = realtimeMultiplayerInstance.onStateChange((players) => {
      setConnectedPlayers(players);
    });

    const unsubStart = realtimeMultiplayerInstance.onGameStart((data) => {
      // Game start signal received from Host!
      onStartMultiplayerDraft({
        roomCode: data.roomCode,
        seatIndex,
        playerCount: data.playerCount || 8,
        nickname
      });
    });

    return () => {
      unsubState();
      unsubStart();
    };
  }, [seatIndex, nickname, onStartMultiplayerDraft]);

  // Create room as Host
  const handleCreateRoom = async () => {
    if (!nickname.trim()) return;
    setIsConnecting(true);
    setErrorMsg('');
    const newCode = generateRoomCode();
    
    try {
      await realtimeMultiplayerInstance.joinRoom({
        roomCode: newCode,
        nickname: nickname.trim(),
        isHost: true,
        seatIndex: 0
      });
      setRoomCode(newCode);
      setIsHost(true);
      setSeatIndex(0);
      setMode('inRoom');
    } catch (err) {
      console.error(err);
      setErrorMsg(isIT ? 'Errore durante la connessione al server WebSocket.' : 'Failed to connect to room server.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Join room as Guest
  const handleJoinRoom = async () => {
    if (!nickname.trim() || !roomCodeInput.trim()) return;
    setIsConnecting(true);
    setErrorMsg('');
    const codeToJoin = roomCodeInput.trim().toUpperCase();

    try {
      await realtimeMultiplayerInstance.joinRoom({
        roomCode: codeToJoin,
        nickname: nickname.trim(),
        isHost: false,
        seatIndex: 1
      });
      setRoomCode(codeToJoin);
      setIsHost(false);
      setSeatIndex(1);
      setMode('inRoom');
    } catch (err) {
      console.error(err);
      setErrorMsg(isIT ? 'Impossibile accedere alla stanza.' : 'Could not join room.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Change seat choice and broadcast live
  const handleSelectSeat = (newSeat) => {
    setSeatIndex(newSeat);
    realtimeMultiplayerInstance.updateMyInfo({ seatIndex: newSeat });
  };

  // Copy code button
  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Launch draft for everyone in room
  const handleLaunchDraft = () => {
    realtimeMultiplayerInstance.launchDraft({ setCode: 'fdn', playerCount });
  };

  // Leave room
  const handleLeaveRoom = () => {
    realtimeMultiplayerInstance.leaveRoom();
    setMode(null);
    setRoomCode('');
    setIsHost(false);
  };

  // Calculate unoccupied seats for bot fill
  const occupiedSeats = new Set(connectedPlayers.map(p => p.seatIndex));
  const botCount = Math.max(0, playerCount - connectedPlayers.length);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold tracking-wider">
          <Radio size={14} className="animate-pulse text-emerald-400" />
          <span>{isIT ? 'STANZE MULTIPLAYER REALTIME (WEBSOCKET)' : 'REALTIME WEBSOCKET MULTIPLAYER'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
          {isIT ? 'Drafta in Tempo Reale con i ' : 'Draft Realtime with your '}
          <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
            {isIT ? 'Tuoi Amici' : 'Friends'}
          </span>
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          {isIT
            ? 'Crea una stanza e condividi il codice. Vedrai i tuoi amici entrare nella stanza in tempo reale da qualsiasi dispositivo o rete!'
            : 'Create a room and share the code. You will see your friends join the room live in real time from any network!'}
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-rose-200 text-xs sm:text-sm text-center font-bold">
          {errorMsg}
        </div>
      )}

      {/* Screen 1: Join or Create Room Form */}
      {mode !== 'inRoom' ? (
        <div className="space-y-6">
          
          {/* Nickname Input Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <label className="text-xs font-extrabold text-slate-300 block uppercase tracking-wider">
              {isIT ? '1. Inserisci il tuo Nickname:' : '1. Enter your Nickname:'}
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={isIT ? 'Il tuo nome al tavolo...' : 'Your display name...'}
              className="w-full sm:w-80 bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white font-bold focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Create Room */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {isIT ? 'Crea Nuova Stanza' : 'Create New Room'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isIT
                    ? 'Diventa l\'Host del tavolo. Genera un codice unico a 6 caratteri e condividilo con i tuoi amici.'
                    : 'Become the Host. Generate a 6-character room code and share it with your friends.'}
                </p>
              </div>
              <button
                onClick={handleCreateRoom}
                disabled={isConnecting || !nickname.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isConnecting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                <span>{isIT ? 'CREA STANZA LIVE' : 'CREATE LIVE ROOM'}</span>
              </button>
            </div>

            {/* Card 2: Join Room */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Users size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {isIT ? 'Entra in una Stanza' : 'Join a Room'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isIT
                    ? 'Hai un codice invito? Inseriscilo qui sotto per accedere immediatamente al tavolo dei tuoi amici.'
                    : 'Have an invite code? Enter it below to join your friends at the table.'}
                </p>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  maxLength={6}
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="ES. K7MN3X"
                  className="w-full uppercase font-mono text-center tracking-[0.3em] bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-lg text-white font-black focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={isConnecting || !nickname.trim() || roomCodeInput.trim().length < 4}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isConnecting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                  <span>{isIT ? 'ENTRA NELLA STANZA' : 'JOIN ROOM'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Screen 2: Active Room Lobby with Live Player Sync */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {/* Room Code Display Banner */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                <Radio size={14} className="text-emerald-400 animate-pulse" />
                <span>{isIT ? 'Codice Stanza Live:' : 'Live Room Code:'}</span>
              </div>
              <div className="text-4xl font-black font-mono text-amber-400 tracking-[0.3em] mt-1">
                {roomCode}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {isIT
                  ? 'I tuoi amici devono inserire questo codice per entrare!'
                  : 'Your friends must enter this code to join!'}
              </span>
            </div>
            <button
              onClick={copyCode}
              className="px-5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
            >
              {copiedCode ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copiedCode ? (isIT ? 'COPIATO!' : 'COPIED!') : (isIT ? 'COPIA CODICE INVITO' : 'COPY INVITE CODE')}</span>
            </button>
          </div>

          {/* Connected Realtime Players List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Users size={16} className="text-amber-400" />
                <span>{isIT ? `Giocatori Connessi nella Stanza (${connectedPlayers.length})` : `Connected Players (${connectedPlayers.length})`}</span>
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                {botCount > 0 ? (isIT ? `${botCount} posti vuoti occupati da Bot IA` : `${botCount} empty seats auto-filled by AI Bots`) : ''}
              </span>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {connectedPlayers.map((player) => (
                <div
                  key={player.playerId}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    player.playerId === realtimeMultiplayerInstance.myPlayerId
                      ? 'bg-amber-500/10 border-amber-500/60 ring-2 ring-amber-500/20 text-amber-300'
                      : 'bg-slate-950 border-emerald-500/40 text-slate-200'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg shrink-0">
                    👤
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-extrabold text-sm text-white block truncate">
                      {player.nickname} {player.playerId === realtimeMultiplayerInstance.myPlayerId ? (isIT ? '(Tu)' : '(You)') : ''}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono block">
                      {player.isHost ? (isIT ? '👑 Host Stanza' : '👑 Room Host') : `Seat ${player.seatIndex + 1}`}
                    </span>
                  </div>
                </div>
              ))}

              {/* Bot Placeholders */}
              {Array.from({ length: botCount }).map((_, idx) => (
                <div
                  key={`bot-${idx}`}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-3 text-xs opacity-50"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-slate-500 flex items-center justify-center font-bold text-lg shrink-0">
                    🤖
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-400 block truncate">Bot IA {idx + 1}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{isIT ? 'Automatico' : 'Auto-filled'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seat Picker for current player */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Hash size={14} className="text-amber-400" />
              <span>{isIT ? 'Scegli il tuo Posto al Tavolo:' : 'Pick your Table Seat:'}</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {Array.from({ length: playerCount }).map((_, idx) => {
                const isOccupiedByOther = connectedPlayers.some(p => p.seatIndex === idx && p.playerId !== realtimeMultiplayerInstance.myPlayerId);
                const isMySeat = seatIndex === idx;

                return (
                  <button
                    key={idx}
                    disabled={isOccupiedByOther}
                    onClick={() => handleSelectSeat(idx)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isMySeat
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                        : isOccupiedByOther
                        ? 'bg-slate-950/50 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-base">{isMySeat ? '👤' : isOccupiedByOther ? '🚫' : '🪑'}</div>
                    <div className="text-[10px] font-bold mt-0.5">S{idx + 1}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleLeaveRoom}
              className="px-4 py-2 bg-slate-800 text-slate-400 font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors"
            >
              ← {isIT ? 'Esci dalla Stanza' : 'Leave Room'}
            </button>

            {isHost ? (
              <button
                onClick={handleLaunchDraft}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
              >
                <span>{isIT ? 'AVVIA DRAFT PER TUTTI' : 'START DRAFT FOR EVERYONE'}</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <div className="text-xs text-amber-400 font-bold flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/30">
                <Loader2 className="animate-spin text-amber-400" size={16} />
                <span>{isIT ? 'In attesa che l\'Host avvii il draft...' : 'Waiting for Host to start draft...'}</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Back to main menu */}
      <div className="text-center">
        <button
          onClick={() => { handleLeaveRoom(); onCancel(); }}
          className="text-xs text-slate-500 hover:text-slate-300 font-bold transition-colors"
        >
          ← {isIT ? 'Torna al Menu Principale' : 'Back to Main Menu'}
        </button>
      </div>

    </div>
  );
}
