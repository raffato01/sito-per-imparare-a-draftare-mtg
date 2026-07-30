# 🧙‍♂️ MTG Draft Academy & Simulator 🃏

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-sky.svg)](https://tailwindcss.com/)
[![Scryfall API](https://img.shields.io/badge/API-Scryfall-red.svg)](https://scryfall.com/docs/api)
[![Language](https://img.shields.io/badge/Language-IT%20%7C%20EN-emerald.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Read this in [Italiano](#ita) or [English](#eng).*

---

<a name="ita"></a>
## 🇮🇹 Italiano — Descrizione Progetto & Algoritmo IA

Un'applicazione web moderna con supporto bilingue (**Italiano & Inglese**) sviluppata per insegnare il formato **Draft di Magic: The Gathering**.

### 🤖 Come Funziona l'Intelligenza Artificiale dei Bot:
Il nostro motore euristico simula i giocatori umani al tavolo attraverso 3 livelli di difficoltà selezionabili:
- 🟢 **Principiante (Facile)**: I Bot scelgono le carte con la rarità/punteggio più alto senza fissarsi sui colori. Ideale per le prime partite!
- 🟡 **Standard (Medio)**: I Bot applicano la regola **B.R.E.A.D.**, valutano il valore delle carte e dal pick 5 del Pack 1 si specializzano nei loro 2 colori primari.
- 🔴 **Pro Player (Difficile)**: I Bot simulano giocatori professionisti: leggono i segnali al tavolo, danno priorità assoluta alle **Rimozioni**, bilanciano rigorosamente la curva di mana (gocce a 2 e 3) e penalizzano pesantemente le carte fuori colore (-5.0).

---

<a name="eng"></a>
## 🇬🇧 English — Project Overview & AI Mechanics

A modern web application with full bilingual support (**Italian & English**) designed to teach **Magic: The Gathering Drafting**.

### 🤖 How the Bot AI Engine Works:
Our heuristic draft engine simulates realistic human players using 3 customizable difficulty levels:
- 🟢 **Beginner (Easy)**: Bots pick cards freely based on raw rarity/rating without strict color commitment. Great for learning the ropes!
- 🟡 **Standard (Normal)**: Bots apply **B.R.E.A.D.** rules, evaluate raw scores, and specialize into their top 2 colors from pick 5 onwards.
- 🔴 **Pro Player (Hard)**: Bots simulate competitive pros: they read table signals, heavily prioritize **Removal**, strictly enforce mana curve balance (prioritizing 2 & 3 drops), and penalize off-color cards (-5.0).

---

## 🚀 Quick Start / Installazione

```bash
# Clone the repository
git clone https://github.com/tuo-username/sito-per-imparare-a-draftare-mtg.git
cd sito-per-imparare-a-draftare-mtg

# Install dependencies
npm install

# Run local dev server
npm run dev

# Rebuild / Deploy to GitHub Pages
npm run deploy
```

---

## 📜 Legal Notice & Trademarks

*Magic: The Gathering* and card artwork are copyrighted by Wizards of the Coast LLC. Card data and media provided via [Scryfall API](https://scryfall.com/). This project is an independent open-source educational tool.
