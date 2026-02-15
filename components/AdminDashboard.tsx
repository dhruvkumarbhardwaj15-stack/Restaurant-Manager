
import React, { useState, useRef } from 'react';
import { FoodItem, CustomerRecord, Category, RestaurantProfile } from '../types';
import ReceiptEditorModal from './ReceiptEditorModal';

interface AdminDashboardProps {
  items: FoodItem[];
  history: CustomerRecord[];
  onAddItem: () => void;
  onEditItem: (item: FoodItem) => void;
  onDeleteItem: (id: string) => void;
  profile: RestaurantProfile;
  onUpdateProfile: (profile: RestaurantProfile) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  items, 
  history, 
  onAddItem, 
  onEditItem, 
  onDeleteItem,
  profile,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'history' | 'settings'>('inventory');
  const [localSearch, setLocalSearch] = useState('');
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<RestaurantProfile>(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Receipt Editor State
  const [viewingRecord, setViewingRecord] = useState<CustomerRecord | null>(null);

  const totalRevenue = history.reduce((sum, r) => sum + r.total, 0);
  const categoriesCount = new Set(items.map(i => i.category)).size;

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(localSearch.toLowerCase()) || 
    i.category.toLowerCase().includes(localSearch.toLowerCase())
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsForm(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(settingsForm);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter italic">Bistro Dashboard</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            Management Console
          </p>
        </div>
        <div className="flex bg-slate-200/50 backdrop-blur p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inventory' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <i className="fas fa-box-open"></i> Inventory
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'history' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <i className="fas fa-history"></i> Sales Log
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <i className="fas fa-sliders-h"></i> Settings
          </button>
        </div>
      </div>

      {activeTab !== 'settings' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items</p>
            <p className="text-2xl font-black text-slate-800">{items.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Categories</p>
            <p className="text-2xl font-black text-slate-800">{categoriesCount}</p>
          </div>
          <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100">
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Revenue</p>
            <p className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Orders</p>
            <p className="text-2xl font-black text-slate-800">{history.length}</p>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none w-full max-w-xs"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
            />
            <button 
              onClick={onAddItem}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
            >
              <i className="fas fa-plus-circle mr-2"></i> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                  <th className="px-8 py-6">Item</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6 text-right">Price</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt={item.name} />
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black uppercase text-slate-500">{item.category}</span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-800">₹{item.price}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onEditItem(item)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><i className="fas fa-edit"></i></button>
                        <button onClick={() => onDeleteItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                  <th className="px-8 py-6">Invoice</th>
                  <th className="px-8 py-6">Customer</th>
                  <th className="px-8 py-6">Method</th>
                  <th className="px-8 py-6">Date</th>
                  <th className="px-8 py-6 text-right">Total</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 text-[10px] font-black text-indigo-600 uppercase">{record.id}</td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-800">{record.name}</p>
                      <p className="text-[10px] text-slate-400">{record.contact}</p>
                    </td>
                    <td className="px-8 py-5">
                       <span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black uppercase text-slate-500">{record.paymentMethod || 'Cash'}</span>
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-500">{record.timestamp}</td>
                    <td className="px-8 py-5 text-right font-black text-slate-900">₹{record.total.toFixed(2)}</td>
                    <td className="px-8 py-5 text-right">
                       <button 
                        onClick={() => setViewingRecord(record)}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
                       >
                         View Receipt
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
         <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-8 border-b border-slate-100 bg-slate-50/30">
              <h2 className="text-2xl font-black text-slate-800">Restaurant Settings</h2>
              <p className="text-sm text-slate-500">Update your business details, receipt text, and branding.</p>
           </div>
           <div className="p-8 md:p-12">
             <form onSubmit={handleSaveSettings} className="max-w-3xl space-y-8">
               
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Logo Section */}
                  <div className="w-full md:w-auto flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm group">
                      {settingsForm.logo ? (
                        <img src={settingsForm.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                           <i className="fas fa-image text-3xl"></i>
                        </div>
                      )}
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs"
                      >
                        Change Logo
                      </button>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleLogoUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline"
                    >
                      Upload Logo
                    </button>
                  </div>

                  {/* Fields Section */}
                  <div className="flex-1 w-full space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Restaurant Name</label>
                         <input 
                           type="text" 
                           required
                           value={settingsForm.name}
                           onChange={e => setSettingsForm({...settingsForm, name: e.target.value})}
                           className="w-full px-5 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-800"
                           placeholder="My Awesome Restaurant"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Owner Name</label>
                         <input 
                           type="text" 
                           required
                           value={settingsForm.ownerName}
                           onChange={e => setSettingsForm({...settingsForm, ownerName: e.target.value})}
                           className="w-full px-5 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-800"
                           placeholder="John Doe"
                         />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Address</label>
                       <textarea 
                         rows={2}
                         value={settingsForm.address}
                         onChange={e => setSettingsForm({...settingsForm, address: e.target.value})}
                         className="w-full px-5 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none text-slate-700"
                         placeholder="123 Food Street, Tasty City..."
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Number</label>
                       <input 
                         type="text"
                         value={settingsForm.contact}
                         onChange={e => setSettingsForm({...settingsForm, contact: e.target.value})}
                         className="w-full px-5 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-800"
                         placeholder="+91 98765 43210"
                       />
                    </div>
                    
                    <hr className="border-slate-100 my-6" />
                    
                    <div className="space-y-2">
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Receipt Header Info (Section 2)</label>
                       <textarea 
                         rows={3}
                         value={settingsForm.receiptHeader}
                         onChange={e => setSettingsForm({...settingsForm, receiptHeader: e.target.value})}
                         className="w-full px-5 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none text-slate-700"
                         placeholder="Text to appear below customer greeting..."
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Receipt Footer / Review (Section 5)</label>
                       <textarea 
                         rows={3}
                         value={settingsForm.receiptFooter}
                         onChange={e => setSettingsForm({...settingsForm, receiptFooter: e.target.value})}
                         className="w-full px-5 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none text-slate-700"
                         placeholder="Thank you message or review link..."
                       />
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                      >
                        Save Settings ✨
                      </button>
                    </div>
                  </div>
               </div>
             </form>
           </div>
         </div>
      )}

      {viewingRecord && (
        <ReceiptEditorModal 
          record={viewingRecord} 
          profile={profile} 
          onClose={() => setViewingRecord(null)} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;
