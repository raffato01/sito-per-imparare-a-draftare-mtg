// AI Bot draft decision engine for MTG Draft Academy with 3 difficulty levels

/**
 * Evaluates a pack of cards from the perspective of an AI Bot player
 * @param {Array} packCards - Cards remaining in the pack
 * @param {Array} botPool - Cards already picked by this bot
 * @param {number} packNum - Current pack number (1, 2, or 3)
 * @param {number} pickNum - Current pick number (1 to 15)
 * @param {string} difficulty - 'easy', 'normal', 'hard'
 * @returns {Object} The chosen card object from packCards
 */
export function botPickCard(packCards, botPool = [], packNum = 1, pickNum = 1, difficulty = 'normal') {
  if (!packCards || packCards.length === 0) return null;

  // Easy bot: picks randomly among top 3 highest rarity/score cards without strict color strategy
  if (difficulty === 'easy') {
    const topScorers = [...packCards].sort((a, b) => (b.score || 5) - (a.score || 5)).slice(0, 3);
    return topScorers[Math.floor(Math.random() * topScorers.length)] || packCards[0];
  }

  // Normal or Hard Bot Logic
  const colorPreferences = calculateColorPreferences(botPool);
  const totalPicked = botPool.length;

  let bestCard = packCards[0];
  let bestScore = -999;

  for (const card of packCards) {
    let cardScore = card.score || 5.0;

    if (totalPicked < 4 && packNum === 1) {
      // Early Draft: Pick raw power / bomb cards
      if (card.colors && card.colors.length === 1) cardScore += 0.5;
    } else {
      // Pick 5+ in Pack 1 or Packs 2 & 3: Color Commitment
      const matchingColorsCount = card.colors.filter(c => colorPreferences.topColors.includes(c)).length;

      if (card.colors.length === 0) {
        // Colorless card (Artifact/Land)
        cardScore += difficulty === 'hard' ? 2.0 : 1.5;
      } else if (matchingColorsCount > 0) {
        if (card.colors.length === 1) {
          cardScore += difficulty === 'hard' ? 4.5 : 3.5;
        } else if (card.colors.every(c => colorPreferences.topColors.includes(c))) {
          cardScore += difficulty === 'hard' ? 5.5 : 4.0; // Perfect 2-color gold match
        } else {
          cardScore += 1.0;
        }
      } else {
        // Off-color card penalty
        cardScore -= difficulty === 'hard' ? 5.0 : 3.0;
      }
    }

    // Mana Curve Balance Adjustment
    if (totalPicked >= 6 && card.isCreature) {
      const currentCurve = calculateManaCurve(botPool);
      const cmc = Math.min(card.cmc, 6);
      
      // Pro Bot (Hard): Heavy priority on 2 and 3 drop creatures
      if (cmc === 2 && currentCurve[2] < 5) {
        cardScore += difficulty === 'hard' ? 2.5 : 1.5;
      }
      if (cmc === 3 && currentCurve[3] < 4) {
        cardScore += difficulty === 'hard' ? 2.0 : 1.0;
      }
      // Penalty for 5+ drops if already holding 3+
      if (cmc >= 5 && currentCurve['5+'] >= 3) {
        cardScore -= difficulty === 'hard' ? 2.8 : 1.5;
      }
    }

    // Removal Priority
    if (card.isRemoval) {
      const currentRemovalCount = botPool.filter(c => c.isRemoval).length;
      if (currentRemovalCount < 5) {
        cardScore += difficulty === 'hard' ? 2.8 : 1.8;
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
 * Suggests the best card for the Human player in Coach Mode with an Italian/English explanation
 */
export function getCoachSuggestion(packCards, playerPool = [], lang = 'it') {
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
        cardReason = lang === 'it' 
          ? `💣 **BOMBA DI PACK 1**: Carta eccezionale per valore assoluto. Perfetta per iniziare il draft!`
          : `💣 **PACK 1 BOMB**: Premium card with high raw value. Great first pick!`;
      } else if (card.breadCategory === 'R') {
        score += 2.5;
        cardReason = lang === 'it'
          ? `⚡ **OTTIMA RIMOZIONE**: Nel Limited rimuovere le creature nemiche è fondamentale.`
          : `⚡ **GREAT REMOVAL**: Removing opposing threats is key in Limited.`;
      } else if (card.breadCategory === 'E') {
        score += 1.5;
        cardReason = lang === 'it'
          ? `🦅 **CREATURA EVASIVA**: Volare/Evasione ti farà vincere molte partite stallate.`
          : `🦅 **EVASIVE CREATURE**: Flying/Evasion breaks board stalls.`;
      } else {
        cardReason = lang === 'it'
          ? `🛡️ Carta solida da considerare nei primi pick.`
          : `🛡️ Solid card to consider in early picks.`;
      }
    } else {
      const matchesColor = card.colors.some(c => colorPrefs.topColors.includes(c)) || card.colors.length === 0;
      if (matchesColor) {
        score += 3.0;
        if (card.isRemoval) {
          cardReason = lang === 'it'
            ? `⚡ **RIMOZIONE NEI TUOI COLORI**: Si inserisce perfettamente nei colori che stai costruendo (${colorPrefs.topColors.join('/')}).`
            : `⚡ **ON-COLOR REMOVAL**: Fits your active colors (${colorPrefs.topColors.join('/')}).`;
        } else if (card.breadCategory === 'B') {
          cardReason = lang === 'it'
            ? `💣 **BOMBA NEI TUOI COLORI**: Carta devastante nei colori ${colorPrefs.topColors.join('/')}!`
            : `💣 **ON-COLOR BOMB**: Devastating bomb card in ${colorPrefs.topColors.join('/')}!`;
        } else {
          cardReason = lang === 'it'
            ? `🎯 **SI ALLINEA AI TUOI COLORI**: Continua a rafforzare la tua combinazione (${colorPrefs.topColors.join('/')}).`
            : `🎯 **COLOR SYNERGY**: Aligns with your archetype (${colorPrefs.topColors.join('/')}).`;
        }
      } else {
        score -= 2.5;
        cardReason = lang === 'it'
          ? `⚠️ Fuori dai tuoi colori principali (${colorPrefs.topColors.join('/')}). Sceglila solo se intendi cambiare colore.`
          : `⚠️ Off your main colors (${colorPrefs.topColors.join('/')}). Pick only if pivoting.`;
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
    reason: reason || (lang === 'it' ? 'Carta consigliata per valore e sinergia.' : 'Recommended pick for value and synergy.')
  };
}
