import React, { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { LOGO_URL } from '../constants';
import { supabase } from '../supabase';
import { MenuItem, Wine } from '../types';

type Category = 'Food' | 'Drinks' | 'Wine';

import { Header } from '../components/Header';

interface MenuScreenProps {
  onOpenMenu: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onOpenMenu }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('Food');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (activeCategory === 'Wine') {
        const { data, error } = await supabase
          .from('wines')
          .select('*')
          .order('id', { ascending: true });

        if (error) console.error('Error fetching wines:', error);
        else setWines(data || []);
      } else {
        const { data, error } = await supabase
          .from('menu_items')
          .select('id, name, price, description, image, tags, isChefChoice:is_chef_choice')
          .eq('category', activeCategory)
          .order('id', { ascending: true });

        if (error) console.error('Error fetching menu:', error);
        else setMenuItems(data || []);
      }
      setLoading(false);
    }

    fetchData();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-warm-ivory pb-24">
      <Header onOpenMenu={onOpenMenu} title="Seasonal Menu" />

      {/* Tabs */}
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

      <main>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-accent-gold font-medium animate-pulse">Browsing the {activeCategory} list...</p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {activeCategory === 'Wine' ? (
              <div className="grid grid-cols-1 gap-4">
                {wines.map((wine) => (
                  <div key={wine.id} className="flex flex-col bg-white dark:bg-primary/20 rounded-2xl overflow-hidden border border-white/5 shadow-lg group">
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url("${wine.image}")` }}
                    >
                      <div className="h-full w-full bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                        <span className="bg-accent-gold text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">{wine.type}</span>
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
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-primary/20 p-4 shadow-sm border border-primary/10 dark:border-white/5 active:scale-[0.98] transition-transform">
                    <div className="flex flex-[2_2_0px] flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-accent-gold text-sm font-bold leading-normal">{item.price}</p>
                        <p className="text-primary dark:text-white text-lg font-bold leading-tight">{item.name}</p>
                        <p className="text-gray-600 dark:text-warm-ivory text-sm font-normal leading-relaxed">{item.description}</p>
                      </div>
                      {item.isChefChoice && (
                        <div className="flex gap-2 items-center">
                          <span className="material-symbols-outlined text-accent-gold text-sm">workspace_premium</span>
                          <span className="text-[10px] uppercase tracking-wider text-accent-gold font-bold">Chef's Choice</span>
                        </div>
                      )}
                    </div>
                    <div
                      className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg flex-none"
                      style={{ backgroundImage: `url("${item.image}")` }}
                    ></div>
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