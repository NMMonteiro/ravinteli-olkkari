import React, { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { LOGO_URL } from '../constants';
import { supabase } from '../supabase';
import { Header } from '../components/Header';
import { MemberGate } from '../components/MemberGate';

type AdminView = 'dashboard' | 'menu' | 'wine' | 'staff' | 'events' | 'art' | 'bookings';

interface AdminScreenProps {
  onOpenMenu: () => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onOpenMenu }) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ bookings: 0, loyalties: 0, activeEvents: 0 });

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
  useEffect(() => {
    if (activeView === 'dashboard') return;

    async function fetchItems() {
      setLoading(true);
      const tableMap: Record<string, string> = {
        menu: 'menu_items',
        wine: 'wines',
        staff: 'staff',
        events: 'events',
        art: 'art_pieces',
        bookings: 'bookings'
      };

      const { data, error } = await supabase
        .from(tableMap[activeView])
        .select('*')
        .order('id', { ascending: false });

      if (error) console.error(`Error fetching ${activeView}:`, error);
      else setItems(data || []);
      setLoading(false);
    }

    fetchItems();
  }, [activeView]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    const tableMap: Record<string, string> = {
      menu: 'menu_items',
      wine: 'wines',
      staff: 'staff',
      events: 'events',
      art: 'art_pieces',
      bookings: 'bookings'
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
    setFormData(item || { category: 'Food', subcategory: '' });
    setIsFormOpen(true);
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
      art: 'menu_images'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tableMap: Record<string, string> = {
      menu: 'menu_items',
      wine: 'wines',
      staff: 'staff',
      events: 'events',
      art: 'art_pieces',
      bookings: 'bookings'
    };

    const table = tableMap[activeView];
    let error;

    // Remove client-only naming helpers before save
    const dataToSave = { ...formData };
    delete dataToSave.isChefChoice; // Map back to is_chef_choice
    if (formData.isChefChoice !== undefined) {
      dataToSave.is_chef_choice = formData.isChefChoice;
    }

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
      alert('Error saving: ' + error.message);
    } else {
      setIsFormOpen(false);
      // Refresh list
      setActiveView('dashboard');
      setTimeout(() => setActiveView(activeView), 10);
    }
    setLoading(false);
  };

  const renderForm = () => (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card-dark w-full max-w-lg rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-xl font-bold">{editingItem ? 'Edit' : 'Add New'} {activeView}</h3>
          <button onClick={() => setIsFormOpen(false)} className="text-white/50">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-accent-gold">Name / Title</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-white focus:border-accent-gold outline-none text-base"
              value={formData.name || formData.title || formData.customer_name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value, title: e.target.value, customer_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-accent-gold">Image</label>
            <div className="flex gap-3 items-center">
              {formData.image && (
                <div className="size-16 rounded-lg bg-cover bg-center border border-white/10" style={{ backgroundImage: `url("${formData.image}")` }}></div>
              )}
              <label className="flex-1 cursor-pointer bg-white/5 border border-dashed border-white/20 rounded-lg h-16 flex items-center justify-center text-white/50 hover:bg-white/10 transition-colors">
                {uploading ? 'Uploading...' : 'Tap to Upload'}
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-accent-gold">Price / Rate</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-white outline-none text-base"
                value={formData.price || formData.rate || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value, rate: e.target.value })}
              />
            </div>

            {activeView === 'menu' && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-accent-gold">Category</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-white outline-none"
                  value={formData.category || 'Food'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Food">Food</option>
                  <option value="Drinks">Drinks</option>
                </select>
              </div>
            )}

            {activeView === 'wine' && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-accent-gold">Year • Region</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-white outline-none text-base"
                  value={formData.year && formData.region ? `${formData.year} • ${formData.region}` : ''}
                  placeholder="2019 • Tuscany"
                  onChange={(e) => {
                    const [year, region] = e.target.value.split(' • ');
                    setFormData({ ...formData, year: year || '', region: region || '' });
                  }}
                />
              </div>
            )}
          </div>

          {(activeView === 'menu' || activeView === 'wine') && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-accent-gold">Sub-Category</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-white outline-none"
                value={formData.subcategory || ''}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              >
                <option value="">None</option>
                {activeView === 'menu' && formData.category === 'Food' && (
                  <>
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Desserts">Desserts</option>
                  </>
                )}
                {activeView === 'wine' && (
                  <>
                    <option value="Red">Red</option>
                    <option value="White">White</option>
                    <option value="Rose">Rose</option>
                    <option value="Sparkling">Sparkling</option>
                  </>
                )}
              </select>
            </div>
          )}

          {activeView === 'events' && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-accent-gold">Date</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-white outline-none"
                value={formData.date || ''}
                placeholder="Oct 31"
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-accent-gold">Description</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none h-24 resize-none text-base"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-accent-gold text-primary font-bold h-12 rounded-xl mt-4 active:scale-95 transition-transform disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <>
      <div className="flex overflow-x-auto gap-4 p-4 no-scrollbar">
        <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-4 bg-primary text-white shadow-lg border border-accent-gold/20">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-accent-gold text-lg">loyalty</span>
            <span className="text-[10px] font-bold text-accent-gold bg-white/10 px-1.5 py-0.5 rounded">+12%</span>
          </div>
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Redeemed</p>
            <p className="text-2xl font-bold leading-tight">{stats.loyalties}</p>
          </div>
        </div>
        <div onClick={() => setActiveView('bookings')} className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-4 bg-card-dark border border-white/5 cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-accent-gold text-lg">calendar_today</span>
            <span className="text-[10px] font-bold text-accent-gold bg-accent-gold/10 px-1.5 py-0.5 rounded">Live</span>
          </div>
          <div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Bookings</p>
            <p className="text-2xl font-bold leading-tight">{stats.bookings}</p>
          </div>
        </div>
        <div onClick={() => setActiveView('events')} className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-4 bg-card-dark border border-white/5 cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-accent-gold text-lg">event</span>
            <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded">Tonight</span>
          </div>
          <div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Active</p>
            <p className="text-2xl font-bold leading-tight">{stats.activeEvents}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <h2 className="text-white text-xl font-bold tracking-tight mb-4">Management Controls</h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setActiveView('menu')} className="flex flex-col items-start gap-2 p-4 bg-card-dark rounded-xl border border-white/5 active:scale-95 transition-transform">
            <div className="bg-primary/50 p-2 rounded-lg text-accent-gold">
              <span className="material-symbols-outlined">restaurant_menu</span>
            </div>
            <span className="text-sm font-semibold">Menu Items</span>
          </button>
          <button onClick={() => setActiveView('wine')} className="flex flex-col items-start gap-2 p-4 bg-card-dark rounded-xl border border-white/5 active:scale-95 transition-transform">
            <div className="bg-primary/50 p-2 rounded-lg text-accent-gold">
              <span className="material-symbols-outlined">wine_bar</span>
            </div>
            <span className="text-sm font-semibold">Wine Cellar</span>
          </button>
          <button onClick={() => setActiveView('staff')} className="flex flex-col items-start gap-2 p-4 bg-card-dark rounded-xl border border-white/5 active:scale-95 transition-transform">
            <div className="bg-primary/50 p-2 rounded-lg text-accent-gold">
              <span className="material-symbols-outlined">supervisor_account</span>
            </div>
            <span className="text-sm font-semibold">Staff Hire</span>
          </button>
          <button onClick={() => setActiveView('events')} className="flex flex-col items-start gap-2 p-4 bg-card-dark rounded-xl border border-white/5 active:scale-95 transition-transform">
            <div className="bg-primary/50 p-2 rounded-lg text-accent-gold">
              <span className="material-symbols-outlined">celebration</span>
            </div>
            <span className="text-sm font-semibold">Live Events</span>
          </button>
          <button onClick={() => setActiveView('art')} className="flex flex-col items-start gap-2 p-4 bg-card-dark rounded-xl border border-white/5 active:scale-95 transition-transform">
            <div className="bg-primary/50 p-2 rounded-lg text-accent-gold">
              <span className="material-symbols-outlined">palette</span>
            </div>
            <span className="text-sm font-semibold">Art Gallery</span>
          </button>
          <button onClick={() => setActiveView('bookings')} className="flex flex-col items-start gap-2 p-4 bg-card-dark rounded-xl border border-white/5 active:scale-95 transition-transform">
            <div className="bg-primary/50 p-2 rounded-lg text-accent-gold">
              <span className="material-symbols-outlined">description</span>
            </div>
            <span className="text-sm font-semibold">Bookings</span>
          </button>
        </div>
      </div>
    </>
  );

  const renderItemsList = () => (
    <div className="px-4 py-4 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setActiveView('dashboard')} className="text-accent-gold">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-white text-xl font-bold capitalize">{activeView} Management</h2>
      </div>

      {loading ? (
        <div className="py-20 text-center text-accent-gold animate-pulse">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center text-white/50 italic">No items found in this category.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-card-dark/50 p-3 rounded-xl border border-white/5">
              {item.image && (
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg h-12 w-12 flex-none"
                  style={{ backgroundImage: `url("${item.image}")` }}
                ></div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{item.name || item.title || item.customer_name}</p>
                <p className="text-white/50 text-xs truncate">
                  {item.subcategory ? `[${item.subcategory}] ` : ''}
                  {item.description || item.role || item.date}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openForm(item)} className="p-2 text-accent-gold hover:bg-white/5 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-white/5 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <MemberGate title="Manager Access" description="This area is restricted to Ravinteli Olkkari management staff.">
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display pb-24">
        <Header onOpenMenu={onOpenMenu} title="Manager Suite" />

        <main className="overflow-x-hidden">
          {activeView === 'dashboard' ? renderDashboard() : renderItemsList()}
        </main>

        {activeView !== 'dashboard' && activeView !== 'bookings' && (
          <button onClick={() => openForm()} className="fixed right-4 bottom-24 bg-accent-gold text-primary shadow-2xl size-14 rounded-full flex items-center justify-center z-40 active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-[28px] font-bold">add</span>
          </button>
        )}

        {isFormOpen && renderForm()}

        <Navigation />
      </div>
    </MemberGate>
  );
};

export default AdminScreen;
