import React, { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { LOGO_URL } from '../constants';
import { supabase } from '../supabase';
import { Header } from '../components/Header';
import { MemberGate } from '../components/MemberGate';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type AdminView = 'dashboard' | 'menu' | 'wine' | 'staff' | 'events' | 'art' | 'bookings' | 'knowledge';

interface AdminScreenProps {
  onOpenMenu: () => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ bookings: 0, loyalties: 0, activeEvents: 0 });

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');

  // Fetch initial stats
  useEffect(() => {
    async function fetchStats() {
      const { count: bCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
      const { count: eCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_tonight', true);
      setStats({ bookings: bCount || 0, loyalties: 124, activeEvents: eCount || 0 });
    }
    fetchStats();
  }, []);

  // Fetch items based on active view
  const fetchItems = async () => {
    if (activeView === 'dashboard') return;
    setLoading(true);
    const tableMap: Record<string, string> = {
      menu: 'menu_items',
      wine: 'wines',
      staff: 'staff',
      events: 'events',
      art: 'art_pieces',
      bookings: 'bookings',
      knowledge: 'knowledge_base'
    };

    const { data, error } = await supabase
      .from(tableMap[activeView])
      .select('*')
      .order('id', { ascending: false });

    if (error) console.error(`Error fetching ${activeView}:`, error);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    setSearchQuery('');
    setSubcategoryFilter('');
  }, [activeView]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const tableMap: Record<string, string> = {
      menu: 'menu_items',
      wine: 'wines',
      staff: 'staff',
      events: 'events',
      art: 'art_pieces',
      bookings: 'bookings',
      knowledge: 'knowledge_base'
    };

    const { error } = await supabase
      .from(tableMap[activeView])
      .delete()
      .eq('id', id);

    if (error) alert('Error deleting item: ' + error.message);
    else setItems(items.filter(item => item.id !== id));
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const openForm = (item: any = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        ...item,
        category: item.category || (activeView === 'wine' ? 'Wine' : 'Food')
      });
    } else {
      setFormData({
        category: activeView === 'wine' ? 'Wine' : 'Food',
        subcategory: '',
        is_chef_choice: false,
        is_tonight: false
      });
    }
    setIsFormOpen(true);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/welcome');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const bucketMap: Record<string, string> = {
      menu: 'menu_images',
      staff: 'staff_images',
      wine: 'menu_images',
      events: 'menu_images',
      art: 'menu_images',
      knowledge: 'menu_images'
    };

    const bucket = bucketMap[activeView] || 'menu_images';
    const filePath = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      alert('Error uploading image: ' + error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      setFormData({ ...formData, image: publicUrl });
    }
    setUploading(false);
  };

  const syncWebsite = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-website-now');
      if (error) throw error;
      alert('Website context synchronized successfully!');
      fetchItems();
    } catch (err: any) {
      console.error('Sync Error:', err);
      alert('Sync failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tableMap: Record<string, string> = {
      menu: 'menu_items',
      wine: 'wines',
      staff: 'staff',
      events: 'events',
      art: 'art_pieces',
      bookings: 'bookings',
      knowledge: 'knowledge_base'
    };

    const table = tableMap[activeView];

    // Explicitly define columns to save for each table to avoid payload errors
    const tableColumns: Record<string, string[]> = {
      menu: ['name', 'price', 'description', 'image', 'is_chef_choice', 'category', 'subcategory'],
      wine: ['name', 'year', 'region', 'type', 'subcategory', 'price', 'description', 'image'],
      staff: ['name', 'role', 'description', 'image', 'rate', 'badge'],
      events: ['title', 'date', 'time', 'description', 'image', 'type', 'is_tonight'],
      art: ['title', 'medium', 'price', 'image'],
      bookings: ['customer_name', 'email', 'date', 'guests', 'location', 'message', 'status'],
      knowledge: ['category', 'content']
    };

    const allowedColumns = tableColumns[activeView];
    const dataToSave: any = {};

    allowedColumns.forEach(col => {
      if (formData[col] !== undefined) {
        dataToSave[col] = formData[col];
      }
      // Fallback mappings
      else if (col === 'name' && formData.title) dataToSave.name = formData.title;
      else if (col === 'title' && formData.name) dataToSave.title = formData.name;
      else if (col === 'category' && activeView === 'knowledge' && formData.name) dataToSave.category = formData.name;
    });

    // Mirror subcategory to type for wines to ensure display consistency
    if (activeView === 'wine' && dataToSave.subcategory) {
      dataToSave.type = dataToSave.subcategory;
    }

    // Handle Booleans
    if (dataToSave.is_chef_choice !== undefined) dataToSave.is_chef_choice = !!dataToSave.is_chef_choice;
    if (dataToSave.is_tonight !== undefined) dataToSave.is_tonight = !!dataToSave.is_tonight;

    let error;

    if (editingItem) {
      const { error: err } = await supabase
        .from(table)
        .update(dataToSave)
        .eq('id', editingItem.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from(table)
        .insert([dataToSave]);
      error = err;
    }

    if (error) {
      alert(`Archive Update Failed: ${error.message}`);
    } else {
      alert(`${dataToSave.name || dataToSave.title || 'Item'} synchronized.`);
      setIsFormOpen(false);
      fetchItems(); // Direct fetch after save
    }
    setLoading(false);
  };

  const renderForm = () => (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card-dark w-full max-w-lg rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-xl font-bold uppercase italic tracking-tight">{editingItem ? 'Modify' : 'Archive'} {activeView}</h3>
          <button onClick={() => setIsFormOpen(false)} className="text-white/50">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pb-10">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-accent-gold tracking-widest px-1">
              {activeView === 'knowledge' ? 'Topic / Category' : 'Identity'}
            </label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-white focus:border-accent-gold outline-none text-base"
              value={formData.name || formData.title || formData.category || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value, title: e.target.value, category: e.target.value })}
              required
            />
          </div>

          {activeView !== 'knowledge' && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-accent-gold tracking-widest px-1">Visual Asset</label>
              <div className="flex gap-4 items-center">
                {formData.image && (
                  <div className="size-20 rounded-2xl bg-cover bg-center border border-white/10 flex-none" style={{ backgroundImage: `url("${formData.image}")` }}></div>
                )}
                <label className="flex-1 cursor-pointer bg-white/5 border border-dashed border-white/20 rounded-2xl h-20 flex flex-col items-center justify-center text-white/30 hover:bg-white/10 transition-colors group">
                  <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">cloud_upload</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">{uploading ? 'Archiving Image...' : 'Tap to Upload'}</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {activeView !== 'knowledge' && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-accent-gold tracking-widest px-1">Valuation</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-white focus:border-accent-gold outline-none text-base"
                  value={formData.price || formData.rate || ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value, rate: e.target.value })}
                />
              </div>
            )}

            {activeView === 'menu' ? (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-accent-gold tracking-widest px-1">Category</label>
                <div className="relative">
                  <select
                    className="w-full bg-[#2a1f20] border border-white/10 rounded-2xl h-14 px-5 text-white focus:border-accent-gold outline-none text-base appearance-none"
                    value={formData.category || 'Food'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                  >
                    <option value="Food" className="bg-[#1d1516] text-white">Food</option>
                    <option value="Drinks" className="bg-[#1d1516] text-white">Drinks</option>
                    <option value="Wine" className="bg-[#1d1516] text-white">Wine</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">expand_more</span>
                </div>
              </div>
            ) : activeView === 'events' ? (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-accent-gold tracking-widest px-1">Event Date</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-white focus:border-accent-gold outline-none text-base"
                  value={formData.date || ''}
                  placeholder="Oct 31"
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            ) : null}
          </div>

          {(formData.category === 'Food' || formData.category === 'Wine') && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-accent-gold tracking-widest px-1">Sub-Category Selection</label>
              <div className="relative">
                <select
                  className="w-full bg-[#2a1f20] border border-white/10 rounded-2xl h-14 px-5 text-white focus:border-accent-gold outline-none text-base appearance-none"
                  value={formData.subcategory || ''}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                >
                  <option value="" className="bg-[#1d1516] text-white">None (Global)</option>
                  {formData.category === 'Food' && (
                    <>
                      <option value="Starters" className="bg-[#1d1516] text-white">Starters</option>
                      <option value="Mains" className="bg-[#1d1516] text-white">Mains</option>
                      <option value="Desserts" className="bg-[#1d1516] text-white">Desserts</option>
                    </>
                  )}
                  {formData.category === 'Wine' && (
                    <>
                      <option value="Red" className="bg-[#1d1516] text-white">Red Wine</option>
                      <option value="White" className="bg-[#1d1516] text-white">White Wine</option>
                      <option value="Rose" className="bg-[#1d1516] text-white">Rosé Wine</option>
                      <option value="Sparkling" className="bg-[#1d1516] text-white">Sparkling / Champagne</option>
                      <option value="Dessert" className="bg-[#1d1516] text-white">Dessert Wine</option>
                    </>
                  )}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">expand_more</span>
              </div>
            </div>
          )}

          {activeView === 'menu' && formData.category === 'Food' && (
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
              <input
                type="checkbox"
                id="chefchoice"
                className="size-5 rounded border-white/10 bg-white/5 text-accent-gold focus:ring-accent-gold accent-gold"
                checked={!!formData.is_chef_choice}
                onChange={(e) => setFormData({ ...formData, is_chef_choice: e.target.checked })}
              />
              <label htmlFor="chefchoice" className="text-xs font-bold uppercase tracking-widest text-white/70">Mark as Chef's Choice</label>
            </div>
          )}

          {activeView === 'wine' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-accent-gold tracking-widest px-1">Vintage Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2018"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-white focus:border-accent-gold outline-none text-base"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-accent-gold tracking-widest px-1">Region</label>
                <input
                  type="text"
                  placeholder="e.g. Bordeaux"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-white focus:border-accent-gold outline-none text-base"
                  value={formData.region || ''}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-accent-gold tracking-widest px-1">Contextual Information</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:border-accent-gold outline-none h-32 resize-none text-base"
              value={formData.description || formData.content || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value, content: e.target.value })}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-accent-gold text-primary font-black h-16 rounded-2xl mt-4 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-accent-gold/10 uppercase tracking-widest text-[10px]"
          >
            {loading ? 'Processing...' : 'Sync with Archive'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <>
      <div className="px-6 pt-6">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">Manager Suite</h1>
        <p className="text-accent-gold/60 text-[10px] font-black uppercase tracking-[0.3em] mt-2 mb-6">Concierge Operations</p>
      </div>

      <div className="flex overflow-x-auto gap-4 px-6 mb-8 no-scrollbar">
        <div className="flex min-w-[160px] flex-1 flex-col gap-4 rounded-[2rem] p-6 bg-accent-gold text-primary shadow-2xl relative overflow-hidden group">
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl opacity-10 group-hover:scale-110 transition-transform">loyalty</span>
          <span className="material-symbols-outlined text-3xl">loyalty</span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Redeemed</p>
            <p className="text-3xl font-black leading-tight italic">{stats.loyalties}</p>
          </div>
        </div>

        <div onClick={() => setActiveView('bookings')} className="flex min-w-[160px] flex-1 flex-col gap-4 rounded-[2rem] p-6 bg-card-dark border border-white/5 shadow-xl relative overflow-hidden group cursor-pointer active:scale-95 transition-all">
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:scale-110 transition-transform text-accent-gold">calendar_today</span>
          <span className="material-symbols-outlined text-3xl text-accent-gold">calendar_today</span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Live Bookings</p>
            <p className="text-3xl font-black leading-tight text-white italic">{stats.bookings}</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-12">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-white text-xs font-black uppercase tracking-[0.3em] opacity-40">Management Controls</h2>
          <button
            onClick={handleLogout}
            className="text-red-500/60 text-[8px] font-black uppercase tracking-widest flex items-center gap-1"
          >
            Logout <span className="material-symbols-outlined text-xs">logout</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'menu', label: 'Menu Items', icon: 'restaurant_menu' },
            { id: 'wine', label: 'Wine Cellar', icon: 'wine_bar' },
            { id: 'staff', label: 'Staff Hire', icon: 'supervisor_account' },
            { id: 'events', label: 'Live Events', icon: 'celebration' },
            { id: 'art', label: 'Art Gallery', icon: 'palette' },
            { id: 'knowledge', label: 'Bot Context', icon: 'psychology' },
            { id: 'bookings', label: 'Inquiries', icon: 'description' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className="flex flex-col items-start gap-4 p-6 bg-card-dark rounded-[2rem] border border-white/5 active:scale-95 transition-all shadow-lg group"
            >
              <div className="bg-white/5 p-3 rounded-2xl text-accent-gold group-hover:bg-accent-gold group-hover:text-primary transition-all shadow-md">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );


  const renderItemsList = () => {
    const filteredItems = items.filter(item => {
      const matchesSearch = (
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      );

      const matchesSubcategory = !subcategoryFilter || item.subcategory === subcategoryFilter;

      return matchesSearch && matchesSubcategory;
    });

    const subcategories = activeView === 'menu' ? ['Starters', 'Mains', 'Desserts'] :
      activeView === 'wine' ? ['Red', 'White', 'Rose', 'Sparkling', 'Dessert'] : [];

    return (
      <div className="px-6 py-4 space-y-6">
        <div className="flex items-center justify-between px-1 mb-2">
          <button onClick={() => setActiveView('dashboard')} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-accent-gold active:scale-90 transition-all border border-white/5">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-white text-lg font-black uppercase italic tracking-tight">{activeView} Sync</h2>
          {activeView === 'knowledge' && (
            <button
              onClick={syncWebsite}
              disabled={loading}
              className="flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              Sync Website
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20">search</span>
          <input
            type="text"
            placeholder={`Search ${activeView}...`}
            className="w-full bg-card-dark border border-white/10 rounded-2xl h-12 pl-12 pr-4 text-white focus:border-accent-gold outline-none text-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Subcategory Filters */}
        {subcategories.length > 0 && (
          <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setSubcategoryFilter('')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!subcategoryFilter ? 'bg-accent-gold text-primary' : 'bg-white/5 text-white/40 border border-white/10'}`}
            >
              All
            </button>
            {subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setSubcategoryFilter(sub)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${subcategoryFilter === sub ? 'bg-accent-gold text-primary' : 'bg-white/5 text-white/40 border border-white/10'}`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-accent-gold animate-pulse italic font-bold tracking-widest uppercase text-xs">Accessing Database...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-card-dark rounded-[2rem] border border-white/5 border-dashed">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">
              {searchQuery || subcategoryFilter ? 'No items match your filters' : 'No entries found in this archive'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex items-center gap-5 bg-card-dark p-4 rounded-3xl border border-white/5 shadow-md group">
                {item.image ? (
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl h-14 w-14 flex-none shadow-inner border border-white/5 transition-transform group-hover:scale-105"
                    style={{ backgroundImage: `url("${item.image}")` }}
                  ></div>
                ) : (
                  <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 flex-none border border-white/5">
                    <span className="material-symbols-outlined">image</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-black truncate tracking-wide">{item.name || item.title || item.customer_name || item.category}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.subcategory && (
                      <span className="bg-accent-gold/10 text-accent-gold text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-accent-gold/20 backdrop-blur-sm">
                        {item.subcategory}
                      </span>
                    )}
                    <p className="text-white/40 text-[10px] truncate font-medium italic">{item.description || item.role || item.date || item.content}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openForm(item)} className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-gold hover:bg-accent-gold/10 transition-all">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <MemberGate adminOnly={true} title="Manager Access" description="This area is restricted to Ravinteli Olkkari management staff profile validation.">
      <div className="min-h-screen text-slate-900 dark:text-white font-display pb-24 relative overflow-hidden">
        <Header onOpenMenu={onOpenMenu} title="Society Control" />

        <main className="relative z-10">
          {activeView === 'dashboard' ? renderDashboard() : renderItemsList()}
        </main>

        {activeView !== 'dashboard' && activeView !== 'bookings' && (
          <button
            onClick={() => openForm()}
            className="fixed right-6 bottom-28 bg-accent-gold text-primary shadow-[0_15px_30px_rgba(197,160,89,0.4)] size-16 rounded-3xl flex items-center justify-center z-40 active:scale-90 transition-all border-4 border-primary/20"
          >
            <span className="material-symbols-outlined text-3xl font-black">add</span>
          </button>
        )}

        {isFormOpen && renderForm()}

        <Navigation />
      </div>
    </MemberGate>
  );
};

export default AdminScreen;
