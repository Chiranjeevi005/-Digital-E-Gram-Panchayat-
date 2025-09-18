'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';

// Dynamically import heavier components with lazy loading
const KeyServices = dynamic(() => import('../components/KeyServices'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
});

const Announcements = dynamic(() => import('../components/Announcements'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>
});

const CitizenStories = dynamic(() => import('../components/CitizenStories'), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
});

const TrackApplication = dynamic(() => import('../components/TrackApplication'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
});

const ProgressTracker = dynamic(() => import('../components/ProgressTracker'), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
});

export default function Home() {
  const { user, loading } = useAuth();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Show skeleton loader for minimum 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Handle showing/hiding skeleton based on loading states
  useEffect(() => {
    // If minimum time has elapsed and we're no longer loading auth state
    if (minTimeElapsed && !loading) {
      setShowSkeleton(false);
    }
  }, [minTimeElapsed, loading]);

  // If showing skeleton loader
  if (showSkeleton) {
    return <SkeletonLoader />;
  }

  // If user is authenticated, show home page
  if (user && !loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <TrackApplication />
          <ProgressTracker />
          <KeyServices />
          <Announcements />
          <CitizenStories />
        </main>
        <Footer />
      </div>
    );
  }

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For unauthenticated users, show the home page
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <TrackApplication />
        <ProgressTracker />
        <KeyServices />
        <Announcements />
        <CitizenStories />
      </main>
      <Footer />
    </div>
  );
}