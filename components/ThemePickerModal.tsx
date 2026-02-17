
import React, { useState } from 'react';
import { RestaurantProfile } from '../types';

interface ThemePickerModalProps {
  currentProfile: RestaurantProfile;
  onUpdateProfile: (profile: RestaurantProfile) => void;
  onClose: () => void;
}

const ThemePickerModal: React.FC<ThemePickerModalProps> = ({ currentProfile, onUpdateProfile, onClose }) => {
  const [customFontInput, setCustomFontInput] = useState(currentProfile.customFontFamily || '');
  
  const colors = [
    // Use hex for Indigo to prevent it from changing when the theme variable changes
    { id: 'indigo', name: 'Royal Indigo', bg: 'bg-[#4f46e5]' },
    { id: 'orange', name: 'Zesty Orange', bg: 'bg-orange-600' },
    { id: 'rose', name: 'Crimson Rose', bg: 'bg-rose-600' },
    { id: 'emerald', name: 'Fresh Emerald', bg: 'bg-emerald-600' },
    { id: 'sky', name: 'Sky Blue', bg: 'bg-sky-500' },
  ];

  const fonts = [
    { id: 'modern', name: 'Modern Clean', desc: 'Inter + Inter' },
    { id: 'elegant', name: 'Oxanium', desc: 'Futuristic & Sci-Fi' },
    { id: 'classic', name: 'Classic Serif', desc: 'Merriweather + Merriweather' },
  ];

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateProfile({ ...currentProfile, themeColor: e.target.value });
  };

  const handleCustomFontApply = () => {
    if (customFontInput.trim()) {
      onUpdateProfile({ 
        ...currentProfile, 
        fontPair: 'custom', 
        customFontFamily: customFontInput.trim() 
      });
    }
  };

  const isPresetColor = colors.some(c => c.id === currentProfile.themeColor);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <h3 className="font-black text-slate-800 text-lg">App Appearance 🎨</h3>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
             <i className="fas fa-times"></i>
           </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
          {/* Color Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Brand Color</label>
            <div className="flex flex-wrap gap-4">
              {colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onUpdateProfile({ ...currentProfile, themeColor: c.id })}
                  className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentProfile.themeColor === c.id 
                      ? 'ring-4 ring-slate-200 scale-110 shadow-lg' 
                      : 'hover:scale-105'
                  }`}
                  title={c.name}
                >
                  <div className={`w-full h-full rounded-full ${c.bg}`}></div>
                  {currentProfile.themeColor === c.id && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                </button>
              ))}
              
              {/* Custom Color Picker Button */}
              <div className={`relative w-12 h-12 rounded-full overflow-hidden transition-all ${
                 !isPresetColor ? 'ring-4 ring-slate-200 scale-110 shadow-lg' : 'hover:scale-105'
              }`}>
                <input 
                  type="color" 
                  value={!isPresetColor ? currentProfile.themeColor : '#000000'}
                  onChange={handleCustomColorChange}
                  className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-white mix-blend-difference">
                  {!isPresetColor ? <i className="fas fa-check"></i> : <i className="fas fa-plus"></i>}
                </div>
              </div>
            </div>
            <p className="text-center text-xs font-bold text-slate-500 mt-3">
              {isPresetColor 
                ? colors.find(c => c.id === currentProfile.themeColor)?.name 
                : 'Custom Color'
              }
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Font Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Typography Style</label>
            <div className="space-y-3">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateProfile({ ...currentProfile, fontPair: f.id })}
                  className={`w-full p-4 rounded-2xl border transition-all text-left flex justify-between items-center ${
                    currentProfile.fontPair === f.id
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className={`block font-black text-slate-800 text-sm ${
                      f.id === 'elegant' ? 'font-serif' : f.id === 'classic' ? 'font-serif' : 'font-sans'
                    }`} style={{ fontFamily: f.id === 'elegant' ? 'Oxanium' : undefined }}>
                      {f.name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{f.desc}</span>
                  </div>
                  {currentProfile.fontPair === f.id && (
                    <i className="fas fa-check-circle text-indigo-600"></i>
                  )}
                </button>
              ))}

              {/* Custom Font Input */}
              <div className={`w-full p-4 rounded-2xl border transition-all ${
                 currentProfile.fontPair === 'custom' 
                   ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                   : 'bg-white border-slate-200'
              }`}>
                <div className="flex justify-between items-center mb-2">
                   <span className="font-black text-slate-800 text-sm">Custom Google Font</span>
                   {currentProfile.fontPair === 'custom' && <i className="fas fa-check-circle text-indigo-600"></i>}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. Poppins"
                    value={customFontInput}
                    onChange={(e) => setCustomFontInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button 
                    onClick={handleCustomFontApply}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  Enter exact name from <a href="https://fonts.google.com" target="_blank" className="underline hover:text-indigo-600">Google Fonts</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePickerModal;
