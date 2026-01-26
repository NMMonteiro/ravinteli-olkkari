import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface MemberGateProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export const MemberGate: React.FC<MemberGateProps> = ({
    children,
    title = "Member Exclusive",
    description = "Join our society to unlock table reservations, loyalty rewards, and private chef hire."
}) => {
    const { isMember, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return null;

    if (!isMember) {
        return (
            <div className="relative">
                <div className="pointer-events-none blur-[2px] opacity-40 select-none">
                    {children}
                </div>
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/10 backdrop-blur-[2px]">
                    <div className="bg-card-dark w-full max-w-sm rounded-[2rem] border border-white/10 p-8 shadow-2xl text-center flex flex-col items-center">
                        <div className="size-16 bg-accent-gold/20 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-accent-gold text-3xl">lock</span>
                        </div>
                        <h3 className="text-white text-2xl font-bold mb-3">{title}</h3>
                        <p className="text-white/60 text-sm mb-8 leading-relaxed">
                            {description}
                        </p>
                        <div className="flex flex-col w-full gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-accent-gold text-primary font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform uppercase tracking-widest text-xs"
                            >
                                Join the Society
                            </button>
                            <button
                                onClick={() => navigate('/welcome')}
                                className="w-full text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] py-2"
                            >
                                Back to Onboarding
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
