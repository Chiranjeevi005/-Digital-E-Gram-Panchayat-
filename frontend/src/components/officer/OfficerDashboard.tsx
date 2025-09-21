'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CertificatesMonitor from './CertificatesMonitor';
import GrievanceTracking from './GrievanceTracking';
import SchemesOverview from './SchemesOverview';
import LandPropertyRecords from './LandPropertyRecords';
import StaffActivity from './StaffActivity';
import ReportsLogs from './ReportsLogs';
import { apiClient, ApplicationStats, RecentActivity } from '../../services/api';
import { socketService } from '../../services/socket'; // Import socket service

// Skeleton Loader Component for Officer Dashboard
const OfficerDashboardSkeleton = () => (
  <div className="p-2 md:p-6 w-full">
    {/* Tab Navigation Skeleton */}
    <div className="mb-6 bg-white rounded-xl shadow-sm p-2 border border-gray-200">
      <div className="flex flex-wrap gap-1 md:gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex items-center justify-center py-2.5 px-3 md:px-4 rounded-lg bg-gray-100 animate-pulse">
            <div className="h-4 w-4 md:h-5 md:w-5 bg-gray-300 rounded-full mr-1.5 md:mr-2"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>
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
);

export default function OfficerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  // Fetch tracking data when component mounts
  useEffect(() => {
    const fetchTrackingData = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          
          // Fetch application stats
          const statsData = await apiClient.getApplicationStats(user.id);
          setStats(statsData);
          
          // Fetch recent activity
          const activityData = await apiClient.getRecentActivity(user.id);
          setRecentActivity(activityData);
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching tracking data:', error);
          setLoading(false);
        }
      }
    };

    fetchTrackingData();
    
    // Add WebSocket listeners for real-time updates
    if (user?.id) {
      // Connect to WebSocket
      socketService.connect(user.id);
      
      // Listen for dashboard updates
      const handleDashboardUpdate = (data: any) => {
        console.log('Received dashboard update:', data);
        // Update stats and recent activity
        if (data.stats) {
          setStats(data.stats);
        }
        
        if (data.recentActivity) {
          setRecentActivity(data.recentActivity);
        }
      };
      
      // Listen for application updates
      const handleApplicationUpdate = (data: any) => {
        console.log('Received application update:', data);
        // Add to recent activity or update existing activity
        const newActivity: RecentActivity = {
          id: Date.now().toString(),
          title: `${data.serviceType} Update`,
          date: new Date().toISOString(),
          status: data.status,
          type: data.serviceType,
          details: data.message
        };
        
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only last 10 activities
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

  // Simulate loading state for demonstration
  // In a real implementation, each component would manage its own loading state
  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const renderActiveTab = () => {
    if (loading) {
      return <OfficerDashboardSkeleton />;
    }

    switch (activeTab) {
      case 'certificates':
        return <CertificatesMonitor />;
      case 'grievances':
        return <GrievanceTracking />;
      case 'schemes':
        return <SchemesOverview />;
      case 'land':
        return <LandPropertyRecords />;
      case 'staff':
        return <StaffActivity />;
      case 'reports':
        return <ReportsLogs />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:col-span-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-700">
                    {stats ? stats.totals.certificates : '142'}
                  </div>
                  <div className="text-sm text-emerald-600">Certificates Applied</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="text-2xl font-bold text-green-700">
                    {stats ? stats.totals.grievances : '87'}
                  </div>
                  <div className="text-sm text-green-600">Grievances Filed</div>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                  <div className="text-2xl font-bold text-teal-700">
                    {stats ? stats.totals.schemes : '24'}
                  </div>
                  <div className="text-sm text-teal-600">Active Schemes</div>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
                  <div className="text-2xl font-bold text-cyan-700">
                    {stats ? stats.totals.total : '1,248'}
                  </div>
                  <div className="text-sm text-cyan-600">Total Applications</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:col-span-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.details}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            activity.status === 'Approved' || activity.status === 'Completed' || activity.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            activity.status === 'Pending' || activity.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                            activity.status === 'In Progress' || activity.status === 'In Process' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No recent activity to display</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  // Tab navigation items
  const tabItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'certificates', name: 'Certificates', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'grievances', name: 'Grievances', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'schemes', name: 'Schemes', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'land', name: 'Land & Property', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'staff', name: 'Staff Activity', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'reports', name: 'Reports & Logs', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <div className="p-2 md:p-6 w-full">
      {/* Tab Navigation */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-2 border border-gray-200">
        <nav className="flex flex-wrap gap-1 md:gap-2">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center py-2.5 px-3 md:px-4 rounded-lg font-medium text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              <span className="truncate">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {renderActiveTab()}
      </div>
    </div>
  );
}