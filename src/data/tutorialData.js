// Tutorial data for MTG Draft Academy (in Italian)

export const TUTORIAL_LESSONS = [
  {
    id: 'intro',
    title: '1. Cos\'è il Draft di Magic?',
    subtitle: 'Il formato Limited più divertente e strategico',
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
    highlights: [
      '3 Bustine da 15 carte per giocatore',
      'Mazzo finale di almeno 40 carte (non 60)',
      'Circa 17 Terre e 23 Carte nel mazzo finale',
      'Non possiedi già il mazzo: lo crei al momento!'
    ]
  },
  {
    id: 'bread',
    title: '2. La Regola d\'Oro B.R.E.A.D.',
    subtitle: 'Come capire quali carte scegliere per prime nelle bustine',
    icon: 'Award',
    badge: 'Strategia di Pick',
    content: `
Quando apri una bustina di 15 carte, come decidi qual è la carta migliore? I pro-player di Magic usano la regola **B.R.E.A.D.** come guida di massima:

- **B - BOMBS (Bombe)** 💣: Carte capaci di vincere la partita da sole se non rimosse (es. Draghi volanti enormi, Planeswalker, creature leggendarie devastanti).
- **R - REMOVAL (Rimozioni)** ⚡: Magie ed istantanei che distruggono o esiliano le creature avversarie (es. *Fulmine*, *Omicidio*, *Lama del Destino*). Nel Limited le rimozioni sono preziosissime!
- **E - EVASION (Evasione)** 🦅: Creature con abilità difficili da bloccare, come *Volare*, *Travolgere*, *Intimidire* o *Furtivo*. In un formato dove il campo si intasa spesso, chi vola vince!
- **A - AGGRO / ABILITIES (Creature efficienti & Abilità)** 🛡️: Creature con buone statistiche rispetto al costo di mana (es. 2/2 a costo 2, 3/3 a costo 3) o carte con abilità utili.
- **D - DIRT / DREGS (Scarti)** 🗑️: Carte deboli o troppo specifiche che solitamente finiscono nella sideboard o non vorresti mai giocare.

> 💡 **Consiglio Coach**: Nei primi pick (Pack 1) cerca sempre le Bombe o le giuste Rimozioni senza fissarti subito sui colori!
    `,
    highlights: [
      'B = Bombs (Devastanti)',
      'R = Removal (Fondamentali per la vittoria)',
      'E = Evasion (Creature che volano o non si bloccano)',
      'A = Aggro/Abilities (Creature solide in curva)',
      'D = Dregs (Carte da evitare)'
    ]
  },
  {
    id: 'deckbuilding',
    title: '3. Regole di Deckbuilding (La formula 17-15-8)',
    subtitle: 'Costruire un mazzo solido ed equilibrato dopo il draft',
    icon: 'Layers',
    badge: 'Costruzione Mazzo',
    content: `
Nel Limited il mazzo minimo è di **40 carte** (anziché 60). Per avere la massima consistenza e pescare sempre quello che ti serve, la regola migliore è giocare **ESATTAMENTE 40 carte**.

### La distribuzione perfetta (Regola del 17-15-8):
- 🏞️ **17 TERRE**: Di solito 8 di un colore e 9 di un altro per un mazzo a **2 Colori**.
- ⚔️ **15-16 CREATURE**: Servono per attaccare, difendere e applicare pressione sul campo.
- 🔮 **7-8 ALTRE MAGIE**: Principalmente Rimozioni, Trucchi da combattimento (Combat Tricks) e Pescaggi.

### Perché restare a 2 colori?
In Draft è molto difficile avere la base di mana per giocare 3 o 4 colori senza rischiare di non trovare le terre giuste (il cosiddetto "Mana Screw"). Concentrati su **2 Colori principali**!
    `,
    highlights: [
      'Mazzo esatto di 40 carte',
      '17 Terre (8/9 per colore)',
      '15+ Creature (ossatura del mazzo)',
      '7-8 Magie non-creatura (Rimozioni)',
      'Rimani su 2 Colori!'
    ]
  },
  {
    id: 'manacurve',
    title: '4. La Curva di Mana (Mana Curve)',
    subtitle: 'Assicurati di poter giocare carte ad ogni turno',
    icon: 'BarChart2',
    badge: 'Tempo & Ritmo',
    content: `
Non puoi riempire il mazzo solo di carte fortissime a costo 5 o 6, altrimenti l'avversario ti sconfiggerà prima che tu riesca a giocarle!

### Una Curva di Mana ideale assomiglia a una campana:
- **Costo 1**: 1 - 2 carte (magie veloci o piccole creature)
- **Costo 2**: 5 - 7 carte *(Il turno più importante nel limited!)*
- **Costo 3**: 4 - 6 carte
- **Costo 4**: 3 - 5 carte
- **Costo 5**: 2 - 3 carte
- **Costo 6+**: 0 - 2 carte (solo se sono vere Bombe!)

Se riesci a giocare una creatura a costo 2 al secondo turno, una a costo 3 al terzo e una a costo 4 al quarto, metterai un'enorme pressione sull'avversario!
    `,
    highlights: [
      'I costi a 2 e 3 mana sono le fondamenta del mazzo',
      'Evita troppi "drop a 5 o 6" per non restare bloccato',
      'Un mazzo fluido gioca sempre qualcosa in curva'
    ]
  },
  {
    id: 'signals',
    title: '5. Leggere i Segnali al Tavolo (Signals)',
    subtitle: 'Capire quali colori sono "aperti" dal tuo vicino',
    icon: 'Compass',
    badge: 'Avanzato',
    content: `
Durante i primi pick della Busta 1 (pick 4, 5, 6), fai attenzione a quali carte forti stanno ancora arrivando!

- Se al **pick 5** vedi una Rimozione Rossa fortissima o una Creatura Blu rara/non comune, significa che i giocatori alla tua destra **non stanno giocando quei colori**. Si dice che quel colore è **"Aperto"**!
- Invece se al pick 3 non vedi più carte Verdi buone, il giocatore alla tua destra sta probabilmente draftando Verde.
- Sii flessibile nei primi 4-5 pick, poi orientati verso i 2 colori che ti sembrano più aperti e forti!
    `,
    highlights: [
      'Flessibilità nei primi 4 pick',
      'Se arrivano carte forti al pick 5+, quel colore è aperto!',
      'Adattati a quello che ti passa il tavolo'
    ]
  }
];

export const GLOSSARY = [
  { term: 'BREAD', desc: 'Acronimo per prioritizzare i pick: Bombs, Removal, Evasion, Aggro, Dirt.' },
  { term: 'Limited', desc: 'Formato in cui si costruisce un mazzo al momento da carte appena aperte (Draft o Sealed).' },
  { term: 'Mana Curve', desc: 'Distribuzione delle carte nel mazzo in base al loro Costo di Mana Convertito (CMC).' },
  { term: 'Signal (Segnale)', desc: 'Indizio su quali colori stiano scegliendo i giocatori alla tua destra in base a cosa ti passano.' },
  { term: 'Sideboard', desc: 'Le carte rimanenti del draft non inserite nel mazzo da 40, usate tra una partita e l\'altra.' },
  { term: 'Removal', desc: 'Magie che distruggono, esiliano o neutralizzano creature o minacce avversarie.' },
  { term: 'Combat Trick', desc: 'Istantaneo giocato durante il combattimento per potenziare improvvisamente la propria creatura.' }
];
