import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../constants';
import { useAuth } from '../hooks/useAuth';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMember, loading, user } = useAuth();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress for effect
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (isMember) {
        if (user?.user_metadata?.onboarding_complete) {
          navigate('/home');
        } else {
          navigate('/onboarding');
        }
      } else {
        navigate('/welcome');
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate, isMember, loading]);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Standardized Logo for Seamless Transition */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 w-64 flex justify-center">
        <img src={LOGO_URL} alt="Olkkari" className="w-full h-auto object-contain drop-shadow-[0_0_25px_rgba(197,160,89,0.5)]" />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center w-full max-w-xs px-8 transition-all duration-1000 delay-300 animate-in fade-in zoom-in-95">

        {/* Premium Glowing Progress Bar */}
        <div className="w-full relative py-2">
          {/* Track */}
          <div className="h-[24px] w-full rounded-full border border-accent-gold/40 bg-black/60 overflow-hidden backdrop-blur-xl shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            {/* Fill with strong glow effect */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-gold/40 via-accent-gold/80 to-[#FFD700] transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 shadow-[0_0_30px_rgba(197,160,89,1),0_0_10px_rgba(255,215,0,1)]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent opacity-40"></div>
              <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>

          <div
            className="absolute top-1/2 -translate-y-1/2 h-20 w-32 bg-accent-gold/50 blur-[40px] rounded-full transition-all duration-300 ease-out pointer-events-none mix-blend-screen"
            style={{ left: `calc(${progress}% - 64px)` }}
          ></div>
        </div>

        {/* Status Text */}
        <div className="flex flex-col items-center mt-10 gap-2">
          <p className="text-[10px] font-montserrat font-light tracking-[0.5em] text-accent-gold uppercase opacity-80">
            Loading
          </p>
          <p className="text-2xl font-montserrat font-extralight tracking-[0.2em] text-accent-gold">
            {progress}%
          </p>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="absolute bottom-12 opacity-30 text-center">
        <p className="text-[10px] font-montserrat font-light uppercase tracking-[0.5em] text-white">
          The Culinary Society
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;