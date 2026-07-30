// WebRTC PeerJS Multiplayer Service for serverless room creation on GitHub Pages

import Peer from 'peerjs';

const ROOM_PREFIX = 'mtgdraft-';

export class MultiplayerService {
  constructor() {
    this.peer = null;
    this.connections = new Map(); // peerId -> DataConnection
    this.isHost = false;
    this.roomCode = '';
    this.myNickname = 'Giocatore';
    this.onStateChangeCallbacks = [];
  }

  // Generate a random 6-character room code
  static generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Create a room as Host
  createRoom(nickname, roomCode = MultiplayerService.generateRoomCode()) {
    return new Promise((resolve, reject) => {
      this.isHost = true;
      this.roomCode = roomCode;
      this.myNickname = nickname || 'Host';
      const hostPeerId = `${ROOM_PREFIX}${roomCode.toLowerCase()}`;

      this.peer = new Peer(hostPeerId, {
        debug: 1
      });

      this.peer.on('open', (id) => {
        console.log('Room created as Host:', id);
        this.notifyStateChange({
          status: 'lobby',
          roomCode,
          players: [{ peerId: id, nickname: this.myNickname, isHost: true }]
        });
        resolve({ roomCode, peerId: id });
      });

      this.peer.on('connection', (conn) => {
        this.handleIncomingConnection(conn);
      });

      this.peer.on('error', (err) => {
        console.error('PeerJS Host Error:', err);
        reject(err);
      });
    });
  }

  // Join a room as Client
  joinRoom(nickname, roomCode) {
    return new Promise((resolve, reject) => {
      this.isHost = false;
      this.roomCode = roomCode.trim().toUpperCase();
      this.myNickname = nickname || 'Ospite';
      const hostPeerId = `${ROOM_PREFIX}${this.roomCode.toLowerCase()}`;

      this.peer = new Peer({ debug: 1 });

      this.peer.on('open', (myPeerId) => {
        const conn = this.peer.connect(hostPeerId);

        conn.on('open', () => {
          this.connections.set(hostPeerId, conn);
          conn.send({
            type: 'JOIN_REQUEST',
            nickname: this.myNickname,
            peerId: myPeerId
          });
          resolve({ roomCode: this.roomCode, peerId: myPeerId });
        });

        conn.on('data', (data) => {
          this.handleIncomingData(data, conn);
        });

        conn.on('error', (err) => {
          console.error('Connection to Host error:', err);
          reject(err);
        });
      });

      this.peer.on('error', (err) => {
        console.error('PeerJS Client Error:', err);
        reject(err);
      });
    });
  }

  // Handle incoming connection on Host
  handleIncomingConnection(conn) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
    });

    conn.on('data', (data) => {
      this.handleIncomingData(data, conn);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.broadcastPlayerList();
    });
  }

  // Handle network messages
  handleIncomingData(data, conn) {
    switch (data.type) {
      case 'JOIN_REQUEST':
        if (this.isHost) {
          this.broadcastPlayerList();
        }
        break;

      case 'PLAYER_LIST_UPDATE':
      case 'STATE_UPDATE':
        this.notifyStateChange(data.state);
        break;

      case 'GAME_ACTION':
        this.notifyStateChange(data);
        break;

      default:
        console.log('Received message:', data);
    }
  }

  // Broadcast player list from Host to all connected peers
  broadcastPlayerList() {
    if (!this.isHost) return;

    const playerList = [
      { peerId: this.peer.id, nickname: this.myNickname, isHost: true }
    ];

    this.connections.forEach((conn, peerId) => {
      playerList.push({
        peerId,
        nickname: conn.metadata?.nickname || 'Giocatore',
        isHost: false
      });
    });

    const statePayload = {
      type: 'PLAYER_LIST_UPDATE',
      state: {
        status: 'lobby',
        roomCode: this.roomCode,
        players: playerList
      }
    };

    this.broadcast(statePayload);
    this.notifyStateChange(statePayload.state);
  }

  // Send message to all peers
  broadcast(payload) {
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(payload);
      }
    });
  }

  // Register callback for state changes
  onStateChange(callback) {
    this.onStateChangeCallbacks.push(callback);
  }

  notifyStateChange(newState) {
    this.onStateChangeCallbacks.forEach((cb) => cb(newState));
  }

  // Close connections
  disconnect() {
    this.connections.forEach(conn => conn.close());
    if (this.peer) this.peer.destroy();
    this.connections.clear();
  }
}

export const multiplayerInstance = new MultiplayerService();
