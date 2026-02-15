
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number, size: 'Half' | 'Full') => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onCheckout }) => {
  const total = items.reduce((sum, item) => {
    const p = item.selectedSize === 'Half' ? item.halfPrice : item.price;
    return sum + (p || 0) * item.quantity;
  }, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <i className="fas fa-shopping-basket text-indigo-600"></i>
            Order Bag
          </h2>
          <button onClick={onClose} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors">
            <i className="fas fa-times text-slate-400"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-utensils text-4xl"></i>
              </div>
              <p className="font-bold text-lg">Your bag is hungry!</p>
              <p className="text-sm">Add some delicious items to get started.</p>
              <button 
                onClick={onClose}
                className="mt-6 text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline"
              >
                Go back to menu
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id + item.selectedSize} className="flex gap-5 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-slate-800 text-base">{item.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded uppercase tracking-wider">
                        {item.selectedSize} Plate
                      </span>
                      <p className="text-indigo-600 font-black text-sm">₹{((item.selectedSize === 'Half' ? item.halfPrice : item.price)! * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1, item.selectedSize)}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          <i className="fas fa-minus text-xs"></i>
                        </button>
                        <span className="w-8 text-center font-black text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1, item.selectedSize)}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          <i className="fas fa-plus text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 bg-slate-50 border-t border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Bill</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95"
            >
              Order & Generate Invoice ✨
              <i className="fas fa-sparkles"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
