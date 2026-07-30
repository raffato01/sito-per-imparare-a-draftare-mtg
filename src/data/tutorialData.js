// Tutorial data for MTG Draft Academy (Bilingual: IT & EN)

export const TUTORIAL_LESSONS = [
  {
    id: 'intro',
    title: '1. Cos\'è il Draft di Magic?',
    subtitle: 'Il formato Limited più divertente e strategico',
    titles: {
      it: '1. Cos\'è il Draft di Magic?',
      en: '1. What is Magic Drafting?'
    },
    subtitles: {
      it: 'Il formato Limited più divertente e strategico',
      en: 'The most fun & strategic Limited format'
    },
    icon: 'Sparkles',
    badge: 'Fase Iniziale',
    content: `
Il **Draft** è un formato "Limited" di Magic: The Gathering. A differenza del formato Constructed (dove ciascun giocatore porta un mazzo già pronto da casa), nel Draft tutti i giocatori partono **sullo stesso piano** aprendo bustine sigillate sul momento.

### Come funziona un tavolo da 8 (o 6) giocatori:
- Ciascun giocatore riceve **3 bustine**.
- Si apre la **prima bustina**, si sceglie **1 carta** a testa e si passa il resto della bustina al giocatore alla propria **sinistra**.
- Si ripetono le scelte finché la prima bustina non è terminata.
- Si apre la **seconda bustina** e le carte girano verso **destra**!
- Infine si apre la **terza bustina** e le carte tornano a girare verso **sinistra**.

Alla fine del Draft avrai raccolto **42 o 45 carte**. Da questa collezione costruirai un mazzo di almeno **40 carte** (comprese le Terre base che ti verranno fornite).
    `,
    contents: {
      it: `
Il **Draft** è un formato "Limited" di Magic: The Gathering. A differenza del formato Constructed (dove ciascun giocatore porta un mazzo già pronto da casa), nel Draft tutti i giocatori partono **sullo stesso piano** aprendo bustine sigillate sul momento.

### Come funziona un tavolo da 8 (o 6) giocatori:
- Ciascun giocatore riceve **3 bustine**.
- Si apre la **prima bustina**, si sceglie **1 carta** a testa e si passa il resto della bustina al giocatore alla propria **sinistra**.
- Si ripetono le scelte finché la prima bustina non è terminata.
- Si apre la **seconda bustina** e le carte girano verso **destra**!
- Infine si apre la **terza bustina** e le carte tornano a girare verso **sinistra**.

Alla fine del Draft avrai raccolto **42 o 45 carte**. Da questa collezione costruirai un mazzo di almeno **40 carte** (comprese le Terre base che ti verranno fornite).
      `,
      en: `
**Draft** is a "Limited" format in Magic: The Gathering. Unlike Constructed formats (where players bring pre-built decks from home), everyone in a Draft starts on an **equal playing field** by opening sealed booster packs on the spot.

### How an 8 (or 6) player draft works:
- Every player receives **3 booster packs**.
- You open the **first pack**, pick **1 card**, and pass the rest to the player on your **left**.
- Repeat picking 1 card and passing until the first pack is empty.
- Open the **second pack** and pass cards to your **right**!
- Open the **third pack** and pass cards back to your **left**.

At the end of the draft you will have drafted **42 or 45 cards**. From this card pool you will build a deck of at least **40 cards** (including basic lands).
      `
    },
    highlights: [
      '3 Bustine da 15 carte per giocatore',
      'Mazzo finale di almeno 40 carte (non 60)',
      'Circa 17 Terre e 23 Carte nel mazzo finale',
      'Non possiedi già il mazzo: lo crei al momento!'
    ],
    highlightList: {
      it: [
        '3 Bustine da 15 carte per giocatore',
        'Mazzo finale di almeno 40 carte (non 60)',
        'Circa 17 Terre e 23 Carte nel mazzo finale',
        'Non possiedi già il mazzo: lo crei al momento!'
      ],
      en: [
        '3 Booster packs of 15 cards per player',
        'Minimum 40-card deck (not 60)',
        'Target ~17 Lands and ~23 Spells',
        'You build your deck live during the draft!'
      ]
    }
  },
  {
    id: 'bread',
    title: '2. La Regola d\'Oro B.R.E.A.D.',
    subtitle: 'Come capire quali carte scegliere per prime nelle bustine',
    titles: {
      it: '2. La Regola d\'Oro B.R.E.A.D.',
      en: '2. The B.R.E.A.D. Strategy Rule'
    },
    subtitles: {
      it: 'Come capire quali carte scegliere per prime nelle bustine',
      en: 'How to prioritize top cards in booster packs'
    },
    icon: 'Award',
    badge: 'Strategia di Pick',
    contents: {
      it: `
Quando apri una bustina di 15 carte, come decidi qual è la carta migliore? I pro-player di Magic usano la regola **B.R.E.A.D.** come guida di massima:

- **B - BOMBS (Bombe)** 💣: Carte capaci di vincere la partita da sole se non rimosse (es. Draghi volanti enormi, Planeswalker, creature leggendarie devastanti).
- **R - REMOVAL (Rimozioni)** ⚡: Magie ed istantanei che distruggono o esiliano le creature avversarie (es. *Fulmine*, *Omicidio*, *Lama del Destino*). Nel Limited le rimozioni sono preziosissime!
- **E - EVASION (Evasione)** 🦅: Creature con abilità difficili da bloccare, come *Volare*, *Travolgere*, *Intimidire* o *Furtivo*. In un formato dove il campo si intasa spesso, chi vola vince!
- **A - AGGRO / ABILITIES (Creature efficienti & Abilità)** 🛡️: Creature con buone statistiche rispetto al costo di mana (es. 2/2 a costo 2, 3/3 a costo 3) o carte con abilità utili.
- **D - DIRT / DREGS (Scarti)** 🗑️: Carte deboli o troppo specifiche che solitamente finiscono nella sideboard o non vorresti mai giocare.
      `,
      en: `
When opening a 15-card pack, how do you decide which card is best? Magic pro players use the **B.R.E.A.D.** acronym as a general guiding rule:

- **B - BOMBS** 💣: Game-winning threats that demand an immediate answer (e.g. huge Flying Dragons, Planeswalkers, devastating legendaries).
- **R - REMOVAL** ⚡: Spells that destroy or exile opposing creatures (e.g. *Lightning Bolt*, *Murder*, *Doom Blade*). Premium removal is king in Limited!
- **E - EVASION** 🦅: Creatures with hard-to-block abilities like *Flying*, *Trample*, *Menace*. When boards get stalled, flyers win games!
- **A - AGGRO / ABILITIES** 🛡️: Efficient creatures on curve (e.g. 2/2 for 2 mana, 3/3 for 3) or cards with solid board synergy.
- **D - DIRT / DREGS** 🗑️: Weak or situational cards that usually end up in your sideboard.
      `
    },
    highlights: [
      'B = Bombs (Devastanti)',
      'R = Removal (Fondamentali per la vittoria)',
      'E = Evasion (Creature che volano o non si bloccano)',
      'A = Aggro/Abilities (Creature solide in curva)',
      'D = Dregs (Carte da evitare)'
    ],
    highlightList: {
      it: [
        'B = Bombs (Devastanti)',
        'R = Removal (Fondamentali per la vittoria)',
        'E = Evasion (Creature che volano o non si bloccano)',
        'A = Aggro/Abilities (Creature solide in curva)',
        'D = Dregs (Carte da evitare)'
      ],
      en: [
        'B = Bombs (Game-ending threats)',
        'R = Removal (Essential for removing opponent threats)',
        'E = Evasion (Flying / Trample creatures win stalled games)',
        'A = Aggro/Abilities (Solid creatures on curve)',
        'D = Dregs (Filler/sideboard cards)'
      ]
    }
  }
];

export const GLOSSARY = [
  {
    term: 'BREAD',
    desc: 'Acronimo per prioritizzare i pick: Bombs, Removal, Evasion, Aggro, Dirt.',
    descs: {
      it: 'Acronimo per prioritizzare i pick: Bombs, Removal, Evasion, Aggro, Dirt.',
      en: 'Acronym for pick priority: Bombs, Removal, Evasion, Aggro, Dregs.'
    }
  },
  {
    term: 'Limited',
    desc: 'Formato in cui si costruisce un mazzo al momento da carte appena aperte (Draft o Sealed).',
    descs: {
      it: 'Formato in cui si costruisce un mazzo al momento da carte appena aperte (Draft o Sealed).',
      en: 'Format where players build decks live from freshly opened booster packs (Draft or Sealed).'
    }
  },
  {
    term: 'Mana Curve',
    desc: 'Distribuzione delle carte nel mazzo in base al loro Costo di Mana Convertito (CMC).',
    descs: {
      it: 'Distribuzione delle carte nel mazzo in base al loro Costo di Mana Convertito (CMC).',
      en: 'Distribution of cards in your deck sorted by their Mana Cost (CMC).'
    }
  },
  {
    term: 'Removal',
    desc: 'Magie che distruggono, esiliano o neutralizzano creature o minacce avversarie.',
    descs: {
      it: 'Magie che distruggono, esiliano o neutralizzano creature o minacce avversarie.',
      en: 'Spells that destroy, exile, or counter opponent creatures and threats.'
    }
  }
];
