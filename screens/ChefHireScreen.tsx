import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../constants';
import { Navigation } from '../components/Navigation';
import { supabase } from '../supabase';
import { StaffMember } from '../types';

const ChefHireScreen: React.FC = () => {
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
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-white font-display pb-24">
      <header className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-white/10">
        <div onClick={() => navigate(-1)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Hire a Chef & Bartender</h2>
        <div className="size-10 flex items-center justify-center cursor-pointer">
          <span className="material-symbols-outlined">info</span>
        </div>
      </header>

      <div className="px-4 pt-6">
        <h1 className="text-3xl font-bold text-white mb-2">Private Culinary Experience</h1>
        <p className="text-[#bba0a2] text-sm leading-relaxed">Bring the refined atmosphere of Ravinteli Olkkari to your own living room with our professional staff.</p>
      </div>

      <div className="pt-6">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Our Professional Staff</h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="w-8 h-8 border-3 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-accent-gold text-sm animate-pulse">Meeting the team...</p>
          </div>
        ) : (
          staffList.map(staff => (
            <div key={staff.id} className="px-4 py-2">
              <div className="flex flex-col items-stretch justify-start rounded-xl shadow-xl bg-burgundy-accent overflow-hidden border border-white/5">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                  style={{ backgroundImage: `url("${staff.image}")` }}
                ></div>
                <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 px-4">
                  <div className="flex justify-between items-start">
                    <p className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">{staff.name}</p>
                    {staff.badge && <span className="text-xs bg-primary px-2 py-1 rounded-full text-white uppercase tracking-wider font-bold">{staff.badge}</span>}
                  </div>
                  <div className="flex flex-col gap-2 mt-1">
                    <p className="text-[#bba0a2] text-sm font-medium">{staff.role}</p>
                    <p className="text-[#d1c1c2] text-sm font-normal leading-relaxed">{staff.description}</p>
                  </div>
                  <div className="flex items-center gap-3 justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex flex-col">
                      <p className="text-white font-bold">{staff.rate}<span className="text-xs font-normal text-[#bba0a2]">/hr</span></p>
                    </div>
                    <button className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal hover:opacity-90 active:scale-95">
                      Select Staff
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-4">Schedule Your Event</h3>
        <div className="px-4 overflow-x-auto no-scrollbar flex gap-3 pb-6">
          <div className="flex flex-col items-center justify-center min-w-[64px] h-20 rounded-xl bg-primary border border-primary/20 cursor-pointer">
            <span className="text-[10px] uppercase font-bold text-white/70">Oct</span>
            <span className="text-xl font-bold text-white">24</span>
            <span className="text-[10px] font-medium text-white/70">Thu</span>
          </div>
          {[25, 26, 27, 28].map(d => (
            <div key={d} className="flex flex-col items-center justify-center min-w-[64px] h-20 rounded-xl bg-burgundy-accent border border-white/10 cursor-pointer hover:border-primary/50">
              <span className="text-[10px] uppercase font-bold text-white/50">Oct</span>
              <span className="text-xl font-bold text-white">{d}</span>
              <span className="text-[10px] font-medium text-white/50">Day</span>
            </div>
          ))}
        </div>

        <div className="px-4 pb-8">
          <p className="text-white text-sm font-bold mb-3">Custom Experience Menu</p>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-burgundy-accent rounded-xl border border-white/5 cursor-pointer hover:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWlGXH0kWinyz1VlACIbjmCTLgFSbySgwoE6WcuuTWbsek_wsRxJVISBzGTATqtOMtoZ96JIfr_1-IkSLBtFMa2H2_VA33lE4daFsQIPepi_uGoxlxPJ4gaYiZBZ3WfnDR8fbM1iy7CJ1yVhTvzzk33VVhVVbxxKybFH8yNIVmzTF4wKXYSGd9h4OHDx0eUPD6fEGkii3dlgN3bjaMt8yPq_LEVG4s-NnCM4K14MxzD5h1DPeoewgbaw0mIauC_Peyk4oLF9MqAIc")' }}></div>
                <div>
                  <p className="text-sm font-bold text-white">Olkkari Wagyu Sliders</p>
                  <p className="text-xs text-[#bba0a2]">Signature Appetizer</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-600 bg-transparent text-primary focus:ring-primary" />
            </label>
            <label className="flex items-center justify-between p-4 bg-burgundy-accent rounded-xl border border-white/5 cursor-pointer hover:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBErkwvYkXpOX5NPHCWb5aMotKPiRYPWm22P4LpeqbeXqLH3L5XMGU12rOsxJuSEfKmtXMEYx4rZNwZTEANI0yJYgQm1eBqyxzCkqG-sbVzR9djk5T5tFDBzemcubagE92jIM4EFyYWnxjxsOz-kpme27B8DZORzFU_79jj4HnT525vF5K_EsMck9HHQFMiXP4uGJPHQI2j9nr4HVVr7VV5ou7FpWsxp_W6MotVWJeXllb4qQc8tIUfdwCf60RnShVCMKYadgJmpJY")' }}></div>
                <div>
                  <p className="text-sm font-bold text-white">Wild Sea Bass Carpaccio</p>
                  <p className="text-xs text-[#bba0a2]">Cold Starter</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-gray-600 bg-transparent text-primary focus:ring-primary" />
            </label>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-4 py-4 bg-background-dark/80 backdrop-blur-lg border-t border-white/5 z-40">
        <button className="w-full bg-primary text-white font-bold h-14 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98]">
          <span>Confirm Selection</span>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <Navigation />
    </div>
  );
};

export default ChefHireScreen;

