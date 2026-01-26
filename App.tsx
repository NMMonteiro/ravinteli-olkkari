import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Import Screens
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import BookingScreen from './screens/BookingScreen';
import EventsScreen from './screens/EventsScreen';
import ChefHireScreen from './screens/ChefHireScreen';
import GalleryScreen from './screens/GalleryScreen';
import LoyaltyScreen from './screens/LoyaltyScreen';
import AdminScreen from './screens/AdminScreen';
import ChatScreen from './screens/ChatScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { ChatWidget } from './components/ChatWidget';

const PageTransition = ({ children }: React.PropsWithChildren<{}>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);
const AnimatedRoutes = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ChatWidget />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/welcome" element={<WelcomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/home" element={<HomeScreen onOpenMenu={() => setIsSidebarOpen(true)} />} />
            <Route path="/menu" element={<MenuScreen onOpenMenu={() => setIsSidebarOpen(true)} />} />
            <Route path="/booking" element={<BookingScreen onOpenMenu={() => setIsSidebarOpen(true)} />} />
            <Route path="/events" element={<EventsScreen onOpenMenu={() => setIsSidebarOpen(true)} />} />
            <Route path="/chef" element={<ChefHireScreen onOpenMenu={() => setIsSidebarOpen(true)} />} />
            <Route path="/gallery" element={<GalleryScreen onOpenMenu={() => setIsSidebarOpen(true)} />} />
            <Route path="/loyalty" element={<LoyaltyScreen onOpenMenu={() => setIsSidebarOpen(true)} />} />
            <Route path="/admin" element={<AdminScreen onOpenMenu={() => setIsSidebarOpen(true)} />} />
            <Route path="/chat" element={<ChatScreen />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

import { AuthProvider } from './hooks/useAuth';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AnimatedRoutes />
      </HashRouter>
    </AuthProvider>
  );
}