import React, { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { EventItem } from '../types';
import { Header } from '../components/Header';
import { AnimatePresence, motion } from 'framer-motion';

interface EventsScreenProps {
  onOpenMenu: () => void;
}

const EventsScreen: React.FC<EventsScreenProps> = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date, time, description, image, type, isTonight:is_tonight')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  const downloadIcs = (event: EventItem) => {
    // 1. Robust Date Parsing
    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12',
      'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12',
      'January': '01', 'February': '02', 'March': '03', 'April': '04', 'June': '06', 'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };

    let year = "2026";
    let month = "01";
    let day = "01";

    if (event.date.includes('-')) {
      const parts = event.date.split('-');
      if (parts.length === 3) [year, month, day] = parts;
    } else {
      const parts = event.date.trim().toUpperCase().split(/[\s,]+/);
      for (const part of parts) {
        if (months[part]) {
          month = months[part];
        } else {
          const num = part.replace(/\D/g, '');
          if (num && num.length <= 2) {
            day = num.padStart(2, '0');
          }
        }
      }
    }

    const dateStr = `${year}${month}${day}`;

    // 2. Time Logic
    let [hours, minutes] = event.time.split(':');
    if (!hours) hours = "19";
    if (!minutes) minutes = "00";
    hours = hours.trim().padStart(2, '0');
    minutes = minutes.trim().padStart(2, '0');

    const startDateTime = `${dateStr}T${hours}${minutes}00`;
    let endHoursNum = parseInt(hours) + 2;
    if (endHoursNum >= 24) endHoursNum = 23;
    const endDateTime = `${dateStr}T${endHoursNum.toString().padStart(2, '0')}${minutes}00`;

    // 3. Proper RFC5545 Formatting
    const sanitize = (str: string) => (str || '').replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');

    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'PRODID:-//Ravinteli Olkkari//NONSGML v1.0//EN',
      'BEGIN:VEVENT',
      `UID:event-${event.id}-${Date.now()}@ravinteli-olkkari.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE-TIME:${startDateTime}`,
      `DTEND;VALUE=DATE-TIME:${endDateTime}`,
      `SUMMARY:${sanitize(event.title)}`,
      `DESCRIPTION:${sanitize(event.description)}`,
      'LOCATION:Ravinteli Olkkari\\, Helsinki',
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    const icsContent = icsLines.join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="min-h-screen text-white font-display pb-20">
      <Header onOpenMenu={onOpenMenu} title="What's On" />

      <main className="flex-1 overflow-y-auto pb-24">
        <section className="px-8 pt-8 text-center text-balance">
          <h1 className="text-white tracking-tight text-3xl font-black leading-tight">Olkkari Live</h1>
          <p className="text-warm-ivory/60 text-sm mt-2 max-w-[280px] mx-auto leading-relaxed">Experience Helsinki's finest live sessions in our society living room.</p>
        </section>

        <section className="flex flex-wrap justify-center gap-2 p-6">
          <button className="h-9 items-center justify-center rounded-full bg-accent-gold text-primary px-5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-accent-gold/20">
            All Events
          </button>
          <button className="h-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-warm-ivory/40 px-5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
            Music
          </button>
          <button className="h-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-warm-ivory/40 px-5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
            Tastings
          </button>
        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-accent-gold font-medium animate-pulse">Loading Events...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto"
          >
            <AnimatePresence>
              {events.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden bg-burgundy-accent/20 backdrop-blur-md shadow-2xl border border-white/5"
                >
                  <div
                    className="relative w-full aspect-[16/9] bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: `url("${event.image}")` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    {event.isTonight && (
                      <div className="absolute top-3 left-3 bg-accent-gold text-black text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-lg">Tonight</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 p-5">
                    <p className="text-white text-xl font-bold leading-tight tracking-tight uppercase italic">{event.title}</p>
                    <p className="text-accent-gold text-xs font-black mt-1 flex items-center gap-1 uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {event.date} • {event.time}
                    </p>
                    <p className="text-warm-ivory/60 text-xs font-montserrat font-light leading-relaxed mt-2 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => downloadIcs(event)}
                        className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-12 bg-white/5 border border-white/10 text-white gap-2 text-[10px] font-black uppercase tracking-[0.2em] active:bg-white/10 transition-all shadow-md"
                      >
                        <span className="material-symbols-outlined text-[18px] text-accent-gold">calendar_add_on</span>
                        <span>Calendar</span>
                      </button>
                      <button
                        onClick={() => {
                          const monthsMap: Record<string, string> = {
                            'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
                            'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
                          };
                          let passDate = event.date;
                          if (!passDate.includes('-')) {
                            const parts = passDate.trim().toUpperCase().split(/[\s,]+/);
                            let m = '01';
                            let d = '01';

                            // Find month and day in parts
                            for (const part of parts) {
                              if (monthsMap[part]) {
                                m = monthsMap[part];
                              } else {
                                const num = part.replace(/\D/g, '');
                                if (num && num.length <= 2) {
                                  d = num.padStart(2, '0');
                                }
                              }
                            }
                            passDate = `2026-${m}-${d}`;
                          }
                          navigate('/booking', { state: { eventDate: passDate, eventTitle: event.title } });
                        }}
                        className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-12 bg-accent-gold text-primary gap-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-accent-gold/20 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">restaurant</span>
                        <span>Book Table</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default EventsScreen;
