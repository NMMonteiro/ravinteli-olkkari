import React, { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { EventItem } from '../types';

const EventsScreen: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-white flex flex-col">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div onClick={() => navigate(-1)} className="text-primary dark:text-white flex size-12 shrink-0 items-center cursor-pointer">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </div>
          <h2 className="text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Upcoming Events</h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex size-12 cursor-pointer items-center justify-center rounded-lg bg-transparent text-primary dark:text-white">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <section className="px-4 pt-4">
          <h1 className="text-primary dark:text-white tracking-tight text-[28px] font-bold leading-tight">Olkkari Live from Helsinki</h1>
          <p className="text-gray-600 dark:text-[#bba0a2] text-sm mt-1">Experience the city's finest live sessions in our cozy living room.</p>
        </section>

        <section className="flex gap-3 p-4 overflow-x-auto no-scrollbar">
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary text-white px-5">
            <p className="text-sm font-medium leading-normal">Music Nights</p>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-200 dark:bg-[#3f2c2e] text-primary dark:text-white px-5">
            <p className="text-sm font-medium leading-normal">Culinary Nights</p>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-200 dark:bg-[#3f2c2e] text-primary dark:text-white px-5">
            <p className="text-sm font-medium leading-normal">Art & Culture</p>
          </div>
        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-accent-gold font-medium animate-pulse">Loading Events...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 p-4">
            {events.map((event) => (
              <div key={event.id} className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden bg-white dark:bg-card-dark shadow-lg ring-1 ring-black/5">
                <div
                  className="relative w-full aspect-[16/9] bg-center bg-no-repeat bg-cover"
                  style={{ backgroundImage: `url("${event.image}")` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  {event.isTonight && (
                    <div className="absolute top-3 left-3 bg-accent-gold text-black text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Tonight</div>
                  )}
                </div>
                <div className="flex flex-col gap-1 p-4">
                  <p className="text-primary dark:text-white text-xl font-bold leading-tight tracking-tight">{event.title}</p>
                  <p className="text-accent-gold text-sm font-semibold mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    {event.date} • {event.time}
                  </p>
                  <p className="text-gray-600 dark:text-[#bba0a2] text-sm font-normal leading-relaxed mt-1">
                    {event.description}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 bg-gray-100 dark:bg-[#3f2c2e] text-primary dark:text-white gap-2 text-xs font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                      <span>Calendar</span>
                    </button>
                    <button onClick={() => navigate('/booking')} className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 bg-accent-gold text-black gap-2 text-xs font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[18px]">restaurant</span>
                      <span>Book Table</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default EventsScreen;

