import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../constants';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const navItems = [
        { label: 'Home', icon: 'home', path: '/home' },
        { label: 'Menu', icon: 'restaurant_menu', path: '/menu' },
        { label: 'Events', icon: 'celebration', path: '/events' },
        { label: 'Gallery', icon: 'palette', path: '/gallery' },
        { label: 'Hire a Chef', icon: 'chef_hat', path: '/chef' },
        { label: 'Booking', icon: 'calendar_today', path: '/booking' },
        { label: 'Loyalty', icon: 'stars', path: '/loyalty' },
        { label: 'Profile', icon: 'person', path: '/profile' },
        { label: 'Admin', icon: 'admin_panel_settings', path: '/admin' },
    ];

    const handleNav = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div
                className={`fixed top-0 left-0 z-[101] h-screen w-[280px] bg-[#0c0c0c]/90 backdrop-blur-3xl border-r border-white/5 shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-12">
                        <img src={LOGO_URL} alt="Olkkari" className="h-10 w-auto object-contain" />
                        <button onClick={onClose} className="text-white/60 hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => handleNav(item.path)}
                                className="w-full flex items-center gap-4 p-4 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all group"
                            >
                                <span className="material-symbols-outlined text-accent-gold/40 group-hover:text-accent-gold transition-colors">{item.icon}</span>
                                <span className="text-sm font-montserrat font-light uppercase tracking-[0.3em] group-hover:text-accent-gold">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-white/5">
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-montserrat font-light text-center mb-4">The Culinary Society</p>
                        <div className="flex justify-center gap-4">
                            <span className="material-symbols-outlined text-white/20 text-sm">facebook</span>
                            <span className="material-symbols-outlined text-white/20 text-sm">camera</span>
                            <span className="material-symbols-outlined text-white/20 text-sm">public</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
