'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OptimizedIcon from './OptimizedIcon';

const KeyServices = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  
  const services = [
    {
      id: 1,
      title: "Certificates & Records",
      icon: "📑",
      description: "Birth, death, marriage certificates and other official records",
      color: "from-emerald-50 to-emerald-100",
      accent: "text-emerald-600"
    },
    {
      id: 2,
      title: "Property & Land",
      icon: "🏠",
      description: "Land records, property registration and mutation services",
      color: "from-sky-50 to-sky-100",
      accent: "text-sky-600"
    },
    {
      id: 3,
      title: "Schemes & Subsidies",
      icon: "💰",
      description: "Apply for government schemes and check eligibility",
      color: "from-yellow-50 to-yellow-100",
      accent: "text-yellow-600"
    },
    {
      id: 4,
      title: "Grievances",
      icon: "📬",
      description: "File complaints and track their resolution status",
      color: "from-rose-50 to-rose-100",
      accent: "text-rose-600"
    }
  ];

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Function to handle service card clicks
  const handleServiceClick = (serviceId: number) => {
    if (isAuthenticated) {
      // If authenticated, navigate to the service page
      router.push(`/services/${serviceId}`);
    } else {
      // If not authenticated, redirect to login page
      router.push('/login');
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Our Key Services</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Everything you need for village governance, all in one place
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {services.map((service) => (
            <div 
              key={service.id} 
              className={`bg-gradient-to-br ${service.color} rounded-2xl p-5 sm:p-6 md:p-8 shadow-soft hover:shadow-xl transition-all duration-300 border border-white hover-lift transform cursor-pointer ${
                hoveredCard === service.id ? 'scale-[1.02]' : ''
              }`}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleServiceClick(service.id)}
            >
              <div className={`text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 md:mb-6 ${service.accent} transition-transform duration-300 ${
                hoveredCard === service.id ? 'scale-110' : ''
              }`}>
                {service.icon}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base">{service.description}</p>
              <div className="flex items-center text-emerald-600 font-medium text-sm">
                <span>{isAuthenticated ? 'Access Service' : 'Login to Access'}</span>
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Arrow" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4 ml-2 transition-transform duration-300 hover:translate-x-1" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyServices;