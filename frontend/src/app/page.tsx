'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

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