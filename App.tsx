
import React, { useState, useEffect } from 'react';
import { FoodItem, Category, CartItem, CustomerRecord, User, RestaurantProfile } from './types';
import { INITIAL_FOOD_ITEMS, DEFAULT_RESTAURANT_PROFILE } from './constants';
import { generateAppetizingMenu } from './services/geminiService';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import FoodCard from './components/FoodCard';
import Cart from './components/Cart';
import InvoiceModal from './components/InvoiceModal';
import AdminDashboard from './components/AdminDashboard';
import FoodFormModal from './components/FoodFormModal';
import ThemePickerModal from './components/ThemePickerModal';
import AuthModal from './components/AuthModal';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Data States
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [customerHistory, setCustomerHistory] = useState<CustomerRecord[]>([]);
  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile>(DEFAULT_RESTAURANT_PROFILE);

  // UI States
  const [activeCategory, setActiveCategory] = useState<Category>(Category.All);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // --- 1. Authentication & Initial Load ---
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || 'User',
            picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.full_name || 'U')}&background=random`
        });
      } else {
        // Guest Mode
        setFoodItems(INITIAL_FOOD_ITEMS);
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || 'User',
            picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.full_name || 'U')}&background=random`
        });
      } else {
        setUser(null);
        setFoodItems(INITIAL_FOOD_ITEMS);
        setCustomerHistory([]);
        setRestaurantProfile(DEFAULT_RESTAURANT_PROFILE);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 2. Data Fetching (When User Changes) ---
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // A. Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
            setRestaurantProfile({
                name: profileData.name || DEFAULT_RESTAURANT_PROFILE.name,
                address: profileData.address || DEFAULT_RESTAURANT_PROFILE.address,
                contact: profileData.contact || DEFAULT_RESTAURANT_PROFILE.contact,
                logo: profileData.logo || '',
                ownerName: profileData.owner_name || DEFAULT_RESTAURANT_PROFILE.ownerName,
                receiptHeader: profileData.receipt_header || DEFAULT_RESTAURANT_PROFILE.receiptHeader,
                receiptFooter: profileData.receipt_footer || DEFAULT_RESTAURANT_PROFILE.receiptFooter,
                themeColor: profileData.theme_color || 'indigo',
                fontPair: profileData.font_pair || 'modern',
                customFontFamily: profileData.custom_font_family
            });
        } else {
            // New User Profile: Insert default profile
             await supabase.from('profiles').insert({
                id: user.id,
                name: DEFAULT_RESTAURANT_PROFILE.name,
                owner_name: user.name,
                theme_color: 'indigo',
                font_pair: 'modern'
             });
        }

        // B. Fetch Menu Items
        const { data: menuData } = await supabase
          .from('menu_items')
          .select('*')
          .eq('user_id', user.id);
        
        if (menuData && menuData.length > 0) {
            // Standard Load
            setFoodItems(menuData.map((m: any) => ({
                id: m.id,
                name: m.name,
                description: m.description,
                price: Number(m.price),
                halfPrice: m.half_price ? Number(m.half_price) : undefined,
                category: m.category,
                image: m.image
            })));
        } else {
             // C. SEEDING LOGIC for New Accounts
             // If menu is empty, insert the INITIAL_FOOD_ITEMS so the user doesn't see a blank screen
             console.log("Seeding initial data for new user...");
             const seedItems = INITIAL_FOOD_ITEMS.map(({ id, ...rest }) => ({
                 ...rest,
                 price: rest.price,
                 half_price: rest.halfPrice,
                 user_id: user.id
                 // Note: We deliberately exclude 'id' so Postgres generates valid UUIDs
             }));

             const { data: insertedItems, error: seedError } = await supabase
                .from('menu_items')
                .insert(seedItems)
                .select();

             if (seedError) {
                 console.error("Seeding failed:", seedError);
                 setFoodItems([]); 
             } else if (insertedItems) {
                 setFoodItems(insertedItems.map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    description: m.description,
                    price: Number(m.price),
                    halfPrice: m.half_price ? Number(m.half_price) : undefined,
                    category: m.category,
                    image: m.image
                })));
             }
        }

        // D. Fetch Orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false });

        if (ordersData) {
            setCustomerHistory(ordersData.map((o: any) => ({
                id: o.id,
                name: o.customer_name,
                contact: o.customer_contact,
                total: Number(o.total),
                timestamp: o.timestamp,
                items: o.items_summary,
                paymentMethod: o.payment_method,
                cartItems: o.cart_items_json
            })));
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        showToast("Error syncing data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // --- 3. Theme Injection ---
  useEffect(() => {
    const r = document.documentElement;
    const palettes: Record<string, any> = {
      indigo: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 600: '#4f46e5', 700: '#4338ca' },
      orange: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 600: '#ea580c', 700: '#c2410c' },
      rose:   { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 600: '#e11d48', 700: '#be123c' },
      emerald:{ 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 600: '#059669', 700: '#047857' },
      sky:    { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 600: '#0284c7', 700: '#0369a1' },
    };
    const fontPairs: Record<string, any> = {
      modern: { body: 'Inter', heading: 'Inter' },
      elegant: { body: 'Oxanium', heading: 'Oxanium' }, // Replaced Playfair/Lato with Oxanium
      classic: { body: 'Merriweather', heading: 'Merriweather' },
    };

    if (palettes[restaurantProfile.themeColor]) {
      const colors = palettes[restaurantProfile.themeColor];
      r.style.setProperty('--color-primary-50', colors[50]);
      r.style.setProperty('--color-primary-100', colors[100]);
      r.style.setProperty('--color-primary-200', colors[200]);
      r.style.setProperty('--color-primary-600', colors[600]);
      r.style.setProperty('--color-primary-700', colors[700]);
    } else {
      const hex = restaurantProfile.themeColor;
      r.style.setProperty('--color-primary-600', hex);
      r.style.setProperty('--color-primary-700', `color-mix(in srgb, ${hex}, black 20%)`);
      r.style.setProperty('--color-primary-200', `color-mix(in srgb, ${hex}, white 60%)`);
      r.style.setProperty('--color-primary-100', `color-mix(in srgb, ${hex}, white 80%)`);
      r.style.setProperty('--color-primary-50', `color-mix(in srgb, ${hex}, white 95%)`);
    }

    if (fontPairs[restaurantProfile.fontPair]) {
      const fonts = fontPairs[restaurantProfile.fontPair];
      r.style.setProperty('--font-body', fonts.body);
      r.style.setProperty('--font-heading', fonts.heading);
    } else if (restaurantProfile.fontPair === 'custom' && restaurantProfile.customFontFamily) {
      const fontName = restaurantProfile.customFontFamily;
      const linkId = 'dhruv-custom-font';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;700;900&display=swap`;
      r.style.setProperty('--font-body', fontName);
      r.style.setProperty('--font-heading', fontName);
    }
  }, [restaurantProfile.themeColor, restaurantProfile.fontPair, restaurantProfile.customFontFamily]);

  // --- Helper Functions ---
  const filteredItems = foodItems.filter(item => {
    const matchesCategory = activeCategory === Category.All || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const showToast = (msg: string) => {
    const existing = document.getElementById('bistro-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'bistro-toast';
    toast.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl z-[150] font-black uppercase tracking-widest text-[10px] animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/10 backdrop-blur-xl';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.replace('animate-in', 'animate-out');
      toast.classList.add('fade-out', 'slide-out-to-bottom-4');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  };

  const updateCartQuantity = (id: string, delta: number, size: 'Half' | 'Full') => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id && i.selectedSize === size);
      if (!existing && delta > 0) {
        const item = foodItems.find(i => i.id === id);
        if (item) {
          showToast(`Added ${item.name} (${size}) to order! 😋`);
          return [...prev, { ...item, quantity: 1, selectedSize: size }];
        }
      }
      return prev.map(item => {
        if (item.id === id && item.selectedSize === size) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const getQuantityInCart = (id: string, size: 'Half' | 'Full') => {
    const item = cart.find(i => i.id === id && i.selectedSize === size);
    return item ? item.quantity : 0;
  };

  // --- Data Actions (Supabase) ---

  const saveFoodItem = async (item: FoodItem) => {
    if (!user) return showToast("Please login to save changes");
    
    // Optimistic Update
    setFoodItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? item : i);
      return [item, ...prev];
    });

    // Check if the item is "new" by checking if its ID matches any known Supabase UUID
    const isTempId = item.id.length < 20; 
    
    const dbItem = {
        name: item.name,
        description: item.description,
        price: item.price,
        half_price: item.halfPrice,
        category: item.category,
        image: item.image,
        user_id: user.id,
        ...(isTempId ? {} : { id: item.id }) // Omit ID for new items
    };

    const { data, error } = await supabase.from('menu_items').upsert(dbItem).select().single();

    if (error) {
        console.error("Supabase Error:", error);
        showToast("Failed to save to cloud ☁️");
    } else if (data && isTempId) {
        // Update local state with real DB ID if it was new
        setFoodItems(prev => prev.map(i => i.id === item.id ? { ...i, id: data.id } : i));
    }

    showToast(editingItem ? 'Dish Refined! ✨' : 'New Dish Launched! 🚀');
    setIsFoodModalOpen(false);
    setEditingItem(null);
  };

  const deleteFoodItem = async (id: string) => {
    if (!user) return;
    if (confirm('Permanently remove this dish from the menu?')) {
      // Optimistic
      setFoodItems(prev => prev.filter(i => i.id !== id));
      
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) {
          console.error(error);
          showToast("Failed to delete ❌");
      } else {
          showToast('Dish Discontinued 🗑️');
      }
    }
  };

  const enhanceMenu = async () => {
    if (isEnhancing) return;
    setIsEnhancing(true);
    const enhanced = await generateAppetizingMenu(JSON.stringify(foodItems));
    if (enhanced) {
      setFoodItems(enhanced);
      // We don't auto-save enhanced items to DB yet to avoid massive writes.
      showToast('AI Intelligence Applied! ✨ (Save items manually to persist)');
    }
    setIsEnhancing(false);
  };

  const handleRecordSaved = async (record: CustomerRecord) => {
    // Optimistic
    setCustomerHistory(prev => [record, ...prev]);

    if (user) {
        const { error } = await supabase.from('orders').insert({
            id: record.id,
            user_id: user.id,
            customer_name: record.name,
            customer_contact: record.contact,
            total: record.total,
            timestamp: record.timestamp,
            items_summary: record.items,
            payment_method: record.paymentMethod,
            cart_items_json: record.cartItems
        });
        if (error) console.error("Error saving order", error);
    }
  };

  const updateProfile = async (profile: RestaurantProfile) => {
    setRestaurantProfile(profile);
    if (user) {
        const { error } = await supabase.from('profiles').update({
            name: profile.name,
            address: profile.address,
            contact: profile.contact,
            logo: profile.logo,
            owner_name: profile.ownerName,
            receipt_header: profile.receiptHeader,
            receipt_footer: profile.receiptFooter,
            theme_color: profile.themeColor,
            font_pair: profile.fontPair,
            custom_font_family: profile.customFontFamily
        }).eq('id', user.id);

        if (error) {
            console.error(error);
            showToast("Failed to update profile ❌");
        } else {
            showToast('Restaurant Settings Updated! 🏢');
        }
    }
  };

  // --- Render ---

  if (isLoading) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                    <i className="fas fa-utensils fa-spin"></i>
                  </div>
                  <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Loading Kitchen...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-0 bg-slate-50/50 transition-colors duration-500">
      <Header 
        user={user}
        onLogout={async () => { 
            await supabase.auth.signOut(); 
            setUser(null); 
            setIsAdminView(false); 
            showToast('Logged Out 👋'); 
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        isAdmin={isAdminView}
        onToggleAdmin={() => setIsAdminView(!isAdminView)}
        restaurantProfile={restaurantProfile}
        onOpenThemePicker={() => setIsThemePickerOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        {isAdminView ? (
          <AdminDashboard 
            items={foodItems}
            history={customerHistory}
            onAddItem={() => { setEditingItem(null); setIsFoodModalOpen(true); }}
            onEditItem={(item) => { setEditingItem(item); setIsFoodModalOpen(true); }}
            onDeleteItem={deleteFoodItem}
            profile={restaurantProfile}
            onUpdateProfile={updateProfile}
          />
        ) : (
          <>
            <section className="relative rounded-[4rem] bg-indigo-600 p-10 md:p-24 mb-20 overflow-hidden shadow-[0_40px_80px_-20px_rgba(var(--color-primary-600),0.3)]">
              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black mb-10 w-fit border border-white/20 uppercase tracking-[0.3em]">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse"></span>
                  Kitchen is Live
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white mb-10 leading-[0.95] tracking-tighter italic font-serif">
                  {restaurantProfile.name} <br/>
                  <span className="text-indigo-200">Served Fresh.</span>
                </h1>
                <div className="flex flex-wrap gap-5">
                  <button 
                    onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-12 py-6 bg-white text-indigo-600 rounded-[2.5rem] font-black hover:scale-105 transition-all shadow-2xl active:scale-95 text-lg flex items-center gap-3"
                  >
                    Explore Menu <i className="fas fa-chevron-right text-sm"></i>
                  </button>
                  <button 
                    onClick={enhanceMenu}
                    disabled={isEnhancing}
                    className="px-10 py-6 bg-white/10 text-white rounded-[2.5rem] font-black hover:bg-white/20 border border-white/20 transition-all flex items-center gap-3 active:scale-95"
                  >
                    {isEnhancing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                    AI Enhancement
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block pointer-events-none">
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop" className="absolute right-[-20%] top-1/2 -translate-y-1/2 w-[130%] h-[140%] object-cover opacity-40 mix-blend-screen rotate-6 blur-[1px]" alt="Food Decor" />
              </div>
            </section>

            <section id="menu-section">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
                <div className="flex-1">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none font-serif">The Menu</h2>
                  <p className="text-slate-500 font-bold mt-4 uppercase tracking-[0.1em] text-xs">A selection of chef's daily creations.</p>
                </div>
                
                {/* Search Bar with Clear Button */}
                <div className="w-full md:w-96 relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-search text-slate-400 group-focus-within:text-indigo-600 transition-colors"></i>
                    </div>
                    <input 
                        type="text"
                        placeholder="Search dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-11 pr-10 py-4 bg-white border border-slate-200 rounded-2xl leading-5 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm font-bold text-slate-700"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
              </div>

              <div className="mb-12">
                 <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {filteredItems.map(item => (
                  <FoodCard 
                    key={item.id} 
                    item={item} 
                    onUpdateQuantity={(item, delta, size) => updateCartQuantity(item.id, delta, size)}
                    getQuantity={getQuantityInCart}
                  />
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-48 bg-white rounded-[4rem] border border-dashed border-slate-200">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200 text-5xl">
                    <i className="fas fa-cookie-bite"></i>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tighter italic font-serif">
                    {user ? "Menu is Empty" : "Login to view menu"}
                  </h3>
                  {!user && (
                      <button onClick={() => setIsAuthModalOpen(true)} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Login Now</button>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={updateCartQuantity} onCheckout={() => { setIsCartOpen(false); setIsInvoiceOpen(true); }} />

      {isInvoiceOpen && (
        <InvoiceModal 
          cart={cart} 
          onClose={() => setIsInvoiceOpen(false)} 
          onClearCart={() => setCart([])} 
          onRecordSaved={handleRecordSaved} 
          restaurantProfile={restaurantProfile}
        />
      )}

      {isFoodModalOpen && (
        <FoodFormModal item={editingItem} onClose={() => setIsFoodModalOpen(false)} onSave={saveFoodItem} />
      )}

      {isThemePickerOpen && (
        <ThemePickerModal 
          currentProfile={restaurantProfile}
          onUpdateProfile={(updated) => { setRestaurantProfile(updated); updateProfile(updated); }} // Auto save on theme change
          onClose={() => setIsThemePickerOpen(false)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onLogin={(u) => { setUser(u); showToast(`Welcome, ${u.name}! 👋`); }} 
        />
      )}
    </div>
  );
};

export default App;
