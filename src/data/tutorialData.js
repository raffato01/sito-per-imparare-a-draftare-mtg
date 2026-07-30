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
  },
  {
    id: 'modern_eval',
    title: '3. Oltre B.R.E.A.D.: 17Lands & Teoria dei Quadranti',
    subtitle: 'La valutazione moderna usata dai Pro-Player attuali',
    titles: {
      it: '3. Oltre B.R.E.A.D.: 17Lands & Teoria dei Quadranti',
      en: '3. Beyond B.R.E.A.D.: 17Lands & Quadrant Theory'
    },
    subtitles: {
      it: 'La valutazione moderna usata dai Pro-Player attuali',
      en: 'Modern evaluation frameworks used by current Pros'
    },
    icon: 'BarChart2',
    badge: 'Valutazione Avanzata',
    contents: {
      it: `
La regola B.R.E.A.D. è stata inventata oltre 20 anni fa. Nel Magic moderno le carte sono molto più veloci e sinergiche! I pro-player attuali usano due strumenti avanzati:

### 1. I Dati di 17Lands.com (GIH WR% & Lettere A/B/C/D/F):
*17Lands* traccia milioni di partite su MTG Arena calcolando il **GIH WR%** (*Game-In-Hand Win Rate*), ovvero la percentuale di vittoria quando quella carta si trova nella tua mano iniziale o viene pescata durante la partita.
- **Grado A (GIH WR% > 60%)**: Bombe che vincono da sole.
- **Grado B (GIH WR% 56-60%)**: Ottime carte, da prendere subito nei tuoi colori.
- **Grado C (GIH WR% 53-56%)**: Carte solide e riempitivi necessari per la curva.
- **Grado D / F (GIH WR% < 52%)**: Carte inefficaci o troppi costi situazionali.

### 2. La Teoria dei Quadranti (Quadrant Theory):
Sviluppata dal famoso podcast *Limited Resources*, valuta ogni carta in **4 fasi di gioco**:
1. **Sviluppo (Developing)**: Funziona bene nei turni 1-3? (es. 2/2 a costo 2).
2. **In Vantaggio (Ahead)**: Ti aiuta a chiudere la partita se stai già vincendo?
3. **In Svantaggio (Behind)**: Ti salva la vita se sei sotto pressione o stavi perdendo? (es. Rimozioni o bloccanti enormi).
4. **Stallo del Campo (Parity)**: Sblocca la situazione quando entrambi i giocatori hanno molte creature in campo? (es. Volanti o Bombe).

> 💡 **La regola d'oro moderna**: Le carte migliori sono quelle che eccellono sia in *Sviluppo* che quando sei *In Svantaggio*!
      `,
      en: `
B.R.E.A.D. was created over 20 years ago. In modern Magic, sets are faster and far more synergy-driven! Modern pros rely on two advanced tools:

### 1. 17Lands.com Data (GIH WR% & A/B/C/D Letter Grades):
*17Lands* tracks millions of games on MTG Arena to calculate **GIH WR%** (*Game-In-Hand Win Rate*): the win percentage when that card is drawn.
- **Grade A (GIH WR% > 60%)**: Game-winning bombs.
- **Grade B (GIH WR% 56-60%)**: Premium spells, auto-include in your colors.
- **Grade C (GIH WR% 53-56%)**: Solid role-players & curve fillers.
- **Grade D / F (GIH WR% < 52%)**: Weak or overly narrow cards.

### 2. Quadrant Theory:
Popularized by the *Limited Resources* podcast, it evaluates cards across **4 game states**:
1. **Developing**: Is it good on turns 1-3? (e.g. 2-drop 2/2).
2. **Ahead**: Does it help close the game when you are already winning?
3. **Behind**: Does it save you when you are behind on board? (e.g. Removal or big blockers).
4. **Parity**: Does it break board stalls? (e.g. Flying or massive threats).

> 💡 **Modern golden rule**: The best cards are those that perform great both in *Developing* and when you are *Behind*!
      `
    },
    highlightList: {
      it: [
        '17Lands GIH WR%: Dati reali su milioni di partite',
        'Grado A/B/C/D/F più preciso del semplice BREAD',
        'Teoria dei Quadranti: Valuta la carta nelle 4 fasi di gioco',
        'Privilegia carte buone quando sei IN SVANTAGGIO per rimontare'
      ],
      en: [
        '17Lands GIH WR%: Empirical data from millions of Arena games',
        'A/B/C/D/F Grade system is far more accurate than BREAD',
        'Quadrant Theory: Evaluates performance across all 4 game states',
        'Prioritize cards that help when you are BEHIND'
      ]
    }
  },
  {
    id: 'deckbuilding',
    title: '4. Deckbuilding & Curva di Mana',
    subtitle: 'Come trasformare le tue scelte in un mazzo vincente',
    titles: {
      it: '4. Deckbuilding & Curva di Mana',
      en: '4. Deckbuilding & Mana Curve'
    },
    subtitles: {
      it: 'Come trasformare le tue scelte in un mazzo vincente',
      en: 'How to turn your drafted cards into a winning deck'
    },
    icon: 'Layers',
    badge: 'Costruzione Mazzo',
    contents: {
      it: `
Avere buone carte non basta, serve un mazzo bilanciato! A fine Draft avrai circa 45 carte, ma il tuo mazzo dovrà essere di **esattamente 40 carte** (è il numero ideale per pescare le carte migliori più spesso).

### La Proporzione d'Oro (17-15-8):
- **17 Terre**: Di solito divise tra i tuoi 2 colori primari (es. 9 Foreste, 8 Montagne).
- **15-18 Creature**: Hai bisogno di pezzi sulla scacchiera per attaccare e difendere.
- **5-8 Magie non creatura**: Rimozioni, potenziamenti o magie per pescare.

### La Curva di Mana:
Una partita si vince nei primi turni. Non puoi avere solo Draghi a costo 6! La tua **Curva di Mana** deve concentrarsi sui costi bassi:
- **Costo 1**: 0-2 carte (non fondamentali nel Draft).
- **Costo 2**: 4-6 carte (FONDAMENTALI! Ti servono creature da giocare subito).
- **Costo 3**: 4-6 carte (Il cuore del mazzo).
- **Costo 4**: 3-5 carte.
- **Costo 5+**: 2-4 carte (Le tue 'Bombe' di fine partita).
      `,
      en: `
Drafting good cards isn't enough; you need a balanced deck! At the end of the Draft you will have around 45 cards, but your deck should be **exactly 40 cards** (the minimum allowed, which maximizes your chances of drawing your best cards).

### The Golden Ratio (17-15-8):
- **17 Lands**: Usually split between your 2 primary colors (e.g. 9 Forests, 8 Mountains).
- **15-18 Creatures**: You need a solid board presence to attack and defend.
- **5-8 Non-creature Spells**: Removals, combat tricks, and card draw.

### The Mana Curve:
Games are often decided in the early turns. You can't rely just on 6-mana Dragons! Your **Mana Curve** should peak at lower costs:
- **1-drops**: 0-2 cards (usually low impact in Draft).
- **2-drops**: 4-6 cards (CRITICAL! You need proactive early plays).
- **3-drops**: 4-6 cards (The core of your deck).
- **4-drops**: 3-5 cards.
- **5+ drops**: 2-4 cards (Your late-game 'Bombs').
      `
    },
    highlightList: {
      it: [
        'Mazzo da ESATTAMENTE 40 carte (mai di più!)',
        '17 Terre sono lo standard d\'oro',
        'Almeno 15 Creature per avere stabilità sul campo',
        'Punta ad avere molte creature a costo 2 e 3 mana'
      ],
      en: [
        'EXACTLY 40-card deck (never play more!)',
        '17 Lands is the golden standard',
        'At least 15 Creatures for consistent board presence',
        'Focus heavily on 2-drop and 3-drop creatures'
      ]
    }
  },
  {
    id: 'signals',
    title: '5. Trovare la tua Corsia (Segnali)',
    subtitle: 'Capire quali colori sono "aperti" al tavolo',
    titles: {
      it: '5. Trovare la tua Corsia (Segnali)',
      en: '5. Reading Signals (Finding your Lane)'
    },
    subtitles: {
      it: 'Capire quali colori sono "aperti" al tavolo',
      en: 'Understanding which colors are "open" at the table'
    },
    icon: 'Flame',
    badge: 'Strategia Avanzata',
    contents: {
      it: `
Durante il primo pacchetto, la cosa più importante non è forzare i colori della tua prima "Bomba", ma **rimanere aperti** e leggere i segnali.

### Cos'è un Segnale?
Se al Pick 5 o 6 ti arriva una carta *Removal* fortissima o una *Creatura eccezionale* Nera, significa che i 4 giocatori alla tua destra **non stanno draftando Nero**. Quel colore è **"aperto"**.
Se ti posizioni su un colore aperto, sarai ricompensato nel Pacchetto 2 e 3 con tantissime carte forti di quel colore!

### Regole d'Oro per la Scelta dei Colori:
- **Pick 1-3**: Scegli semplicemente le carte più forti in assoluto (Bombe e Rimozioni), a prescindere dal colore.
- **Pick 4-8**: Osserva cosa ti arriva di buono. Inizia a delineare i tuoi **2 colori principali**.
- **Mai 3 colori (all'inizio)**: Evita di giocare 3 colori senza Terre speciali (fixing), altrimenti rischierai di avere in mano carte che non puoi lanciare (il famoso *Mana Screw*). Resta su 2 colori!
      `,
      en: `
During the first pack, the most important thing is not forcing the colors of your first "Bomb", but **staying open** and reading signals.

### What is a Signal?
If at Pick 5 or Pick 6 you are passed an incredibly strong Black *Removal* or premium *Creature*, it means the 4 players passing to you are likely **not drafting Black**. That color is **"open"**.
If you move into an open color, you will be heavily rewarded in Pack 2 and Pack 3 with great cards!

### Golden Rules for Color Commitment:
- **Pick 1-3**: Simply take the most powerful cards overall (Bombs & Premium Removal), regardless of color.
- **Pick 4-8**: Notice what strong cards are late in the pack. Start committing to your **2 primary colors**.
- **Avoid 3 colors (usually)**: Unless you draft a lot of mana fixing (dual lands), stick to a strict 2-color deck. Playing 3 colors increases the risk of not having the right mana (*Mana Screw*).
      `
    },
    highlightList: {
      it: [
        'Pick 1-3: Prendi le carte più forti',
        'Pick 4-8: Leggi i segnali (carte forti passate tardi)',
        'Un colore "aperto" ti premierà nei pack successivi',
        'Gioca sempre 2 Colori (non 1, non 3)'
      ],
      en: [
        'Pick 1-3: Take the highest power level cards',
        'Pick 4-8: Read signals (premium cards passed late)',
        'Moving into an "open" color rewards you later',
        'Always play a 2-Color deck (not 1, not 3)'
      ]
    }
  }
];

// Set Ratings, Speed & Top Archetypes Data for Set Guides
export const SET_GUIDES = [
  {
    code: 'fdn',
    name: 'Foundations (FDN)',
    difficulty: 'Principiante',
    speed: 'Medio (Sinergico)',
    rating: 'S-Tier (Ideale per Imparare)',
    ratings: {
      it: 'S-Tier (Set Perfetto per Iniziare)',
      en: 'S-Tier (Perfect Beginner Set)'
    },
    description: {
      it: 'Foundations è il set ideale per fare pratica. Le meccaniche sono chiare e i 10 archetipi bicolore sono ben bilanciati.',
      en: 'Foundations is the ideal set for practice. Mechanics are straightforward and the 10 color pairs are well balanced.'
    },
    topArchetypes: [
      {
        pair: 'R-W (Boros Aggro)',
        desc: {
          it: 'Aggro velocissimo basato su creature a basso costo e magie di rimozione dirette (Danni & Sparatutto).',
          en: 'Super fast aggro with low-cost creatures and direct burn spells.'
        }
      },
      {
        pair: 'U-B (Dimir Control)',
        desc: {
          it: 'Controllo basato su magie di rimozione nere, peschini blu e creature con evasione (Volare).',
          en: 'Control deck with black removal, blue card draw, and flying win conditions.'
        }
      },
      {
        pair: 'G-W (Selesnya Tokens)',
        desc: {
          it: 'Creazione di pedine creatura e potenziamenti di massa per travolgere l\'avversario.',
          en: 'Token generation and team pump spells to overwhelm opponents.'
        }
      }
    ],
    proTip: {
      it: 'In Foundations, assicurati di avere almeno 5-6 creature a costo 2 mana per non subire l\'aggressività di Boros!',
      en: 'In Foundations, make sure you draft at least 5-6 two-drop creatures to survive early aggression!'
    }
  },
  {
    code: 'blb',
    name: 'Bloomburrow (BLB)',
    difficulty: 'Medio',
    speed: 'Veloce (Molto Sinergico)',
    rating: 'A-Tier (Molto Divertente)',
    ratings: {
      it: 'A-Tier (Set basato su Tribù & Sinergie)',
      en: 'A-Tier (Tribal Synergy Focused)'
    },
    description: {
      it: 'Bloomburrow ruota attorno alle tribù animali. Scegliere la tribù giusta nel tuo colore principale è la chiave per vincere.',
      en: 'Bloomburrow revolves around animal tribes. Synergizing with your main color tribe is key to victory.'
    },
    topArchetypes: [
      {
        pair: 'W-B (Orzhov Pipistrelli / Lifegain)',
        desc: {
          it: 'Volanti con abilità legate al guadagno e perdita di punti vita nello stesso turno.',
          en: 'Flyers triggering bonus effects when gaining or losing life each turn.'
        }
      },
      {
        pair: 'R-G (Gruul Rprocioni / Foraggiare)',
        desc: {
          it: 'Creature enormi e meccanica Foraggiare per spendere mana ed attivare effetti devastanti.',
          en: 'Huge creatures and Expend mechanic rewarding you for spending mana.'
        }
      },
      {
        pair: 'U-R (Izzet Lontre / Spellslinger)',
        desc: {
          it: 'Lontre veloci che prendono +1/+1 ogni volta che lanci un istantaneo o stregoneria.',
          en: 'Fast Otters getting buffed whenever you cast instant or sorcery spells.'
        }
      }
    ],
    proTip: {
      it: 'Non mischiare troppe tribù diverse! Se giochi Topolini (R/W), resta focalizzato su equipaggiamenti e attacco.',
      en: 'Don\'t mix too many tribes! If drafting Mice (R/W), stay focused on equipment and heroic-style attacks.'
    }
  },
  {
    code: 'mh3',
    name: 'Modern Horizons 3 (MH3)',
    difficulty: 'Avanzato',
    speed: 'Alto Livello di Potenza',
    rating: 'S-Tier (Complesso & Entusiasmante)',
    ratings: {
      it: 'S-Tier (Set Complesso per Giocatori Esperti)',
      en: 'S-Tier (Complex High-Power Set)'
    },
    description: {
      it: 'Set ad altissima potenza con Eldrazi giganti, carte bifaccia (TDFC) ed energie. Richiede una grande conoscenza delle interazioni.',
      en: 'High power level set featuring massive Eldrazi, modal double-faced cards, and Energy synergies.'
    },
    topArchetypes: [
      {
        pair: 'G-U-C (Eldrazi Ramp / Colorless)',
        desc: {
          it: 'Genera scioni/spawn Eldrazi per lanciare minacce incolori colossali a costo 7+ mana.',
          en: 'Ramp Eldrazi spawns to hardcast devastating 7+ CMC colorless titans.'
        }
      },
      {
        pair: 'R-W (Boros Energy Aggro)',
        desc: {
          it: 'Accumula segnalini Energia per potenziare le tue creature e lanciare rimozioni a basso costo.',
          en: 'Accumulate Energy counters to power up low-cost aggressive attackers.'
        }
      }
    ],
    proTip: {
      it: 'Le terre incolori e il Mana Fixing sono fondamentali in MH3: prendi le terre bicolore nei primi pick!',
      en: 'Dual lands and mana fixing are premium in MH3: pick dual lands early in pack 1 & 2!'
    }
  }
];

export const GLOSSARY = [
  {
    term: '17Lands GIH WR%',
    desc: 'Percentuale di vittoria (Game-In-Hand Win Rate) calcolata su milioni di partite su MTG Arena. Il gold standard della valutazione moderna.',
    descs: {
      it: 'Percentuale di vittoria (Game-In-Hand Win Rate) calcolata su milioni di partite su MTG Arena. Il gold standard della valutazione moderna.',
      en: 'Game-In-Hand Win Rate calculated from millions of MTG Arena games. The gold standard of modern card evaluation.'
    }
  },
  {
    term: 'Teoria dei Quadranti (Quadrant Theory)',
    desc: 'Metodo di valutazione delle carte in 4 fasi: Sviluppo (turni 1-3), In Vantaggio, In Svantaggio, Stallo.',
    descs: {
      it: 'Metodo di valutazione delle carte in 4 fasi: Sviluppo (turni 1-3), In Vantaggio, In Svantaggio, Stallo.',
      en: 'Card evaluation framework analyzing performance across 4 game states: Developing, Ahead, Behind, Parity.'
    }
  },
  {
    term: 'BREAD',
    desc: 'Acronimo classico per prioritizzare i pick: Bombs, Removal, Evasion, Aggro, Dirt.',
    descs: {
      it: 'Acronimo classico per prioritizzare i pick: Bombs, Removal, Evasion, Aggro, Dirt.',
      en: 'Classic pick priority acronym: Bombs, Removal, Evasion, Aggro, Dregs.'
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
    term: 'Mana Curve / Curva di Mana',
    desc: 'Distribuzione delle carte nel mazzo in base al loro Costo di Mana (CMC).',
    descs: {
      it: 'Distribuzione delle carte nel mazzo in base al loro Costo di Mana (CMC). Ideale avere molte carte a costo 2 e 3.',
      en: 'Distribution of cards in your deck sorted by their Mana Cost (CMC). Ideal curve peaks at 2 and 3 drops.'
    }
  },
  {
    term: 'Removal / Rimozione',
    desc: 'Magie che distruggono, esiliano o neutralizzano creature o minacce avversarie.',
    descs: {
      it: 'Magie che distruggono, esiliano o neutralizzano creature o minacce avversarie.',
      en: 'Spells that destroy, exile, or counter opponent creatures and threats.'
    }
  }
];
