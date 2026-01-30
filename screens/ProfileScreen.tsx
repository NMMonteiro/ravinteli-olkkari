import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabase';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { MemberGate } from '../components/MemberGate';
import { Booking } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

interface ProfileScreenProps {
    onOpenMenu: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenMenu }) => {
    const navigate = useNavigate();
    const { user, profile, isAdmin, isApproved, signOut, refreshProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: profile?.full_name || user?.user_metadata?.full_name || '',
        email: user?.email || '',
        notifications: true
    });
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Booking Details State
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [receiptUploading, setReceiptUploading] = useState(false);
    const [extracting, setExtracting] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData(prev => ({ ...prev, fullName: profile.full_name || '' }));
        }
    }, [profile]);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        setLoadingBookings(true);
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('email', user?.email)
            .order('date', { ascending: false });

        if (!error && data) {
            setBookings(data);
        }
        setLoadingBookings(false);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ full_name: formData.fullName })
            .eq('id', user?.id);

        const { error: authError } = await supabase.auth.updateUser({
            data: { full_name: formData.fullName }
        });

        if (profileError || authError) {
            alert(profileError?.message || authError?.message);
        } else {
            await refreshProfile();
            setIsEditing(false);
        }
        setSaving(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        const filePath = `${user.id}/${Date.now()}_avatar`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            await refreshProfile();
            alert('Profile picture synchronized.');
        } catch (error: any) {
            alert('Avatar archive failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const processReceipt = async (url: string, bookingId: number) => {
        setExtracting(true);
        try {
            const { data, error } = await supabase.functions.invoke('process-receipt', {
                body: { receiptUrl: url, bookingId }
            });

            if (error) throw error;

            if (data?.success) {
                setSelectedBooking(prev => prev ? { ...prev, receipt_data: data.data } : null);
                setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, receipt_data: data.data } : b));
            } else if (data?.error) {
                alert('AI Audit Failed: ' + data.error);
                console.error('AI Partial Failure:', data.logs);
            }
        } catch (error: any) {
            console.error('Fetch Error:', error);
            alert('Connection Error: ' + (error.message || 'The secure gate is currently busy. Please try again in a few moments.'));
        } finally {
            setExtracting(false);
        }
    };

    const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user || !selectedBooking) return;

        setReceiptUploading(true);
        // Use a unique but simple path
        const fileName = `${user.id.substring(0, 8)}/${selectedBooking.id}_${Date.now()}.jpg`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(fileName, file, {
                    upsert: true,
                    contentType: file.type || 'image/jpeg'
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('receipts')
                .getPublicUrl(fileName);

            const { error: updateError } = await supabase
                .from('bookings')
                .update({ receipt_url: publicUrl })
                .eq('id', selectedBooking.id);

            if (updateError) throw updateError;

            // Update local state
            setSelectedBooking(prev => prev ? { ...prev, receipt_url: publicUrl } : null);
            setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, receipt_url: publicUrl } : b));

            // Call AI Processor
            await processReceipt(publicUrl, selectedBooking.id);

        } catch (error: any) {
            console.error('Receipt Error:', error);
            alert('Receipt upload failed: ' + error.message);
        } finally {
            setReceiptUploading(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/welcome');
    };

    return (
        <MemberGate requireApproval={false} title="Personal Profile" description="Manage your residency at Ravinteli Olkkari.">
            <div className="min-h-screen text-white font-display pb-32">
                <Header onOpenMenu={onOpenMenu} title={isAdmin ? "Admin Profile" : "Member Profile"} />

                <main className="p-6 max-w-lg mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Hero Section */}
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="relative group">
                            <div className="size-32 rounded-[2.5rem] bg-accent-gold/20 border-4 border-accent-gold/40 overflow-hidden flex items-center justify-center p-1 shadow-2xl relative">
                                <img
                                    src={profile?.avatar_url || user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.fullName}`}
                                    alt="Avatar"
                                    className={`w-full h-full object-cover rounded-[2rem] ${uploading ? 'opacity-30' : ''}`}
                                />
                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 size-10 bg-accent-gold text-primary rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer">
                                <span className="material-symbols-outlined text-xl">photo_camera</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                            </label>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-xl sm:text-2xl font-black italic uppercase tracking-tight line-clamp-1">{formData.fullName || 'Society Member'}</h1>
                            <div className="flex items-center justify-center gap-2">
                                <span className={`material-symbols-outlined text-sm ${isApproved ? 'text-accent-gold' : 'text-white/20'}`}>
                                    {isAdmin ? 'admin_panel_settings' : isApproved ? 'verified' : 'pending'}
                                </span>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isApproved ? 'text-accent-gold' : 'text-white/30'}`}>
                                    {isAdmin ? 'Management Registry' : isApproved ? 'Active Residency' : 'Admission Pending'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] text-center">
                            <p className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-1">Status</p>
                            <p className="text-sm font-bold text-accent-gold uppercase">{isAdmin ? 'Executive' : isApproved ? 'Certified Member' : 'Candidate'}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] text-center">
                            <p className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-1">Joined</p>
                            <p className="text-sm font-bold text-accent-gold uppercase">{new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Bookings Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] opacity-40">Booking Ledger</h3>
                            <button onClick={() => navigate('/booking')} className="text-accent-gold text-[10px] font-black uppercase tracking-widest">Reserve New</button>
                        </div>

                        {loadingBookings ? (
                            <div className="py-8 text-center text-accent-gold animate-pulse italic text-xs uppercase font-bold tracking-widest">Opening Ledger...</div>
                        ) : bookings.length === 0 ? (
                            <div className="bg-card-dark rounded-[2.5rem] p-10 border border-white/5 text-center space-y-4">
                                <span className="material-symbols-outlined text-white/10 text-4xl">event_busy</span>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">No active reservations</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map(booking => (
                                    <div
                                        key={booking.id}
                                        onClick={() => setSelectedBooking(booking as any)}
                                        className="bg-card-dark p-5 rounded-3xl border border-white/5 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform shadow-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10">
                                                <span className="text-[10px] font-black text-accent-gold uppercase">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-lg font-black text-white leading-none">{new Date(booking.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase italic">{booking.guests} Guests</p>
                                                <p className="text-[10px] text-white/40 font-medium tracking-wide uppercase">{booking.status || 'Scheduled'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {booking.receipt_url && (
                                                <span className="material-symbols-outlined text-accent-gold text-lg">receipt_long</span>
                                            )}
                                            <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent-gold transition-colors">
                                                <span className="material-symbols-outlined text-xl">content_paste_search</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Identify Details Form */}
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
                                    <button type="submit" disabled={saving} className="flex-1 bg-accent-gold text-primary font-black py-4 rounded-2xl shadow-xl shadow-accent-gold/10 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px]">
                                        {saving ? 'Updating...' : 'Save Changes'}
                                    </button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-8 bg-white/5 text-white font-black py-4 rounded-2xl active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px]">
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all flex items-center justify-center gap-2 mt-12"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Depart residency
                    </button>
                </main>

                <Navigation />
            </div>

            {/* Booking Detail Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0707]/95 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-burgundy-accent/40 rounded-[32px] border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-8 pb-4 flex justify-between items-start">
                                <div>
                                    <p className="text-accent-gold text-[10px] font-black uppercase tracking-[0.3em] mb-2">Registry Entry</p>
                                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tight leading-none">Reservation Details</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="size-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 active:scale-95 transition-transform"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="p-8 pt-4 space-y-8 overflow-y-auto no-scrollbar pb-16">
                                {/* Core Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/5 rounded-3xl p-5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Date & Time</p>
                                        <p className="text-lg font-bold text-white uppercase italic">
                                            {new Date(selectedBooking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-3xl p-5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Guest Table</p>
                                        <p className="text-lg font-bold text-white font-montserrat">{selectedBooking.guests} Residents</p>
                                    </div>
                                </div>

                                {/* Location & Message */}
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2 px-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Time</p>
                                        <p className="text-sm font-black uppercase tracking-tight text-accent-gold">{selectedBooking.time}</p>
                                    </div>
                                    <div className="space-y-2 px-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Status</p>
                                        <p className="text-sm font-black uppercase tracking-tight text-white">{selectedBooking.status || 'Confirmed'}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 px-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Registry Email</p>
                                    <p className="text-sm font-medium text-warm-ivory/80">{selectedBooking.email}</p>
                                </div>

                                {selectedBooking.special_requests && (
                                    <div className="space-y-2 px-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Special Requests</p>
                                        <p className="text-sm italic font-light text-warm-ivory/80 leading-relaxed font-montserrat">"{selectedBooking.special_requests}"</p>
                                    </div>
                                )}

                                {/* AI Extraction View */}
                                {selectedBooking.receipt_data && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-accent-gold">AI Audit Result</p>
                                        <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
                                            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                                <p className="text-sm font-black text-white italic">{selectedBooking.receipt_data.vendor || 'Unknown Vendor'}</p>
                                                <p className="text-[10px] font-black text-accent-gold uppercase">{selectedBooking.receipt_data.date}</p>
                                            </div>
                                            <table className="w-full text-left text-[11px]">
                                                <thead>
                                                    <tr className="border-b border-white/5 text-white/30">
                                                        <th className="px-4 py-2 font-black uppercase tracking-widest">Item</th>
                                                        <th className="px-4 py-2 font-black uppercase tracking-widest text-right">Qty</th>
                                                        <th className="px-4 py-2 font-black uppercase tracking-widest text-right">Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-white/70">
                                                    {selectedBooking.receipt_data.items?.map((item: any, idx: number) => {
                                                        const price = typeof item.price === 'string' ? parseFloat(item.price.replace(',', '.')) : Number(item.price || 0);
                                                        return (
                                                            <tr key={idx} className="border-b border-white/5 last:border-0">
                                                                <td className="px-4 py-2 font-medium">{item.name}</td>
                                                                <td className="px-4 py-2 text-right font-montserrat">{item.quantity}</td>
                                                                <td className="px-4 py-2 text-right font-montserrat">{price.toFixed(2)}{selectedBooking.receipt_data.currency === 'EUR' ? '€' : selectedBooking.receipt_data.currency}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-accent-gold/5 font-black text-white italic">
                                                        <td colSpan={2} className="px-4 py-3 uppercase tracking-widest">Total Amount</td>
                                                        <td className="px-4 py-3 text-right font-montserrat">
                                                            {(typeof selectedBooking.receipt_data.total === 'string'
                                                                ? parseFloat(selectedBooking.receipt_data.total.replace(',', '.'))
                                                                : Number(selectedBooking.receipt_data.total || 0)
                                                            ).toFixed(2)}
                                                            {selectedBooking.receipt_data.currency === 'EUR' ? '€' : selectedBooking.receipt_data.currency}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Receipt Section */}
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Expense Verification</p>
                                        <div className="flex items-center gap-2">
                                            {selectedBooking.receipt_url && !selectedBooking.receipt_data && !extracting && !receiptUploading && (
                                                <button
                                                    onClick={() => processReceipt(selectedBooking.receipt_url!, selectedBooking.id)}
                                                    className="bg-accent-gold/10 text-accent-gold text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-accent-gold/20 hover:bg-accent-gold/20 transition-all"
                                                >
                                                    Retry AI Audit
                                                </button>
                                            )}
                                            {selectedBooking.receipt_url && selectedBooking.receipt_data && (
                                                <span className="bg-green-500/20 text-green-500 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-green-500/20">Archived</span>
                                            )}
                                            {extracting && (
                                                <span className="text-accent-gold animate-pulse text-[8px] font-black uppercase tracking-widest">AI analysis in progress...</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative aspect-video rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden group">
                                        {selectedBooking.receipt_url ? (
                                            <>
                                                <img src={selectedBooking.receipt_url} className="w-full h-full object-cover" alt="Receipt" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <label htmlFor="receipt-upload" className="cursor-pointer bg-white text-primary px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Update Receipt</label>
                                                </div>
                                            </>
                                        ) : (
                                            <label htmlFor="receipt-upload" className="cursor-pointer flex flex-col items-center gap-3">
                                                <div className="size-16 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold">
                                                    <span className="material-symbols-outlined text-3xl">receipt_long</span>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-black uppercase tracking-widest text-white">Attach Statement</p>
                                                    <p className="text-[9px] text-white/30 mt-1 uppercase tracking-widest">Camera or Photo Library</p>
                                                </div>
                                            </label>
                                        )}
                                        {(receiptUploading || extracting) && (
                                            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
                                                <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-gold">
                                                    {receiptUploading ? 'Archiving Image...' : 'AI Extraction...'}
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            id="receipt-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleReceiptUpload}
                                            disabled={receiptUploading || extracting}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="w-full bg-white/5 hover:bg-white/10 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-white/10 transition-all active:scale-[0.98]"
                                >
                                    Return to Ledger
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MemberGate>
    );
};

export default ProfileScreen;
