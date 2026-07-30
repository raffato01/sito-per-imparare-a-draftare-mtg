// MQTT-backed Realtime Multiplayer Service for Serverless Room Lobby & Live Sync
import mqtt from 'mqtt';

const BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://test.mosquitto.org:8081/mqtt'
];

/**
 * Seeded pseudo-random number generator (Mulberry32).
 */
export function createSeededRNG(seed) {
  let state = hashString(seed);
  return function () {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

export function seededShuffle(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function generateSeededPacks(cardPool, roomCode, playerCount, packNumber) {
  const seedString = `${roomCode}-PACK${packNumber}`;
  const rng = createSeededRNG(seedString);

  const mythicsAndRares = cardPool.filter(c => c.rarity === 'mythic' || c.rarity === 'rare');
  const uncommons = cardPool.filter(c => c.rarity === 'uncommon');
  const commons = cardPool.filter(c => c.rarity === 'common');

  const allPacks = [];

  for (let seat = 0; seat < playerCount; seat++) {
    const pack = [];

    if (mythicsAndRares.length > 0) {
      const idx = Math.floor(rng() * mythicsAndRares.length);
      pack.push({ ...mythicsAndRares[idx] });
    }

    const shuffledUnc = seededShuffle(uncommons, rng);
    const uncCount = Math.min(3, shuffledUnc.length);
    for (let i = 0; i < uncCount; i++) {
      pack.push({ ...shuffledUnc[i] });
    }

    const needed = 15 - pack.length;
    const shuffledCommon = seededShuffle(commons, rng);
    for (let i = 0; i < Math.min(needed, shuffledCommon.length); i++) {
      pack.push({ ...shuffledCommon[i] });
    }

    while (pack.length < 15 && cardPool.length > 0) {
      const idx = Math.floor(rng() * cardPool.length);
      pack.push({ ...cardPool[idx] });
    }

    pack.forEach((card, idx) => {
      card.instanceId = `seed-${roomCode}-p${packNumber}-s${seat}-c${idx}`;
    });

    allPacks.push(pack);
  }

  return allPacks;
}

/* =========================================================================
   Real-Time Room Lobby & Messaging Engine via WebSocket MQTT
   ========================================================================= */

class RealtimeMultiplayerService {
  constructor() {
    this.client = null;
    this.roomCode = null;
    this.topic = null;
    this.myPlayerId = `p_${Math.random().toString(36).substring(2, 9)}`;
    this.myNickname = 'Giocatore';
    this.isHost = false;
    this.seatIndex = 0;
    this.connectedPlayers = new Map(); // playerId -> { nickname, isHost, seatIndex, lastSeen }
    this.heartbeatTimer = null;
    this.cleanupTimer = null;
    this.stateListeners = [];
    this.gameStartListeners = [];
  }

  // Connect to room topic via MQTT WebSocket
  joinRoom({ roomCode, nickname, isHost = false, seatIndex = 0 }) {
    return new Promise((resolve, reject) => {
      this.leaveRoom();

      this.roomCode = roomCode.toUpperCase().trim();
      this.topic = `mtgdraft/rooms/${this.roomCode}`;
      this.myNickname = nickname || (isHost ? 'Host' : 'Giocatore');
      this.isHost = isHost;
      this.seatIndex = seatIndex;

      // Add self to local player map
      this.connectedPlayers.set(this.myPlayerId, {
        playerId: this.myPlayerId,
        nickname: this.myNickname,
        isHost: this.isHost,
        seatIndex: this.seatIndex,
        lastSeen: Date.now()
      });

      const brokerUrl = BROKERS[Math.floor(Math.random() * BROKERS.length)];
      console.log(`Connecting to room ${this.roomCode} via ${brokerUrl}...`);

      this.client = mqtt.connect(brokerUrl, {
        clientId: `client_${this.myPlayerId}`,
        keepalive: 30,
        reconnectPeriod: 2000,
        clean: true
      });

      this.client.on('connect', () => {
        console.log(`Connected to MQTT broker! Subscribing to ${this.topic}...`);
        this.client.subscribe(this.topic, (err) => {
          if (err) {
            console.error('Subscription error:', err);
            reject(err);
            return;
          }

          // Start broadcasting heartbeat presence
          this.startPresenceHeartbeat();
          this.startStaleCleanup();
          this.broadcastPresence();
          resolve({ roomCode: this.roomCode, playerId: this.myPlayerId });
        });
      });

      this.client.on('message', (topic, message) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleIncomingMessage(data);
        } catch (e) {
          console.warn('Malformed message received:', e);
        }
      });

      this.client.on('error', (err) => {
        console.error('MQTT connection error:', err);
      });
    });
  }

  // Broadcast presence heartbeat every 2 seconds
  startPresenceHeartbeat() {
    this.stopPresenceHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.broadcastPresence();
    }, 2000);
  }

  stopPresenceHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }

  // Cleanup stale players missing for > 6 seconds
  startStaleCleanup() {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      let changed = false;
      this.connectedPlayers.forEach((player, id) => {
        if (id !== this.myPlayerId && now - player.lastSeen > 6000) {
          this.connectedPlayers.delete(id);
          changed = true;
        }
      });
      if (changed) {
        this.notifyStateListeners();
      }
    }, 2000);
  }

  broadcastPresence() {
    if (!this.client || !this.topic) return;
    const payload = {
      type: 'PRESENCE',
      playerId: this.myPlayerId,
      nickname: this.myNickname,
      isHost: this.isHost,
      seatIndex: this.seatIndex,
      timestamp: Date.now()
    };
    this.client.publish(this.topic, JSON.stringify(payload));
  }

  // Update own seat or nickname and broadcast
  updateMyInfo({ nickname, seatIndex }) {
    if (nickname !== undefined) this.myNickname = nickname;
    if (seatIndex !== undefined) this.seatIndex = seatIndex;
    
    // Update local state
    const me = this.connectedPlayers.get(this.myPlayerId);
    if (me) {
      me.nickname = this.myNickname;
      me.seatIndex = this.seatIndex;
      me.lastSeen = Date.now();
    }
    this.broadcastPresence();
    this.notifyStateListeners();
  }

  // Host launches draft for everyone in room
  launchDraft({ setCode = 'fdn', playerCount = 8 }) {
    if (!this.client || !this.topic) return;
    const playersList = Array.from(this.connectedPlayers.values());
    const payload = {
      type: 'START_DRAFT',
      roomCode: this.roomCode,
      setCode,
      playerCount,
      players: playersList,
      timestamp: Date.now()
    };
    this.client.publish(this.topic, JSON.stringify(payload));
  }

  handleIncomingMessage(data) {
    if (!data || !data.type) return;

    if (data.type === 'PRESENCE') {
      this.connectedPlayers.set(data.playerId, {
        playerId: data.playerId,
        nickname: data.nickname,
        isHost: data.isHost,
        seatIndex: data.seatIndex,
        lastSeen: Date.now()
      });
      this.notifyStateListeners();
    } else if (data.type === 'START_DRAFT') {
      this.notifyGameStartListeners(data);
    } else if (data.type === 'LEAVE') {
      this.connectedPlayers.delete(data.playerId);
      this.notifyStateListeners();
    }
  }

  onStateChange(callback) {
    this.stateListeners.push(callback);
    // Trigger immediately with current state
    callback(Array.from(this.connectedPlayers.values()));
    return () => {
      this.stateListeners = this.stateListeners.filter(cb => cb !== callback);
    };
  }

  notifyStateListeners() {
    const list = Array.from(this.connectedPlayers.values());
    this.stateListeners.forEach(cb => cb(list));
  }

  onGameStart(callback) {
    this.gameStartListeners.push(callback);
    return () => {
      this.gameStartListeners = this.gameStartListeners.filter(cb => cb !== callback);
    };
  }

  notifyGameStartListeners(data) {
    this.gameStartListeners.forEach(cb => cb(data));
  }

  leaveRoom() {
    this.stopPresenceHeartbeat();
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    if (this.client && this.topic) {
      try {
        this.client.publish(this.topic, JSON.stringify({ type: 'LEAVE', playerId: this.myPlayerId }));
        this.client.end(true);
      } catch (e) {
        // ignore
      }
    }
    this.client = null;
    this.roomCode = null;
    this.topic = null;
    this.connectedPlayers.clear();
  }
}

export const realtimeMultiplayerInstance = new RealtimeMultiplayerService();
