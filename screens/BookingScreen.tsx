import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { LOGO_URL } from '../constants';
import { Header } from '../components/Header';
import { MemberGate } from '../components/MemberGate';
import { Navigation } from '../components/Navigation';

interface BookingScreenProps {
  onOpenMenu: () => void;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleBooking = async () => {
    if (!name || !email) {
      alert('Please provide your name and email');
      return;
    }

    setLoading(true);

    // 1. Save to DB
    const { error } = await supabase.from('bookings').insert([
      {
        customer_name: name,
        email: email,
        guests: guests,
        date: date,
        time: time,
        special_requests: comments
      }
    ]);

    if (error) {
      console.error('Booking error:', error);
      alert('Network error. Please try again.');
    } else {
      // 2. Clear HTML templates for Gmail SMTP
      const notificationHtml = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #C5A059; border-radius: 12px; background-color: #fcfcfc;">
          <h2 style="color: #502025;">New Reservation Request</h2>
          <p><strong>Customer:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Guests:</strong> ${guests}</p>
          <p><strong>Time:</strong> ${date} @ ${time}</p>
          <p><strong>Requests:</strong> ${comments || 'None'}</p>
        </div>
      `;

      const confirmationHtml = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #C5A059; border-radius: 12px;">
          <h2 style="color: #C5A059;">Reservation Inquiry Received</h2>
          <p>We have received your request for ${date} at ${time}.</p>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeeba; color: #856404; margin: 20px 0;">
            <strong>Important:</strong> Please note your reservation is <strong>not confirmed</strong> until we reply directly to this email.
          </div>
          <p>Thank you for choosing Ravinteli Olkkari.</p>
        </div>
      `;

      try {
        // Notify Restaurant
        await supabase.functions.invoke('gmail-smtp', {
          body: { to: 'ps.olkkari@gmail.com', subject: `Booking: ${name} - ${date}`, body: notificationHtml }
        });

        // Notify User
        await supabase.functions.invoke('gmail-smtp', {
          body: { to: email, subject: `Reservation Inquiry - Ravinteli Olkkari`, body: confirmationHtml }
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
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-white font-display pb-24">
        <Header onOpenMenu={onOpenMenu} title="Reservations" />

        <div className="px-6 pt-10 pb-6">
          <h3 className="text-white text-3xl font-black leading-tight tracking-tight">Find your spot at our table</h3>
          <p className="text-white/60 text-lg mt-2">Welcome home to Ravinteli Olkkari</p>
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
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl pointer-events-none">
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
                    className={`py-4 rounded-xl border font-bold transition-all ${time === t ? 'border-accent-gold bg-accent-gold/20 text-accent-gold' : 'border-white/5 text-white/40'}`}
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
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
