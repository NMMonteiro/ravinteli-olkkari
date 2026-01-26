import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { LOGO_URL } from '../constants';
import { Header } from '../components/Header';
import { MemberGate } from '../components/MemberGate';
import { NotificationService } from '../services/NotificationService';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabase';

interface LoyaltyScreenProps {
  onOpenMenu: () => void;
}

const LoyaltyScreen: React.FC<LoyaltyScreenProps> = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setSettingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert(error.message);
    } else {
      setPasswordSuccess(true);
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
    setSettingPassword(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/welcome');
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member';

  return (
    <MemberGate title="Member Rewards" description="Start earning points on every visit and unlock exclusive culinary rewards.">
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-white flex flex-col font-display pb-24">
        <Header onOpenMenu={onOpenMenu} title="Member Rewards" />

        <main className="flex-1 overflow-y-auto pb-10">
          <div className="flex p-6">
            <div className="flex w-full flex-col gap-4 items-center">
              <div className="flex gap-4 flex-col items-center">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full border-4 border-accent-gold/30 w-28 h-28 relative group"
                  style={{ backgroundImage: `url("${user?.user_metadata?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN__56EBvbVXl3mytJq-TSEd8RFHGA4MSk5AyHj4F9xSd1XP_x_k54MQvbWxaH-UdSyxpb01-ILm4Sv_7xGjefid-lAdaJFCMceGjS3hjj4huDbEi7wl9C9ciJlrOf0a8hezmQFqZatdqDTr_B4cstOO14O00aNMcPYNZ8qUVgZcFsKPDFBMfb4lqZcYw97KiCxGt_H12NwM2gGYdUItvADqxh3Dts9KY9i24Unkc0WenE3Ll-fjxcdEOPkgIoEHXU5WK4rj6FoQA'}")` }}
                >
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <span className="material-symbols-outlined text-white">edit</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-primary dark:text-white text-2xl font-black leading-tight tracking-tight uppercase italic line-clamp-1">Welcome, {userName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-accent-gold text-sm">stars</span>
                    <p className="text-primary/70 dark:text-accent-gold/60 text-[10px] font-black tracking-[0.2em] uppercase">Private Society Gold</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 mb-8">
            <div className="bg-primary/20 rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
              {/* Progress bar and scan section ... */}
              <div className="relative z-10 flex flex-col gap-6">
                <div>
                  <div className="flex justify-between items-end mb-3 px-1">
                    <p className="text-accent-gold text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Reward Progress</p>
                    <p className="text-white text-xs font-bold">350 / 500 PTS</p>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-accent-gold animate-pulse shadow-[0_0_15px_rgba(197,160,89,0.5)]" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="material-symbols-outlined text-accent-gold text-2xl">local_bar</span>
                  <div>
                    <p className="text-white text-sm font-bold">Signature Cocktail</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">Unlocked at 500 points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security Section */}
          <div className="px-6 mb-10">
            <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-40">Account Security</h3>
            <div className="bg-card-dark rounded-[2rem] p-8 border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-bold uppercase tracking-wider mb-1">Normal Sign-In</p>
                  <p className="text-white/40 text-[10px] font-medium leading-relaxed">Set a password to avoid using Magic Links every time you login.</p>
                </div>
              </div>

              <form onSubmit={handleSetPassword} className="space-y-4 pt-2">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Type new password..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-white/20 focus:border-accent-gold outline-none transition-all text-base"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/20 select-none">lock</span>
                </div>
                <button
                  type="submit"
                  disabled={settingPassword || !newPassword}
                  className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${passwordSuccess ? 'bg-green-500 text-white' : 'bg-accent-gold text-primary shadow-lg shadow-accent-gold/10 active:scale-95 disabled:opacity-30'}`}
                >
                  {settingPassword ? 'Updating...' : (passwordSuccess ? 'Password Set!' : 'Enable Password Login')}
                </button>
                {passwordSuccess && <p className="text-green-500 text-[10px] text-center font-bold tracking-widest uppercase animate-bounce mt-2">Next time, just use your password!</p>}
              </form>

              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full text-red-500/60 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.3em] py-2 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Sign Out of Society
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 mb-6 flex justify-between items-center">
            <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] opacity-40">Redeem Awards</h3>
            <button className="text-accent-gold text-[10px] font-bold uppercase tracking-widest">View All</button>
          </div>

          <div className="flex overflow-x-auto gap-4 px-6 pb-4 no-scrollbar">
            <div className="min-w-[240px] flex-shrink-0 bg-primary/10 rounded-3xl overflow-hidden border border-white/5 group active:scale-95 transition-transform">
              <div className="h-32 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCmw2YMiCzB59gs8fHRQmvCa245kHPD3WVwF5L0EaHEdJrxczlK6L1t4xoxC13oIhkQwh8YtSQ4_XXSinrGPQL1dvndUV9UNqZ8oltyLNQwoYyqHFRgS7iqY1JVP0TwdTJVaDdJcS9M_Wf9TpsNz_cEKpuVlIIRsQRBysPL7u-njgRQ8j6oqt1mwiHbXC3ubCyXcZpjURzYIotBr4tSx5xWNyct6ijJDvYAZVaQDggQO67ATiOtrDt8R2Zil4C38ElP8vDzjDmgsjA")' }}></div>
              <div className="p-5">
                <p className="text-white font-bold text-sm tracking-wide">Signature Cocktail</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[10px] text-accent-gold">stars</span>
                  <p className="text-accent-gold font-black text-[10px] uppercase tracking-widest">500 PTS</p>
                </div>
                <button className="w-full mt-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">Insufficient Points</button>
              </div>
            </div>
          </div>
        </main>

        <Navigation />
      </div>
    </MemberGate>
  );
};

export default LoyaltyScreen;
