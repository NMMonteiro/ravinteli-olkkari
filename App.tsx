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

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><SplashScreen /></PageTransition>} />
        <Route path="/home" element={<PageTransition><HomeScreen /></PageTransition>} />
        <Route path="/menu" element={<PageTransition><MenuScreen /></PageTransition>} />
        <Route path="/booking" element={<PageTransition><BookingScreen /></PageTransition>} />
        <Route path="/events" element={<PageTransition><EventsScreen /></PageTransition>} />
        <Route path="/chef" element={<PageTransition><ChefHireScreen /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><GalleryScreen /></PageTransition>} />
        <Route path="/loyalty" element={<PageTransition><LoyaltyScreen /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminScreen /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><ChatScreen /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AnimatedRoutes />
    </HashRouter>
  );
}