import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Header } from '../components/Header';
import { motion } from 'framer-motion';

interface HomeCardProps {
  title: string;
  subtitle: string;
  icon: string;
  bgImage: string;
  onClick: () => void;
  extra?: React.ReactNode;
  delay?: number;
}

const HomeCard: React.FC<HomeCardProps> = ({ title, subtitle, icon, bgImage, onClick, extra, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    onClick={onClick}
    className="relative group cursor-pointer overflow-hidden rounded-xl border border-accent-gold/20 shadow-2xl active:scale-[0.98] transition-all duration-200"
  >
    <div
      className="bg-cover bg-center flex flex-col items-stretch justify-end min-h-[160px] h-[20vh] group-hover:scale-105 transition-transform duration-700"
      style={{ backgroundImage: `linear-gradient(0deg, rgba(29, 21, 22, 0.95) 0%, rgba(29, 21, 22, 0.2) 60%), url("${bgImage}")` }}
    >
      <div className="flex w-full items-end justify-between gap-4 p-5">
        <div className="flex flex-col gap-0">
          <p className="text-accent-gold font-montserrat tracking-widest text-3xl font-bold leading-tight uppercase drop-shadow-md">{title}</p>
          <p className="text-white/80 text-sm font-medium leading-normal italic">{subtitle}</p>
        </div>
        {extra || <span className="material-symbols-outlined text-accent-gold text-2xl">{icon}</span>}
      </div>
    </div>
  </motion.div>
);

interface HomeScreenProps {
  onOpenMenu: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenMenu }) => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "MENU",
      subtitle: "Explore our seasonal flavors",
      icon: "restaurant_menu",
      bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTimBzMMsO-OWGwDwMmA6l8m2uC5ld4fh0f095f9vBniwTub0lQXgN34TuavurGM-o8hHEkZjOi9vZmPVCmbRrMGzVT-y63SM7ne9Dhbi3rgvk-Th3XHxRAw_CxsOdWPLcO5nYfptvDc4q17xNmwIkyKLoIna_HH3YImLOymgIuW5mQIWQ9IQ6RkhO9ALPU-RAM76rrwu-BrL2PK51XXZmf9J4NWxyMwKCLM6NULj9ACvvjXn_CTJW4ygSKIQPtB-Y2b6cxSQP7zQ",
      path: "/menu"
    },
    {
      title: "BOOKINGS",
      subtitle: "Reserve your table",
      icon: "calendar_month",
      bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6oQEGVpM0D-t5FjkT07hk6cN2nEmKyh8X2L0zVOecQ-aVVlFhPtMtvvtuYE6DP0hfNZvR7Ofj6jlBKuVxOmHJu9x9DHz0J8Gu2QDcqdrM8X_nKBFXH0ykYLzsIM2Z3Ex-KlA1X7U4WhdbwjsT6juqrj3chDZSXui5sTO9BeFZ5Pb02hjszbOInOyBm9x8tGBItTjUmnpJxTGICMYJPCjWlP3lU-G8LsG8sR1jxRWHCAhwgW_3Ot26sFsYZzyIrJU1fTb7Eo3Vm2w",
      path: "/booking"
    },
    {
      title: "EVENTS",
      subtitle: "Jazz nights & gatherings",
      icon: "confirmation_number",
      bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6IzMrGt3DnrMPaoR9kDDOEB55HDRebU_r88-A3LAuiPefSLHYirMDZYw7r1jKp-pw155ZMUpzlh4ZP2PMMWy12nYW5Xvq60n25jI1d1sbm2lXTtZJVKwIc69hnqOqQKQEM-ZxmSPuo4Af-hsnaGxISz8uDLnFjksmYH3ozAfE01ic9SmZZBu9dK2gtZaToQ6e23ZmJMmN2ea6XxZvR6bkup271RCTc2QoXw_33cJRzyx4zpZB77Z_h7u-IYdzSpLFBEZI92CFDos",
      path: "/events"
    },
    {
      title: "CHEF HIRE",
      subtitle: "Private dining experience",
      icon: "skillet",
      bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ-Cj-r08aJ7X_h6txRrmA94MI4N-ephRQs4J09OYHEW6t1Yu5tgdrsa1eYRsYJzRNtKHNtII1leh4uM5All7rXuCMiBM-ToIHL03jUOa3j1a78p54oJQND2q-FnLV-EZfNaWxzGy-kF4umLhmxSTeAQxtoB17qJ-sDsgm4I18QTuGjq-RrNmlVLaNvUFVhO3eALZhFB14j1XfYTHAPxLJ7c_7TXpx6swgzB1t9myJyAYVf2NrAJZourF2rL6PYX1dsl1mY4AMU-o",
      path: "/chef"
    },
    {
      title: "ART GALLERY",
      subtitle: "Curated local exhibitions",
      icon: "palette",
      bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-YesvGrOTvoLwORvLVjy_dBFEiXt9vQVDrJ8lJKBn5m9L-hnIM1kQH6ycolIqfxKcSpnp3nRToOMwndvZ8dT6AuFyZDDmR85Oq0726PouK5dwi9D0el4v8jLDMvM8vOqz0SGTbj_-aTNmTTjuwjnpaIsgR_h9hSzy_t8-yXD8vKvGrjZo2SrJlOCVnLY_eKjIcqEfaD352ndln96zpldIZ9YvVjVQPXVaTepiLHIWwPab7DW8lvb511ctQRFZkbgRWz500kJt62Q",
      path: "/gallery"
    }
  ];

  return (
    <div className="min-h-screen text-white font-display pb-20">
      <Header onOpenMenu={onOpenMenu} />

      <main className="flex flex-col gap-4 p-4 mt-2">
        {cards.map((card, idx) => (
          <HomeCard
            key={card.title}
            title={card.title}
            subtitle={card.subtitle}
            icon={card.icon}
            bgImage={card.bgImage}
            onClick={() => navigate(card.path)}
            delay={idx * 0.1}
          />
        ))}

        <HomeCard
          title="LOYALTY"
          subtitle="Exclusive member rewards"
          icon=""
          bgImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDNIIII8ywo21-hvgor2z10bU3hnVF0avfXqlxDQ46o2qIGbsN-fH4r3ps5ofXTtM7C-Li_CUGeLyFcettYqLWDpvK-4RwB81kSJ5ispaqh3I1Tc3te5UH3nN91eIdGt-iSy4NqgBHP_KJAoasuFYmMEsi_3T9AmctWBs3kGaxh20kGceazwdInACpLTZd3jlj4c_tkQWtjfeZUKIyo_3yyD1JLK3bWmUWNTUdeIVjerwr82FzQCwrJWCSAbyjKLelxPdCq-S9WFXw"
          onClick={() => navigate('/loyalty')}
          delay={0.6}
          extra={
            <div className="size-14 rounded-full border border-accent-gold/30 bg-accent-gold/20 flex flex-col items-center justify-center shadow-xl shadow-accent-gold/5 backdrop-blur-sm">
              <span className="text-accent-gold text-xs font-black leading-none">1250</span>
              <span className="text-accent-gold/60 text-[6px] font-black uppercase tracking-[0.2em] mt-0.5">PTS</span>
            </div>
          }
        />
      </main>

      <Navigation />
    </div>
  );
};

export default HomeScreen;