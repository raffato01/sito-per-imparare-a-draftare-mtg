# 🧙‍♂️ MTG Draft Academy & Simulator 🃏

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-sky.svg)](https://tailwindcss.com/)
[![Scryfall API](https://img.shields.io/badge/API-Scryfall-red.svg)](https://scryfall.com/docs/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Un'applicazione web moderna, interattiva ed intuitiva sviluppata in italiano per insegnare il formato **Draft di Magic: The Gathering** attraverso lezioni teoriche guidate, un simulatore di draft a 6 o 8 giocatori con intelligenza artificiale per i bot, assistente coach in tempo reale e un deckbuilder guidato con calcolo automatico delle terre.

---

## 🌟 Funzionalità Principali

### 1. 📖 Draft Academy (Guida Didattica Interattiva)
- **Lezioni Step-by-Step**: Introduzione al formato Limited, rotazione delle 3 bustine e regole di deckbuilding.
- **Strategia B.R.E.A.D.**: Guida alla priorità dei pick (*Bombs, Removal, Evasion, Aggro/Abilities, Dregs*).
- **Curva di Mana e Formula 17-15-8**: Come bilanciare 17 Terre, 15+ Creature e 8 Magie per un mazzo competitivo a 2 colori.
- **Glossario MTG**: Spiegazioni di termini chiave come *Sideboard*, *Signal*, *Combat Trick*, *Removal*.

### 2. ⚡ Simulatore Draft (6 o 8 Giocatori)
- **Integrazione API Scryfall**: Download automatico di carte e immagini ufficiali in alta risoluzione per qualsiasi set MTG (*Foundations*, *Bloomburrow*, *Modern Horizons 3*, *March of the Machine*, *Neon Dynasty*, ecc.).
- **Supporto per Spoiler & Set Non Ancora Usciti 🚀**: Inserendo il codice del set (es. `fin`, `tds`) è possibile draftare in anteprima i nuovi set durante la spoiler season non appena le carte compaiono su Scryfall.
- **IA per Bot Virtuali**: Simulazione di 5 o 7 giocatori al tavolo che scelgono le carte e si specializzano nei loro 2 colori principali.
- **💡 Coach Assistant (Modalità Assistente)**: Suggerimento in tempo reale su quale carta scegliere nella bustina con spiegazione in italiano del motivo.
- **Rotazione Realistica delle Bustine**: Pack 1 a Sinistra ⬅️, Pack 2 a Destra ➡️, Pack 3 a Sinistra ⬅️.

### 3. 🛡️ Deck Builder Guidato & Calcolo Terre
- **Interfaccia Drag / Click**: Gestione rapida delle carte tra Pool e Mazzo principale (40 carte target).
- **✨ Calcolatore Automatico di Terre Base**: Aggiunge con un singolo click la proporzione ideale di *Pianure, Isole, Paludi, Montagne e Foreste* in base ai simboli di mana nel mazzo.
- **Grafico Curva di Mana (CMC 0-6+)**: Istogramma in tempo reale per monitorare il ritmo del mazzo.
- **Esportazione MTG Arena**: Esporta il mazzo finale in formato `.txt` per importarlo direttamente su MTG Arena.

---

## 🛠️ Tecnologie Utilizzate

- **Core Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Google Fonts (Outfit & JetBrains Mono)
- **Icons**: Lucide React
- **Effetti Visivi**: Canvas Confetti
- **Dati Carte**: Scryfall REST API

---

## 🚀 Guida all'Installazione ed Avvio Locale

### Prerequisiti
Assicurati di aver installato [Node.js](https://nodejs.org/) (versione 18 o superiore).

### Passaggi:

1. **Clona il repository**:
   ```bash
   git clone https://github.com/tuo-username/sito-per-imparare-a-draftare-mtg.git
   cd sito-per-imparare-a-draftare-mtg
   ```

2. **Installa le dipendenze**:
   ```bash
   npm install
   ```

3. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```
   L'applicazione sarà disponibile su `http://localhost:5173/`.

4. **Compilazione per la produzione**:
   ```bash
   npm run build
   ```

---

## 📜 Note Legali & Requisiti del Marchio

*Magic: The Gathering* e le relative immagini delle carte sono marchi registrati di Wizards of the Coast LLC. I dati ed i file multimediali delle carte sono forniti tramite l'API pubblica di [Scryfall](https://scryfall.com/). Questo progetto è una risorsa didattica senza scopo di lucro ed indipendente.
