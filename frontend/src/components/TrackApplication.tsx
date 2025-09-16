'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TrackApplication = () => {
  const [trackingId, setTrackingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      router.push('/login');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Tracking application with ID: ${trackingId}`);
    }, 1500);
  };

  // Function to handle login CTA
  const handleLoginCta = () => {
    router.push('/login');
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-50 to-sky-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-soft-lg p-5 sm:p-6 md:p-8 border border-white">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-emerald-100 text-emerald-600 mb-3 sm:mb-4 mx-auto">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">Track Your Application</h2>
              <p className="text-gray-600 text-sm sm:text-base px-2">
                {isAuthenticated 
                  ? "Enter your application ID to check the current status and progress" 
                  : "Login to track your applications"}
              </p>
            </div>
            
            {isAuthenticated ? (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
                    Application ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="trackingId"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="e.g., APP-2025-09-001"
                      className="block w-full pl-10 pr-3 py-3 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-soft text-sm sm:text-base text-gray-800"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Tracking...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Track Now
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-6">You need to be logged in to track your applications.</p>
                <button
                  onClick={handleLoginCta}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md"
                >
                  Login to Continue
                </button>
              </div>
            )}
            
            {isAuthenticated && (
              <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Need help finding your Application ID?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-emerald-600 font-bold mb-1 text-sm sm:text-base">1</div>
                    <p className="text-xs sm:text-sm text-gray-700">Check your confirmation email</p>
                  </div>
                  <div className="bg-sky-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-sky-600 font-bold mb-1 text-sm sm:text-base">2</div>
                    <p className="text-xs sm:text-sm text-gray-700">Look for SMS notification</p>
                  </div>
                  <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-amber-600 font-bold mb-1 text-sm sm:text-base">3</div>
                    <p className="text-xs sm:text-sm text-gray-700">Contact help desk</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackApplication;