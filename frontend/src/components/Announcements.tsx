'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Announcements = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  
  const notices = [
    {
      id: 1,
      title: "Gram Sabha Meeting Notice",
      date: "15 Sep 2025",
      description: "Quarterly Gram Sabha meeting scheduled for October 1st, 2025 at 10:00 AM in Community Hall",
      category: "Meeting",
      priority: "high"
    },
    {
      id: 2,
      title: "New Scheme Launched",
      date: "10 Sep 2025",
      description: "PM-KISAN scheme registration now open for eligible farmers in our panchayat",
      category: "Scheme",
      priority: "medium"
    },
    {
      id: 3,
      title: "Emergency Health Camp",
      date: "5 Sep 2025",
      description: "Free health checkup camp organized by District Health Department on September 20th",
      category: "Health",
      priority: "high"
    }
  ];

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Function to handle login CTA
  const handleLoginCta = () => {
    router.push('/login');
  };

  if (!isAuthenticated) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-radial">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Latest Announcements</h2>
            <p className="text-gray-600 text-sm sm:text-base px-2">Login to stay updated with the latest news and notices</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden">
              <div className="p-0.5 bg-gradient-to-r from-emerald-500 to-sky-500">
                <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-6">You need to be logged in to view announcements.</p>
                    <button
                      onClick={handleLoginCta}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md"
                    >
                      Login to Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-radial">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Latest Announcements</h2>
          <p className="text-gray-600 text-sm sm:text-base px-2">Stay updated with the latest news and notices</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden">
            <div className="p-0.5 bg-gradient-to-r from-emerald-500 to-sky-500">
              <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6">
                {/* Mobile view - tabs at top */}
                <div className="md:hidden mb-4 sm:mb-5">
                  <div className="flex overflow-x-auto pb-2 -mx-1 px-1">
                    {notices.map((notice, index) => (
                      <button
                        key={notice.id}
                        onClick={() => setActiveIndex(index)}
                        className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap mx-1 ${
                          activeIndex === index
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        type="button"
                      >
                        {notice.title}
                        {notice.priority === 'high' && (
                          <span className="ml-1.5 inline-flex items-center justify-center w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6">
                  {/* Desktop sidebar */}
                  <div className="hidden md:block md:w-1/3 md:pr-4 md:border-r border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 sm:mb-4">Categories</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {notices.map((notice, index) => (
                        <button
                          key={notice.id}
                          onClick={() => setActiveIndex(index)}
                          className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all text-sm ${
                            activeIndex === index
                              ? 'bg-emerald-50 border border-emerald-200'
                              : 'hover:bg-gray-50'
                          }`}
                          type="button"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-800">{notice.title}</span>
                            {notice.priority === 'high' && (
                              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-red-500"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{notice.date}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3 sm:mb-4">
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                          {notices[activeIndex].category}
                        </span>
                        {notices[activeIndex].priority === 'high' && (
                          <span className="inline-block ml-2 px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{notices[activeIndex].date}</span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                      {notices[activeIndex].title}
                    </h3>
                    <p className="text-gray-600 mb-4 sm:mb-5 text-sm sm:text-base">
                      {notices[activeIndex].description}
                    </p>
                    
                    <button className="text-emerald-600 font-medium flex items-center text-sm sm:text-base" type="button">
                      Read full announcement
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcements;