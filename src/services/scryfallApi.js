// Scryfall API integration service for MTG card & set fetching

const SCRYFALL_BASE = 'https://api.scryfall.com';

// Local cache for card pools to avoid spamming Scryfall API
const cardPoolCache = new Map();

/**
 * Fetch all MTG sets from Scryfall (including unreleased / spoiler sets)
 */
export async function fetchAllScryfallSets() {
  try {
    const res = await fetch(`${SCRYFALL_BASE}/sets`);
    if (!res.ok) throw new Error('Scryfall sets API error');
    const data = await res.json();
    const sets = data.data || [];

    // Filter expansion, draft innovation, core, masters
    return sets
      .filter(s => ['expansion', 'draft_innovation', 'core', 'masters', 'commander'].includes(s.set_type))
      .map(s => ({
        code: s.code,
        name: s.name,
        releaseYear: s.released_at ? parseInt(s.released_at.substring(0, 4)) : 2026,
        cardCount: s.card_count,
        icon: s.icon_svg_uri,
        releasedAt: s.released_at,
        isUnreleased: new Date(s.released_at) > new Date() || !s.released_at
      }));
  } catch (err) {
    console.warn('Could not fetch Scryfall sets list', err);
    return [];
  }
}

/**
 * Normalizes card data retrieved from Scryfall API into a clean standard object
 */
export function normalizeCard(card) {
  // Handle double-faced cards or regular cards
  let imageUrl = '';
  if (card.image_uris && card.image_uris.normal) {
    imageUrl = card.image_uris.normal;
  } else if (card.card_faces && card.card_faces[0] && card.card_faces[0].image_uris) {
    imageUrl = card.card_faces[0].image_uris.normal;
  } else {
    imageUrl = 'https://cards.scryfall.io/large/back.jpg';
  }

  // Back image for double-faced cards
  let backImageUrl = null;
  if (card.card_faces && card.card_faces[1] && card.card_faces[1].image_uris) {
    backImageUrl = card.card_faces[1].image_uris.normal;
  }

  // Parse colors & mana cost
  const colors = card.colors || (card.card_faces ? card.card_faces[0].colors : []) || [];
  const cmc = card.cmc !== undefined ? Math.floor(card.cmc) : 0;
  const typeLine = card.type_line || '';
  const isCreature = typeLine.toLowerCase().includes('creature');
  const isLand = typeLine.toLowerCase().includes('land');
  const isRemoval = checkIsRemoval(card);
  const isEvasion = checkIsEvasion(card);
  const breadCategory = categorizeBREAD(card, isRemoval, isEvasion);

  return {
    id: card.id,
    scryfallId: card.id,
    name: card.name,
    set: card.set,
    rarity: card.rarity, // common, uncommon, rare, mythic
    imageUrl,
    backImageUrl,
    manaCost: card.mana_cost || (card.card_faces ? card.card_faces[0].mana_cost : ''),
    cmc,
    colors, // ['W', 'U', ...]
    colorIdentity: card.color_identity || [],
    typeLine,
    isCreature,
    isLand,
    isRemoval,
    isEvasion,
    oracleText: card.oracle_text || (card.card_faces ? card.card_faces[0].oracle_text : ''),
    power: card.power || null,
    toughness: card.toughness || null,
    breadCategory, // 'B', 'R', 'E', 'A', 'D'
    score: calculateCardScore(card, breadCategory)
  };
}

/**
 * Heuristic helper to check if a card is removal
 */
function checkIsRemoval(card) {
  const text = (card.oracle_text || (card.card_faces ? card.card_faces[0].oracle_text : '') || '').toLowerCase();
  return text.includes('destroy target') ||
         text.includes('exile target') ||
         text.includes('deals ') && text.includes('damage to target') ||
         text.includes('counter target spell') ||
         text.includes('fight target') ||
         text.includes('-x/-x') ||
         text.includes('put target') && text.includes('into its owner\'s library');
}

/**
 * Heuristic helper to check if card has evasion
 */
function checkIsEvasion(card) {
  const text = (card.oracle_text || (card.card_faces ? card.card_faces[0].oracle_text : '') || '').toLowerCase();
  const keywords = card.keywords || [];
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  return lowerKeywords.includes('flying') ||
         lowerKeywords.includes('trample') ||
         lowerKeywords.includes('menace') ||
         lowerKeywords.includes('skulk') ||
         text.includes('can\'t be blocked') ||
         text.includes('flying');
}

/**
 * Categorize card according to BREAD for coach mode
 */
function categorizeBREAD(card, isRemoval, isEvasion) {
  if (card.rarity === 'mythic' || card.rarity === 'rare') {
    if (card.cmc <= 6 && !card.type_line?.toLowerCase().includes('land')) return 'B'; // Bomb
  }
  if (isRemoval) return 'R';
  if (isEvasion) return 'E';
  if (card.type_line?.toLowerCase().includes('creature')) return 'A';
  return 'D';
}

/**
 * Calculate a base score (1 - 10) for AI bot drafting
 */
function calculateCardScore(card, breadCategory) {
  let score = 5.0;
  if (card.rarity === 'mythic') score += 3.0;
  else if (card.rarity === 'rare') score += 2.0;
  else if (card.rarity === 'uncommon') score += 1.0;

  if (breadCategory === 'B') score += 2.5;
  if (breadCategory === 'R') score += 2.0;
  if (breadCategory === 'E') score += 1.2;

  // Penalty for high CMC unless mythic/rare
  if (card.cmc >= 6 && card.rarity !== 'mythic' && card.rarity !== 'rare') {
    score -= 1.5;
  }

  return Math.min(10, Math.max(1, score));
}

/**
 * Fetch card pool for a specific set from Scryfall (supports unreleased & spoiler sets!)
 */
export async function fetchSetCardPool(setCode) {
  const cleanCode = setCode.trim().toLowerCase();

  if (cardPoolCache.has(cleanCode)) {
    return cardPoolCache.get(cleanCode);
  }

  const localStorageKey = `mtg_draft_pool_${cleanCode}`;
  const cachedLocal = localStorage.getItem(localStorageKey);
  if (cachedLocal) {
    try {
      const parsed = JSON.parse(cachedLocal);
      if (parsed && parsed.length > 20) {
        cardPoolCache.set(cleanCode, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Failed parsing local storage cache', e);
    }
  }

  try {
    // Try standard query with is:booster, or fallback to set:code if set is unreleased / spoiled
    let url = `${SCRYFALL_BASE}/cards/search?q=e%3A${cleanCode}+is%3Abooster&unique=cards`;
    let response = await fetch(url);

    // If no booster cards found (e.g. unreleased set during spoiler season), query all cards in set
    if (!response.ok) {
      url = `${SCRYFALL_BASE}/cards/search?q=set%3A${cleanCode}&unique=cards`;
      response = await fetch(url);
    }

    if (!response.ok) {
      throw new Error(`Scryfall HTTP error ${response.status}`);
    }

    const data = await response.json();
    let rawCards = data.data || [];

    // Fetch page 2 if available
    if (data.has_more && data.next_page) {
      try {
        const page2Res = await fetch(data.next_page);
        if (page2Res.ok) {
          const page2Data = await page2Res.json();
          rawCards = [...rawCards, ...(page2Data.data || [])];
        }
      } catch (err) {
        console.warn('Could not fetch page 2', err);
      }
    }

    const normalizedCards = rawCards.map(normalizeCard);

    // Save in cache
    cardPoolCache.set(cleanCode, normalizedCards);
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(normalizedCards));
    } catch (e) {
      // Storage quota fallback
    }

    return normalizedCards;
  } catch (err) {
    console.error('Error fetching set card pool from Scryfall:', err);
    throw err;
  }
}
