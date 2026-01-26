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
        <div className="relative h-screen w-full overflow-hidden bg-black font-display">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1577214190211-1849f7b3c660?q=80&w=2000")' }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between py-12 px-8">
                <div className="w-full flex justify-end">
                    <button onClick={() => navigate('/login')} className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1 group">
                        Sign In <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </button>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-0.5 bg-accent-gold rounded-full"></div>
                    <div className="flex flex-col items-center">
                        <img src={LOGO_URL} alt="Olkkari" className="h-16 w-auto object-contain brightness-0 invert" />
                        <p className="text-white text-[10px] font-bold tracking-[0.4em] uppercase mt-2">The Culinary Society</p>
                    </div>
                </div>

                <div className="w-full max-w-xs flex flex-col gap-8 items-center">
                    <p className="text-white italic text-lg opacity-90">{isMember ? 'Welcome Back, Member' : 'Begin your Journey'}</p>

                    <div
                        ref={containerRef}
                        className="w-full h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-2 relative flex items-center justify-center overflow-hidden"
                    >
                        <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 ml-12">Slide to Enter</p>
                        <div
                            onMouseDown={(e) => handleStart(e.clientX)}
                            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                            className="absolute left-2 size-12 bg-accent-gold rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing transition-transform duration-75"
                            style={{ transform: `translateX(${sliderPos}px)` }}
                        >
                            <span className="material-symbols-outlined text-primary font-bold">arrow_forward</span>
                        </div>
                    </div>

                    <p className="text-white/40 text-[8px] uppercase tracking-[0.2em] mb-4">Exclusive Access for Members Only</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
