import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../constants';

interface HeaderProps {
    onOpenMenu?: () => void;
    showBack?: boolean;
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMenu, showBack, title }) => {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center p-4 py-3 justify-between">
                <div className="flex size-12 shrink-0 items-center justify-start">
                    {showBack ? (
                        <span onClick={() => navigate(-1)} className="material-symbols-outlined cursor-pointer text-white hover:text-accent-gold transition-colors">arrow_back_ios_new</span>
                    ) : (
                        <span onClick={onOpenMenu} className="material-symbols-outlined cursor-pointer text-accent-gold hover:text-accent-gold/80 transition-colors text-2xl">menu</span>
                    )}
                </div>

                <div className="flex-1 flex justify-center flex-col items-center">
                    <img src={LOGO_URL} alt="Olkkari" className="h-10 w-auto object-contain" />
                    {title && <p className="text-[8px] uppercase tracking-[0.3em] font-montserrat font-light text-accent-gold mt-1">{title}</p>}
                </div>

                <div className="flex w-12 items-center justify-end">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/40 text-accent-gold border border-accent-gold/20 hover:bg-primary/60 transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">person</span>
                    </button>
                </div>
            </div>
        </header>
    );
};
