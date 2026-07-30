// Shared-Seed Multiplayer Service
// Instead of real-time WebRTC, players share a Room Code that acts as a
// deterministic SEED. The same seed generates the exact same booster packs
// on every device, so all players draft from identical packs independently.
// After drafting & deckbuilding, players can battle in the Match Arena.

/**
 * Seeded pseudo-random number generator (Mulberry32).
 * Given the same seed, it always produces the same sequence of numbers.
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

/**
 * Simple string hash (DJB2) to convert a room code into a numeric seed.
 */
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

/**
 * Deterministic shuffle using seeded RNG (Fisher-Yates).
 */
export function seededShuffle(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a 6-character room code (human-friendly, uppercase alphanumeric).
 */
export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Generate deterministic booster packs for ALL seats at the table.
 * Given the same cardPool + roomCode + playerCount, every device
 * will produce the exact same packs in the exact same order.
 *
 * @param {Array} cardPool - All available cards for the set
 * @param {string} roomCode - The shared room/seed code
 * @param {number} playerCount - Number of seats (6 or 8)
 * @param {number} packNumber - Which pack round (1, 2, or 3)
 * @returns {Array<Array>} - Array of packs, one per seat
 */
export function generateSeededPacks(cardPool, roomCode, playerCount, packNumber) {
  // Create a unique seed per pack round
  const seedString = `${roomCode}-PACK${packNumber}`;
  const rng = createSeededRNG(seedString);

  const mythicsAndRares = cardPool.filter(c => c.rarity === 'mythic' || c.rarity === 'rare');
  const uncommons = cardPool.filter(c => c.rarity === 'uncommon');
  const commons = cardPool.filter(c => c.rarity === 'common');

  const allPacks = [];

  for (let seat = 0; seat < playerCount; seat++) {
    const pack = [];

    // 1 Rare/Mythic
    if (mythicsAndRares.length > 0) {
      const idx = Math.floor(rng() * mythicsAndRares.length);
      pack.push({ ...mythicsAndRares[idx] });
    }

    // 3 Uncommons
    const shuffledUnc = seededShuffle(uncommons, rng);
    const uncCount = Math.min(3, shuffledUnc.length);
    for (let i = 0; i < uncCount; i++) {
      pack.push({ ...shuffledUnc[i] });
    }

    // Fill rest with commons (target 15 cards per pack)
    const needed = 15 - pack.length;
    const shuffledCommon = seededShuffle(commons, rng);
    for (let i = 0; i < Math.min(needed, shuffledCommon.length); i++) {
      pack.push({ ...shuffledCommon[i] });
    }

    // Fallback: if not enough cards by rarity, fill from full pool
    while (pack.length < 15 && cardPool.length > 0) {
      const idx = Math.floor(rng() * cardPool.length);
      pack.push({ ...cardPool[idx] });
    }

    // Assign unique instance IDs (deterministic)
    pack.forEach((card, idx) => {
      card.instanceId = `seed-${roomCode}-p${packNumber}-s${seat}-c${idx}`;
    });

    allPacks.push(pack);
  }

  return allPacks;
}
