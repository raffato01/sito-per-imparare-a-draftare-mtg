// Preset MTG sets available for selection in the draft simulator
export const PRESET_SETS = [
  {
    code: 'fdn',
    name: 'Foundations (FDN)',
    releaseYear: 2024,
    icon: '✨',
    description: 'Il set perfetto per imparare le basi di Magic! Carte lineari, sinergiche e chiare.',
    difficulty: 'Principiante',
    bannerColor: 'from-amber-600 to-yellow-500'
  },
  {
    code: 'blb',
    name: 'Bloomburrow (BLB)',
    releaseYear: 2024,
    icon: '🐾',
    description: 'Un mondo incantevole di animaletti silvani: Topolini, Ranocchi, Pipistrelli e Scoiattoli.',
    difficulty: 'Medio',
    bannerColor: 'from-emerald-600 to-teal-500'
  },
  {
    code: 'mh3',
    name: 'Modern Horizons 3 (MH3)',
    releaseYear: 2024,
    icon: '⚡',
    description: 'Set ad alto livello di potenza! Eldrazi imponenti, carte complesse e abilità avanzate.',
    difficulty: 'Avanzato',
    bannerColor: 'from-purple-600 to-indigo-600'
  },
  {
    code: 'neo',
    name: 'Kamigawa: Neon Dynasty (NEO)',
    releaseYear: 2022,
    icon: '🌸',
    description: 'Cyberpunk incontra la mitologia giapponese: Ninjas, Samurai, Incantesimi e Veicoli.',
    difficulty: 'Medio',
    bannerColor: 'from-pink-600 to-purple-600'
  },
  {
    code: 'mom',
    name: 'March of the Machine (MOM)',
    releaseYear: 2023,
    icon: '🛡️',
    description: 'La battaglia finale contro i Phyrexiani con carte Battaglia e Leggende da tutto il multiverso.',
    difficulty: 'Medio-Alto',
    bannerColor: 'from-red-600 to-rose-600'
  }
];

export const BASIC_LANDS = {
  W: { name: 'Pianura', type: 'Plains', color: 'W', id: 'basic-land-w', image: 'https://cards.scryfall.io/normal/front/1/7/17d4787a-3932-4752-9ef8-e04e1e07dbfc.jpg?1730489993' },
  U: { name: 'Isola', type: 'Island', color: 'U', id: 'basic-land-u', image: 'https://cards.scryfall.io/normal/front/5/6/563842c2-9e29-4598-bf38-0955f442f88f.jpg?1730490001' },
  B: { name: 'Palude', type: 'Swamp', color: 'B', id: 'basic-land-b', image: 'https://cards.scryfall.io/normal/front/e/0/e06b3e34-5fb0-4e35-866a-12e02aa11e25.jpg?1730490010' },
  R: { name: 'Montagna', type: 'Mountain', color: 'R', id: 'basic-land-r', image: 'https://cards.scryfall.io/normal/front/a/e/aee52c21-f09c-4993-8a39-ec45e43a6d71.jpg?1730490020' },
  G: { name: 'Foresta', type: 'Forest', color: 'G', id: 'basic-land-g', image: 'https://cards.scryfall.io/normal/front/d/2/d2ef02a2-3f19-48e0-a7d0-8f9611b8b64b.jpg?1730490029' }
};

