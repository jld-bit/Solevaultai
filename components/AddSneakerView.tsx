import React, { useState, useRef, useEffect } from 'react';
import { Sneaker } from '../types';

interface AddSneakerViewProps {
  onSave: (sneaker: Sneaker) => void;
  onCancel: () => void;
  initialModel?: string;
  initialSneaker?: Sneaker | null;
}

const AddSneakerView: React.FC<AddSneakerViewProps> = ({ onSave, onCancel, initialModel = '', initialSneaker }) => {
  const [image, setImage] = useState<string | null>(null);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState(initialModel);
  const [colorway, setColorway] = useState('');
  const [size, setSize] = useState<string>('10');
  const [price, setPrice] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize state based on editing mode or search prefill
  useEffect(() => {
    if (initialSneaker) {
        setBrand(initialSneaker.brand);
        setModel(initialSneaker.model);
        setColorway(initialSneaker.colorway);
        setSize(initialSneaker.size.toString());
        setPrice(initialSneaker.price ? initialSneaker.price.toString() : '');
        setImage(initialSneaker.image || null);
    } else if (initialModel) {
        setModel(initialModel);
    }
  }, [initialSneaker, initialModel]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Price is no longer required
    if (!brand || !model) {
      setError("Brand and Model are required.");
      return;
    }

    const newSneaker: Sneaker = {
      // If editing, preserve ID and date. If new, generate them.
      id: initialSneaker ? initialSneaker.id : Date.now().toString(),
      brand,
      model,
      colorway,
      size: parseFloat(size),
      price: price ? parseFloat(price) : undefined,
      image: image || undefined,
      condition: 'Deadstock',
      addedDate: initialSneaker ? initialSneaker.addedDate : new Date().toISOString()
    };

    onSave(newSneaker);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in mt-6 pb-20 overflow-y-auto no-scrollbar">
      <h2 className="text-2xl font-bold mb-6">
        {initialSneaker ? 'Edit Sneaker' : 'Add to Vault'}
      </h2>

      <div className="space-y-6">
        {/* Image Upload Area */}
        <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${image ? 'border-transparent' : 'border-gray-300 hover:border-black'}`}
        >
            {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
                <div className="text-center p-6">
                    <span className="text-4xl mb-2 block">📷</span>
                    <span className="font-bold text-gray-500">
                        {initialSneaker ? "Tap to add/change photo" : "Tap to upload photo"}
                    </span>
                </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
            />
        </div>

        {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-semibold">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Brand</label>
                <input 
                    type="text" 
                    value={brand} 
                    onChange={e => setBrand(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-black outline-none font-semibold transition-all"
                    placeholder="Nike, Adidas..."
                />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Model</label>
                <input 
                    type="text" 
                    value={model} 
                    onChange={e => setModel(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-black outline-none font-semibold transition-all"
                    placeholder="Air Jordan 1..."
                />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Colorway</label>
                <input 
                    type="text" 
                    value={colorway} 
                    onChange={e => setColorway(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-black outline-none font-semibold transition-all"
                    placeholder="Chicago, Bred..."
                />
            </div>

            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Size (US)</label>
                    <input 
                        type="number" 
                        value={size} 
                        onChange={e => setSize(e.target.value)}
                        className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-black outline-none font-semibold transition-all"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Price ($)</label>
                    <input 
                        type="number" 
                        value={price} 
                        onChange={e => setPrice(e.target.value)}
                        className="w-full p-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-black outline-none font-semibold transition-all"
                        placeholder="Optional"
                    />
                </div>
            </div>

            <div className="pt-4 flex space-x-3">
                 <button 
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-4 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    className="flex-1 py-4 rounded-xl font-bold bg-black text-white shadow-lg hover:scale-[1.02] transition-transform"
                >
                    {initialSneaker ? 'Update Shoe' : 'Save Shoe'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddSneakerView;