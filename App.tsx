import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from './components/Navbar';
import CollectionView from './components/CollectionView';
import AddSneakerView from './components/AddSneakerView';
import StatsView from './components/StatsView';
import { ViewState, Sneaker } from './types';

const STORAGE_KEY = 'solevault_inventory';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('COLLECTION');
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [prefillModel, setPrefillModel] = useState('');
  const [editingSneaker, setEditingSneaker] = useState<Sneaker | null>(null);

  // Load from Async Storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setSneakers(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load sneakers", e);
      }
    };
    loadData();
  }, []);

  // Save to Async Storage on change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sneakers));
      } catch (e) {
        console.error("Failed to save sneakers", e);
      }
    };
    saveData();
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Navbar 
          currentView={currentView} 
          onChangeView={(view) => {
              setCurrentView(view);
              setEditingSneaker(null);
              setPrefillModel('');
          }} 
        />
        
        <View style={styles.mainArea}>
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
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mainArea: {
    flex: 1,
    marginTop: 10,
  }
});
