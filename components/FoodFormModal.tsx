
import React, { useState, useEffect, useRef } from 'react';
import { FoodItem, Category } from '../types';

interface FoodFormModalProps {
  item?: FoodItem | null;
  onClose: () => void;
  onSave: (item: FoodItem) => void;
}

const FoodFormModal: React.FC<FoodFormModalProps> = ({ item, onClose, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<FoodItem>>({
    name: '',
    description: '',
    price: 0,
    halfPrice: undefined,
    category: Category.Starters,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop'
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: item?.id || Math.random().toString(36).substr(2, 9),
    } as FoodItem);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {item ? '📝 Update Dish' : '➕ Create New Dish'}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Menu Management</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors">
            <i className="fas fa-times text-slate-400"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Image Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Dish Presentation</label>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-slate-100 group shadow-sm bg-slate-50">
                <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin text-indigo-600"></i>
                  </div>
                )}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1"
                >
                  <i className="fas fa-camera text-lg"></i>
                  Change
                </button>
              </div>
              <div className="flex-1 space-y-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-upload text-xs"></i>
                  Upload from Device
                </button>
                <div className="relative">
                   <input 
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    placeholder="Or paste image URL here..."
                    value={formData.image?.startsWith('data:') ? '' : formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                  />
                  <i className="fas fa-link absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Dish Information</label>
            <input 
              required
              placeholder="Dish Name (e.g. Spicy Paneer Tikka)"
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-800"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Plate (₹)</label>
              <input 
                required
                type="number"
                placeholder="0.00"
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none font-black text-indigo-600"
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Half Plate (₹)</label>
              <input 
                type="number"
                placeholder="Optional"
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-600"
                value={formData.halfPrice || ''}
                onChange={e => setFormData({...formData, halfPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
              />
            </div>
          </div>

          <div className="space-y-3">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Menu Category</label>
            <select 
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              {Object.values(Category).filter(c => c !== Category.All).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Appetizing Description</label>
            <textarea 
              rows={2}
              placeholder="Describe the flavors, ingredients, and texture..."
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none text-sm text-slate-600"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isUploading}
              className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {item ? 'Save Changes ✨' : 'Add to Menu 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodFormModal;
