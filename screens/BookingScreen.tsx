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
  const [date, setDate] = useState('2023-11-05');
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
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-white font-display flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 bg-accent-gold/20 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-accent-gold text-4xl">check_circle</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Table Reserved!</h2>
        <p className="text-white/60 mb-8 font-medium">We've sent a confirmation to {email}.<br />See you on {date} at {time}!</p>
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

        <div className="px-4 pt-6 pb-2">
          <h3 className="text-white text-2xl font-bold leading-tight">Find your spot at our table</h3>
          <p className="text-white/60 text-sm mt-1">Welcome home to Ravinteli Olkkari</p>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] no-scrollbar">
          <div className="px-4 pt-4 space-y-4">
            <div>
              <label className="block text-white/60 text-[10px] uppercase font-bold tracking-widest mb-2 px-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-primary/20 border border-primary/30 rounded-xl p-4 text-white text-sm focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none h-14"
                placeholder="e.g. Pekka Puupää"
              />
            </div>
            <div>
              <label className="block text-white/60 text-[10px] uppercase font-bold tracking-widest mb-2 px-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-primary/20 border border-primary/30 rounded-xl p-4 text-white text-sm focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none h-14"
                placeholder="pekka@example.com"
              />
            </div>
          </div>

          <div className="px-4">
            <h3 className="text-white text-lg font-bold tracking-tight mb-4">Number of Guests</h3>
            <div className="flex items-center gap-4 bg-primary/20 p-4 rounded-xl border border-primary/30">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="size-10 rounded-full border border-accent-gold flex items-center justify-center text-accent-gold hover:bg-accent-gold/10"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-accent-gold">{guests}</span>
                <span className="text-sm text-white/60 ml-1">Guests</span>
              </div>
              <button
                onClick={() => setGuests(guests + 1)}
                className="size-10 rounded-full border border-accent-gold flex items-center justify-center text-accent-gold hover:bg-accent-gold/10"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>

          <div className="px-4">
            <h3 className="text-white text-lg font-bold tracking-tight mb-3">Select Date</h3>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-primary/20 border border-primary/30 rounded-xl p-4 text-white text-sm focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none h-14 flex flex-row-reverse justify-end gap-3"
            />
          </div>

          <div className="px-4">
            <h3 className="text-white text-lg font-bold tracking-tight mb-3">Select Time</h3>
            <div className="grid grid-cols-3 gap-3">
              {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(t => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${time === t ? 'border-accent-gold bg-accent-gold/10 text-accent-gold shadow-md shadow-accent-gold/10' : 'border-primary/30 text-white/80'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-lg font-bold tracking-tight">Special Requests</h3>
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest px-1">Optional</span>
            </div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full bg-primary/20 border border-primary/30 rounded-xl p-4 text-white text-sm placeholder:text-white/30 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none min-h-[100px]"
              placeholder="Tell us about allergies, birthdays, or specific table preferences..."
            ></textarea>
          </div>

          <div className="px-4 pb-8">
            <button
              onClick={handleBooking}
              disabled={loading}
              className="w-full bg-accent-gold text-primary font-bold py-4 rounded-xl shadow-lg shadow-accent-gold/20 active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Reserving...</span>
                </>
              ) : (
                'Confirm Reservation'
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
