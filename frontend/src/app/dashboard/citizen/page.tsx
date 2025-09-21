'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { apiClient, SchemeApplication, ApplicationStats, RecentActivity } from '../../../services/api';
import { socketService } from '../../../services/socket'; // Import socket service

// Define types for our data
interface Grievance {
  _id: string;
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  remarks?: string;
}

// Add this interface for SchemeApplication to match the backend model
interface CitizenSchemeApplication {
  _id: string;
  id: string;
  citizenId: string;
  schemeId: string;
  schemeName: string;
  applicantName: string;
  fatherName: string;
  address: string;
  phone: string;
  email: string;
  income: string;
  caste: string;
  documents: string[];
  status: string;
  submittedAt: string;
  updatedAt: string;
}

// Skeleton Loader Component for Citizen Dashboard
const CitizenDashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Hero Welcome Section Skeleton */}
    <div className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-5 shadow-lg">
      <div className="animate-pulse">
        <div className="h-6 bg-white bg-opacity-30 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-white bg-opacity-30 rounded w-1/2 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white bg-opacity-30 rounded-lg p-2 md:p-3">
              <div className="flex items-center">
                <div className="bg-emerald-600 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                  <div className="h-4 w-4 md:h-5 md:w-5 bg-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-white bg-opacity-50 rounded w-3/4 mb-1"></div>
                  <div className="h-5 bg-white bg-opacity-70 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Quick Actions Widget Skeleton */}
    <div className="mb-6">
      <div className="h-5 bg-gray-200 rounded w-1/4 mb-3 animate-pulse"></div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-3 border border-gray-100 animate-pulse">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-gray-200 p-2 rounded-full mb-2 w-8 h-8"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Services Section Skeleton */}
    <div className="mb-6">
      <div className="h-5 bg-gray-200 rounded w-1/4 mb-3 animate-pulse"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-3 md:p-4 border border-gray-100 animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-200 p-2 rounded-full w-8 h-8"></div>
              <div className="ml-3 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Activity and Notifications Skeleton */}
    <div className="grid grid-cols-1 gap-5">
      {/* Recent Activity Skeleton */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex animate-pulse">
              <div className="flex flex-col items-center mr-3">
                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                <div className="w-0.5 h-full bg-gray-200"></div>
              </div>
              <div className="flex-1 pb-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex">
            <div className="flex flex-col items-center mr-3">
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            </div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Skeleton */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="border border-gray-200 rounded p-3 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16 ml-2"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-1/3 mt-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Help & Support Section Skeleton */}
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <div className="h-5 bg-gray-200 rounded w-1/4 mb-3 animate-pulse"></div>
      <div className="space-y-3">
        <div className="border border-gray-200 rounded p-3 animate-pulse">
          <div className="flex items-center mb-2">
            <div className="bg-gray-200 p-1.5 rounded-full mr-2 w-6 h-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [recentActivity, setRecentActivity] = useState<Array<{id: number, title: string, date: string, status: string, type: string, details: string}>>([]);
  const [notifications, setNotifications] = useState<Array<{id: number, title: string, message: string, date: string, type: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const [stats, setStats] = useState({
    applications: 0,
    notifications: 0,
    completed: 0
  });

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const startTime = Date.now();
      
      if (user?.id) {
        // Fetch recent activity from the new tracking API
        const activityData: RecentActivity[] = await apiClient.getRecentActivity(user.id);
        
        // Transform activity data to match existing format
        const transformedActivities = activityData.map((activity, index) => ({
          id: index + 1,
          title: activity.title,
          date: new Date(activity.date).toLocaleDateString(),
          status: activity.status,
          type: activity.type,
          details: activity.details
        }));
        
        setRecentActivity(transformedActivities);
        
        // Fetch application stats
        const statsData: ApplicationStats = await apiClient.getApplicationStats(user.id);
        
        // Update stats
        setStats({
          applications: statsData.totals.total,
          notifications: 0, // Would come from notifications API
          completed: Object.values(statsData.statuses).reduce((total: number, statusCounts) => {
            // Count completed/approved/resolved applications
            const counts = statusCounts as Record<string, number>;
            return total + (counts['Approved'] || 0) + (counts['Resolved'] || 0) + (counts['Completed'] || 0);
          }, 0)
        });
      }
      
      // Set notifications (in a real app, these would come from the backend)
      setNotifications([
        // These would typically come from a notifications API endpoint
      ]);
      
      // Ensure minimum loading time of 1-2 seconds for better UX
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 1000; // 1 second minimum
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial data
    if (user?.userType === 'Citizen' && user?.id) {
      fetchData();
      
      // Connect to WebSocket
      socketService.connect(user.id);
      
      // Listen for dashboard updates
      const handleDashboardUpdate = (data: any) => {
        console.log('Received dashboard update:', data);
        // Update stats and recent activity
        if (data.stats) {
          setStats({
            applications: data.stats.totals.total,
            notifications: 0,
            completed: Object.values(data.stats.statuses).reduce((total: number, statusCounts) => {
              const counts = statusCounts as Record<string, number>;
              return total + (counts['Approved'] || 0) + (counts['Resolved'] || 0) + (counts['Completed'] || 0);
            }, 0)
          });
        }
        
        if (data.recentActivity) {
          const transformedActivities = data.recentActivity.map((activity: any, index: number) => ({
            id: index + 1,
            title: activity.title,
            date: new Date(activity.date).toLocaleDateString(),
            status: activity.status,
            type: activity.type,
            details: activity.details
          }));
          setRecentActivity(transformedActivities);
        }
      };
      
      // Listen for application updates
      const handleApplicationUpdate = (data: any) => {
        console.log('Received application update:', data);
        // Add to recent activity or update existing activity
        const newActivity = {
          id: Date.now(), // Use timestamp as ID
          title: `${data.serviceType} Update`,
          date: new Date().toLocaleDateString(),
          status: data.status,
          type: data.serviceType,
          details: data.message
        };
        
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only last 10 activities
        
        // Update stats
        setStats(prev => ({
          ...prev,
          applications: prev.applications + 1
        }));
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

  if (user?.userType !== 'Citizen') {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['Citizen']}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex flex-col">
        {/* Navbar at the top */}
        <Navbar />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - only visible on mobile/tablet */}
          <header className="bg-white shadow md:hidden">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 w-full">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Citizen Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome, {user?.name}</p>
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

          {/* Main content area */}
          <main className="flex-1 py-4 md:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              {loading ? (
                <CitizenDashboardSkeleton />
              ) : (
                <>
                  {/* Hero Welcome Section - Enhanced with more meaningful content */}
                  <div className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-5 text-white shadow-lg">
                    <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Welcome, {user?.name}!</h1>
                    <p className="text-emerald-100 text-xs md:text-sm mb-3 md:mb-4">Your village, your rights, one portal.</p>
                    {/* Replaced the three white boxes with meaningful quick stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                      <div className="bg-white bg-opacity-30 rounded-lg p-2 md:p-3 backdrop-blur-sm">
                        <div className="flex items-center">
                          <div className="bg-emerald-600 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs text-emerald-900 font-medium">Applications</p>
                            <p className="text-base md:text-lg font-bold text-gray-800">{stats.applications}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-30 rounded-lg p-2 md:p-3 backdrop-blur-sm">
                        <div className="flex items-center">
                          <div className="bg-emerald-600 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs text-emerald-900 font-medium">Notifications</p>
                            <p className="text-base md:text-lg font-bold text-gray-800">{stats.notifications}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-30 rounded-lg p-2 md:p-3 backdrop-blur-sm">
                        <div className="flex items-center">
                          <div className="bg-emerald-600 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs text-emerald-900 font-medium">Completed</p>
                            <p className="text-base md:text-lg font-bold text-gray-800">{stats.completed}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Widget */}
                  <div className="mb-6">
                    <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Updated links to track application status */}
                      <Link href="/services/tracking" className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-md transition-shadow text-center">
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="bg-blue-100 p-2 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gray-700">Track Applications</span>
                        </div>
                      </Link>

                      <Link href="/services/grievances" className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-md transition-shadow text-center">
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="bg-red-100 p-2 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gray-700">File Grievance</span>
                        </div>
                      </Link>

                      <Link href="/services/schemes" className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-md transition-shadow text-center">
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="bg-green-100 p-2 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gray-700">View Schemes</span>
                        </div>
                      </Link>

                      <Link href="/profile" className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-md transition-shadow text-center">
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="bg-purple-100 p-2 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gray-700">View Profile</span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Quick Access Cards - Updated links to track application status */}
                  <div className="mb-6">
                    <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Services</h2>
                    <div className="grid grid-cols-1 gap-3">
                      <Link href="/services/tracking?service=certificates" className="bg-white rounded-lg shadow p-3 md:p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm md:text-base font-medium text-gray-900">Certificates</h3>
                            <p className="text-xs text-gray-500">Track applications</p>
                          </div>
                        </div>
                      </Link>

                      <Link href="/services/tracking?service=grievances" className="bg-white rounded-lg shadow p-3 md:p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-red-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm md:text-base font-medium text-gray-900">Grievances</h3>
                            <p className="text-xs text-gray-500">Track complaints</p>
                          </div>
                        </div>
                      </Link>

                      <Link href="/services/tracking?service=schemes" className="bg-white rounded-lg shadow p-3 md:p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm md:text-base font-medium text-gray-900">Schemes</h3>
                            <p className="text-xs text-gray-500">Track applications</p>
                          </div>
                        </div>
                      </Link>

                      <Link href="/services/tracking?service=property" className="bg-white rounded-lg shadow p-3 md:p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2 2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm md:text-base font-medium text-gray-900">Property & Land</h3>
                            <p className="text-xs text-gray-500">Track services</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Recent Activity and Notifications */}
                  <div className="grid grid-cols-1 gap-5">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base md:text-lg font-semibold text-gray-800">Activity Timeline</h2>
                        {/* Updated link to track all applications */}
                        <Link href="/services/tracking" className="text-emerald-600 hover:text-emerald-800 text-xs font-medium">
                          View All
                        </Link>
                      </div>
                      
                      {loading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse flex space-x-3">
                              <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : recentActivity.length > 0 ? (
                        <div className="space-y-3">
                          {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex">
                              <div className="flex flex-col items-center mr-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <div className="w-0.5 h-full bg-emerald-200"></div>
                              </div>
                              <div className="flex-1 pb-3">
                                <div className="flex justify-between flex-wrap">
                                  <h3 className="font-medium text-gray-900 text-sm">{activity.title}</h3>
                                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                                    activity.status === 'Approved' || activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    activity.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {activity.status}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                                <div className="flex justify-between items-center mt-1 flex-wrap">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    {activity.type}
                                  </span>
                                  <p className="text-xs text-gray-500">{activity.date}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="flex">
                            <div className="flex flex-col items-center mr-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500">Account created</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No recent activity to display.</p>
                      )}
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base md:text-lg font-semibold text-gray-800">Notifications</h2>
                        <div className="flex space-x-1">
                          {/* Using dark text colors for better visibility */}
                          <select 
                            value={notificationFilter}
                            onChange={(e) => setNotificationFilter(e.target.value)}
                            className="text-xs border border-gray-400 rounded px-1.5 py-0.5 bg-white text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 notification-filter-select"
                          >
                            <option value="all" className="text-gray-800 bg-white">All</option>
                            <option value="Services" className="text-gray-800 bg-white">Services</option>
                            <option value="Schemes" className="text-gray-800 bg-white">Schemes</option>
                            <option value="Grievances" className="text-gray-800 bg-white">Grievances</option>
                            <option value="Property" className="text-gray-800 bg-white">Property</option>
                          </select>
                          <button className="text-emerald-700 hover:text-emerald-900 text-xs font-medium bg-white hover:bg-gray-50 px-1.5 py-0.5 rounded border border-gray-300 transition-colors notification-filter-button">
                            Mark All
                          </button>
                        </div>
                      </div>
                      
                      {loading ? (
                        <div className="space-y-3">
                          {[1, 2].map((i) => (
                            <div key={i} className="animate-pulse flex space-x-3">
                              <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-2 bg-gray-200 rounded"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : notifications.length > 0 ? (
                        <ul className="space-y-3">
                          {notifications
                            .filter(notification => notificationFilter === 'all' || notification.type === notificationFilter)
                            .map((notification) => (
                            <li key={notification.id} className="border border-gray-300 rounded p-3 hover:bg-gray-50 relative transition-colors">
                              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              <div className="flex justify-between items-start flex-wrap">
                                <div>
                                  <h3 className="font-medium text-gray-900 text-sm">{notification.title}</h3>
                                  <p className="text-xs text-gray-700 mt-1">{notification.message}</p>
                                </div>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-900">
                                  {notification.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{notification.date}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 text-sm">No notifications to display.</p>
                      )}
                    </div>
                  </div>

                  {/* Help & Support Section */}
                  <div className="mt-6 bg-white rounded-lg shadow p-4">
                    <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Help & Support</h2>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="border border-gray-200 rounded p-3 hover:shadow-sm transition-shadow">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="font-medium text-gray-800 text-sm">FAQs</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">Find answers to commonly asked questions about our services.</p>
                        <Link href="/help#faqs" className="text-emerald-600 hover:text-emerald-800 text-xs font-medium">
                          Browse FAQs
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
        
        {/* Footer moved outside the main content area to occupy full width */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}