'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OptimizedIcon from './OptimizedIcon';

const HeroSection = () => {
  const [currentStat, setCurrentStat] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  
  const stats = [
    { label: "Applications Processed", value: "1,248+" },
    { label: "Villages Served", value: "42+" },
    { label: "Schemes Available", value: "15+" },
    { label: "Happy Citizens", value: "15,000+" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Function to handle CTA clicks
  const handleCtaClick = (destination: string) => {
    if (isAuthenticated) {
      // If authenticated, navigate to the destination
      router.push(destination);
    } else {
      // If not authenticated, redirect to login page
      router.push('/login');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-diagonal">
      {/* Animated background elements - optimized for mobile */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-5 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-emerald-200/30 blur-xl animate-float hidden sm:block"></div>
        <div className="absolute bottom-10 right-5 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-full bg-sky-200/30 blur-xl animate-float animation-delay-2000 hidden sm:block"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-yellow-200/30 blur-xl animate-float animation-delay-4000 hidden md:block"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="lg:w-1/2 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 animate-fade-in-up">
              Empowering Villages through <span className="text-emerald-600">Digital Governance</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl animate-fade-in-up animation-delay-200">
              One platform for all citizen services – simple, transparent, and efficient. Experience the future of rural governance today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in-up animation-delay-400">
              <button 
                onClick={() => handleCtaClick('/dashboard')}
                className="btn-primary text-center flex-1"
              >
                {isAuthenticated ? 'Access Services' : 'Citizen Login / Register'}
              </button>
              <button 
                onClick={() => handleCtaClick('/services')}
                className="btn-secondary text-center flex-1"
              >
                Explore Services
              </button>
            </div>
            
            {/* Stats counter - made responsive */}
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft max-w-md animate-fade-in-up animation-delay-600">
              <div className="flex items-center">
                <div className="mr-3 sm:mr-4 p-2 sm:p-3 bg-emerald-100 rounded-full">
                  <OptimizedIcon 
                    src="/globe.svg" 
                    alt="Checkmark" 
                    width={24} 
                    height={24} 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" 
                  />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats[currentStat].value}</p>
                  <p className="text-sm sm:text-base text-gray-600">{stats[currentStat].label}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full flex justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg">
              {/* Main illustration - optimized for mobile */}
              <div className="relative bg-white rounded-2xl shadow-soft-lg p-4 sm:p-6 transform transition-transform duration-500">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-sky-50 p-3 sm:p-4 rounded-xl shadow-soft">
                    <div className="text-emerald-600 text-xl sm:text-2xl mb-1 sm:mb-2">📱</div>
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Digital Services</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Apply anytime, anywhere</p>
                  </div>
                  <div className="bg-gradient-to-br from-sky-50 to-sky-blue p-3 sm:p-4 rounded-xl shadow-soft">
                    <div className="text-sky-600 text-xl sm:text-2xl mb-1 sm:mb-2">📊</div>
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Transparency</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Track your applications</p>
                  </div>
                  <div className="bg-gradient-to-br from-sky-blue to-beige p-3 sm:p-4 rounded-xl shadow-soft">
                    <div className="text-purple-600 text-xl sm:text-2xl mb-1 sm:mb-2">💬</div>
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Grievance Redressal</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Quick resolution</p>
                  </div>
                  <div className="bg-gradient-to-br from-beige to-mint-green p-3 sm:p-4 rounded-xl shadow-soft">
                    <div className="text-yellow-600 text-xl sm:text-2xl mb-1 sm:mb-2">💰</div>
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Schemes & Benefits</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Access all benefits</p>
                  </div>
                </div>
                

              </div>
              
              {/* Floating elements - made responsive and hidden on small screens */}
              <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 bg-white p-2 sm:p-3 rounded-full shadow-soft animate-float hidden md:block">
                <div className="text-emerald-600 text-lg sm:text-xl">✅</div>
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-white p-2 sm:p-3 rounded-full shadow-soft animate-float animation-delay-2000 hidden md:block">
                <div className="text-sky-600 text-lg sm:text-xl">⚡</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;