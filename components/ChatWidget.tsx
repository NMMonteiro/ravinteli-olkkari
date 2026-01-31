import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const ChatWidget: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const constraintRef = useRef(null);

    // Don't show on Splash, Welcome or Chat page itself
    const hiddenPaths = ['/', '/welcome', '/chat'];
    if (hiddenPaths.includes(location.pathname)) return null;

    return (
        <motion.div
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
            onTap={() => navigate('/chat')}
            className="fixed top-24 right-4 z-[60] group cursor-pointer touch-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            <div className="relative">
                <div className="absolute -inset-2 bg-accent-gold/20 rounded-full blur-lg group-hover:bg-accent-gold/40 transition-all duration-300"></div>
                <div className="relative size-14 bg-primary rounded-full flex items-center justify-center text-accent-gold shadow-2xl border border-accent-gold/30 group-active:scale-90 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">smart_toy</span>
                    <div className="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-primary"></div>
                </div>

                {/* Tooltip - Hide while dragging */}
                <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                    AI Concierge
                </div>
            </div>
        </motion.div>
    );
};
