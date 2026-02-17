
import React, { useState, useEffect } from 'react';
import { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  // We'll pass a helper to get quantity from parent
  onUpdateQuantity: (item: FoodItem, delta: number, size: 'Half' | 'Full') => void;
  // We need current cart context to show accurate quantity for selected size
  getQuantity: (id: string, size: 'Half' | 'Full') => number;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onUpdateQuantity, getQuantity }) => {
  const [size, setSize] = useState<'Half' | 'Full'>('Full');
  
  const currentQuantity = getQuantity(item.id, size);
  const unit = item.category === 'Drinks' ? 'Glass' : 'Plate';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-indigo-600 font-bold text-sm shadow-sm">
          ₹{size === 'Full' ? item.price : item.halfPrice}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{item.name}</h3>
        </div>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {item.description}
        </p>

        {item.halfPrice && (
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
            <button 
              onClick={() => setSize('Half')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${size === 'Half' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              Half {unit}
            </button>
            <button 
              onClick={() => setSize('Full')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${size === 'Full' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              Full {unit}
            </button>
          </div>
        )}

        <div className="mt-auto">
          {currentQuantity > 0 ? (
            <div className="flex items-center justify-between bg-indigo-50 p-1 rounded-xl border border-indigo-100">
              <button 
                onClick={() => onUpdateQuantity(item, -1, size)}
                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"
              >
                <i className="fas fa-minus text-xs"></i>
              </button>
              <div className="flex flex-col items-center">
                <span className="font-black text-indigo-600 text-lg leading-none">{currentQuantity}</span>
                <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-tighter">{size}</span>
              </div>
              <button 
                onClick={() => onUpdateQuantity(item, 1, size)}
                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"
              >
                <i className="fas fa-plus text-xs"></i>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onUpdateQuantity(item, 1, size)}
              className="w-full bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-800 font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200 hover:border-indigo-600 active:scale-95"
            >
              <i className="fas fa-plus text-xs"></i>
              Add {item.halfPrice ? size : ''} Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
