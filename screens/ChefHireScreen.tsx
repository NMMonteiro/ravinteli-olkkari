import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { StaffMember } from '../types';
import { Header } from '../components/Header';
import { MemberGate } from '../components/MemberGate';
import { Navigation } from '../components/Navigation';

interface ChefHireScreenProps {
  onOpenMenu: () => void;
}

const ChefHireScreen: React.FC<ChefHireScreenProps> = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    async function fetchStaff() {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching staff:', error);
      } else {
        setStaffList(data || []);
      }
      setLoading(false);
    }

    fetchStaff();
  }, []);

  const handleInquiry = async () => {
    if (!inquiryName || !inquiryEmail) {
      alert('Please provide your name and email');
      return;
    }

    setSendingInquiry(true);

    const inquiryHtml = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #C5A059; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #502025; padding: 20px; text-align: center;">
          <h1 style="color: #C5A059; margin: 0;">Chef Service Inquiry</h1>
        </div>
        <div style="padding: 30px; background-color: #fff;">
          <p><strong>You have received a new inquiry for ${selectedStaff?.name}:</strong></p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;">👤 <strong>Client:</strong> ${inquiryName} (${inquiryEmail})</li>
            <li style="margin-bottom: 10px;">👨‍🍳 <strong>Chef:</strong> ${selectedStaff?.name}</li>
            <li style="margin-bottom: 10px;">📍 <strong>Service:</strong> ${selectedStaff?.role}</li>
          </ul>
          ${inquiryMessage ? `<p><strong>Client Message:</strong> ${inquiryMessage}</p>` : ''}
          <p style="margin-top: 30px; font-size: 12px; color: #666;">Sent from Olkkari Society App</p>
        </div>
      </div>
    `;

    try {
      await supabase.functions.invoke('onesignal-email', {
        body: {
          email: 'ps.olkkari@gmail.com',
          subject: `Chef Inquiry: ${selectedStaff?.name} - By ${inquiryName}`,
          body: inquiryHtml,
          name: "Chef Inquiry Notification"
        }
      });

      setInquirySent(true);
      setTimeout(() => {
        setInquirySent(false);
        setSelectedStaff(null);
        setInquiryName('');
        setInquiryEmail('');
        setInquiryMessage('');
      }, 3000);
    } catch (err) {
      console.error('Inquiry error:', err);
      alert('Failed to send inquiry. Please try again.');
    }
    setSendingInquiry(false);
  };

  return (
    <MemberGate title="Personal Chef Service" description="Registered members can hire our expert chefs for private dining and catering events.">
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-white font-display pb-24">
        <Header onOpenMenu={onOpenMenu} title="Private Service" />

        <div className="px-4 pt-6">
          <h1 className="text-3xl font-bold text-white mb-2">Private Culinary Experience</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Bring the Olkkari kitchen to your home. Hire our award-winning staff for your next private event.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-accent-gold animate-pulse">Gathering our best...</div>
        ) : (
          <div className="px-4 py-8 grid grid-cols-1 gap-6">
            {staffList.map((staff) => (
              <div key={staff.id} className="bg-card-dark rounded-3xl border border-white/5 overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <img src={staff.image} alt={staff.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full border border-accent-gold shadow-lg">
                    <p className="text-accent-gold text-xs font-bold uppercase tracking-widest">{staff.badge}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{staff.name}</h3>
                      <p className="text-accent-gold text-sm font-medium">{staff.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-lg font-bold">{staff.rate}</p>
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-none">Hourly Rate</p>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed mb-6">
                    {staff.description}
                  </p>

                  <button
                    onClick={() => setSelectedStaff(staff)}
                    className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-accent-gold hover:text-primary hover:border-accent-gold transition-all uppercase tracking-widest text-xs"
                  >
                    Inquire Availability
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inquiry Modal */}
        {selectedStaff && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-background-dark/90 backdrop-blur-sm" onClick={() => !sendingInquiry && setSelectedStaff(null)} />
            <div className="relative w-full max-w-lg bg-card-dark rounded-t-[32px] sm:rounded-3xl border-t sm:border border-white/10 p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
              {inquirySent ? (
                <div className="py-12 text-center">
                  <div className="size-20 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-accent-gold text-4xl animate-bounce">check</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Request Dispatched!</h3>
                  <p className="text-white/60">Anthonio will be notified immediately.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Inquire Availability</h3>
                      <p className="text-accent-gold text-sm font-medium">Requesting: {selectedStaff.name}</p>
                    </div>
                    <button onClick={() => setSelectedStaff(null)} className="p-2 text-white/40 hover:text-white transition-colors">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1.5 ml-1">Your Name</label>
                      <input
                        type="text"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="What should we call you?"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-accent-gold outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1.5 ml-1">Your Email</label>
                      <input
                        type="email"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-accent-gold outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1.5 ml-1">Event Details</label>
                      <textarea
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Tell us about your event (date, number of guests, type of cuisine)..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-accent-gold outline-none transition-colors min-h-[120px] resize-none"
                      />
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <button
                      onClick={handleInquiry}
                      disabled={sendingInquiry}
                      className="w-full bg-accent-gold text-primary font-extrabold py-5 rounded-xl uppercase tracking-[0.2em] text-sm shadow-xl shadow-accent-gold/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      {sendingInquiry ? (
                        <>
                          <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching Inquiry...</span>
                        </>
                      ) : (
                        'Request Now'
                      )}
                    </button>
                    <p className="text-center text-[10px] text-white/30 px-6 leading-relaxed">
                      By clicking Request Now, our team will review the chef's schedule and contact you directly via email.
                    </p>
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
