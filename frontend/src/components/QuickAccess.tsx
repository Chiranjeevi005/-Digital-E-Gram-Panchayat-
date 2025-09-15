'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const QuickAccess = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const actions = [
    { name: "Services", icon: "📋", href: "/services", color: "text-emerald-600" },
    { name: "Schemes", icon: "💰", href: "/schemes", color: "text-sky-600" },
    { name: "Grievances", icon: "📬", href: "/grievances", color: "text-rose-600" },
    { name: "Dashboard", icon: "📊", href: "/dashboard", color: "text-amber-600" }
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const container = document.querySelector('.quick-access-container');
      
      if (isOpen && container && !container.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu when resizing to larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="md:hidden quick-access-container">
      {/* Floating action button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg flex items-center justify-center text-white z-50 hover:from-emerald-600 hover:to-emerald-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 active:scale-95"
        aria-label={isOpen ? "Close quick access menu" : "Open quick access menu"}
        aria-expanded={isOpen}
        type="button"
      >
        {isOpen ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      
      {/* Quick access menu */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-5 sm:bottom-24 sm:right-5 bg-white rounded-2xl shadow-xl border border-gray-200 z-40 overflow-hidden quick-access-menu"
          role="menu"
          aria-label="Quick access menu"
        >
          <div className="py-2">
            {actions.map((action, index) => (
              <Link 
                key={index} 
                href={action.href}
                className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-100 active:bg-gray-100"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <span className={`text-xl sm:text-2xl mr-3 ${action.color}`} aria-hidden="true">{action.icon}</span>
                <span className="text-gray-800 font-medium text-sm sm:text-base">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Background overlay when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default QuickAccess;