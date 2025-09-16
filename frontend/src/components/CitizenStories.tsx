'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CitizenStories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  
  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
  
  const stories = [
    {
      id: 1,
      name: "Ramesh Kumar",
      location: "Sector 3, Village",
      quote: "The digital platform helped me get my land mutation done in just 3 days instead of weeks. Highly efficient!",
      role: "Farmer"
    },
    {
      id: 2,
      name: "Sunita Devi",
      location: "Sector 5, Village",
      quote: "I applied for the PM-KISAN scheme online and received the benefit directly in my account. Such a smooth process!",
      role: "Housewife"
    },
    {
      id: 3,
      name: "Amit Sharma",
      location: "Sector 2, Village",
      quote: "Filing a grievance about street lighting was so easy. The issue was resolved within 48 hours. Great work!",
      role: "Shop Owner"
    }
  ];

  const handleNavigation = (direction: 'prev' | 'next' | 'index', index?: number) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (direction === 'prev') {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
    } else if (direction === 'next') {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
    } else if (direction === 'index' && index !== undefined) {
      setCurrentIndex(index);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-emerald-50 to-sky-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Citizen Success Stories</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Hear from our community members about their experiences with digital governance
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-soft-lg p-6 sm:p-8 md:p-10 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-sky-100 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div className="relative z-10">
              {/* Testimonial card with improved layout */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 sm:p-8 shadow-inner">
                <div className="flex flex-col items-center text-center">
                  {/* Quote mark */}
                  <div className="text-emerald-500 text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-4 opacity-70">❝</div>
                  
                  {/* Testimonial content */}
                  <div className="max-w-3xl">
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-700 italic mb-6 sm:mb-8 px-2 sm:px-4">
                      "{stories[currentIndex].quote}"
                    </p>
                    
                    {/* Author information */}
                    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-soft max-w-md mx-auto">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{stories[currentIndex].name}</h3>
                      <p className="text-gray-600 mb-2 text-sm sm:text-base">{stories[currentIndex].location}</p>
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-medium">
                        {stories[currentIndex].role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 sm:mt-10 space-y-4 sm:space-y-0">
                <button 
                  onClick={() => handleNavigation('prev')}
                  className="flex items-center text-emerald-600 font-medium hover:text-emerald-800 transition-colors text-sm sm:text-base py-2 px-5 rounded-lg hover:bg-emerald-50 active:bg-emerald-100 shadow-soft"
                  type="button"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Story
                </button>
                
                {/* Pagination dots */}
                <div className="flex space-x-2">
                  {stories.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation('index', index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-emerald-600 w-6' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to story ${index + 1}`}
                      type="button"
                    />
                  ))}
                </div>
                
                <button 
                  onClick={() => handleNavigation('next')}
                  className="flex items-center text-emerald-600 font-medium hover:text-emerald-800 transition-colors text-sm sm:text-base py-2 px-5 rounded-lg hover:bg-emerald-50 active:bg-emerald-100 shadow-soft"
                  type="button"
                >
                  Next Story
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CitizenStories;