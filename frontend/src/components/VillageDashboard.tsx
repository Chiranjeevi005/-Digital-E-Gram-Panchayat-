'use client';

import React, { useState, useEffect, useMemo } from 'react';

const VillageDashboard = () => {
  const [animatedValues, setAnimatedValues] = useState({
    applications: 0,
    water: 0,
    projects: 0,
    funds: 0
  });
  
  const stats = useMemo(() => [
    {
      id: 1,
      title: "Applications Processed",
      value: 1248,
      target: 1248,
      change: "+12%",
      icon: "✅",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      key: "applications"
    },
    {
      id: 2,
      title: "Water Connections",
      value: 856,
      target: 856,
      change: "+8%",
      icon: "💧",
      color: "text-sky-600",
      bg: "bg-sky-50",
      key: "water"
    },
    {
      id: 3,
      title: "Projects Completed",
      value: 42,
      target: 42,
      change: "+5%",
      icon: "🌱",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      key: "projects"
    },
    {
      id: 4,
      title: "Funds Utilized",
      value: 24000000,
      target: 24000000,
      change: "+15%",
      icon: "💰",
      color: "text-amber-600",
      bg: "bg-amber-50",
      key: "funds"
    }
  ], []);
  
  useEffect(() => {
    // Animate counters
    const timers = stats.map((stat, index) => {
      const increment = stat.target / 50;
      let currentValue = 0;
      
      return setInterval(() => {
        currentValue += increment;
        if (currentValue >= stat.target) {
          currentValue = stat.target;
          clearInterval(timers[index]);
        }
        
        setAnimatedValues(prev => ({
          ...prev,
          [stat.key]: Math.floor(currentValue)
        }));
      }, 30);
    });
    
    return () => timers.forEach(timer => clearInterval(timer));
  }, [stats]);

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Village Dashboard Snapshot</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time insights into our panchayat&apos;s performance and achievements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className={`${stat.bg} rounded-2xl p-6 shadow-soft border border-white hover-lift transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600 mb-1">{stat.title}</p>
                  <h3 className={`text-3xl font-bold ${stat.color}`}>
                    {stat.title === "Funds Utilized" 
                      ? formatCurrency(animatedValues[stat.key as keyof typeof animatedValues] || 0)
                      : animatedValues[stat.key as keyof typeof animatedValues] || 0}
                  </h3>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-emerald-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {stat.change}
                </span>
                <span className="text-gray-500 text-sm ml-2">from last month</span>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${stat.color.replace('text', 'bg')}`} 
                    style={{ width: `${Math.min(100, (animatedValues[stat.key as keyof typeof animatedValues] || 0) / stat.target * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional metrics */}
        <div className="mt-12 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-2xl p-8 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-xl shadow-soft">
              <div className="text-3xl mb-2">😊</div>
              <p className="text-2xl font-bold text-gray-800">98%</p>
              <p className="text-gray-600">Citizen Satisfaction</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-soft">
              <div className="text-3xl mb-2">⏱️</div>
              <p className="text-2xl font-bold text-gray-800">3.2 Days</p>
              <p className="text-gray-600">Avg. Processing Time</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-soft">
              <div className="text-3xl mb-2">📱</div>
              <p className="text-2xl font-bold text-gray-800">85%</p>
              <p className="text-gray-600">Digital Adoption</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillageDashboard;