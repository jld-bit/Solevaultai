import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Sneaker } from '../types';

interface StatsViewProps {
  sneakers: Sneaker[];
}

const COLORS = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#E5E5E5'];

const StatsView: React.FC<StatsViewProps> = ({ sneakers }) => {
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

  return (
    <div className="flex flex-col h-full animate-fade-in mt-6">
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

      <div className="bg-white rounded-2xl p-6 border border-gray-100 flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-4">Brand Distribution</h3>
        {sneakers.length > 0 ? (
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
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
                    {brandData.map((entry, index) => (
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
            <div className="flex-1 flex items-center justify-center text-gray-400">
                No data available.
            </div>
        )}
      </div>
    </div>
  );
};

export default StatsView;