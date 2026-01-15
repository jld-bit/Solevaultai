import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CollectionView from './components/CollectionView';
import AddSneakerView from './components/AddSneakerView';
import StatsView from './components/StatsView';
import { ViewState, Sneaker } from './types';

const STORAGE_KEY = 'solevault_inventory';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('COLLECTION');
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [prefillModel, setPrefillModel] = useState('');
  const [editingSneaker, setEditingSneaker] = useState<Sneaker | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSneakers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved sneakers", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sneakers));
  }, [sneakers]);

  const handleSaveSneaker = (sneaker: Sneaker) => {
    if (editingSneaker) {
        // Update existing sneaker
        setSneakers(prev => prev.map(s => s.id === sneaker.id ? sneaker : s));
        setEditingSneaker(null);
    } else {
        // Add new sneaker
        setSneakers(prev => [sneaker, ...prev]);
    }
    setPrefillModel('');
    setCurrentView('COLLECTION');
  };

  const handleDeleteSneaker = (id: string) => {
    setSneakers(prev => prev.filter(s => s.id !== id));
  };

  const handleAddFromSearch = (term: string) => {
    setPrefillModel(term);
    setEditingSneaker(null);
    setCurrentView('ADD');
  };

  const handleEditSneaker = (sneaker: Sneaker) => {
    setEditingSneaker(sneaker);
    setPrefillModel('');
    setCurrentView('ADD');
  };

  const handleCancelAdd = () => {
    setPrefillModel('');
    setEditingSneaker(null);
    setCurrentView('COLLECTION');
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col p-6">
        <Navbar 
          currentView={currentView} 
          onChangeView={(view) => {
              setCurrentView(view);
              setEditingSneaker(null);
              setPrefillModel('');
          }} 
        />
        
        <main className="flex-1 overflow-hidden relative">
          {currentView === 'COLLECTION' && (
            <CollectionView 
              sneakers={sneakers} 
              onDelete={handleDeleteSneaker}
              onAddFromSearch={handleAddFromSearch}
              onEdit={handleEditSneaker}
            />
          )}
          
          {currentView === 'ADD' && (
            <AddSneakerView 
              onSave={handleSaveSneaker}
              onCancel={handleCancelAdd}
              initialModel={prefillModel}
              initialSneaker={editingSneaker}
            />
          )}

          {currentView === 'STATS' && (
            <StatsView sneakers={sneakers} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;