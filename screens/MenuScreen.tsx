import React, { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { LOGO_URL } from '../constants';
import { supabase } from '../supabase';
import { MenuItem } from '../types';

const MenuScreen: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase
        .from('menu_items')
        .select('id, name, price, description, image, tags, isChefChoice:is_chef_choice')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching menu:', error);
      } else {
        setMenuItems(data || []);
      }
      setLoading(false);
    }

    fetchMenu();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-warm-ivory pb-24">
      {/* Top Nav */}
      <div className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center p-4 py-3 justify-between">
          <div className="text-white flex size-12 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </div>
          <div className="flex-1 flex justify-center">
            <img src={LOGO_URL} alt="Olkkari" className="h-8 w-auto object-contain" />
          </div>
          <div className="flex w-12 items-center justify-end">
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 bg-transparent text-primary dark:text-accent-gold">
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="px-4">
          <div className="flex justify-between">
            <button className="flex flex-col items-center justify-center border-b-[3px] border-accent-gold text-accent-gold pb-[13px] pt-4 flex-1 transition-colors">
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Food</p>
            </button>
            <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-400 dark:text-warm-ivory/60 pb-[13px] pt-4 flex-1 transition-colors">
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Drinks</p>
            </button>
            <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-400 dark:text-warm-ivory/60 pb-[13px] pt-4 flex-1 transition-colors">
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Wine</p>
            </button>
          </div>
        </div>
      </div>

      <main>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-accent-gold font-medium animate-pulse">Loading Menu...</p>
          </div>
        ) : (
          <>
            {/* Starters */}
            <div className="mt-4">
              <h3 className="text-primary dark:text-accent-gold tracking-tight text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">Starters</h3>
              <div className="p-4 pt-2">
                {menuItems.filter(item => item.name === 'Beef Tartar').map(item => (
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
            </div>

            {/* Mains */}
            <div>
              <div className="flex items-center justify-between px-4 pt-5 pb-2">
                <h3 className="text-primary dark:text-accent-gold tracking-tight text-2xl font-bold leading-tight">Main Courses</h3>
                <span className="material-symbols-outlined text-accent-gold cursor-pointer">tune</span>
              </div>
              <div className="p-4 pt-2 flex flex-col gap-4">
                {menuItems.filter(item => item.name !== 'Beef Tartar').map(item => (
                  <div key={item.id} className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-primary/20 p-4 shadow-sm border border-primary/10 dark:border-white/5 active:scale-[0.98] transition-transform">
                    <div className="flex flex-[2_2_0px] flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-accent-gold text-sm font-bold leading-normal">{item.price}</p>
                        <p className="text-primary dark:text-white text-lg font-bold leading-tight">{item.name}</p>
                        <p className="text-gray-600 dark:text-warm-ivory text-sm font-normal leading-relaxed">{item.description}</p>
                      </div>
                      {item.tags?.includes('Sustainable') ? (
                        <div className="flex gap-2 items-center">
                          <span className="material-symbols-outlined text-green-600 text-sm">eco</span>
                          <span className="text-[10px] uppercase tracking-wider text-green-600 font-bold">Sustainable</span>
                        </div>
                      ) : (
                        <button className="flex items-center justify-center rounded-lg h-8 px-4 bg-primary text-white text-xs font-bold tracking-widest uppercase w-fit">
                          <span>Details</span>
                        </button>
                      )}
                    </div>
                    <div
                      className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg flex-none"
                      style={{ backgroundImage: `url("${item.image}")` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </>
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
          <div className="mt-4 bg-background-dark/40 rounded-full h-2 w-full overflow-hidden">
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