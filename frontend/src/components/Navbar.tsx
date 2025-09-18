'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BackToTop from './BackToTop';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Help', href: '/help' },
    { name: 'Contact', href: '/contact' }
  ];

  // Dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return null;
    
    switch (user.userType) {
      case 'Citizen':
        return { name: 'Dashboard', href: '/dashboard/citizen' };
      case 'Staff':
        return { name: 'Dashboard', href: '/dashboard/staff' };
      case 'Officer':
        return { name: 'Dashboard', href: '/dashboard/officer' };
      default:
        return { name: 'Dashboard', href: '/dashboard' };
    }
  };

  const dashboardLink = getDashboardLink();
  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm py-2 shadow-soft' : 'bg-white/90 py-3'} nav-sticky`}>
        <div className="responsive-container flex justify-between items-center">
          {/* Make the brand/logo area a link to home page */}
          <Link href="/" className="flex items-center space-x-2 focus:outline-none rounded-lg" aria-label="Digital e-Gram Panchayat Home">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center shadow-soft flex-shrink-0">
              <span className="text-white font-bold text-lg">DP</span>
            </div>
            <div className="min-w-0 hidden sm:block">
              <h1 className="text-base sm:text-lg font-bold text-emerald-700 truncate">Digital e-Gram Panchayat</h1>
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
            
            {user && dashboardLink && (
              <Link 
                href={dashboardLink.href} 
                className="text-emerald-700 font-medium hover:text-emerald-900 transition-colors text-sm lg:text-base focus:outline-none rounded-lg px-2 py-1"
              >
                {dashboardLink.name}
              </Link>
            )}
            
            {user ? (
              <ProfileDropdown />
            ) : (
              <Link href="/login" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md text-sm lg:text-base whitespace-nowrap focus:outline-none">
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile Navigation - Simplified for less congestion */}
          <div className="flex md:hidden items-center space-x-2">
            {user ? (
              <ProfileDropdown />
            ) : (
              <Link href="/login" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white w-9 h-9 rounded-full flex items-center justify-center hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-soft hover:shadow-md focus:outline-none" aria-label="Login">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

// Skeleton version of Navbar for loading states
export const NavbarSkeleton = () => {
  return (
    <nav className="fixed w-full z-50 bg-transparent py-3 nav-sticky">
      <div className="responsive-container flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-5 w-40 bg-gray-200 rounded hidden sm:block animate-pulse"></div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        <div className="flex md:hidden">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;