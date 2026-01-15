import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SoleVault</Text>
      <View style={styles.buttonContainer}>
        <NavButton 
          title="Collection" 
          active={currentView === 'COLLECTION'} 
          onPress={() => onChangeView('COLLECTION')} 
        />
        <NavButton 
          title="Add" 
          active={currentView === 'ADD'} 
          onPress={() => onChangeView('ADD')} 
        />
        <NavButton 
          title="Stats" 
          active={currentView === 'STATS'} 
          onPress={() => onChangeView('STATS')} 
        />
      </View>
    </View>
  );
};

const NavButton = ({ title, active, onPress }: { title: string, active: boolean, onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[styles.button, active ? styles.activeButton : styles.inactiveButton]}
  >
    <Text style={[styles.buttonText, active ? styles.activeText : styles.inactiveText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111',
    marginBottom: 15,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#000',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  inactiveButton: {
    backgroundColor: '#E5E5E5',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: '#333',
  }
});

export default Navbar;
