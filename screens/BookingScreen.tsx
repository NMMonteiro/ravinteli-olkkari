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
      alert('Something went wrong. Please try again.');
    } else {
      // Send notification to the restaurant
      const bookingHtml = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #C5A059; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #502025; padding: 20px; text-align: center;">
            <h1 style="color: #C5A059; margin: 0;">New Reservation Request</h1>
          </div>
          <div style="padding: 30px; background-color: #fff; line-height: 1.6;">
            <p><strong>A new booking inquiry has been received:</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px;">👤 <strong>Customer:</strong> ${name} (${email})</li>
              <li style="margin-bottom: 10px;">📅 <strong>Date:</strong> ${date}</li>
              <li style="margin-bottom: 10px;">⏰ <strong>Time:</strong> ${time}</li>
              <li style="margin-bottom: 10px;">👥 <strong>Guests:</strong> ${guests}</li>
            </ul>
            ${comments ? `<p><strong>Special Requests:</strong> ${comments}</p>` : ''}
            <p style="margin-top: 30px; font-size: 11px; color: #666;">Sent from Olkkari Society App</p>
          </div>
        </div>
      `;

      try {
        await supabase.functions.invoke('onesignal-email', {
          body: {
            email: 'ps.olkkari@gmail.com', // Notification address
            subject: `New Request: ${name} - ${date} @ ${time}`,
            body: bookingHtml,
            name: "Internal Notification"
          }
        });

        // Also send a shorter confirmation to the customer
        const customerHtml = `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #C5A059; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #502025; padding: 20px; text-align: center;">
              <h1 style="color: #C5A059; margin: 0;">Olkkari Reservation</h1>
            </div>
            <div style="padding: 30px; background-color: #fff;">
              <p>Dear ${name},</p>
              <p>We've received your inquiry for <strong>${date} at ${time}</strong>.</p>
              <div style="margin: 25px 0; padding: 20px; background-color: #fcf8e3; border: 1px solid #faebcc; border-radius: 8px; color: #8a6d3b; text-align: left;">
                <p style="margin: 0; font-weight: bold;">⚠️ Please Note:</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Your reservation is <strong>NOT confirmed</strong> yet. Our staff will contact you shortly to finalize your booking.</p>
              </div>
              <p style="margin-top: 30px;">Warmly,<br/>The Olkkari Team</p>
            </div>
          </div>
        `;

        await supabase.functions.invoke('onesignal-email', {
          body: {
            email: email,
            subject: `Reservation Inquiry Received - Ravinteli Olkkari`,
            body: customerHtml,
            name: "Customer Confirmation"
          }
        });
      } catch (err) {
        console.error('Email error:', err);
      }

      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-white font-display flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 bg-accent-gold/20 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-accent-gold text-4xl animate-bounce">mark_email_read</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Request Sent!</h2>
        <p className="text-white font-medium mb-4">We've received your inquiry for<br />{date} at {time}.</p>
        <div className="bg-primary/20 border border-accent-gold/30 p-5 rounded-2xl mb-8 max-w-sm">
          <p className="text-accent-gold text-sm font-bold uppercase tracking-widest mb-1.5 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">warning</span>
            Important
          </p>
          <p className="text-white/80 text-sm leading-relaxed">
            Your reservation is <span className="text-accent-gold font-bold underline">not confirmed</span> until our team contacts you personally.
          </p>
        </div>
        <button
          onClick={() => navigate('/home')}
          className="w-full bg-accent-gold text-primary font-bold py-4 rounded-xl shadow-lg shadow-accent-gold/20 hover:opacity-90 transition-all uppercase tracking-widest"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <MemberGate title="Reserve Your Table" description="Table reservations are an exclusive benefit for our registered members.">
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-white font-display pb-24">
        <Header onOpenMenu={onOpenMenu} title="Reservations" />

        <div className="px-6 pt-8 pb-4">
          <h3 className="text-white text-3xl font-extrabold leading-tight tracking-tight">Find your spot at our table</h3>
          <p className="text-white/60 text-base mt-2">Welcome home to Ravinteli Olkkari</p>
        </div>

        <div className="space-y-8 overflow-y-auto max-h-[calc(100vh-200px)] no-scrollbar pb-10">
          <div className="px-6 space-y-5">
            <div>
              <label className="block text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-2 px-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-primary/20 border border-white/10 rounded-xl p-4 text-white text-base focus:border-accent-gold outline-none h-14 transition-colors"
                placeholder="e.g. Pekka Puupää"
              />
            </div>
            <div>
              <label className="block text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-2 px-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-primary/20 border border-white/10 rounded-xl p-4 text-white text-base focus:border-accent-gold outline-none h-14 transition-colors"
                placeholder="pekka@example.com"
              />
            </div>
          </div>

          <div className="px-6">
            <h3 className="text-white text-xl font-bold tracking-tight mb-4">Number of Guests</h3>
            <div className="flex items-center gap-4 bg-primary/20 p-5 rounded-2xl border border-white/10">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="size-12 rounded-full border border-accent-gold flex items-center justify-center text-accent-gold hover:bg-accent-gold/10 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">remove</span>
              </button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-black text-accent-gold">{guests}</span>
                <span className="text-sm font-bold text-white/40 ml-2 uppercase tracking-widest">Guests</span>
              </div>
              <button
                onClick={() => setGuests(guests + 1)}
                className="size-12 rounded-full border border-accent-gold flex items-center justify-center text-accent-gold hover:bg-accent-gold/10 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">add</span>
              </button>
            </div>
          </div>

          <div className="px-6">
            <h3 className="text-white text-xl font-bold tracking-tight mb-4">Select Date</h3>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-primary/20 border border-white/10 rounded-xl p-4 text-white text-base focus:border-accent-gold outline-none h-14 transition-colors"
                style={{ colorScheme: 'dark' }}
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none text-2xl font-bold">
                calendar_today
              </span>
            </div>
          </div>

          <div className="px-6">
            <h3 className="text-white text-xl font-bold tracking-tight mb-4">Select Time</h3>
            <div className="grid grid-cols-3 gap-3">
              {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(t => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`py-4 rounded-xl border text-sm font-black transition-all ${time === t ? 'border-accent-gold bg-accent-gold/20 text-accent-gold shadow-lg shadow-accent-gold/10' : 'border-white/5 bg-white/5 text-white/50'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-bold tracking-tight">Special Requests</h3>
              <span className="text-white/30 text-[10px] uppercase font-bold tracking-[0.2em] px-2">Optional</span>
            </div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full bg-primary/20 border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-white/20 focus:border-accent-gold outline-none min-h-[120px] transition-colors resize-none"
              placeholder="Tell us about allergies, birthdays, or specific table preferences..."
            ></textarea>
          </div>

          <div className="px-6 pb-12">
            <button
              onClick={handleBooking}
              disabled={loading}
              className="w-full bg-accent-gold text-primary font-black py-5 rounded-xl shadow-xl shadow-accent-gold/20 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Dispatching...</span>
                </>
              ) : (
                'Confirm Request'
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
