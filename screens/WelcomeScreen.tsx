import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../constants';
import { useAuth } from '../hooks/useAuth';

const WelcomeScreen: React.FC = () => {
    const navigate = useNavigate();
    const { isMember, loading } = useAuth();
    const [sliderPos, setSliderPos] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    // If already logged in, redirect to home
    useEffect(() => {
        if (!loading && isMember) {
            navigate('/home');
        }
    }, [isMember, loading, navigate]);

    const handleStart = (clientX: number) => {
        isDragging.current = true;
    };

    const handleMove = (clientX: number) => {
        if (!isDragging.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width;
        const handleWidth = 48; // Size of the yellow circle
        const maxPos = width - handleWidth - 8; // 8 is padding

        let pos = clientX - rect.left - handleWidth / 2;
        pos = Math.max(0, Math.min(pos, maxPos));
        setSliderPos(pos);

        if (pos >= maxPos * 0.9) {
            isDragging.current = false;
            navigate('/home');
        }
    };

    const handleEnd = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        setSliderPos(0);
    };

    useEffect(() => {
        const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const onEnd = () => handleEnd();

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onEnd);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onEnd);
        };
    }, []);

    if (loading) return null;

    return (
        <div className="relative h-screen w-full overflow-hidden font-display">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Standardized Logo for Seamless Transition from Splash */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 w-64 flex justify-center">
                <img src={LOGO_URL} alt="Olkkari" className="w-full h-auto object-contain drop-shadow-[0_0_25px_rgba(197,160,89,0.5)]" />
            </div>

            {/* Content with Fade-In Transition */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between py-12 px-8">
                {/* Top Actions - Fades In */}
                <div className="w-full flex justify-end animate-in fade-in duration-1000">
                    <button onClick={() => navigate('/login')} className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1 group">
                        Sign In <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </button>
                </div>

                {/* Sub-Branding - Fixed position relative to standard logo placement */}
                <div className="mt-40 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <div className="w-12 h-px bg-accent-gold/40"></div>
                    <p className="text-white text-[10px] font-montserrat font-light tracking-[0.5em] uppercase opacity-60">The Culinary Society</p>
                </div>

                {/* Bottom Actions - Fades In */}
                <div className="w-full max-w-xs flex flex-col gap-8 items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                    <p className="text-white italic text-lg font-montserrat font-extralight opacity-90">{isMember ? 'Welcome Back, Member' : 'Begin your Journey'}</p>

                    <div
                        ref={containerRef}
                        className="w-full h-16 bg-white/5 backdrop-blur-md rounded-full border border-white/10 p-2 relative flex items-center justify-center overflow-hidden"
                    >
                        <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 ml-12">Slide to Enter</p>
                        <div
                            onMouseDown={(e) => handleStart(e.clientX)}
                            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                            className="absolute left-2 size-12 bg-accent-gold rounded-full flex items-center justify-center shadow-lg shadow-accent-gold/20 cursor-grab active:cursor-grabbing transition-transform duration-75"
                            style={{ transform: `translateX(${sliderPos}px)` }}
                        >
                            <span className="material-symbols-outlined text-primary font-bold">arrow_forward</span>
                        </div>
                    </div>

                    <p className="text-white/30 text-[8px] uppercase tracking-[0.3em] font-montserrat font-light">Exclusive Access for Members Only</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
