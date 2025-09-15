'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BackToTop from './BackToTop';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
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
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm py-2 shadow-soft' : 'bg-transparent py-3'} nav-sticky`}>
        <div className="responsive-container flex justify-between items-center">
          {/* Make the brand/logo area a link to home page */}
          <Link href="/" className="flex items-center space-x-2 focus:outline-none rounded-lg" aria-label="Digital e-Gram Panchayat Home">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center shadow-soft flex-shrink-0">
              <span className="text-white font-bold text-lg">DP</span>
            </div>
            <div className="min-w-0 hidden sm:block">
              <h1 className="text-lg font-bold text-emerald-700 truncate">Digital e-Gram Panchayat</h1>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-emerald-700 font-medium hover:text-emerald-900 transition-colors text-sm lg:text-base focus:outline-none rounded-lg px-2 py-1"
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-emerald-700 font-medium text-sm lg:text-base">
                  Namaste, {userFirstName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md text-sm lg:text-base whitespace-nowrap focus:outline-none"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md text-sm lg:text-base whitespace-nowrap focus:outline-none">
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile Navigation - Simplified for less congestion */}
          <div className="flex md:hidden items-center space-x-1">
            {isAuthenticated ? (
              <>
                <span className="text-emerald-700 font-medium text-sm truncate max-w-[70px]">
                  Namaste, {userFirstName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white w-8 h-8 rounded-full flex items-center justify-center hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md focus:outline-none"
                  aria-label="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white w-8 h-8 rounded-full flex items-center justify-center hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md focus:outline-none" aria-label="Login">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h8a3 3 0 013 3v1" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </nav>
      <BackToTop />
    </>
  );
};

export default Navbar;