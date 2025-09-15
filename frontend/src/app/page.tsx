'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import KeyServices from '../components/KeyServices';
import Announcements from '../components/Announcements';
import CitizenStories from '../components/CitizenStories';
import TrackApplication from '../components/TrackApplication';
import ProgressTracker from '../components/ProgressTracker';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Navbar />
      <main className="flex-grow pt-20">
        <HeroSection />
        <TrackApplication />
        <ProgressTracker />
        <KeyServices />
        <Announcements />
        <CitizenStories />
      </main>
      <Footer />
      <QuickAccess />
    </div>
  );
}
