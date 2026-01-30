import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { StaffMember, MenuItem } from '../types';
import { Header } from '../components/Header';
import { MemberGate } from '../components/MemberGate';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';

interface ChefHireScreenProps {
  onOpenMenu: () => void;
}

const ChefHireScreen: React.FC<ChefHireScreenProps> = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Inquiry State
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryDate, setInquiryDate] = useState(new Date().toISOString().split('T')[0]);
  const [inquiryGuests, setInquiryGuests] = useState(2);
  const [inquiryLocation, setInquiryLocation] = useState('');
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  // Menu Filtering
  const [activeMenuCategory, setActiveMenuCategory] = useState<string>('All');
  const [uniqueCategories, setUniqueCategories] = useState<string[]>(['All']);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setInquiryEmail(user.email ?? '');
      if (user.user_metadata?.full_name) {
        setInquiryName(user.user_metadata.full_name);
      }
    }
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [staffRes, menuRes] = await Promise.all([
        supabase.from('staff').select('*').order('id', { ascending: true }),
        supabase.from('menu_items').select('*').order('name', { ascending: true })
      ]);

      if (staffRes.data) setStaffList(staffRes.data);
      if (menuRes.data) {
        const items = menuRes.data;
        setMenuItems(items);

        // Extract unique categories (preferring subcategory if available for better resolution)
        const cats = Array.from(new Set(items.map((i: any) => i.subcategory || i.category || 'Other'))) as string[];
        setUniqueCategories(['All', ...cats]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const toggleMenuItem = (id: number) => {
    setSelectedMenuIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredMenuItems = activeMenuCategory === 'All'
    ? menuItems
    : menuItems.filter(item => (item.subcategory === activeMenuCategory || (item as any).category === activeMenuCategory));

  const handleInquiry = async () => {
    if (!inquiryName || !inquiryEmail || !inquiryLocation) {
      alert('Please fill in your name, email, and event location');
      return;
    }

    setSendingInquiry(true);

    const selectedMenuNames = menuItems
      .filter(item => selectedMenuIds.includes(item.id))
      .map(item => item.name);

    const ABSOLUTE_LOGO_URL = 'https://ravinteli-olkkari.vercel.app/assets/logo/Olkkari-simple.png';
    const emailStyles = `font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; line-height: 1.6;`;

    // Internal notification
    const inquiryHtml = `
      <div style="${emailStyles} max-width: 600px; margin: 0 auto; background-color: #1d1516; border: 1px solid #C5A059; border-radius: 20px; overflow: hidden;">
        <div style="padding: 40px; text-align: center; background-color: #1d1516; border-bottom: 1px solid rgba(197,160,89,0.2);">
          <img src="${ABSOLUTE_LOGO_URL}" alt="Olkkari Logo" style="width: 120px; height: auto; margin-bottom: 20px;" />
          <h1 style="color: #C5A059; margin: 0; font-size: 22px; letter-spacing: 3px; text-transform: uppercase;">Private Chef Inquiry</h1>
        </div>
        <div style="padding: 40px; background-color: #1d1516;">
          <div style="background-color: rgba(197, 160, 89, 0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 16px; padding: 30px; margin-bottom: 30px;">
            <table style="width: 100%; color: #ffffff; border-collapse: collapse;">
              <tr><td style="color: #C5A059; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 2px; padding-bottom: 15px;">Requested Service</td></tr>
              <tr><td style="font-size: 20px; font-weight: bold; padding-bottom: 25px; border-bottom: 1px solid rgba(197,160,89,0.1);">Hire ${selectedStaff?.name}</td></tr>
              
              <tr><td style="padding-top: 25px; color: #C5A059; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 2px;">Event Details</td></tr>
              <tr>
                <td style="padding-top: 5px;">
                  <p style="margin: 5px 0;"><strong>Date:</strong> ${inquiryDate}</p>
                  <p style="margin: 5px 0;"><strong>Guests:</strong> ${inquiryGuests}</p>
                  <p style="margin: 5px 0;"><strong>Location:</strong> ${inquiryLocation}</p>
                </td>
              </tr>

              ${selectedMenuNames.length > 0 ? `
                <tr><td style="padding-top: 25px; color: #C5A059; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 2px;">Menu Preferences</td></tr>
                <tr><td style="padding-top: 5px; font-size: 14px;">${selectedMenuNames.join(', ')}</td></tr>
              ` : ''}

              <tr><td style="padding-top: 25px; color: #C5A059; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 2px;">Client</td></tr>
              <tr><td style="padding-top: 5px;">${inquiryName} (${inquiryEmail})</td></tr>
            </table>
          </div>
          <p style="font-size: 10px; color: #666; text-align: center;">Ravinteli Olkkari Concierge Service</p>
        </div>
      </div>
    `;

    // Client confirmation
    const confirmationHtml = `
      <div style="${emailStyles} max-width: 600px; margin: 0 auto; background-color: #1d1516; border: 1px solid #C5A059; border-radius: 20px; overflow: hidden;">
        <div style="padding: 40px; text-align: center; background-color: #1d1516; border-bottom: 1px solid rgba(197,160,89,0.2);">
          <img src="${ABSOLUTE_LOGO_URL}" alt="Olkkari Logo" style="width: 120px; height: auto; margin-bottom: 20px;" />
          <h1 style="color: #C5A059; margin: 0; font-size: 22px; letter-spacing: 3px; text-transform: uppercase;">Inquiry Received</h1>
        </div>
        <div style="padding: 40px; background-color: #1d1516;">
          <p style="font-size: 18px; color: #C5A059; font-weight: bold;">Dear ${inquiryName.split(' ')[0]},</p>
          <p>We have successfully logged your request for <strong>${selectedStaff?.name}</strong> on <strong>${inquiryDate}</strong>.</p>
          
          <div style="background-color: rgba(197, 160, 89, 0.1); border: 1px solid #C5A059; border-radius: 16px; padding: 25px; margin: 30px 0; text-align: center;">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">Next Steps</p>
            <p style="font-size: 14px; opacity: 0.8; margin-top: 10px;">Our team will review the availability for your location (${inquiryLocation}) and contact you via email with a formal quote.</p>
          </div>

          <p>Thank you for choosing Olkkari.</p>
        </div>
      </div>
    `;

    try {
      await supabase.functions.invoke('gmail-smtp', {
        body: { to: 'ps.olkkari@gmail.com', subject: `Chef Request: ${selectedStaff?.name} - ${inquiryDate}`, body: inquiryHtml }
      });
      await supabase.functions.invoke('gmail-smtp', {
        body: { to: inquiryEmail, subject: `Chef Hire Inquiry - Ravinteli Olkkari`, body: confirmationHtml }
      });
      setInquirySent(true);
      setTimeout(() => {
        setInquirySent(false);
        setSelectedStaff(null);
        resetForm();
      }, 3000);
    } catch (err) {
      console.error('Inquiry error:', err);
      alert('Failed to send inquiry.');
    } finally {
      setSendingInquiry(false);
    }
  };

  const resetForm = () => {
    setInquiryName('');
    setInquiryEmail('');
    setInquiryLocation('');
    setInquiryMessage('');
    setSelectedMenuIds([]);
    setInquiryGuests(2);
    setInquiryDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <MemberGate title="Personal Chef Service" description="Exclusive access to our elite culinary team for your private events.">
      <div className="min-h-screen text-white font-display pb-24 overflow-hidden relative">
        <Header onOpenMenu={onOpenMenu} title="Private Staff" />

        <div className="px-6 pt-10 pb-6">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase italic">The Studio Line</h1>
          <p className="text-accent-gold text-xs font-bold tracking-[0.3em] uppercase opacity-60">Elite Home Catering</p>
        </div>

        {loading ? (
          <div className="py-20 text-center animate-pulse text-accent-gold">Loading Crew...</div>
        ) : (
          <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {staffList.map((staff) => (
              <div key={staff.id} className="bg-primary/20 rounded-[32px] border border-white/5 overflow-hidden group">
                <div className="relative aspect-[4/5]">
                  <img src={staff.image} alt={staff.name} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80" />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="bg-accent-gold text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{staff.badge}</span>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-3xl font-black text-white leading-tight">{staff.name}</h3>
                    <p className="text-accent-gold text-sm font-bold uppercase tracking-widest mt-1 opacity-80">{staff.role}</p>
                  </div>
                </div>
                <div className="p-8 bg-black/20">
                  <p className="text-white/50 text-sm leading-relaxed mb-8 italic">"{staff.description}"</p>
                  <div className="flex items-center justify-end mb-8">
                    <button
                      onClick={() => setSelectedStaff(staff)}
                      className="w-full bg-accent-gold text-primary px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all text-center"
                    >
                      Book Availability
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Inquiry Modal */}
        {selectedStaff && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto pt-10">
            <div className="fixed inset-0 bg-background-dark/95 backdrop-blur-md" onClick={() => !sendingInquiry && setSelectedStaff(null)} />
            <div className="relative w-full max-w-xl bg-card-dark rounded-t-[40px] sm:rounded-[40px] border-t sm:border border-white/10 p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto no-scrollbar scale-100">
              {inquirySent ? (
                <div className="py-20 text-center">
                  <div className="size-24 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-accent-gold/40">
                    <span className="material-symbols-outlined text-accent-gold text-5xl">check_circle</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 uppercase italic">Reserved</h3>
                  <p className="text-white/40">Our concierge will contact you shortly.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tight uppercase italic line-clamp-1">Personal Hire: {selectedStaff.name.split(' ')[0]}</h3>
                      <p className="text-accent-gold text-[10px] font-bold uppercase tracking-[0.3em] mt-2 opacity-60">Custom Experience Design</p>
                    </div>
                    <button onClick={() => setSelectedStaff(null)} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                      <span className="material-symbols-outlined font-bold text-xl">close</span>
                    </button>
                  </div>

                  <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Your Name</label>
                        <input type="text" value={inquiryName} onChange={(e) => setInquiryName(e.target.value)} className="w-full bg-primary/20 border border-white/5 rounded-2xl p-4 text-white text-base outline-none focus:border-accent-gold transition-colors" placeholder="Full Name" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                        <input type="email" value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} className="w-full bg-primary/20 border border-white/5 rounded-2xl p-4 text-white text-base outline-none focus:border-accent-gold transition-colors" placeholder="Your Email" />
                      </div>
                    </div>

                    {/* Date and Guests */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Event Date</label>
                        <div className="relative">
                          <input type="date" value={inquiryDate} onChange={(e) => setInquiryDate(e.target.value)} className="w-full bg-primary/20 border border-white/5 rounded-2xl p-4 text-white text-base outline-none focus:border-accent-gold transition-colors bg-white/0" style={{ colorScheme: 'dark' }} />
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none text-xl">calendar_month</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Guest List</label>
                        <div className="flex items-center justify-between bg-primary/20 border border-white/5 rounded-2xl p-4">
                          <button onClick={() => setInquiryGuests(Math.max(1, inquiryGuests - 1))} className="text-accent-gold material-symbols-outlined text-xl">remove</button>
                          <span className="text-white font-black text-lg">{inquiryGuests}</span>
                          <button onClick={() => setInquiryGuests(inquiryGuests + 1)} className="text-accent-gold material-symbols-outlined text-xl">add</button>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Event Location</label>
                      <input type="text" value={inquiryLocation} onChange={(e) => setInquiryLocation(e.target.value)} className="w-full bg-primary/20 border border-white/5 rounded-2xl p-4 h-14 text-white text-base outline-none focus:border-accent-gold transition-colors" placeholder="e.g. City Garden Apartment, Helsinki" />
                    </div>

                    {/* Menu Selection */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Menu Selection</label>
                        <div className="flex gap-2 bg-white/5 p-1 rounded-full overflow-x-auto no-scrollbar max-w-[60%]">
                          {uniqueCategories.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setActiveMenuCategory(cat)}
                              className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeMenuCategory === cat ? 'bg-accent-gold text-primary' : 'text-white/40'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto no-scrollbar pr-1 bg-primary/10 rounded-2xl p-2 border border-white/5">
                        {filteredMenuItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => toggleMenuItem(item.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${selectedMenuIds.includes(item.id) ? 'bg-accent-gold/20 border-accent-gold text-accent-gold' : 'bg-transparent border-white/5 text-white/40'}`}
                          >
                            <span className="text-xs font-bold leading-tight line-clamp-1">{item.name}</span>
                            {selectedMenuIds.includes(item.id) && <span className="material-symbols-outlined text-sm">check</span>}
                          </button>
                        ))}
                        {filteredMenuItems.length === 0 && (
                          <p className="text-center py-4 text-white/20 text-[10px] uppercase tracking-widest font-bold italic">No items in this category</p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Notes / Preferences</label>
                      <textarea value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)} className="w-full bg-primary/20 border border-white/5 rounded-2xl p-4 text-white text-base outline-none focus:border-accent-gold min-h-[100px] resize-none" placeholder="Dietary restrictions, theme, or special requests..." />
                    </div>

                    <button
                      onClick={handleInquiry}
                      disabled={sendingInquiry}
                      className="w-full bg-accent-gold text-primary p-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-accent-gold/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                    >
                      {sendingInquiry ? <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : 'Send Concierge Request'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <Navigation />
      </div>
    </MemberGate>
  );
};

export default ChefHireScreen;
