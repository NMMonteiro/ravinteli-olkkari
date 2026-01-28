import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabase';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { MemberGate } from '../components/MemberGate';

interface ProfileScreenProps {
    onOpenMenu: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenMenu }) => {
    const navigate = useNavigate();
    const { user, isAdmin, signOut } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        notifications: true
    });
    const [saving, setSaving] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: formData.fullName }
        });

        if (error) alert(error.message);
        else setIsEditing(false);
        setSaving(false);
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/welcome');
    };

    return (
        <MemberGate title="Personal Profile" description="Manage your residency at Ravinteli Olkkari.">
            <div className="min-h-screen text-white font-display pb-24">
                <Header onOpenMenu={onOpenMenu} title={isAdmin ? "Admin Profile" : "Member Profile"} />

                <main className="p-6 max-w-lg mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Hero Section */}
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="relative group">
                            <div className="size-32 rounded-[2.5rem] bg-accent-gold/20 border-4 border-accent-gold/40 overflow-hidden flex items-center justify-center p-1 shadow-2xl">
                                <img
                                    src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.fullName}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover rounded-[2rem]"
                                />
                            </div>
                            <button className="absolute -bottom-2 -right-2 size-10 bg-accent-gold text-primary rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                                <span className="material-symbols-outlined text-xl">photo_camera</span>
                            </button>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-3xl font-black italic uppercase tracking-tight">{formData.fullName || 'Society Member'}</h1>
                            <div className="flex items-center justify-center gap-2">
                                <span className={`material-symbols-outlined text-sm ${isAdmin ? 'text-accent-gold' : 'text-accent-gold/60'}`}>
                                    {isAdmin ? 'admin_panel_settings' : 'verified'}
                                </span>
                                <p className="text-accent-gold text-[10px] font-black uppercase tracking-[0.2em]">
                                    {isAdmin ? 'Management Registry' : 'Active Residency'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] text-center">
                            <p className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-1">Status</p>
                            <p className="text-sm font-bold text-accent-gold uppercase">{isAdmin ? 'Executive' : 'Certified Member'}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] text-center">
                            <p className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-1">Joined</p>
                            <p className="text-sm font-bold text-accent-gold uppercase">{new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="bg-card-dark rounded-[2.5rem] p-8 border border-white/5 shadow-2xl space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] opacity-40">Identify Details</h3>
                            {!isEditing && (
                                <button onClick={() => setIsEditing(true)} className="text-accent-gold text-[10px] font-black uppercase tracking-widest border-b border-accent-gold/30 pb-0.5">Edit Profile</button>
                            )}
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    className={`w-full bg-white/5 border rounded-2xl py-4 px-5 text-white transition-all text-base outline-none ${isEditing ? 'border-accent-gold/40 focus:border-accent-gold' : 'border-transparent'}`}
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Archive Email</label>
                                <input
                                    type="email"
                                    disabled
                                    className="w-full bg-white/5 border border-transparent rounded-2xl py-4 px-5 text-white/40 text-base"
                                    value={formData.email}
                                />
                            </div>

                            {isEditing && (
                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 bg-accent-gold text-primary font-black py-4 rounded-2xl shadow-xl shadow-accent-gold/10 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px]"
                                    >
                                        {saving ? 'Updating...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-8 bg-white/5 text-white font-black py-4 rounded-2xl active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>

                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <div>
                                <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-4">Society Preferences</h3>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-accent-gold">notifications</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">SMS Alerts</span>
                                    </div>
                                    <div className="w-12 h-6 bg-accent-gold rounded-full relative p-1 shadow-inner">
                                        <div className="size-4 bg-primary rounded-full absolute right-1"></div>
                                    </div>
                                </div>
                            </div>

                            {isAdmin && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="w-full flex items-center justify-between p-5 bg-accent-gold text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-accent-gold/10"
                                >
                                    <span>Access Manager Suite</span>
                                    <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                                </button>
                            )}

                            <button
                                onClick={handleLogout}
                                className="w-full py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <span className="material-symbols-outlined text-sm">logout</span>
                                Depart residency
                            </button>
                        </div>
                    </div>
                </main>

                <Navigation />
            </div>
        </MemberGate>
    );
};

export default ProfileScreen;
