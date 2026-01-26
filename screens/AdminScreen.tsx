import React from 'react';
import { Navigation } from '../components/Navigation';

const AdminScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display pb-24">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 ios-blur border-b border-primary/10 dark:border-white/5">
        <div className="flex items-center p-4 pb-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 rounded-full p-0.5 border border-accent-gold/30">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDjfjLsbKyqfRXmNe77xpKGgCrqGSyn8T3Jyp7jY1CLJDJjXSFHe3obnwR6nOa8r62qiXy6hof9M6y06mAkvKlC4Ix3xqgiU3fkhizm9LkTPGV2oE6Fc8BEtExKJUrl6LsZS7Z6ttF6yE7doOBMDWx_pffxVe5fpdbZI4bdSqfIzLstVG-C0dXp3-fHzkGQLGhVOaYGw3bRp4LpbC81EPFjN-S4khHXCuvnK8wQ0uNKyzdX1_vabNSUSeYEMGkXfG6fqW73-ei0oOk")' }}
              ></div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-accent-gold font-bold">Manager</p>
              <h1 className="text-lg font-bold leading-tight">Olkkari Dashboard</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex size-10 items-center justify-center rounded-full bg-primary/10 dark:bg-white/5 text-accent-gold border border-white/5">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <main className="overflow-x-hidden">
        <div className="flex overflow-x-auto gap-4 p-4 no-scrollbar">
          <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-4 bg-primary text-white shadow-lg border border-accent-gold/20">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-accent-gold text-lg">loyalty</span>
              <span className="text-[10px] font-bold text-accent-gold bg-white/10 px-1.5 py-0.5 rounded">+12%</span>
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Redeemed</p>
              <p className="text-2xl font-bold leading-tight">124</p>
            </div>
          </div>
          <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-4 bg-card-dark border border-white/5">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-accent-gold text-lg">calendar_today</span>
              <span className="text-[10px] font-bold text-accent-gold bg-accent-gold/10 px-1.5 py-0.5 rounded">+5%</span>
            </div>
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Bookings</p>
              <p className="text-2xl font-bold leading-tight">42</p>
            </div>
          </div>
          <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-4 bg-card-dark border border-white/5">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-accent-gold text-lg">event</span>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded">-2%</span>
            </div>
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Active</p>
              <p className="text-2xl font-bold leading-tight">3</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-white text-xl font-bold tracking-tight">Pending Loyalty</h2>
            <button className="text-accent-gold text-xs font-semibold uppercase tracking-wider">View All</button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-4 bg-card-dark/50 p-3 rounded-xl border border-white/5">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg h-12 w-12 border border-accent-gold/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRD6KGfjm_GIT90NTzbg13MpUinpHWtEAtIvbZmKIqGQYaF6Z0q2kCt_mrXtghmkAwLKL6_QVqPHJ8xMUP4FuSc2nEmfgd9jWUQvbevU8C_fvcVWZwF1PXXpW-w1ce8TPxhD3WR8ug42ZISIt-EloLqn4qQG6XOyO7V_RFKPpf7NZTKn7_EhoyiLdLUZFRGT5ruUlsHUfv-R_GLJ288ZUZrl3r9TSvzzkBPFvCleatKjVh9bnl18hMDZa6ilXvHRanT-C_F0S0nU0")' }}></div>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">Timo Virtanen</p>
                <p className="text-white/50 text-xs mt-0.5">Free Craft Beer</p>
              </div>
              <div className="flex gap-2">
                <button className="flex h-8 px-3 items-center justify-center rounded-lg bg-accent-gold text-primary text-[11px] font-bold uppercase tracking-wider">Approve</button>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-card-dark/50 p-3 rounded-xl border border-white/5">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg h-12 w-12 border border-accent-gold/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzAS_-RWr9Dw6OR2L7p4LqcktQmytCtRxMvUmsB_bEwU04nDHgOl51SE36ijTwh0QTO1XGmpqzMuytLCijZW7SYxxLj0u4oS8K2VHfmOaLoRqunMIQRGKd_C-O129PYNufDiRjiCheQwAOQvSNjYrYj_lBu3B53WSMziNVQK3abQFS52nbkx59CdqFSm-MQzlc1TJIjfrZaQVCCHRDL-fZ0QTyip3xyhmyeAD7DYp0YTD4wmlZWvfZm7wqpnhQKK2ZXs6wWUZwc28")' }}></div>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">Sari Korhonen</p>
                <p className="text-white/50 text-xs mt-0.5">20% Total Bill</p>
              </div>
              <div className="flex gap-2">
                <button className="flex h-8 px-3 items-center justify-center rounded-lg bg-accent-gold text-primary text-[11px] font-bold uppercase tracking-wider">Approve</button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-white text-xl font-bold tracking-tight">Tonight's Event</h2>
            <button className="flex items-center gap-1 bg-primary/40 text-accent-gold px-3 py-1.5 rounded-full border border-accent-gold/20 text-xs font-bold">
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Event
            </button>
          </div>
          <div className="relative overflow-hidden rounded-2xl aspect-[16/9] group border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCWE1Xi_CjD91bjEporwTdaU06OfVZWh1i4oByHJtlfC7s5T6n52k3RcgakK-ag2f1iC9Vgr8rOLpgWHUue1TEOS0_MY2kP9oU-qsaVuOVT_OvXlww5B9wHRYUmCNaNYYB5kieIiaDYVvey0-BkL8w4RgySow8zsgPCX20vb2pOJRttFb6-_7YSM2TJbtJY-a0rzzHxr_G4Tiz71EFfA5gLZ8jIb7FLwmRtFFDbI8PYXm3AopMo04uPRVgGOTWft4d9gAx1fysj2XE")' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-5 w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-gold"></span>
                </span>
                <span className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.2em]">Live Performance</span>
              </div>
              <h3 className="text-white text-2xl font-bold">Jazz & Negroni Night</h3>
              <p className="text-white/80 text-sm font-medium flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-sm text-accent-gold">person</span>
                Marcus & The Blue Trio
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 mt-8 pb-8">
          <h2 className="text-white text-xl font-bold tracking-tight mb-4">Admin Controls</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-start gap-2 p-4 bg-card-dark rounded-xl border border-white/5 active:scale-95 transition-transform">
              <div className="bg-primary/50 p-2 rounded-lg text-accent-gold">
                <span className="material-symbols-outlined">restaurant_menu</span>
              </div>
              <span className="text-sm font-semibold">Update Menu</span>
            </button>
            <button className="flex flex-col items-start gap-2 p-4 bg-card-dark rounded-xl border border-white/5 active:scale-95 transition-transform">
              <div className="bg-primary/50 p-2 rounded-lg text-accent-gold">
                <span className="material-symbols-outlined">artist</span>
              </div>
              <span className="text-sm font-semibold">Artist Log</span>
            </button>
            <button className="flex flex-col items-start gap-2 p-4 bg-card-dark rounded-xl border border-white/5 active:scale-95 transition-transform">
              <div className="bg-primary/50 p-2 rounded-lg text-accent-gold">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <span className="text-sm font-semibold">Broadcast</span>
            </button>
            <button className="flex flex-col items-start gap-2 p-4 bg-card-dark rounded-xl border border-white/5 active:scale-95 transition-transform">
              <div className="bg-primary/50 p-2 rounded-lg text-accent-gold">
                <span className="material-symbols-outlined">settings</span>
              </div>
              <span className="text-sm font-semibold">Settings</span>
            </button>
          </div>
        </div>
      </main>

      <button className="fixed right-4 bottom-24 bg-accent-gold text-primary shadow-2xl size-14 rounded-full flex items-center justify-center z-40 active:scale-90 transition-transform">
        <span className="material-symbols-outlined text-[28px] font-bold">add</span>
      </button>

      <Navigation />
    </div>
  );
};

export default AdminScreen;
