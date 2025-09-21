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

interface Scheme {
  _id: string;
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  createdAt: string;
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
  const [availableSchemes, setAvailableSchemes] = useState<Scheme[]>([]);

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const startTime = Date.now();
      
      if (user?.id) {
        console.log('Fetching data for user:', user.id); // Debug log
        
        // Fetch recent activity from the new tracking API
        const activityData: RecentActivity[] = await apiClient.getRecentActivity(user.id);
        console.log('Fetched activity data:', activityData); // Debug log
        
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
        console.log('Fetched stats data:', statsData); // Debug log
        
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
        
        // Fetch available schemes
        const schemesData: Scheme[] = await apiClient.getSchemes();
        console.log('Fetched schemes data:', schemesData); // Debug log
        setAvailableSchemes(schemesData);
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
      console.log('Initializing dashboard for user:', user.id); // Debug log
      fetchData();
      
      // Connect to WebSocket
      console.log('Connecting to socket service'); // Debug log
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
        console.log('Cleaning up socket listeners'); // Debug log
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
                      <Link href="/services/certificates" className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-md transition-shadow text-center">
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="bg-green-100 p-2 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gray-700">Certificates</span>
                        </div>
                      </Link>
                      <Link href="/services/schemes" className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-md transition-shadow text-center">
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="bg-purple-100 p-2 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gray-700">Schemes</span>
                        </div>
                      </Link>
                      <Link href="/services/grievances" className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-md transition-shadow text-center">
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="bg-red-100 p-2 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gray-700">Grievances</span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Available Schemes Section */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-base md:text-lg font-semibold text-gray-800">Available Schemes</h2>
                      <Link href="/services/schemes" className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">
                        View All
                      </Link>
                    </div>
                    {availableSchemes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableSchemes.slice(0, 3).map((scheme) => (
                          <div key={scheme._id} className="bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="font-semibold text-gray-800 mb-2">{scheme.name}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{scheme.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                {scheme.eligibility}
                              </span>
                              <Link 
                                href={`/services/schemes/apply/${scheme._id}`}
                                className="text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                              >
                                Apply
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No schemes available</h3>
                        <p className="mt-1 text-sm text-gray-500">Check back later for new schemes.</p>
                      </div>
                    )}
                  </div>

                  {/* Recent Activity and Notifications Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base md:text-lg font-semibold text-gray-800">Recent Activity</h2>
                        <Link href="/services/tracking" className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">
                          View All
                        </Link>
                      </div>
                      {recentActivity.length > 0 ? (
                        <div className="space-y-3">
                          {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex">
                              <div className="flex flex-col items-center mr-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <div className="w-0.5 h-full bg-emerald-200"></div>
                              </div>
                              <div className="flex-1 pb-3">
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                                  <span className="text-xs text-gray-500">{activity.date}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    activity.status === 'Approved' || activity.status === 'Completed' || activity.status === 'Resolved' 
                                      ? 'bg-green-100 text-green-800' 
                                      : activity.status === 'Rejected' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {activity.status}
                                  </span>
                                  <span className="text-xs text-gray-500">{activity.type}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="flex">
                            <div className="flex flex-col items-center mr-3">
                              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500">End of activity history</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                          <p className="mt-1 text-sm text-gray-500">Your recent actions will appear here.</p>
                        </div>
                      )}
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base md:text-lg font-semibold text-gray-800">Notifications</h2>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setNotificationFilter('all')}
                            className={`text-xs px-2 py-1 rounded ${
                              notificationFilter === 'all' 
                                ? 'bg-emerald-100 text-emerald-800 font-medium' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            All
                          </button>
                          <button 
                            onClick={() => setNotificationFilter('unread')}
                            className={`text-xs px-2 py-1 rounded ${
                              notificationFilter === 'unread' 
                                ? 'bg-emerald-100 text-emerald-800 font-medium' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Unread
                          </button>
                        </div>
                      </div>
                      {notifications.length > 0 ? (
                        <div className="space-y-3">
                          {notifications.map((notification) => (
                            <div key={notification.id} className="border border-gray-200 rounded p-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                </div>
                                <span className="text-xs text-gray-500 ml-2">{notification.date}</span>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {notification.type}
                                </span>
                                <button className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">
                                  Mark as read
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                          <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Help & Support Section */}
                  <div className="mt-6 bg-white rounded-lg shadow p-4">
                    <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Help & Support</h2>
                    <div className="space-y-3">
                      <div className="border border-gray-200 rounded p-3">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900">Contact Support</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">Need help with your applications or services?</p>
                        <Link href="/support" className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">
                          Get Support
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}