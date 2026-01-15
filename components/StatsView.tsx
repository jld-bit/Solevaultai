import React, { useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Sneaker } from '../types';

interface StatsViewProps {
  sneakers: Sneaker[];
  onImport: (data: Sneaker[]) => void;
}

const COLORS = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#E5E5E5'];

const StatsView: React.FC<StatsViewProps> = ({ sneakers, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use 0 if price is undefined
  const totalValue = sneakers.reduce((sum, s) => sum + (s.price || 0), 0);
  
  // Calculate brand distribution
  const brandData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    sneakers.forEach(s => {
      const brand = s.brand || 'Other';
      counts[brand] = (counts[brand] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sneakers]);

  const handleExport = () => {
    const dataStr = JSON.stringify(sneakers, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solevault_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target?.result as string);
            if (Array.isArray(json)) {
                onImport(json);
            } else {
                alert("Invalid backup file.");
            }
        } catch (err) {
            alert("Error reading file.");
        }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again if needed
    e.target.value = ''; 
  };

  return (
    <div className="flex flex-col h-full animate-fade-in mt-6 overflow-y-auto no-scrollbar pb-20">
      <h2 className="text-2xl font-bold mb-6">Vault Stats</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-black text-white p-6 rounded-2xl shadow-lg">
            <p className="text-sm text-gray-400 font-bold uppercase">Total Value</p>
            <p className="text-3xl font-bold mt-1">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-gray-100 text-black p-6 rounded-2xl">
            <p className="text-sm text-gray-500 font-bold uppercase">Total Pairs</p>
            <p className="text-3xl font-bold mt-1">{sneakers.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 flex-col mb-8">
        <h3 className="text-lg font-bold mb-4">Brand Distribution</h3>
        {sneakers.length > 0 ? (
          <div className="min-h-[250px] relative">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                <Pie
                    data={brandData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {brandData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                />
                </PieChart>
            </ResponsiveContainer>
             {/* Legend */}
             <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {brandData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center space-x-1 text-xs font-bold bg-gray-50 px-2 py-1 rounded-lg">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span>{entry.name}</span>
                        <span className="text-gray-400">({entry.value})</span>
                    </div>
                ))}
            </div>
          </div>
        ) : (
            <div className="flex items-center justify-center text-gray-400 h-[200px]">
                No data available.
            </div>
        )}
      </div>

      <div className="border-t pt-8">
        <h3 className="text-lg font-bold mb-4">Data Management</h3>
        <p className="text-sm text-gray-500 mb-4">
            Save your vault to a file or restore from a backup.
        </p>
        <div className="flex space-x-3">
            <button 
                onClick={handleExport}
                className="flex-1 py-3 px-4 bg-white border-2 border-black text-black rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
                Export JSON
            </button>
            <button 
                onClick={handleImportClick}
                className="flex-1 py-3 px-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
                Import JSON
            </button>
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleFileChange}
            />
        </div>
      </div>
    </div>
  );
};

export default StatsView;