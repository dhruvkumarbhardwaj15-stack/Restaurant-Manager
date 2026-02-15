
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only used for signup meta data
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Use user metadata for name if available, else email
        const userObj: User = {
           id: data.user.id,
           email: data.user.email || '',
           name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
           picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.email || 'U')}&background=random`
        };
        
        onLogin(userObj);
        onClose();

      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) throw error;
        
        if (data.user) {
             const userObj: User = {
               id: data.user.id,
               email: data.user.email || '',
               name: name || data.user.email?.split('@')[0] || 'User',
               picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=random`
            };
            onLogin(userObj);
            onClose();
        } else {
            // Note: If email confirmation is enabled in Supabase, this might happen
            setError('Check your email for confirmation link!');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <i className="fas fa-utensils text-xl"></i>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <h2 className="text-4xl font-black text-slate-900 mb-2 italic tracking-tighter">
            {isLogin ? 'Welcome Back! 🥗' : 'Join the Bistro! 🚀'}
          </h2>
          <p className="text-slate-500 mb-8 font-medium">
            {isLogin ? 'Log in to manage your digital kitchen.' : 'Create an account to start your restaurant journey.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-500 text-xs font-bold rounded-2xl animate-in fade-in slide-in-from-top-2">
                <i className="fas fa-exclamation-circle mr-2"></i> {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dhruv Sharma"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold text-slate-800"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email / Gmail ID</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold text-slate-800"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold text-slate-800"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-[2.4rem] text-slate-300 hover:text-indigo-600 transition-colors"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95 text-lg mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : (isLogin ? 'Log In Now ✨' : 'Create Account 🚀')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-slate-400 font-bold text-sm hover:text-indigo-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
