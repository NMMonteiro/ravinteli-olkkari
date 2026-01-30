import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface MemberGateProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    adminOnly?: boolean;
    requireApproval?: boolean;
}

export const MemberGate: React.FC<MemberGateProps> = ({
    children,
    title = "Member Exclusive",
    description = "Join our society to unlock table reservations, loyalty rewards, and private chef hire.",
    adminOnly = false,
    requireApproval = true
}) => {
    const { isMember, isAdmin, isApproved, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return null;

    const needsMembership = !isMember;
    const needsAdmin = adminOnly && !isAdmin;
    const needsApproval = requireApproval && !isApproved && !isAdmin;

    const isAccessDenied = needsMembership || needsAdmin || needsApproval;

    if (isAccessDenied) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-md overscroll-none">
                {/* Background content (blurred and locked) */}
                <div className="absolute inset-0 -z-10 pointer-events-none blur-[6px] opacity-20 select-none overflow-hidden h-screen w-screen">
                    {children}
                </div>

                {/* Centered Popup Card */}
                <div className="bg-card-dark w-full max-w-sm rounded-[2.5rem] border border-white/10 p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="size-20 bg-accent-gold/10 rounded-full flex items-center justify-center mb-8 border border-accent-gold/20">
                        <span className="material-symbols-outlined text-accent-gold text-4xl">{needsMembership ? 'lock' : 'verified_user'}</span>
                    </div>
                    <h3 className="text-white text-2xl font-black mb-4 tracking-tight uppercase italic">{needsMembership ? title : "Admission Pending"}</h3>
                    <p className="text-white/50 text-sm mb-10 leading-relaxed font-medium">
                        {needsMembership ? description : "Your membership application has been received. Our host team is currently reviewing your residency request. You will be notified once complete."}
                    </p>
                    <div className="flex flex-col w-full gap-4">
                        {needsMembership ? (
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-accent-gold text-primary font-black py-5 rounded-2xl shadow-xl shadow-accent-gold/10 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px]"
                            >
                                Join the Society
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full bg-white/5 border border-white/10 text-white font-black py-5 rounded-2xl active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px]"
                            >
                                View Application Status
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/welcome')}
                            className="w-full text-white/30 text-[9px] font-bold uppercase tracking-[0.3em] py-2 hover:text-white transition-colors"
                        >
                            Back to Onboarding
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
