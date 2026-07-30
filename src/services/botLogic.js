// AI Bot draft decision engine for MTG Draft Academy

/**
 * Evaluates a pack of cards from the perspective of an AI Bot player
 * @param {Array} packCards - Cards remaining in the pack
 * @param {Array} botPool - Cards already picked by this bot
 * @param {number} packNum - Current pack number (1, 2, or 3)
 * @param {number} pickNum - Current pick number (1 to 15)
 * @returns {Object} The chosen card object from packCards
 */
export function botPickCard(packCards, botPool = [], packNum = 1, pickNum = 1) {
  if (!packCards || packCards.length === 0) return null;

  // Determine Bot's preferred colors based on current pool
  const colorPreferences = calculateColorPreferences(botPool);
  const totalPicked = botPool.length;

  let bestCard = packCards[0];
  let bestScore = -999;

  for (const card of packCards) {
    let cardScore = card.score || 5.0;

    // Color Synergies / Commitment
    if (totalPicked < 4 && packNum === 1) {
      // Early in Draft: Pick raw power / bomb cards (flexible)
      if (card.colors && card.colors.length === 1) {
        cardScore += 0.5; // Slight preference for monocolor
      }
    } else {
      // Pick 5+ in Pack 1, or Packs 2 & 3: Commit to bot's top colors
      const matchingColorsCount = card.colors.filter(c => colorPreferences.topColors.includes(c)).length;

      if (card.colors.length === 0) {
        // Colorless card (Artifact/Land) - flexible for any deck!
        cardScore += 1.5;
      } else if (matchingColorsCount > 0) {
        // Fits bot's colors
        if (card.colors.length === 1) {
          cardScore += 3.5; // Strong bonus for monocolor matching bot colors
        } else if (card.colors.every(c => colorPreferences.topColors.includes(c))) {
          cardScore += 4.0; // Perfect 2-color gold match
        } else {
          cardScore += 1.0; // Multi-color partial match
        }
      } else {
        // Off-color card penalty
        cardScore -= 3.0;
      }
    }

    // Mana Curve Balance Adjustment
    if (totalPicked >= 8 && card.isCreature) {
      const currentCurve = calculateManaCurve(botPool);
      const cmc = Math.min(card.cmc, 6);
      
      // Need 2 and 3 drops badly if lacking
      if ((cmc === 2 && currentCurve[2] < 4) || (cmc === 3 && currentCurve[3] < 3)) {
        cardScore += 1.5;
      }
      // Too many 5+ drops penalty
      if (cmc >= 5 && currentCurve['5+'] >= 4) {
        cardScore -= 1.8;
      }
    }

    // Need for Removal
    if (card.isRemoval) {
      const currentRemovalCount = botPool.filter(c => c.isRemoval).length;
      if (currentRemovalCount < 4) {
        cardScore += 1.8;
      }
    }

    if (cardScore > bestScore) {
      bestScore = cardScore;
      bestCard = card;
    }
  }

  return bestCard;
}

/**
 * Calculates bot's primary 2 color preferences based on picked pool
 */
function calculateColorPreferences(botPool) {
  const colorCounts = { W: 0, U: 0, B: 0, R: 0, G: 0 };

  botPool.forEach(card => {
    if (card.colors && card.colors.length > 0) {
      card.colors.forEach(c => {
        if (colorCounts[c] !== undefined) {
          colorCounts[c] += 1;
        }
      });
    }
  });

  const sortedColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  return {
    primaryColor: sortedColors[0] || 'W',
    secondaryColor: sortedColors[1] || 'U',
    topColors: [sortedColors[0] || 'W', sortedColors[1] || 'U'],
    counts: colorCounts
  };
}

/**
 * Helper to count current curve in pool
 */
function calculateManaCurve(pool) {
  const curve = { 1: 0, 2: 0, 3: 0, 4: 0, '5+': 0 };
  pool.forEach(card => {
    if (card.isCreature || !card.isLand) {
      const cmc = card.cmc;
      if (cmc <= 1) curve[1]++;
      else if (cmc === 2) curve[2]++;
      else if (cmc === 3) curve[3]++;
      else if (cmc === 4) curve[4]++;
      else curve['5+']++;
    }
  });
  return curve;
}

/**
 * Suggests the best card for the Human player in Coach Mode with an Italian explanation
 */
export function getCoachSuggestion(packCards, playerPool = []) {
  if (!packCards || packCards.length === 0) return null;

  const colorPrefs = calculateColorPreferences(playerPool);
  const totalPicked = playerPool.length;

  let bestCard = null;
  let maxScore = -999;
  let reason = '';

  packCards.forEach(card => {
    let score = card.score || 5.0;
    let cardReason = '';

    if (totalPicked < 5) {
      if (card.breadCategory === 'B') {
        score += 3.5;
        cardReason = `💣 **BOMBA DI PACK 1**: Carta eccezionale per valore assoluto. Perfetta per iniziare il draft!`;
      } else if (card.breadCategory === 'R') {
        score += 2.5;
        cardReason = `⚡ **OTTIMA RIMOZIONE**: Nel Limited rimuovere le creature nemiche è fondamentale.`;
      } else if (card.breadCategory === 'E') {
        score += 1.5;
        cardReason = `🦅 **CREATURA EVASIVA**: Volare/Evasione ti farà vincere molte partite stallate.`;
      } else {
        cardReason = `🛡️ Carta solida da considerare nei primi pick.`;
      }
    } else {
      const matchesColor = card.colors.some(c => colorPrefs.topColors.includes(c)) || card.colors.length === 0;
      if (matchesColor) {
        score += 3.0;
        if (card.isRemoval) {
          cardReason = `⚡ **RIMOZIONE NEI TUOI COLORI**: Si inserisce perfettamente nei colori che stai costruendo (${colorPrefs.topColors.join('/')}).`;
        } else if (card.breadCategory === 'B') {
          cardReason = `💣 **BOMBA NEI TUOI COLORI**: Carta devastante nei colori ${colorPrefs.topColors.join('/')}!`;
        } else {
          cardReason = `🎯 **SI ALLINEA AI TUOI COLORI**: Continua a rafforzare la tua combinazione (${colorPrefs.topColors.join('/')}).`;
        }
      } else {
        score -= 2.5;
        cardReason = `⚠️ Fuori dai tuoi colori principali (${colorPrefs.topColors.join('/')}). Sceglila solo se intendi cambiare colore.`;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestCard = card;
      reason = cardReason;
    }
  });

  return {
    suggestedCard: bestCard,
    reason: reason || 'Carta consigliata per valore e sinergia nel mazzo.'
  };
}
