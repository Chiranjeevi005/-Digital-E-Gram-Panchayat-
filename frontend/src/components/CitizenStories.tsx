'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OptimizedIcon from './OptimizedIcon';

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
      image: "/placeholder-avatar-1.jpg",
      role: "Farmer"
    },
    {
      id: 2,
      name: "Sunita Devi",
      location: "Sector 5, Village",
      quote: "I applied for the PM-KISAN scheme online and received the benefit directly in my account. Such a smooth process!",
      image: "/placeholder-avatar-2.jpg",
      role: "Housewife"
    },
    {
      id: 3,
      name: "Amit Sharma",
      location: "Sector 2, Village",
      quote: "Filing a grievance about street lighting was so easy. The issue was resolved within 48 hours. Great work!",
      image: "/placeholder-avatar-3.jpg",
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
          <div className="bg-white rounded-2xl shadow-soft-lg p-5 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Decorative elements - optimized for mobile */}
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-emerald-100 rounded-full -translate-y-8 translate-x-8 sm:-translate-y-10 sm:translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-sky-100 rounded-full translate-y-6 -translate-x-6 sm:translate-y-8 sm:-translate-x-8"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div className="md:w-1/3 w-full flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 p-1">
                      <div className="bg-gray-200 border-2 border-dashed rounded-full w-full h-full flex items-center justify-center">
                        <span className="text-3xl sm:text-4xl">👤</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-emerald-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                      <OptimizedIcon 
                        src="/globe.svg" 
                        alt="Checkmark" 
                        width={20} 
                        height={20} 
                        className="w-4 h-4 sm:w-5 sm:h-5" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 w-full text-center md:text-left">
                  <div className="text-emerald-500 text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">❝</div>
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 italic mb-5 sm:mb-6 px-2">
                    {stories[currentIndex].quote}
                  </p>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{stories[currentIndex].name}</h3>
                    <p className="text-gray-600 mb-2 text-sm sm:text-base">{stories[currentIndex].location}</p>
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-medium">
                      {stories[currentIndex].role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 md:mt-10 space-y-4 sm:space-y-0">
                <button 
                  onClick={() => handleNavigation('prev')}
                  className="flex items-center text-emerald-600 font-medium hover:text-emerald-800 transition-colors text-sm sm:text-base py-2 px-4 rounded-lg hover:bg-emerald-50 active:bg-emerald-100"
                  type="button"
                >
                  <OptimizedIcon 
                    src="/globe.svg" 
                    alt="Previous" 
                    width={20} 
                    height={20} 
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2" 
                  />
                  Previous Story
                </button>
                
                <div className="flex space-x-2">
                  {stories.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation('index', index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        index === currentIndex ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to story ${index + 1}`}
                      type="button"
                    />
                  ))}
                </div>
                
                <button 
                  onClick={() => handleNavigation('next')}
                  className="flex items-center text-emerald-600 font-medium hover:text-emerald-800 transition-colors text-sm sm:text-base py-2 px-4 rounded-lg hover:bg-emerald-50 active:bg-emerald-100"
                  type="button"
                >
                  Next Story
                  <OptimizedIcon 
                    src="/globe.svg" 
                    alt="Next" 
                    width={20} 
                    height={20} 
                    className="w-4 h-4 sm:w-5 sm:h-5 ml-2" 
                  />
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