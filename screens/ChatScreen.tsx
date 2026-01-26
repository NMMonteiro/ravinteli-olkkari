import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';

const ChatScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display flex flex-col">
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center p-4 pb-4 justify-between">
          <div onClick={() => navigate(-1)} className="text-primary dark:text-accent-gold flex size-10 shrink-0 items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined">chevron_left</span>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-gray-900 dark:text-white text-base font-bold leading-tight tracking-tight">AI Concierge</h2>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-green-500"></span>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">Online</span>
            </div>
          </div>
          <div className="flex w-10 items-center justify-end">
            <button className="flex items-center justify-center text-primary dark:text-accent-gold">
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-40">
        <div className="flex items-end gap-3 max-w-[85%]">
          <div 
            className="bg-primary border border-accent-gold/30 aspect-square bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 flex items-center justify-center overflow-hidden" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnGD3ZnY1d0KPJbtEb_b4OHHQ5VEJrPa4NQVaWF4P0jjcWgdFiRUSHFHO1UlThywxNO0wp-Uy2AD1n2pOYB5C3NBIfA2jOLoz7gOUe8CyrQ4fUpeZTD4YIT4fbtQGyT-qvHoK3EFtBedkyfFxVYaGnymyYZUqTexeSHIsuuv2GUIneLcu4nyovtLUR03doY1N2eHzynmLWXD6Bh0k0JKdxmmMoKNZhEE9hjdOw4DvulgbcCpD3kAJmBm19W--McVlxA3pz-J2nXKw")' }}
          ></div>
          <div className="flex flex-col gap-1 items-start">
            <p className="text-gray-500 dark:text-gray-400 text-[11px] font-medium ml-1">Olkkari Bot</p>
            <div className="rounded-xl px-4 py-3 bg-white dark:bg-chat-bot text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-white/5 text-sm leading-relaxed">
              Welcome to Ravinteli Olkkari! I'm your digital host. How can I assist your culinary journey today?
            </div>
          </div>
        </div>

        <div className="flex items-end gap-3 justify-end ml-auto max-w-[85%]">
          <div className="flex flex-col gap-1 items-end">
            <p className="text-gray-500 dark:text-gray-400 text-[11px] font-medium mr-1">You</p>
            <div className="rounded-xl px-4 py-3 bg-primary text-white shadow-md text-sm leading-relaxed">
              What are today's specials and can you tell me about the art on the walls?
            </div>
          </div>
          <div 
            className="bg-gray-300 dark:bg-gray-700 aspect-square rounded-full size-10 shrink-0 flex items-center justify-center overflow-hidden bg-cover bg-center" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAepBGV-i1XpHjHc0av9oyEx8t-N-4mOtMWFxUGL1A0ZBIDdYJKhwLOpjeDvLvQHv-oeSe0FRm2wja02Y8ctGeX3ZRVSRN-YZvbO7hOcK9sakNY_trxi7MIPaZO09YNz--qzPDDgtG9UeL1G6_Ou-tLDUhnU3yAtXHuMvzSJovOiQjZcPDJUJmTsWnH7UgSq37G8TeZTFOGEH5N_ZEpOfw5HVALTdTKpGgCH9i22yrDMbkDKDLLhld5K1fe0zBe9SpQxy4O2g_f9N0")' }}
          ></div>
        </div>

        <div className="flex items-end gap-3 max-w-[85%]">
          <div 
            className="bg-primary border border-accent-gold/30 aspect-square bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 flex items-center justify-center overflow-hidden" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDco884r1Zds04DQqFtwt2QWj5T1kD8cIzlxyY1IMa2e_qSjYFLVzxcxyYjyQwzskcMZzdLA2sjVcLmoCPmhm74ztGCDwxIOvOyPLYLZE0ucUOW8TeawsJEvFYMpmn6QXjGkaMaQRvaiXj2OwsPp51WRAxzbsoz3pv8DvqrrrPSIbyPo2Mdxj4NahSlvs59myAJEJnRpabLZfVcPPeGur1q4IaRBukFgmWICHUmmnHCFH7oYV8uhvpxRSKRuKU5nWUE_egLoWKLN6M")' }}
          ></div>
          <div className="flex flex-col gap-1 items-start">
            <p className="text-gray-500 dark:text-gray-400 text-[11px] font-medium ml-1">Olkkari Bot</p>
            <div className="rounded-xl px-4 py-3 bg-white dark:bg-chat-bot text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-white/5 text-sm leading-relaxed">
              Today's Chef recommendation is our <span className="text-accent-gold font-semibold">Burgundy-braised beef</span> and seasonal forest mushroom risotto.
              <br/><br/>
              Regarding our art, we are currently featuring local artists in our "Living Room" gallery. The main centerpiece is an oil painting titled "Nocturne" by Elena Rossi.
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-[84px] left-0 right-0 z-10 bg-gradient-to-t from-background-dark via-background-dark/90 to-transparent pt-10">
        <div className="flex gap-2.5 px-4 pb-4 overflow-x-auto no-scrollbar mx-auto max-w-lg">
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-chat-bot border border-gray-200 dark:border-white/10 px-4 shadow-sm active:scale-95 transition-transform cursor-pointer">
            <span className="material-symbols-outlined text-accent-gold text-lg">restaurant_menu</span>
            <p className="text-gray-700 dark:text-gray-200 text-xs font-semibold">Full Menu</p>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-chat-bot border border-gray-200 dark:border-white/10 px-4 shadow-sm active:scale-95 transition-transform cursor-pointer">
            <span className="material-symbols-outlined text-accent-gold text-lg">calendar_month</span>
            <p className="text-gray-700 dark:text-gray-200 text-xs font-semibold">Book Table</p>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-chat-bot border border-gray-200 dark:border-white/10 px-4 shadow-sm active:scale-95 transition-transform cursor-pointer">
            <span className="material-symbols-outlined text-accent-gold text-lg">palette</span>
            <p className="text-gray-700 dark:text-gray-200 text-xs font-semibold">Art Tour</p>
          </div>
        </div>

        <div className="px-4 pb-4 max-w-lg mx-auto">
          <div className="relative flex items-center">
            <input 
              className="w-full bg-white dark:bg-[#251b1c] border-gray-200 dark:border-white/5 rounded-full py-3.5 pl-5 pr-12 text-sm focus:ring-accent-gold focus:border-accent-gold dark:text-white placeholder-gray-400 shadow-lg" 
              placeholder="Ask Olkkari..." 
              type="text" 
            />
            <button className="absolute right-2 bg-primary p-2 rounded-full text-white shadow-md active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-24 right-[calc(50%-175px)] z-30 pointer-events-none hidden md:block">
         {/* Hidden on desktop usually but keeping for consistent structure */}
      </div>

      <Navigation />
    </div>
  );
};

export default ChatScreen;
