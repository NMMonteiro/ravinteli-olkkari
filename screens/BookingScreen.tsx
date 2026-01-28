import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { LOGO_URL } from '../constants';
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

  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(eventDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState(eventTitle ? `Reservation for: ${eventTitle}` : '');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email ?? '');
      // If you have a profile table, you could fetch the name here.
      // For now, we'll see if full_name is in user_metadata
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

    const { error } = await supabase.from('bookings').insert([
      {
        customer_name: name,
        email: email,
        guests: guests,
        date: date,
        time: time,
        special_requests: comments,
        user_id: user?.id // Link booking to the authenticated user
      }
    ]);

    if (error) {
      console.error('Booking error:', error);
      alert('Network error. Please try again.');
    } else {
      const ABSOLUTE_LOGO_URL = 'https://ravinteli-olkkari.vercel.app/assets/logo/Olkkari-simple.png';

      const emailStyles = `
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        color: #ffffff;
        line-height: 1.6;
      `;

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

      try {
        await supabase.functions.invoke('gmail-smtp', {
          body: { to: 'ps.olkkari@gmail.com', subject: `Booking: ${name} - ${date}`, body: notificationHtml }
        });
        await supabase.functions.invoke('gmail-smtp', {
          body: { to: email, subject: `Reservation Inquiry Received - Ravinteli Olkkari`, body: confirmationHtml }
        });
      } catch (e) {
        console.error('SMTP Error:', e);
      }

      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-white font-display flex flex-col items-center justify-center p-6 text-center">
        <div className="size-24 bg-accent-gold/20 rounded-full flex items-center justify-center mb-8 border border-accent-gold/40">
          <span className="material-symbols-outlined text-accent-gold text-5xl">inventory_2</span>
        </div>
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Request Logged</h2>
        <p className="text-white/80 text-lg mb-8 max-w-xs mx-auto">
          We have received your inquiry for <strong>{date}</strong>. Our team will review availability and contact you shortly.
        </p>

        <div className="bg-primary/30 border border-accent-gold/30 p-6 rounded-2xl mb-10 w-full max-w-sm">
          <h4 className="text-accent-gold font-bold uppercase tracking-widest text-xs mb-2">PLEASE NOTE</h4>
          <p className="text-white/90 text-sm leading-relaxed">
            Please don't consider your reservation confirmed until you receive a formal reply from us.
          </p>
        </div>

        <button
          onClick={() => navigate('/home')}
          className="w-full bg-accent-gold text-primary font-bold py-5 rounded-xl shadow-2xl active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-sm"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <MemberGate title="Table Reservation" description="Exclusive booking service for our Society members.">
      <div className="min-h-screen text-white font-display pb-24">
        <Header onOpenMenu={onOpenMenu} title="Reservations" />

        <div className="px-6 pt-10 pb-6">
          <h3 className="text-white text-3xl font-black leading-tight tracking-tight">
            {eventTitle ? 'Reserve for Event' : 'Find your spot at our table'}
          </h3>
          <p className="text-white/60 text-lg mt-2">
            {eventTitle ? `Booking for: ${eventTitle}` : 'Welcome home to Ravinteli Olkkari'}
          </p>
        </div>

        <div className="space-y-8 px-6">
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-primary/20 border border-white/5 rounded-2xl p-4 h-16 text-white focus:border-accent-gold outline-none"
              placeholder="Full Name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-primary/20 border border-white/5 rounded-2xl p-4 h-16 text-white focus:border-accent-gold outline-none"
              placeholder="Email Address"
            />
          </div>

          <div>
            <h3 className="text-white font-bold opacity-40 uppercase tracking-[0.2em] text-[10px] mb-3 ml-1">Number of Guests</h3>
            <div className="flex items-center gap-6 bg-primary/20 p-5 rounded-2xl border border-white/5">
              <button onClick={() => setGuests(Math.max(1, guests - 1))} className="size-12 rounded-full border border-accent-gold flex items-center justify-center text-accent-gold">
                <span className="material-symbols-outlined">remove</span>
              </button>
              <div className="flex-1 text-center">
                <span className="text-4xl font-black text-accent-gold">{guests}</span>
              </div>
              <button onClick={() => setGuests(guests + 1)} className="size-12 rounded-full border border-accent-gold flex items-center justify-center text-accent-gold">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-white font-bold opacity-40 uppercase tracking-[0.2em] text-[10px] mb-3 ml-1">Select Date</h3>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-primary/20 border border-white/5 rounded-2xl p-4 h-16 text-white focus:border-accent-gold outline-none"
                  style={{ colorScheme: 'dark' }}
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl pointer-events-none font-bold">
                  calendar_today
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold opacity-40 uppercase tracking-[0.2em] text-[10px] mb-3 ml-1">Select Time</h3>
              <div className="grid grid-cols-3 gap-3">
                {['17:00', '18:00', '19:00', '20:00', '21:00'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`py-4 rounded-xl border font-bold transition-all ${time === t ? 'border-accent-gold bg-accent-gold/20 text-accent-gold shadow-lg shadow-accent-gold/10' : 'border-white/5 text-white/40'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold opacity-40 uppercase tracking-[0.2em] text-[10px] mb-3 ml-1">Special Occasion</h3>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full bg-primary/20 border border-white/5 rounded-2xl p-4 text-white focus:border-accent-gold outline-none h-32 resize-none"
              placeholder="Allergies, birthdays, or preferences..."
            />
          </div>

          <div className="pb-10">
            <button
              onClick={handleBooking}
              disabled={loading}
              className="w-full bg-accent-gold text-primary font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                'Request Table'
              )}
            </button>
          </div>
        </div>

        <Navigation />
      </div>
    </MemberGate>
  );
};

export default BookingScreen;
