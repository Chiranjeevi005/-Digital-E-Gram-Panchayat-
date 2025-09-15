'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication status and get user info
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    if (token) {
      try {
        // Decode JWT token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        const name = payload.name || 'User';
        // Extract first name
        const firstName = name.split(' ')[0];
        setUserFirstName(firstName);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserFirstName('');
    // Redirect to home page
    window.location.href = '/';
  };

  // Simplified navigation links
  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm py-2 shadow-soft' : 'bg-transparent py-3'}`}>
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center shadow-soft flex-shrink-0">
            <span className="text-white font-bold text-lg sm:text-xl">DP</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-emerald-700 truncate">Digital e-Gram Panchayat</h1>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-emerald-700 font-medium hover:text-emerald-900 transition-colors text-sm lg:text-base"
            >
              {link.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-emerald-700 font-medium text-sm lg:text-base">
                Hi, {userFirstName}
              </span>
              <button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md text-sm lg:text-base whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md text-sm lg:text-base whitespace-nowrap">
              Login
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            className="text-gray-600 focus:outline-none p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            type="button"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-soft border-t border-gray-100 absolute top-full left-0 right-0">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-emerald-700 font-medium py-3 px-4 hover:text-emerald-900 hover:bg-gray-50 transition-colors rounded-lg border-b border-gray-100 last:border-b-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="pt-2 border-t border-gray-200">
                  <div className="px-4 py-2 text-emerald-700 font-medium">
                    Hi, {userFirstName}
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-3 rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md mt-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-3 rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md text-center mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;