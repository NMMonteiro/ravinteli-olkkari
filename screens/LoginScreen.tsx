import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../constants';
import { supabase } from '../supabase';

const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });

        if (error) {
            alert(error.message);
        } else {
            setMessage('Check your email for the magic link!');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center p-8 font-display">
            <div className="w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center">
                    <img src={LOGO_URL} alt="Olkkari" className="h-12 w-auto brightness-0 invert" />
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-accent-gold">Member Login</h2>
                    <p className="mt-2 text-sm text-white/60">Exclusive access for the culinary society</p>
                </div>

                {message ? (
                    <div className="bg-accent-gold/10 border border-accent-gold/20 p-6 rounded-2xl text-center">
                        <span className="material-symbols-outlined text-accent-gold text-4xl mb-4">mail</span>
                        <p className="text-white font-medium">{message}</p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="relative block w-full rounded-xl border border-white/10 bg-white/5 py-4 px-4 text-white placeholder:text-white/30 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-xl bg-accent-gold py-4 px-3 text-sm font-bold text-primary uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Sending link...' : 'Send Magic Link'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/welcome')}
                            className="w-full text-white/40 text-xs font-bold uppercase tracking-widest mt-4"
                        >
                            Back to Welcome
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginScreen;
