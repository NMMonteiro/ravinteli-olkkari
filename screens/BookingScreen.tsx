import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase';
import { Header } from '../components/Header';
import { MemberGate } from '../components/MemberGate';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';

interface BookingScreenProps {
  onOpenMenu: () => void;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Check for passed state from EventsScreen
  const eventDate = location.state?.eventDate;
  const eventTitle = location.state?.eventTitle;

  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(eventDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState(eventTitle ? `Reservation for: ${eventTitle}` : '');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setEmail(user.email ?? '');
      if (user.user_metadata?.full_name) {
        setName(user.user_metadata.full_name);
      }
    }
  }, [user]);

  const handleBooking = async () => {
    if (!name || !email) {
      alert('Please provide your name and email');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('bookings').insert([
        {
          customer_name: name,
          email: email,
          guests: guests,
          date: date,
          time: time,
          special_requests: comments,
          user_id: user?.id
        }
      ]);

      if (error) throw error;

      // Restore Rich Email Templates
      const ABSOLUTE_LOGO_URL = 'https://ravinteli-olkkari.vercel.app/assets/logo/Olkkari-simple.png';
      const emailStyles = "font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; line-height: 1.6;";

      const notificationHtml = `
        <div style="${emailStyles} max-width: 600px; margin: 0 auto; background-color: #1d1516; border: 1px solid #C5A059; border-radius: 20px; overflow: hidden;">
          <div style="padding: 40px; text-align: center; background-color: #1d1516;">
            <img src="${ABSOLUTE_LOGO_URL}" alt="Olkkari Logo" style="width: 120px; height: auto; margin-bottom: 20px;" />
            <h1 style="color: #C5A059; margin: 0; font-size: 24px; letter-spacing: 4px; text-transform: uppercase; font-weight: bold;">New Reservation</h1>
          </div>
          <div style="padding: 0 40px 40px 40px; background-color: #1d1516;">
            <div style="background-color: rgba(197, 160, 89, 0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 16px; padding: 30px; margin-bottom: 30px;">
              <table style="width: 100%; color: #ffffff;">
                <tr><td style="color: #888; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 2px; padding-bottom: 5px;">Guest Information</td></tr>
                <tr><td style="font-size: 18px; font-weight: bold; color: #ffffff; padding-bottom: 25px;">${name} <br/><span style="font-weight: normal; color: #C5A059; font-size: 14px;">${email}</span></td></tr>
                <tr>
                  <td>
                    <table style="width: 100%;">
                      <tr>
                        <td style="width: 33%;">
                          <div style="color: #888; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 2px;">Date</div>
                          <div style="font-size: 16px; font-weight: bold; color: #C5A059; margin-top: 5px;">${date}</div>
                        </td>
                        <td style="width: 33%;">
                          <div style="color: #888; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 2px;">Time</div>
                          <div style="font-size: 16px; font-weight: bold; color: #C5A059; margin-top: 5px;">${time}</div>
                        </td>
                        <td style="width: 33%;">
                          <div style="color: #888; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 2px;">Guests</div>
                          <div style="font-size: 16px; font-weight: bold; color: #C5A059; margin-top: 5px;">${guests}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ${comments ? `
                <div style="margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(197, 160, 89, 0.2);">
                  <div style="color: #888; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 2px;">Special Requests</div>
                  <div style="font-size: 14px; font-style: italic; margin-top: 10px; color: rgba(255,255,255,0.8); line-height: 1.5;">"${comments}"</div>
                </div>
              ` : ''}
            </div>
            <p style="font-size: 10px; color: #666; text-align: center; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px;">Ravinteli Olkkari Society App • Automated Notification</p>
          </div>
        </div>
      `;

      const confirmationHtml = `
        <div style="${emailStyles} max-width: 600px; margin: 0 auto; background-color: #1d1516; border: 1px solid #C5A059; border-radius: 24px; overflow: hidden;">
          <div style="padding: 50px 40px; text-align: center; background-color: #1d1516; border-bottom: 1px solid rgba(197, 160, 89, 0.2);">
            <img src="${ABSOLUTE_LOGO_URL}" alt="Olkkari Logo" style="width: 140px; height: auto; margin-bottom: 25px;" />
            <h1 style="color: #C5A059; margin: 0; font-size: 26px; letter-spacing: 3px; text-transform: uppercase; font-weight: bold;">Inquiry Logged</h1>
          </div>
          <div style="padding: 50px 40px; background-color: #1d1516;">
            <p style="font-size: 18px; margin-top: 0; color: #C5A059; font-weight: bold;">Dear ${name.split(' ')[0]},</p>
            <p style="font-size: 16px; color: rgba(255,255,255,0.9);">We have received your reservation inquiry for <strong>${date}</strong> at <strong>${time}</strong>.</p>
            
            <div style="background-color: rgba(197, 160, 89, 0.1); border: 2px solid #C5A059; border-radius: 20px; padding: 35px; margin: 40px 0; text-align: center;">
              <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; color: #C5A059; margin-bottom: 15px;">Official Status</div>
              <div style="font-size: 22px; font-weight: bold; color: #ffffff;">Waitlist / Pending</div>
              <p style="font-size: 14px; margin-top: 20px; color: rgba(255,255,255,0.7); line-height: 1.6;">Please note that your table is <strong>not confirmed</strong> until one of our hosts reaches out to confirm availability. We curated every evening specifically for our members.</p>
            </div>

            <p style="font-size: 16px; color: rgba(255,255,255,0.9);">We look forward to seeing you at the living room.</p>
            
            <div style="margin-top: 60px; padding-top: 40px; border-top: 1px solid rgba(197, 160, 89, 0.2); text-align: center;">
              <p style="margin: 0; font-weight: bold; color: #C5A059; font-size: 18px; letter-spacing: 2px;">RAVINTELI OLKKARI</p>
              <p style="margin: 5px 0 0 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 4px;">The Society Living Room</p>
            </div>
          </div>
        </div>
      `;

      await Promise.all([
        supabase.functions.invoke('gmail-smtp', {
          body: { to: 'ps.olkkari@gmail.com', subject: `Booking: ${name} - ${date}`, body: notificationHtml }
        }),
        supabase.functions.invoke('gmail-smtp', {
          body: { to: email, subject: `Reservation Inquiry Received - Ravinteli Olkkari`, body: confirmationHtml }
        })
      ]).catch(e => console.error('SMTP Error:', e));

      setSubmitted(true);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0d090a] text-white font-display flex flex-col items-center justify-center p-8 text-center overflow-auto">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-accent-gold/10 rounded-full flex items-center justify-center mb-10 border-2 border-accent-gold/40 shadow-[0_0_50px_rgba(197,160,89,0.2)]"
        >
          <span className="material-symbols-outlined text-accent-gold text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-black mb-4 tracking-tighter"
        >
          Inquiry Logged
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-lg mb-10 max-w-xs mx-auto leading-relaxed"
        >
          We have received your reservation request for <span className="text-accent-gold font-bold">{date}</span> at <span className="text-accent-gold font-bold">{time}</span>.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mb-12 w-full max-w-sm"
        >
          <h4 className="text-accent-gold font-black uppercase tracking-[0.3em] text-[10px] mb-3">Priority Notification</h4>
          <p className="text-white/80 text-sm leading-relaxed">
            A confirmation has been sent to your email. Our host team will handle your request as priority.
          </p>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/home')}
          className="w-full max-w-sm bg-accent-gold text-primary font-black py-5 rounded-2xl shadow-2xl shadow-accent-gold/20 active:scale-95 transition-all uppercase tracking-[0.2em] text-sm"
        >
          Return to Living Room
        </motion.button>
      </div>
    );
  }

  return (
    <MemberGate title="Table Reservation" description="The most sought-after tables in Helsinki, reserved for our Society members.">
      <div className="min-h-screen bg-[#0d090a] text-white font-display flex flex-col h-full overflow-hidden">
        <Header onOpenMenu={onOpenMenu} title="Reservations" />

        {/* Custom Progress Bar */}
        <div className="px-6 pt-4 flex gap-1.5 h-1">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-accent-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]' : 'bg-white/10'}`}
            />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto mt-4 pb-32">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="px-6 py-6"
              >
                <div className="mb-10 text-center">
                  <h3 className="text-3xl font-black tracking-tighter mb-2">The Guest List</h3>
                  <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Step 1 — Party Size</p>
                </div>

                <div className="flex flex-col items-center justify-center gap-8 py-10 rounded-[40px] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 relative overflow-hidden">
                  {/* Geometric Deco Background */}
                  <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent-gold/5 blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />

                  <div className="relative group">
                    <div className="absolute -inset-10 bg-accent-gold/10 blur-[80px] group-active:scale-150 transition-transform duration-700" />
                    <span className="text-9xl font-black text-white relative flex items-baseline gap-1 select-none">
                      {guests}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 relative">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white active:scale-90 transition-all hover:border-accent-gold/50"
                    >
                      <span className="material-symbols-outlined text-3xl">remove</span>
                    </button>
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/40 mx-2">GUESTS</p>
                    <button
                      onClick={() => setGuests(guests + 1)}
                      className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white active:scale-90 transition-all hover:border-accent-gold/50"
                    >
                      <span className="material-symbols-outlined text-3xl">add</span>
                    </button>
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    onClick={nextStep}
                    className="w-full bg-white text-primary font-black py-5 rounded-3xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    CONTINUE
                    <span className="material-symbols-outlined text-xl font-bold">arrow_forward</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="px-6 py-6"
              >
                <div className="mb-10 text-center">
                  <h3 className="text-3xl font-black tracking-tighter mb-2">Timing</h3>
                  <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Step 2 — Date & Time</p>
                </div>

                <div className="space-y-10">
                  <div className="relative group">
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-accent-gold mb-3 block ml-2">Preferred Date</label>
                    <div className="relative bg-white/5 rounded-3xl border border-white/5 p-4 flex items-center gap-4 group-focus-within:border-accent-gold transition-colors">
                      <span className="material-symbols-outlined text-accent-gold">calendar_month</span>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="flex-1 bg-transparent text-lg font-bold outline-none text-white selection:bg-accent-gold"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-accent-gold mb-4 block ml-2">Available Slots</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map(t => (
                        <button
                          key={t}
                          onClick={() => setTime(t)}
                          className={`py-5 rounded-2xl font-black text-sm transition-all duration-300 border-2 ${time === t
                            ? 'bg-accent-gold border-accent-gold text-primary shadow-xl shadow-accent-gold/20'
                            : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-16 flex flex-col gap-4">
                  <button
                    onClick={nextStep}
                    className="w-full bg-white text-primary font-black py-5 rounded-3xl shadow-xl active:scale-95 transition-all text-sm tracking-widest"
                  >
                    CONTINUE
                  </button>
                  <button
                    onClick={prevStep}
                    className="w-full py-2 text-white/30 text-[10px] font-black tracking-widest uppercase hover:text-white/60 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="px-6 py-6"
              >
                <div className="mb-10 text-center">
                  <h3 className="text-3xl font-black tracking-tighter mb-2">Final Details</h3>
                  <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Step 3 — Personalization</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-3xl border border-white/5 p-1 px-4 focus-within:border-accent-gold transition-colors">
                      <label className="text-[9px] uppercase font-black tracking-widest text-accent-gold pt-2 block">Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent p-2 pb-3 text-lg font-bold outline-none text-white border-none focus:ring-0"
                        placeholder="Nuno Monteiro"
                      />
                    </div>
                    <div className="bg-white/5 rounded-3xl border border-white/5 p-1 px-4 focus-within:border-accent-gold transition-colors">
                      <label className="text-[9px] uppercase font-black tracking-widest text-accent-gold pt-2 block">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent p-2 pb-3 text-lg font-bold outline-none text-white border-none focus:ring-0"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-[32px] border border-white/5 p-1 px-4 focus-within:border-accent-gold transition-colors">
                    <label className="text-[9px] uppercase font-black tracking-widest text-accent-gold pt-3 block">Special Occasion / Allergies</label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full bg-transparent p-2 pb-4 text-base font-semibold outline-none text-white/90 min-h-[140px] resize-none border-none focus:ring-0"
                      placeholder="Birthdays, anniversaries, or ingredient sensitivities..."
                    />
                  </div>
                </div>

                <div className="mt-16 flex flex-col gap-4">
                  <button
                    onClick={handleBooking}
                    disabled={loading || !name || !email}
                    className="w-full bg-accent-gold text-primary font-black py-5 rounded-3xl shadow-2xl shadow-accent-gold/20 active:scale-95 transition-all text-sm tracking-widest disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden relative"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'COMPLETE REQUEST'
                    )}
                  </button>
                  <button
                    onClick={prevStep}
                    className="w-full py-2 text-white/30 text-[10px] font-black tracking-widest uppercase hover:text-white/60 transition-colors"
                  >
                    Review Schedule
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Navigation />
      </div>
    </MemberGate>
  );
};

export default BookingScreen;
