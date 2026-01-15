import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const getButtonClass = (view: ViewState) => {
    const isActive = currentView === view;
    return `flex-1 py-4 px-2 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-200 ${
      isActive 
        ? 'bg-vault-black text-white shadow-lg' 
        : 'bg-vault-gray text-vault-text hover:bg-gray-300'
    }`;
  };

  return (
    <div className="w-full space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight pt-2">SoleVault</h1>
      <div className="flex space-x-3 w-full">
        <button 
          onClick={() => onChangeView('COLLECTION')}
          className={getButtonClass('COLLECTION')}
        >
          Collection
        </button>
        <button 
          onClick={() => onChangeView('ADD')}
          className={getButtonClass('ADD')}
        >
          Add
        </button>
        <button 
          onClick={() => onChangeView('STATS')}
          className={getButtonClass('STATS')}
        >
          Stats
        </button>
      </div>
    </div>
  );
};

export default Navbar;