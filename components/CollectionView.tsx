import React, { useState, useMemo } from 'react';
import { Sneaker } from '../types';

interface CollectionViewProps {
  sneakers: Sneaker[];
  onDelete: (id: string) => void;
  onAddFromSearch: (term: string) => void;
  onEdit: (sneaker: Sneaker) => void;
}

type SortOption = 'newest' | 'oldest' | 'price_high' | 'price_low';

const CollectionView: React.FC<CollectionViewProps> = ({ sneakers, onDelete, onAddFromSearch, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredSneakers = useMemo(() => {
    let result = sneakers;

    // Filter
    const term = searchTerm.toLowerCase().trim();
    if (term) {
        result = result.filter(s => {
            const fullSearchString = `${s.brand} ${s.model} ${s.colorway}`.toLowerCase();
            return fullSearchString.includes(term);
        });
    }

    // Sort
    return [...result].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
            case 'oldest':
                return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
            case 'price_high':
                return (b.price || 0) - (a.price || 0);
            case 'price_low':
                return (a.price || 0) - (b.price || 0);
            default:
                return 0;
        }
    });

  }, [sneakers, searchTerm, sortBy]);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex justify-between items-center mb-4 mt-6">
        <h2 className="text-2xl font-bold">Your Kicks</h2>
        <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            {filteredSneakers.length} Pairs
        </span>
      </div>

      <div className="flex space-x-2 mb-4">
        <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            </div>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-black text-sm focus:outline-none transition-all placeholder-gray-400 font-semibold"
            />
            {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
        
        <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-gray-50 text-sm font-bold rounded-xl px-3 py-3 border border-transparent focus:border-black focus:outline-none focus:bg-white text-gray-600 cursor-pointer"
        >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_high">$$$ High</option>
            <option value="price_low">$$$ Low</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {filteredSneakers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center px-6">
            <span className="text-4xl mb-4">🔍</span>
            <p className="text-lg font-bold text-black mb-2">No kicks found</p>
            {searchTerm ? (
                <>
                    <p className="text-sm mb-6">We couldn't find "{searchTerm}" in your vault.</p>
                    <button 
                        onClick={() => onAddFromSearch(searchTerm)}
                        className="bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                    >
                        Add "{searchTerm}"
                    </button>
                </>
            ) : (
               <p className="text-sm">Your inventory is empty. Start adding some heat!</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSneakers.map((sneaker) => (
              <div 
                key={sneaker.id} 
                onClick={() => onEdit(sneaker)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col relative group cursor-pointer hover:shadow-md transition-shadow"
              >
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if(confirm('Delete this sneaker?')) onDelete(sneaker.id);
                    }}
                    className="absolute top-2 right-2 bg-white text-gray-400 hover:text-red-500 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <div className="aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center relative">
                  {sneaker.image ? (
                    <img src={sneaker.image} alt={sneaker.model} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-300">
                        <span className="text-4xl mb-1">👟</span>
                        <span className="text-[10px] font-bold">Add Photo</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black/5 backdrop-blur-md px-2 py-1 rounded-md">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-black">{sneaker.brand}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight truncate">{sneaker.model}</h3>
                  <p className="text-sm text-gray-500 truncate mb-2">{sneaker.colorway}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="font-bold text-lg">
                        {sneaker.price ? `$${sneaker.price}` : <span className="text-gray-300">-</span>}
                    </span>
                    <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">US {sneaker.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionView;