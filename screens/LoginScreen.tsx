import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../constants';
import { supabase } from '../supabase';

const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordLogin, setIsPasswordLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleMagicLink = async (e: React.FormEvent) => {
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

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            navigate('/home');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-8 font-display">
            <div className="w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center">
                    <img src={LOGO_URL} alt="Olkkari" className="h-16 w-auto object-contain" />
                    <h2 className="mt-6 text-3xl font-black tracking-tight text-accent-gold uppercase italic">Member Login</h2>
                    <p className="mt-2 text-sm text-white/50 font-medium">Exclusive access for the society</p>
                </div>

                {message ? (
                    <div className="bg-accent-gold/10 border border-accent-gold/20 p-8 rounded-[2rem] text-center animate-in fade-in zoom-in duration-500">
                        <div className="size-16 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-accent-gold text-3xl">mail</span>
                        </div>
                        <p className="text-white font-bold mb-2">Check your inbox</p>
                        <p className="text-white/60 text-sm leading-relaxed">{message}</p>
                        <button
                            onClick={() => setMessage('')}
                            className="mt-6 text-accent-gold text-xs font-bold uppercase tracking-widest"
                        >
                            Try another way
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <form className="space-y-4" onSubmit={isPasswordLogin ? handlePasswordLogin : handleMagicLink}>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-accent-gold/60 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-white/20 focus:border-accent-gold outline-none transition-all text-base"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {isPasswordLogin && (
                                    <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-accent-gold/60 ml-1">Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-white/20 focus:border-accent-gold outline-none transition-all text-base"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-accent-gold text-primary font-black py-5 rounded-2xl shadow-xl shadow-accent-gold/10 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px] mt-2"
                            >
                                {loading ? 'Processing...' : (isPasswordLogin ? 'Sign In' : 'Send Magic Link')}
                            </button>
                        </form>

                        <div className="flex flex-col items-center gap-6">
                            <button
                                type="button"
                                onClick={() => setIsPasswordLogin(!isPasswordLogin)}
                                className="text-accent-gold/80 text-[10px] font-black uppercase tracking-widest hover:text-accent-gold transition-colors"
                            >
                                {isPasswordLogin ? 'Use Magic Link instead' : 'Login with Password'}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/welcome')}
                                className="text-white/30 text-[9px] font-bold uppercase tracking-[0.3em] hover:text-white transition-colors"
                            >
                                Back to Welcome
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginScreen;
