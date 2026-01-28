import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../constants';
import { supabase } from '../supabase';
import { useAuth } from '../hooks/useAuth';

const OnboardingScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user, isMember, loading } = useAuth();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!loading && !isMember) {
            navigate('/welcome');
        }
        if (user?.user_metadata?.onboarding_complete) {
            navigate('/home');
        }
    }, [user, isMember, loading, navigate]);

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            // Update metadata and password
            const { error: metaError } = await supabase.auth.updateUser({
                data: {
                    full_name: name,
                    onboarding_complete: true,
                    role: user?.email === 'ps.olkkari@gmail.com' ? 'admin' : 'member'
                },
                password: password
            });

            if (metaError) throw metaError;

            navigate('/home');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-8 font-display">
            <div className="w-full max-w-sm space-y-12">
                <div className="flex flex-col items-center text-center">
                    <img src={LOGO_URL} alt="Olkkari" className="h-16 w-auto object-contain" />
                    <div className="mt-8 space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-accent-gold uppercase italic">Welcome Home</h2>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Setup your Member Profile</p>
                    </div>
                </div>

                <form onSubmit={handleComplete} className="space-y-8">
                    {step === 1 ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-accent-gold/60 ml-1">Your Full Name</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/20 focus:border-accent-gold outline-none transition-all text-base shadow-inner"
                                    placeholder="e.g. Alex Henderson"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <p className="text-[9px] text-white/30 italic px-1">This is how you will appear on our guest lists.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => name.length > 2 && setStep(2)}
                                disabled={name.length < 3}
                                className="w-full bg-accent-gold text-primary font-black py-5 rounded-2xl shadow-xl shadow-accent-gold/10 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px] disabled:opacity-30"
                            >
                                Next Step
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-accent-gold/60 ml-1">Secure Password</label>
                                <input
                                    type="password"
                                    required
                                    autoFocus
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/20 focus:border-accent-gold outline-none transition-all text-base shadow-inner"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className="text-[9px] text-white/30 italic px-1">Choose a password to skip magic links in the future.</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={processing || password.length < 6}
                                    className="w-full bg-accent-gold text-primary font-black py-5 rounded-2xl shadow-xl shadow-accent-gold/10 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px] disabled:opacity-30"
                                >
                                    {processing ? 'Finalizing Profile...' : 'Complete Entry'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-white/30 text-[9px] font-bold uppercase tracking-[0.3em] hover:text-white transition-colors"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                <div className="flex flex-col items-center pt-8">
                    <div className="flex gap-2">
                        <div className={`size-1.5 rounded-full transition-colors ${step === 1 ? 'bg-accent-gold' : 'bg-white/10'}`}></div>
                        <div className={`size-1.5 rounded-full transition-colors ${step === 2 ? 'bg-accent-gold' : 'bg-white/10'}`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingScreen;
