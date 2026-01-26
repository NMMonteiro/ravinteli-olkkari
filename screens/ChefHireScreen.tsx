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

                  <button className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-accent-gold hover:text-primary hover:border-accent-gold transition-all uppercase tracking-widest text-xs">
                    Inquire Availability
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Navigation />
      </div>
    </MemberGate>
  );
};

export default ChefHireScreen;
