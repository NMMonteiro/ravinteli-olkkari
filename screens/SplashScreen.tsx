import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../constants';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden px-6 py-12 bg-primary">
      {/* Header Spacer */}
      <div className="h-10 w-full"></div>
      
      {/* Central Branding */}
      <div className="flex flex-col items-center justify-center flex-grow relative z-10">
        <div className="mb-6 flex items-center justify-center">
          <img src={LOGO_URL} alt="Olkkari" className="w-64 h-auto object-contain drop-shadow-lg" />
        </div>
        <p className="text-accent/80 text-sm font-medium tracking-[0.2em] uppercase mt-2">Ravinteli</p>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 via-primary to-background-dark/20 pointer-events-none"></div>

      {/* Background Texture */}
      <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
        <div 
          className="w-full h-full bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1M7c_lctsXVk_ZuMgILPB_r_lbqf4WwTKtroprWcsHIVW6qlDa5aDB3V3H9VmoH7CMeGQ7laD31CvQ8ZE8lyGvEu-faR9lksjMxWiYk701KMHyRo9BjP-PZ_Zhp3ne-fSVe5yZu8zz6CdKM1lmWUivziGMP0dyZ56nAyifvdf5VUBQOlpuavhzjwk5YWenX4rVL2jZWlI3SzWgr9TtvelETqza8UaPzH3vMkN6xE-fyTBC-Q_viZ32_-bjsFEE7eTl_-IBkSiq9M")' }}
        ></div>
      </div>

      {/* Bottom Loading */}
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-8">
        <div className="w-full flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <p className="text-accent text-xs font-medium tracking-wider uppercase opacity-70">Preparing your table</p>
            <p className="text-accent text-xs font-medium">85%</p>
          </div>
          <div className="h-1 w-full rounded-full bg-accent/20">
            <div className="h-full rounded-full bg-accent animate-[width_2s_ease-out_forwards]" style={{ width: '85%' }}></div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-60">
          <p className="text-accent text-[10px] text-center leading-relaxed tracking-widest">
            YOUR CULINARY LIVING ROOM
          </p>
        </div>
      </div>
      
      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>
    </div>
  );
};

export default SplashScreen;