
import React from 'react';
import { User, RestaurantProfile } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  cartCount: number;
  onCartClick: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  restaurantProfile: RestaurantProfile;
  onOpenThemePicker: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user,
  onLogout,
  onOpenAuth,
  cartCount, 
  onCartClick, 
  isAdmin, 
  onToggleAdmin,
  restaurantProfile,
  onOpenThemePicker
}) => {
  return (
    <header className="sticky top-0 z-40 glass-effect border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          {/* Logo - Left */}
          <div className="flex items-center gap-2 shrink-0 max-w-[50%]">
            {restaurantProfile.logo ? (
              <img src={restaurantProfile.logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-indigo-200" />
            ) : (
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
                <i className="fas fa-utensils"></i>
              </div>
            )}
            <div className="hidden md:block truncate">
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 truncate block font-serif">
                {restaurantProfile.name}
              </span>
              {user && <span className="block text-[9px] font-black text-green-500 uppercase tracking-widest leading-none mt-1">Cloud Synced</span>}
            </div>
          </div>

          {/* Action Cluster - Right */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Theme Button */}
            <button 
              onClick={onOpenThemePicker}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-200"
              title="Change Theme"
            >
              <i className="fas fa-palette"></i>
            </button>

            {user ? (
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 pr-3 rounded-full shadow-sm">
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-slate-100 shadow-sm" />
                <div className="hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">{user.name.split(' ')[0]}</p>
                </div>
                <button onClick={onLogout} className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all" title="Sign Out">
                  <i className="fas fa-sign-out-alt text-[10px]"></i>
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="h-10 px-6 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
              >
                Login
              </button>
            )}

            <button 
              onClick={onToggleAdmin}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all h-10 flex items-center gap-2 ${
                isAdmin 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600'
              }`}
            >
              <i className={`fas ${isAdmin ? 'fa-store' : 'fa-cog'}`}></i>
              <span className="hidden sm:inline">{isAdmin ? 'Shop' : user ? 'Admin' : 'Admin (Guest)'}</span>
            </button>

            <button 
              onClick={onCartClick}
              className="relative p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm h-10 w-10 flex items-center justify-center"
            >
              <i className="fas fa-shopping-bag text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white bg-indigo-600 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
