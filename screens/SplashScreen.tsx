import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../constants';
import { useAuth } from '../hooks/useAuth';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMember, loading, user } = useAuth();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress up to 90% while loading
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading) return;

    // Once loading is complete, jump to 100% and then navigate
    setProgress(100);

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
    }, 1000); // Wait 1s at 100% for smooth payoff

    return () => clearTimeout(timer);
  }, [navigate, isMember, loading, user]);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background-dark">
      {/* Main Content Area */}
      <div className="flex flex-col items-center w-full max-w-xs px-8 animate-in fade-in zoom-in-95 duration-1000">

        {/* Logo at center */}
        <div className="w-64 mb-16 flex justify-center">
          <img src={LOGO_URL} alt="Olkkari" className="w-full h-auto object-contain drop-shadow-[0_0_25px_rgba(197,160,89,0.3)]" />
        </div>

        {/* Premium Glowing Progress Bar */}
        <div className="w-full relative py-2">
          {/* Track */}
          <div className="h-[2px] w-full rounded-full bg-white/10 overflow-hidden backdrop-blur-xl">
            {/* Fill with strong glow effect */}
            <div
              className="h-full bg-accent-gold transition-all duration-500 ease-out relative shadow-[0_0_10px_rgba(197,160,89,1)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 size-4 bg-accent-gold blur-md rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="flex flex-col items-center mt-10 gap-2">
          <p className="text-[10px] font-montserrat font-light tracking-[0.5em] text-accent-gold uppercase opacity-80">
            {progress === 100 ? 'Welcome' : 'Initializing Residency'}
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