// Smart Deckbuilding Coach Assistant Logic
// Analyzes drafted pool, auto-builds optimal 40-card deck (23 spells + 17 lands),
// and provides detailed strategy, curve evaluation, and archetype analysis.

import { BASIC_LANDS } from '../data/presetSets';

const COLOR_NAMES = {
  W: { it: 'Bianco', en: 'White' },
  U: { it: 'Blu', en: 'Blue' },
  B: { it: 'Nero', en: 'Black' },
  R: { it: 'Rosso', en: 'Red' },
  G: { it: 'Verde', en: 'Green' }
};

const PAIR_ARCHETYPES = {
  'W-U': { it: 'Azorius (Volanti & Controllo)', en: 'Azorius (Flying & Control)' },
  'U-B': { it: 'Dimir (Controllo & Cimitero)', en: 'Dimir (Control & Graveyard)' },
  'B-R': { it: 'Rakdos (Sacrificio & Aggro)', en: 'Rakdos (Sacrifice & Aggro)' },
  'R-G': { it: 'Gruul (Creature Enormi & Ramp)', en: 'Gruul (Stompy & Ramp)' },
  'G-W': { it: 'Selesnya (Pedine & +1/+1)', en: 'Selesnya (Tokens & +1/+1)' },
  'W-B': { it: 'Orzhov (Sanguisuga & Punti Vita)', en: 'Orzhov (Lifegain & Drain)' },
  'U-R': { it: 'Izzet (Magie Istantaneo & Sinergia)', en: 'Izzet (Spellslinger)' },
  'B-G': { it: 'Golgari (Cimitero & Decomposizione)', en: 'Golgari (Graveyard & Morbid)' },
  'R-W': { it: 'Boros (Aggro Veloce & Attacco)', en: 'Boros (Fast Aggro)' },
  'G-U': { it: 'Simic (Ramp & Valore)', en: 'Simic (Ramp & Value)' }
};

/**
 * Score individual card for inclusion quality.
 */
function scoreCardForDeck(card) {
  let score = 5.0;
  if (card.rarity === 'mythic') score += 3.5;
  else if (card.rarity === 'rare') score += 2.5;
  else if (card.rarity === 'uncommon') score += 1.5;

  if (card.isRemoval) score += 3.0;
  if (card.isEvasion) score += 2.0;
  if (card.breadCategory === 'B') score += 4.0;
  if (card.breadCategory === 'R') score += 3.0;

  // Favor 2-drop and 3-drop creatures for curve
  const cmc = card.cmc || 2;
  if (cmc === 2 || cmc === 3) score += 1.5;
  if (cmc > 6) score -= 1.5;

  return Math.max(1, score);
}

/**
 * Smart Auto-Build Algorithm:
 * Finds the best 2-color combination in the drafted pool, picks the top 23 spells,
 * adheres to a balanced mana curve, and calculates the 17 basic land split.
 */
export function buildSmartDeck(draftedPool, lang = 'it') {
  if (!draftedPool || draftedPool.length === 0) {
    return {
      maindeckSpells: [],
      sideboardSpells: [],
      landCounts: { W: 4, U: 4, B: 3, R: 3, G: 3 },
      primaryColors: ['W', 'U'],
      archetype: 'N/A',
      analysis: lang === 'it' ? 'Nessuna carta presente nel pool.' : 'No cards in pool.'
    };
  }

  // Filter out any basic lands already in pool
  const spellsPool = draftedPool.filter(c => !c.isLand && !c.typeLine?.toLowerCase().includes('basic land'));

  // 1. Evaluate total power score per color
  const colorScores = { W: 0, U: 0, B: 0, R: 0, G: 0 };
  const colorCounts = { W: 0, U: 0, B: 0, R: 0, G: 0 };

  spellsPool.forEach(card => {
    const cardScore = scoreCardForDeck(card);
    const colors = card.colors && card.colors.length > 0 ? card.colors : ['W'];
    colors.forEach(col => {
      if (colorScores[col] !== undefined) {
        colorScores[col] += cardScore;
        colorCounts[col] += 1;
      }
    });
  });

  // Pick top 2 colors by score
  const sortedColors = Object.keys(colorScores).sort((a, b) => colorScores[b] - colorScores[a]);
  const primaryColors = [sortedColors[0], sortedColors[1]];

  // 2. Separate cards matching primary colors vs off-color cards
  const primarySpells = [];
  const offColorSpells = [];

  spellsPool.forEach(card => {
    const cardCols = card.colors && card.colors.length > 0 ? card.colors : [];
    // Colorless cards fit any deck
    if (cardCols.length === 0) {
      primarySpells.push(card);
      return;
    }
    // Card belongs to primary colors if all its colors are in primaryColors
    const fitsPrimary = cardCols.every(c => primaryColors.includes(c));
    if (fitsPrimary) {
      primarySpells.push(card);
    } else {
      offColorSpells.push(card);
    }
  });

  // 3. Sort primary spells by quality score
  primarySpells.sort((a, b) => scoreCardForDeck(b) - scoreCardForDeck(a));

  // Target ~23 spells for a 40-card deck (leaving 17 slots for lands)
  let maindeckSpells = primarySpells.slice(0, 23);
  let sideboardSpells = primarySpells.slice(23).concat(offColorSpells);

  // If we don't have 23 primary spells, fill with highest rated off-color cards (or colorless)
  if (maindeckSpells.length < 23 && offColorSpells.length > 0) {
    offColorSpells.sort((a, b) => scoreCardForDeck(b) - scoreCardForDeck(a));
    const needed = 23 - maindeckSpells.length;
    const filler = offColorSpells.slice(0, needed);
    maindeckSpells = maindeckSpells.concat(filler);
    sideboardSpells = offColorSpells.slice(needed).concat(primarySpells.slice(23));
  }

  // 4. Calculate land distribution for 17 lands matching maindeck color symbols
  const colorSymbols = { W: 0, U: 0, B: 0, R: 0, G: 0 };
  maindeckSpells.forEach(c => {
    if (c.colors) {
      c.colors.forEach(col => {
        if (colorSymbols[col] !== undefined) colorSymbols[col]++;
      });
    }
  });

  const totalSymbols = (colorSymbols[primaryColors[0]] || 0) + (colorSymbols[primaryColors[1]] || 0);
  const landCounts = { W: 0, U: 0, B: 0, R: 0, G: 0 };

  if (totalSymbols === 0) {
    landCounts[primaryColors[0]] = 9;
    landCounts[primaryColors[1]] = 8;
  } else {
    const c1Share = Math.round((colorSymbols[primaryColors[0]] / totalSymbols) * 17);
    const c2Share = 17 - c1Share;
    landCounts[primaryColors[0]] = Math.max(6, Math.min(11, c1Share));
    landCounts[primaryColors[1]] = 17 - landCounts[primaryColors[0]];
  }

  // Archetype Identification
  const pairKey = [primaryColors[0], primaryColors[1]].sort().join('-');
  const archetypeObj = PAIR_ARCHETYPES[pairKey] || PAIR_ARCHETYPES['R-W'];
  const archetypeName = lang === 'it' ? archetypeObj.it : archetypeObj.en;

  const col1Name = COLOR_NAMES[primaryColors[0]][lang === 'it' ? 'it' : 'en'];
  const col2Name = COLOR_NAMES[primaryColors[1]][lang === 'it' ? 'it' : 'en'];

  const creatures = maindeckSpells.filter(c => c.isCreature).length;
  const removal = maindeckSpells.filter(c => c.isRemoval || c.breadCategory === 'R').length;

  const analysis = lang === 'it'
    ? `Il Coach ha identificato i tuoi colori migliori in **${col1Name} / ${col2Name}** (${archetypeName}). Il mazzo include **${creatures} Creature**, **${removal} Rimozioni** e una combinazione ideale di 17 Terre base (${landCounts[primaryColors[0]]} ${BASIC_LANDS[primaryColors[0]].name}, ${landCounts[primaryColors[1]]} ${BASIC_LANDS[primaryColors[1]].name}).`
    : `The Coach identified your best colors as **${col1Name} / ${col2Name}** (${archetypeName}). The deck includes **${creatures} Creatures**, **${removal} Removal spells**, and an optimal 17 Basic Land split (${landCounts[primaryColors[0]]} ${BASIC_LANDS[primaryColors[0]].type}, ${landCounts[primaryColors[1]]} ${BASIC_LANDS[primaryColors[1]].type}).`;

  return {
    maindeckSpells,
    sideboardSpells,
    landCounts,
    primaryColors,
    archetype: archetypeName,
    analysis
  };
}

/**
 * Evaluates an existing deck built by the user and provides actionable advice.
 */
export function analyzeUserDeck(maindeckSpells, landCounts, lang = 'it') {
  const isIT = lang === 'it';
  const totalLands = Object.values(landCounts).reduce((a, b) => a + b, 0);
  const totalCards = maindeckSpells.length + totalLands;

  const creaturesCount = maindeckSpells.filter(c => c.isCreature).length;
  const removalCount = maindeckSpells.filter(c => c.isRemoval || c.breadCategory === 'R').length;

  const twoDrops = maindeckSpells.filter(c => (c.cmc || 0) === 2).length;
  const threeDrops = maindeckSpells.filter(c => (c.cmc || 0) === 3).length;

  const tips = [];

  // 1. Total Deck Size
  if (totalCards === 40) {
    tips.push({
      status: 'success',
      text: isIT ? '✅ **Mazzo di 40 carte esatte!** Hai la probabilità massima di pescare le tue carte migliori.' : '✅ **Exact 40-card deck!** Maximum consistency for drawing top cards.'
    });
  } else if (totalCards < 40) {
    tips.push({
      status: 'warning',
      text: isIT ? `⚠️ **Mazzo incompleto (${totalCards}/40)**: Aggiungi ancora ${40 - totalCards} carte o terre prima di iniziare la partita.` : `⚠️ **Incomplete deck (${totalCards}/40)**: Add ${40 - totalCards} more cards or lands.`
    });
  } else {
    tips.push({
      status: 'warning',
      text: isIT ? `⚠️ **Troppe carte (${totalCards}/40)**: Rimuovi ${totalCards - 40} carte per rimanere a 40 carte esatte e migliorare la costanza.` : `⚠️ **Too many cards (${totalCards}/40)**: Remove ${totalCards - 40} cards to stay at 40.`
    });
  }

  // 2. Creature Count
  if (creaturesCount >= 14 && creaturesCount <= 18) {
    tips.push({
      status: 'success',
      text: isIT ? `✅ **Creature bilanciate (${creaturesCount})**: Numero ideale per dominare il campo da gioco.` : `✅ **Balanced creature count (${creaturesCount})**: Optimal count to control the battlefield.`
    });
  } else if (creaturesCount < 14) {
    tips.push({
      status: 'warning',
      text: isIT ? `⚠️ **Poche creature (${creaturesCount})**: Rischi di rimanere senza bloccanti. Cerca di averne almeno 15.` : `⚠️ **Low creature count (${creaturesCount})**: Risk of empty board. Aim for at least 15.`
    });
  }

  // 3. Removal Count
  if (removalCount >= 4) {
    tips.push({
      status: 'success',
      text: isIT ? `⚡ **Ottima presenza di Rimozioni (${removalCount})**: Riuscirai a neutralizzare le Bombe avversarie.` : `⚡ **Great Removal suite (${removalCount})**: Easily answer opponent Bombs.`
    });
  } else {
    tips.push({
      status: 'info',
      text: isIT ? `💡 **Poche rimozioni (${removalCount})**: Se hai rimozioni nel pool, prova a inserirle.` : `💡 **Low removal (${removalCount})**: Add removal spells from your pool if available.`
    });
  }

  // 4. Early Curve (2-drops)
  if (twoDrops >= 4) {
    tips.push({
      status: 'success',
      text: isIT ? `🏃 **Ottimo gioco nei primi turni (${twoDrops} creature a 2 mana)**.` : `🏃 **Solid early game (${twoDrops} 2-drop creatures)**.`
    });
  } else {
    tips.push({
      status: 'warning',
      text: isIT ? `⚠️ **Poche creature a costo 2 (${twoDrops})**: Rischi di subire danni nei primi turni.` : `⚠️ **Low 2-drops (${twoDrops})**: Vulnerable to early aggro pressure.`
    });
  }

  return { totalCards, creaturesCount, removalCount, twoDrops, threeDrops, tips };
}
