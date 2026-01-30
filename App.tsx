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
import OnboardingScreen from './screens/OnboardingScreen';
import ProfileScreen from './screens/ProfileScreen';
import { Sidebar } from './components/Sidebar';
import { ChatWidget } from './components/ChatWidget';
import { AuthProvider } from './hooks/useAuth';

const AnimatedRoutes = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-background-dark">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ChatWidget />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          className="w-full h-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div className="w-full h-full overflow-y-auto no-scrollbar">
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
              <Route path="/profile" element={<ProfileScreen onOpenMenu={() => setIsSidebarOpen(true)} />} />
              <Route path="/onboarding" element={<OnboardingScreen />} />
              <Route path="/admin" element={<AdminScreen onOpenMenu={() => setIsSidebarOpen(true)} />} />
              <Route path="/chat" element={<ChatScreen />} />
            </Routes>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AnimatedRoutes />
      </HashRouter>
    </AuthProvider>
  );
}