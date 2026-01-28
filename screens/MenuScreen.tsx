import React, { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { LOGO_URL } from '../constants';
import { supabase } from '../supabase';
import { MenuItem, Wine } from '../types';
import { Header } from '../components/Header';

type Category = 'Food' | 'Drinks' | 'Wine';

const FOOD_SUBS = ['Starters', 'Mains', 'Desserts'];
const WINE_SUBS = ['Red', 'White', 'Rose', 'Sparkling', 'Dessert'];

interface MenuScreenProps {
  onOpenMenu: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onOpenMenu }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('Food');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('Starters');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync subcategory when main category changes
  useEffect(() => {
    if (activeCategory === 'Food') setActiveSubcategory('Starters');
    else if (activeCategory === 'Wine') setActiveSubcategory('Red');
    else setActiveSubcategory('');
  }, [activeCategory]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (activeCategory === 'Wine') {
        let query = supabase.from('wines').select('*');

        if (activeSubcategory) {
          query = query.eq('subcategory', activeSubcategory);
        }

        const { data, error } = await query.order('id', { ascending: true });

        if (error) console.error('Error fetching wines:', error);
        else setWines(data || []);
      } else {
        let query = supabase
          .from('menu_items')
          .select('id, name, price, description, image, subcategory, isChefChoice:is_chef_choice')
          .eq('category', activeCategory);

        if (activeSubcategory && activeCategory === 'Food') {
          query = query.eq('subcategory', activeSubcategory);
        }

        const { data, error } = await query.order('id', { ascending: true });

        if (error) console.error('Error fetching menu:', error);
        else setMenuItems(data || []);
      }
      setLoading(false);
    }

    fetchData();
  }, [activeCategory, activeSubcategory]);

  return (
    <div className="min-h-screen text-warm-ivory pb-24">
      <Header onOpenMenu={onOpenMenu} title="Seasonal Menu" />

      {/* Main Tabs */}
      <div className="sticky top-[68px] z-30 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
        <div className="px-4">
          <div className="flex justify-between">
            {(['Food', 'Drinks', 'Wine'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 flex-1 transition-all ${activeCategory === cat
                  ? 'border-accent-gold text-accent-gold'
                  : 'border-transparent text-gray-400 dark:text-warm-ivory/60'
                  }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">{cat}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      {(activeCategory === 'Food' || activeCategory === 'Wine') && (
        <div className="bg-background-dark/80 backdrop-blur-sm sticky top-[125px] z-20 py-3 border-b border-white/5 overflow-x-auto no-scrollbar">
          <div className="px-6 flex gap-6 justify-center">
            {(activeCategory === 'Food' ? FOOD_SUBS : WINE_SUBS).map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubcategory(sub)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all ${activeSubcategory === sub ? 'text-accent-gold bg-accent-gold/10 px-3 py-1 rounded-full' : 'text-white/30'}`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      <main>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-accent-gold font-medium animate-pulse">Browsing the {activeSubcategory || activeCategory} list...</p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {activeCategory === 'Wine' ? (
              <div className="grid grid-cols-1 gap-4">
                {wines.length === 0 ? (
                  <div className="py-20 text-center opacity-40 italic text-sm">No selection in this category yet.</div>
                ) : wines.map((wine) => (
                  <div key={wine.id} className="flex flex-col bg-white dark:bg-primary/20 rounded-2xl overflow-hidden border border-white/5 shadow-lg group">
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url("${wine.image}")` }}
                    >
                      <div className="h-full w-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                        <span className="bg-accent-gold/10 text-accent-gold text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-accent-gold/20 backdrop-blur-sm">
                          {wine.subcategory || wine.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white text-lg font-bold">{wine.name}</h3>
                          <p className="text-accent-gold text-xs font-semibold">{wine.year} • {wine.region}</p>
                        </div>
                        <p className="text-accent-gold font-bold">{wine.price}</p>
                      </div>
                      <p className="text-warm-ivory/70 text-sm mt-2 leading-relaxed">{wine.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {menuItems.length === 0 ? (
                  <div className="py-20 text-center opacity-40 italic text-sm font-montserrat font-light">No selection in this category yet.</div>
                ) : menuItems.map((item) => (
                  <div key={item.id} className="relative flex items-stretch min-h-[150px] rounded-2xl bg-burgundy-accent/80 backdrop-blur-md overflow-hidden border border-white/5 active:scale-[0.98] transition-all group shadow-2xl">
                    {/* Content Section - Fully opaque over the blended image edge */}
                    <div className="flex-1 p-6 z-10 flex flex-col justify-between relative">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-accent-gold text-xs font-montserrat font-bold tracking-widest">{item.price}</p>
                          {item.subcategory && (
                            <span className="bg-accent-gold/10 text-accent-gold text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-accent-gold/20 backdrop-blur-md">
                              {item.subcategory}
                            </span>
                          )}
                        </div>
                        <h3 className="text-white text-xl font-bold leading-tight group-hover:text-accent-gold transition-colors">{item.name}</h3>
                        <p className="text-warm-ivory/60 text-xs font-montserrat font-light leading-relaxed line-clamp-2 max-w-[90%]">{item.description}</p>
                      </div>

                      {item.isChefChoice && (
                        <div className="flex gap-2 items-center mt-3">
                          <div className="size-5 rounded-full bg-accent-gold/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-accent-gold text-[10px]">workspace_premium</span>
                          </div>
                          <span className="text-[9px] uppercase tracking-[0.2em] text-accent-gold font-bold">Chef's Choice</span>
                        </div>
                      )}
                    </div>

                    {/* Perfect Blended Image Section */}
                    {item.image && (
                      <div className="absolute right-0 top-0 bottom-0 w-3/5 h-full pointer-events-none">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                          style={{ backgroundImage: `url("${item.image}")` }}
                        />
                        {/* Blend Overlays - Using the exact card color (#2d2021) for seamless transition */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2d2021] via-[#2d2021] via-30% to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2d2021] to-transparent opacity-60"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loyalty Banner */}
        <div className="mx-4 mt-6 p-6 rounded-xl bg-gradient-to-br from-primary to-[#331418] border border-accent-gold/30">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-accent-gold font-bold text-lg">Olkkari Points</h4>
              <p className="text-warm-ivory/80 text-xs mt-1">Order the Monthly Special to earn 50 bonus points!</p>
            </div>
            <div className="bg-accent-gold/20 p-2 rounded-full">
              <span className="material-symbols-outlined text-accent-gold">stars</span>
            </div>
          </div>
          <div className="mt-4 bg-background-dark/40 rounded-full h-2 w-full overflow-hidden" title="Progress bar">
            <div className="bg-accent-gold h-full w-2/3"></div>
          </div>
          <p className="text-[10px] text-accent-gold/80 mt-2 font-bold tracking-widest uppercase text-right">350 / 500 TO NEXT REWARD</p>
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default MenuScreen;