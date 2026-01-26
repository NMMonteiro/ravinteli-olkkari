import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';

const LoyaltyScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-white flex flex-col font-display pb-24">
      <nav className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-primary/10">
        <div className="flex items-center p-4 justify-between">
          <div onClick={() => navigate(-1)} className="text-primary dark:text-white flex size-10 items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined">chevron_left</span>
          </div>
          <h2 className="text-primary dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">Receipt Rewards</h2>
          <div className="flex size-10 items-center justify-end">
            <button className="text-primary dark:text-white">
              <span className="material-symbols-outlined">history</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        <div className="flex p-6">
          <div className="flex w-full flex-col gap-4 items-center">
            <div className="flex gap-4 flex-col items-center">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full border-4 border-accent-gold/30 w-28 h-28" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCN__56EBvbVXl3mytJq-TSEd8RFHGA4MSk5AyHj4F9xSd1XP_x_k54MQvbWxaH-UdSyxpb01-ILm4Sv_7xGjefid-lAdaJFCMceGjS3hjj4huDbEi7wl9C9ciJlrOf0a8hezmQFqZatdqDTr_B4cstOO14O00aNMcPYNZ8qUVgZcFsKPDFBMfb4lqZcYw97KiCxGt_H12NwM2gGYdUItvADqxh3Dts9KY9i24Unkc0WenE3Ll-fjxcdEOPkgIoEHXU5WK4rj6FoQA")' }}
              ></div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-primary dark:text-white text-2xl font-bold leading-tight tracking-tight text-center">Welcome back, Alex</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-accent-gold text-sm">stars</span>
                  <p className="text-primary/70 dark:text-[#bba0a2] text-sm font-medium tracking-wide uppercase">Gold Member Tier</p>
                </div>
                <p className="text-accent-gold text-lg font-bold mt-1">1,250 Total Points</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mb-8">
          <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-5 border border-primary/10">
            <div className="flex gap-6 justify-between items-end mb-3">
              <div>
                <p className="text-primary dark:text-white text-sm font-medium opacity-70 uppercase tracking-wider">Current Progress</p>
                <p className="text-primary dark:text-white text-base font-bold">Next: Signature Cocktail</p>
              </div>
              <p className="text-primary dark:text-white text-sm font-bold">350 / 500 pts</p>
            </div>
            <div className="h-3 rounded-full bg-primary/20 dark:bg-[#5a3f42] overflow-hidden">
              <div className="h-full rounded-full bg-accent-gold" style={{ width: '70%' }}></div>
            </div>
            <p className="text-primary/70 dark:text-[#bba0a2] text-xs font-normal mt-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">info</span>
              You're only 150 points away from your next treat!
            </p>
          </div>
        </div>

        <div className="px-4 mb-10">
          <div className="relative overflow-hidden rounded-xl bg-primary p-8 text-center shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-8xl">receipt_long</span>
            </div>
            <h3 className="text-white text-2xl font-bold leading-tight mb-2">Scan Your Receipt</h3>
            <p className="text-white/80 text-sm font-normal mb-6 max-w-xs mx-auto">
              Turn your meal into milestones. Take a photo of your physical receipt to earn instant points.
            </p>
            <button className="bg-accent-gold text-primary font-bold py-4 px-8 rounded-full flex items-center justify-center gap-3 mx-auto shadow-lg active:scale-95 transition-transform">
              <span className="material-symbols-outlined">photo_camera</span>
              <span>Launch Camera</span>
            </button>
          </div>
        </div>

        <div className="px-4 mb-6 flex justify-between items-center">
          <h3 className="text-primary dark:text-white text-xl font-bold">Redeem Shop</h3>
          <button className="text-accent-gold text-sm font-bold">View All</button>
        </div>

        <div className="flex overflow-x-auto gap-4 px-4 pb-4 no-scrollbar">
          <div className="min-w-[200px] flex-shrink-0 bg-white dark:bg-primary/10 rounded-xl overflow-hidden border border-primary/5 dark:border-primary/20">
            <div className="h-28 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCmw2YMiCzB59gs8fHRQmvCa245kHPD3WVwF5L0EaHEdJrxczlK6L1t4xoxC13oIhkQwh8YtSQ4_XXSinrGPQL1dvndUV9UNqZ8oltyLNQwoYyqHFRgS7iqY1JVP0TwdTJVaDdJcS9M_Wf9TpsNz_cEKpuVlIIRsQRBysPL7u-njgRQ8j6oqt1mwiHbXC3ubCyXcZpjURzYIotBr4tSx5xWNyct6ijJDvYAZVaQDggQO67ATiOtrDt8R2Zil4C38ElP8vDzjDmgsjA")' }}></div>
            <div className="p-3">
              <p className="text-primary dark:text-white font-bold text-sm">Cocktail Voucher</p>
              <p className="text-accent-gold font-bold text-xs mt-1">500 Points</p>
              <button className="w-full mt-3 py-1.5 rounded bg-primary text-white text-xs font-bold">Redeem</button>
            </div>
          </div>
          <div className="min-w-[200px] flex-shrink-0 bg-white dark:bg-primary/10 rounded-xl overflow-hidden border border-primary/5 dark:border-primary/20">
            <div className="h-28 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD58MENcVVsR-NG-yZ86M03_wyVgKz8TR0ptOFpuKvTmwavKo-O8wa4bNBvv9ctGsT3JQCNqHuabD0s4U-QoyAWO6m9Vx86KuO2hpuVC6ny4w4WMd6ltOWAIolaVEtCzonFuuxEtDeva24ISOISZcUxQKJf6vpZZsBFZ1jYtTWiwMrVzaLQpdGYLpTI2h9S36n3Br2TK25p4VvvW1B-lBN6M8YEYoeyztUGnZW4b28idrDyOFmi_C6U3gEz_YFQuZZ2cJaYnzODDVQ")' }}></div>
            <div className="p-3">
              <p className="text-primary dark:text-white font-bold text-sm">Free Appetizer</p>
              <p className="text-accent-gold font-bold text-xs mt-1">350 Points</p>
              <button className="w-full mt-3 py-1.5 rounded bg-primary text-white text-xs font-bold">Redeem</button>
            </div>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default LoyaltyScreen;
