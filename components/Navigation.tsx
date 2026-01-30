import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItemProps {
  icon: string;
  label: string;
  route: string;
  active: boolean;
  onClick: () => void;
  filled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, route, active, onClick, filled }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors duration-200 ${active ? 'text-accent-gold' : 'text-white/40'}`}
  >
    <span
      className={`material-symbols-outlined text-[24px] ${filled && active ? 'fill-1' : ''}`}
    >
      {icon}
    </span>
    <span className={`text-[10px] uppercase font-montserrat font-light tracking-[0.2em] ${active ? 'font-bold' : ''}`}>
      {label}
    </span>
  </button>
);

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navs = [
    { label: 'Home', icon: 'home', route: '/home' },
    { label: 'Menu', icon: 'restaurant_menu', route: '/menu', filled: true },
    { label: 'Events', icon: 'event', route: '/events', filled: true },
    { label: 'Booking', icon: 'book_online', route: '/booking' },
    { label: 'Loyalty', icon: 'loyalty', route: '/loyalty', filled: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-t border-white/5 pb-6 pt-2 px-6">
      <div className="flex justify-around items-center max-w-2xl mx-auto">
        {navs.map((nav) => (
          <NavItem
            key={nav.label}
            {...nav}
            active={location.pathname === nav.route}
            onClick={() => navigate(nav.route)}
          />
        ))}
      </div>
    </nav>
  );
};
