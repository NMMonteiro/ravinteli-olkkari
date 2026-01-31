import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const ChatWidget: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on Splash, Welcome or Chat page itself
    const hiddenPaths = ['/', '/welcome', '/chat'];
    if (hiddenPaths.includes(location.pathname)) return null;

    return (
        <div
            onClick={() => navigate('/chat')}
            className="fixed bottom-6 right-6 z-[60] group cursor-pointer"
        >
            <div className="relative">
                <div className="absolute -inset-2 bg-accent-gold/20 rounded-full blur-lg group-hover:bg-accent-gold/40 transition-all duration-300"></div>
                <div className="relative size-14 bg-primary rounded-full flex items-center justify-center text-accent-gold shadow-2xl border border-accent-gold/30 group-active:scale-90 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">smart_toy</span>
                    <div className="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-primary"></div>
                </div>

                {/* Tooltip */}
                <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    AI Concierge
                </div>
            </div>
        </div>
    );
};
