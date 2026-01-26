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
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
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
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #C5A059; border-radius: 12px; background-color: #fcfcfc;">
        <h2 style="color: #502025;">Chef Service Inquiry</h2>
        <p><strong>Chef Requested:</strong> ${selectedStaff?.name}</p>
        <p><strong>Client:</strong> ${inquiryName}</p>
        <p><strong>Client Email:</strong> ${inquiryEmail}</p>
        <p><strong>Details:</strong> ${inquiryMessage || 'None'}</p>
      </div>
    `;

    try {
      await supabase.functions.invoke('gmail-smtp', {
        body: {
          to: 'ps.olkkari@gmail.com',
          subject: `Inquiry: ${selectedStaff?.name} - Ref: ${inquiryName}`,
          body: inquiryHtml
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

        <div className="px-6 pt-10 pb-6">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Private Culinary Experience</h1>
          <p className="text-white/40 text-lg leading-relaxed italic">
            Bring the Olkkari kitchen to your home.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-accent-gold animate-pulse font-bold tracking-widest uppercase text-xs">Gathering our best...</div>
        ) : (
          <div className="px-4 py-4 grid grid-cols-1 gap-8">
            {staffList.map((staff) => (
              <div key={staff.id} className="bg-primary/20 rounded-[32px] border border-white/5 overflow-hidden group shadow-2xl">
                <div className="relative aspect-square">
                  <img src={staff.image} alt={staff.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-primary/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-accent-gold shadow-2xl">
                    <p className="text-accent-gold text-[10px] font-black uppercase tracking-[0.2em]">{staff.badge}</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">{staff.name}</h3>
                      <p className="text-accent-gold text-sm font-bold uppercase tracking-widest mt-1">{staff.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-2xl font-black">{staff.rate}</p>
                      <p className="text-white/20 text-[9px] uppercase font-bold tracking-[0.2em] leading-none mt-1">Hourly</p>
                    </div>
                  </div>

                  <p className="text-white/60 text-base leading-relaxed mb-8 italic">
                    "{staff.description}"
                  </p>

                  <button
                    onClick={() => setSelectedStaff(staff)}
                    className="w-full bg-accent-gold text-primary font-black py-5 rounded-2xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs shadow-xl shadow-accent-gold/10"
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
            <div className="absolute inset-0 bg-background-dark/95 backdrop-blur-md" onClick={() => !sendingInquiry && setSelectedStaff(null)} />
            <div className="relative w-full max-w-lg bg-card-dark rounded-t-[40px] sm:rounded-[32px] border-t sm:border border-white/10 p-10 shadow-2xl animate-in slide-in-from-bottom duration-500">
              {inquirySent ? (
                <div className="py-12 text-center">
                  <div className="size-24 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-accent-gold/30">
                    <span className="material-symbols-outlined text-accent-gold text-5xl animate-bounce">rocket_launch</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">Inquiry Dispatched</h3>
                  <p className="text-white/40 text-lg">We will contact you via email shortly.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tight">Hire {selectedStaff.name.split(' ')[0]}</h3>
                      <p className="text-accent-gold text-sm font-bold uppercase tracking-widest mt-1">Availability Request</p>
                    </div>
                    <button onClick={() => setSelectedStaff(null)} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                      <span className="material-symbols-outlined font-bold">close</span>
                    </button>
                  </div>

                  <div className="space-y-5">
                    <input
                      type="text"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full bg-primary/20 border border-white/10 rounded-2xl p-5 h-16 text-white focus:border-accent-gold outline-none transition-colors"
                    />
                    <input
                      type="email"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      placeholder="Your Email Address"
                      className="w-full bg-primary/20 border border-white/10 rounded-2xl p-5 h-16 text-white focus:border-accent-gold outline-none transition-colors"
                    />
                    <textarea
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="Tell us about your event..."
                      className="w-full bg-primary/20 border border-white/10 rounded-2xl p-5 text-white focus:border-accent-gold outline-none min-h-[140px] resize-none transition-colors"
                    />
                  </div>

                  <div className="mt-10">
                    <button
                      onClick={handleInquiry}
                      disabled={sendingInquiry}
                      className="w-full bg-accent-gold text-primary font-black py-6 rounded-2xl uppercase tracking-[0.2em] text-sm shadow-2xl shadow-accent-gold/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                    >
                      {sendingInquiry ? (
                        <div className="size-5 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Send Request</span>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-white/20 mt-6 px-10 leading-relaxed uppercase tracking-widest font-bold">
                      Reservation is not confirmed until we reach out personally.
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
