import React, { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { supabase } from '../supabase';
import { MenuItem, Wine } from '../types';
import { Header } from '../components/Header';
import { AnimatePresence, motion } from 'framer-motion';

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

  // Detail State
  const [selectedItem, setSelectedItem] = useState<MenuItem | Wine | null>(null);

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
        let query = supabase.from('wines').select('id, name, year, region, type, subcategory, price_glass, price_bottle, description, image, isSommelierChoice:is_sommelier_choice');

        if (activeSubcategory) {
          query = query.eq('subcategory', activeSubcategory);
        }

        const { data, error } = await query.order('id', { ascending: true });

        if (error) console.error('Error fetching wines:', error);
        else setWines(data || []);
      } else {
        let query = supabase
          .from('menu_items')
          .select('id, name, price, description, image, subcategory, isChefChoice:is_chef_choice, category')
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

  const isWine = (item: MenuItem | Wine): item is Wine => {
    return 'year' in item || 'region' in item || (item as any).category === 'Wine';
  };

  const isFood = (item: MenuItem | Wine): item is MenuItem => {
    return 'isChefChoice' in item && !('year' in item);
  };

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
            <AnimatePresence mode="wait">
              {activeCategory === 'Wine' ? (
                <motion.div
                  key={`wine-${activeSubcategory}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 gap-4"
                >
                  {wines.length === 0 ? (
                    <div className="py-20 text-center opacity-40 italic text-sm">No selection in this category yet.</div>
                  ) : wines.map((wine, idx) => (
                    <motion.div
                      key={wine.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedItem(wine)}
                      className="flex flex-col bg-white dark:bg-primary/20 rounded-2xl overflow-hidden border border-white/5 shadow-lg group cursor-pointer active:scale-[0.98] transition-transform"
                    >
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
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white text-lg font-bold">{wine.name}</h3>
                              {wine.isSommelierChoice && (
                                <span className="material-symbols-outlined text-accent-gold text-lg fill-1">workspace_premium</span>
                              )}
                            </div>
                            <p className="text-accent-gold text-xs font-semibold">{wine.year} • {wine.region}</p>
                          </div>
                          <div className="text-right">
                            {wine.price_glass && wine.price_glass !== '-' && (
                              <p className="text-accent-gold font-bold text-sm">Price Glass 12cl {wine.price_glass}€</p>
                            )}
                            {wine.price_bottle && wine.price_bottle !== '-' && (
                              <p className="text-accent-gold font-bold">Price Bottle {wine.price_bottle}€</p>
                            )}
                          </div>
                        </div>
                        <p className="text-warm-ivory/70 text-sm mt-2 leading-relaxed line-clamp-2">{wine.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`menu-${activeCategory}-${activeSubcategory}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col gap-4"
                >
                  {menuItems.length === 0 ? (
                    <div className="py-20 text-center opacity-40 italic text-sm font-montserrat font-light">No selection in this category yet.</div>
                  ) : menuItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedItem(item)}
                      className="relative flex items-stretch min-h-[150px] rounded-2xl bg-burgundy-accent/80 backdrop-blur-md overflow-hidden border border-white/5 active:scale-[0.98] transition-all group shadow-2xl cursor-pointer"
                    >
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

                      {item.image && (
                        <div className="absolute right-0 top-0 bottom-0 w-3/5 h-full pointer-events-none">
                          <div
                            className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                            style={{ backgroundImage: `url("${item.image}")` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#2d2021] via-[#2d2021] via-30% to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#2d2021] to-transparent opacity-60"></div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-burgundy-accent/40 rounded-[32px] border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {/* Top Image */}
              <div className="w-full aspect-square relative bg-primary/20">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d1516] via-transparent to-transparent" />

                {/* Float Badges */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div className="space-y-2">
                    {isWine(selectedItem) ? (
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-accent-gold/10 text-accent-gold text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-accent-gold/20 backdrop-blur-md">
                          {selectedItem.subcategory || (selectedItem as Wine).type}
                        </span>
                        {selectedItem.year && !['Sparkling', 'Champagne', 'Sparkling Wine'].includes(selectedItem.subcategory || (selectedItem as Wine).type || '') && (
                          <span className="bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
                            Vintage: {selectedItem.year}
                          </span>
                        )}
                      </div>
                    ) : (
                      selectedItem.subcategory && (
                        <span className="bg-accent-gold/10 text-accent-gold text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-accent-gold/20 backdrop-blur-md">
                          {selectedItem.subcategory}
                        </span>
                      )
                    )}
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tight leading-none drop-shadow-xl">{selectedItem.name}</h2>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    {isWine(selectedItem) && selectedItem.price_glass && selectedItem.price_glass !== '-' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 block font-bold whitespace-nowrap">Price Glass 12cl</span>
                        <div className="text-lg font-black text-accent-gold drop-shadow-xl">{selectedItem.price_glass}€</div>
                      </div>
                    )}
                    {isWine(selectedItem) && selectedItem.price_bottle && selectedItem.price_bottle !== '-' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 block font-bold whitespace-nowrap">Price Bottle</span>
                        <div className="text-2xl font-black text-accent-gold drop-shadow-xl">{selectedItem.price_bottle}€</div>
                      </div>
                    )}
                    {!isWine(selectedItem) && (
                      <div className="text-2xl font-black text-accent-gold drop-shadow-xl">{(selectedItem as MenuItem).price}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-8 pt-6 space-y-6">
                <div className="space-y-4">
                  <p className="text-warm-ivory/80 text-lg leading-relaxed font-montserrat font-light italic">
                    {selectedItem.description}
                  </p>

                  {isWine(selectedItem) && (
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-white/40 block font-bold">Type</span>
                        <span className="text-sm font-bold text-accent-gold">{selectedItem.type}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-white/40 block font-bold">Origin</span>
                        <span className="text-sm font-bold text-accent-gold">{selectedItem.region}</span>
                      </div>
                    </div>
                  )}

                  {/* Chef's Choice - Food items only */}
                  {isFood(selectedItem) && (selectedItem as MenuItem).isChefChoice && (
                    <div className="flex gap-4 items-center bg-accent-gold/5 p-4 rounded-2xl border border-accent-gold/20">
                      <div className="size-10 rounded-full bg-accent-gold/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-accent-gold text-2xl">workspace_premium</span>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-accent-gold">Chef's Choice</p>
                        <p className="text-[10px] text-warm-ivory/60 mt-0.5">The kitchen's specialized selection for this evening.</p>
                      </div>
                    </div>
                  )}

                  {/* Sommelier's Choice - Wine items only */}
                  {isWine(selectedItem) && (selectedItem as Wine).isSommelierChoice && (
                    <div className="flex gap-4 items-center bg-accent-gold/5 p-4 rounded-2xl border border-accent-gold/20">
                      <div className="size-10 rounded-full bg-accent-gold/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-accent-gold text-2xl">wine_bar</span>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-accent-gold">Sommelier's Choice</p>
                        <p className="text-[10px] text-warm-ivory/60 mt-0.5">A rare find, curated for our refined cellar collection.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-full bg-white/5 hover:bg-white/10 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-white/10 transition-all active:scale-[0.98]"
                  >
                    Return to Menu
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation />
    </div>
  );
};

export default MenuScreen;