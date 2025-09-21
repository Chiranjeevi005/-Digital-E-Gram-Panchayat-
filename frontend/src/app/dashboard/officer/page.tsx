'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import OfficerDashboard from '../../../components/officer/OfficerDashboard';
import { apiClient } from '../../../services/api';
import { socketService } from '../../../services/socket'; // Import socket service

// Skeleton Loader Component for Officer Dashboard Page
const OfficerDashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Hero Welcome Section Skeleton */}
    <div className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-5 shadow-lg">
      <div className="animate-pulse">
        <div className="h-6 bg-white bg-opacity-30 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-white bg-opacity-30 rounded w-1/2 mb-4"></div>
      </div>
    </div>

    {/* Dashboard Tabs and Content Skeleton */}
    <div className="bg-white rounded-xl shadow-sm p-2 border border-gray-200">
      <div className="flex flex-wrap gap-1 md:gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex items-center justify-center py-2.5 px-3 md:px-4 rounded-lg bg-gray-100 animate-pulse">
            <div className="h-4 w-4 md:h-5 md:w-5 bg-gray-300 rounded-full mr-1.5 md:mr-2"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>
      
      {/* Dashboard Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Quick Stats Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:col-span-3">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:col-span-3">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100 animate-pulse">
                <div className="bg-gray-200 p-2 rounded-full mr-3 w-8 h-8"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function OfficerDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Add WebSocket connection for real-time updates
  useEffect(() => {
    if (user?.userType === 'Officer' && user?.id) {
      // Connect to WebSocket
      socketService.connect(user.id);
      
      // Listen for dashboard updates
      const handleDashboardUpdate = (data: any) => {
        console.log('Received dashboard update:', data);
        // Update dashboard data
      };
      
      // Listen for application updates
      const handleApplicationUpdate = (data: any) => {
        console.log('Received application update:', data);
        // Handle application updates
      };
      
      socketService.onDashboardUpdate(handleDashboardUpdate);
      socketService.onApplicationUpdate(handleApplicationUpdate);
      
      // Cleanup function
      return () => {
        socketService.offDashboardUpdate(handleDashboardUpdate);
        socketService.offApplicationUpdate(handleApplicationUpdate);
      };
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (user?.userType !== 'Officer') {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['Officer']}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex flex-col">
        {/* Use the default main homepage navbar */}
        <Navbar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 w-full">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Officer Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome, {user?.name} <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Officer</span></p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 py-4 md:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              {loading ? (
                <OfficerDashboardSkeleton />
              ) : (
                <>
                  {/* Hero Welcome Section */}
                  <div className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-5 text-white shadow-lg">
                    <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Welcome, {user?.name}!</h1>
                    <p className="text-emerald-100 text-xs md:text-sm mb-3 md:mb-4">Your administrative dashboard for efficient service delivery.</p>
                  </div>

                  {/* Officer Dashboard Components */}
                  <OfficerDashboard />
                </>
              )}
            </div>
          </main>
        </div>
        
        {/* Add Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}