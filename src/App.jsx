import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AcademyGuide } from './components/Academy/AcademyGuide';
import { SetSelector } from './components/Draft/SetSelector';
import { DraftBoard } from './components/Draft/DraftBoard';
import { DeckBuilder } from './components/DeckBuilder/DeckBuilder';
import { fetchSetCardPool } from './services/scryfallApi';
import { SAMPLE_CARD_POOLS } from './data/sampleCardPool';
import { PRESET_SETS } from './data/presetSets';

export function App() {
  const [activeTab, setActiveTab] = useState('academy'); // 'academy', 'simulator', 'deckbuilder'
  const [draftState, setDraftState] = useState('selector'); // 'selector', 'drafting', 'complete'
  
  const [selectedSetInfo, setSelectedSetInfo] = useState(null);
  const [playerCount, setPlayerCount] = useState(8);
  const [cardPool, setCardPool] = useState([]);
  const [draftedPool, setDraftedPool] = useState([]);
  
  const [coachMode, setCoachMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Start Draft handler
  const handleStartDraft = async ({ setCode, playerCount: count }) => {
    setIsLoading(true);
    setErrorMessage('');
    setPlayerCount(count);

    const presetInfo = PRESET_SETS.find(s => s.code === setCode) || {
      code: setCode,
      name: `Set ${setCode.toUpperCase()}`,
      releaseYear: 2024
    };
    setSelectedSetInfo(presetInfo);

    try {
      // Fetch cards from Scryfall API
      let cards = await fetchSetCardPool(setCode);
      if (!cards || cards.length < 15) {
        throw new Error('Poche carte trovate per questo set.');
      }
      setCardPool(cards);
      setDraftState('drafting');
      setActiveTab('simulator');
    } catch (err) {
      console.warn('Scryfall fetch failed or offline mode. Using preset pool fallback.', err);
      // Fallback offline pool
      const fallbackCards = SAMPLE_CARD_POOLS[setCode] || SAMPLE_CARD_POOLS.fdn;
      setCardPool(fallbackCards);
      setDraftState('drafting');
      setActiveTab('simulator');
    } finally {
      setIsLoading(false);
    }
  };

  // Draft Finished handler
  const handleDraftComplete = (completedPool) => {
    setDraftedPool(completedPool);
    setDraftState('complete');
    setActiveTab('deckbuilder');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSet={selectedSetInfo}
        coachMode={coachMode}
        setCoachMode={setCoachMode}
      />

      {/* Main Body View */}
      <main className="flex-1">
        {activeTab === 'academy' && (
          <AcademyGuide onStartDraft={() => setActiveTab('simulator')} />
        )}

        {activeTab === 'simulator' && (
          <>
            {draftState === 'selector' && (
              <SetSelector
                onStartDraft={handleStartDraft}
                isLoading={isLoading}
                errorMessage={errorMessage}
              />
            )}

            {draftState === 'drafting' && (
              <DraftBoard
                setInfo={selectedSetInfo}
                playerCount={playerCount}
                cardPool={cardPool}
                coachMode={coachMode}
                onDraftComplete={handleDraftComplete}
                onCancel={() => setDraftState('selector')}
              />
            )}
          </>
        )}

        {activeTab === 'deckbuilder' && (
          <DeckBuilder
            draftedPool={draftedPool}
            onResetDraft={() => setDraftState('selector')}
          />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MTG Draft Academy — Creato per insegnare Magic: The Gathering.</p>
          <p className="text-[11px] text-slate-600">
            Magic: The Gathering e le relative immagini delle carte sono marchi registrati di Wizards of the Coast LLC. Immagini fornite tramite l'API di Scryfall.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
