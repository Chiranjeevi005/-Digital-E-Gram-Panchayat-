'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CertificateManagement from './CertificateManagement';
import GrievanceHandling from './GrievanceHandling';
import CitizenRecords from './CitizenRecords';
import SchemeApplications from './SchemeApplications';
import ReportsAndAnalytics from './ReportsAndAnalytics';
import ProfileAndSettings from './ProfileAndSettings';
import NotificationsCenter from './NotificationsCenter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { apiClient, ApplicationStats, RecentActivity } from '../../services/api';

// Skeleton Loader Component for Staff Dashboard
const StaffDashboardSkeleton = () => (
  <div className="p-2 md:p-6 w-full">
    {/* Tab Navigation Skeleton */}
    <div className="mb-6 bg-white rounded-xl shadow-sm p-2 border border-gray-200">
      <div className="flex flex-wrap gap-1 md:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex items-center justify-center py-2.5 px-3 md:px-4 rounded-lg bg-gray-100 animate-pulse">
            <div className="h-4 w-4 md:h-5 md:w-5 bg-gray-300 rounded-full mr-1.5 md:mr-2"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Dashboard Content Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* Welcome Card Skeleton */}
      <div className="bg-gradient-to-r from-white to-emerald-50 rounded-xl shadow-lg p-6 lg:col-span-3 border border-emerald-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
          </div>
          <div className="bg-gray-200 rounded-lg p-3 w-12 h-12 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-5 border border-gray-200 animate-pulse">
              <div className="flex items-center">
                <div className="bg-gray-200 p-3 rounded-xl mr-4 w-12 h-12"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics Chart Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="bg-gray-200 p-2 rounded-lg w-8 h-8 animate-pulse"></div>
        </div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
        <div className="mt-4">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="w-full md:w-1/2 h-32 bg-gray-100 rounded animate-pulse"></div>
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2 bg-gray-200 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="bg-gray-200 p-2 rounded-lg w-8 h-8 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="w-full p-4 rounded-xl border border-gray-200 animate-pulse">
              <div className="flex items-center">
                <div className="bg-gray-200 p-3 rounded-xl mr-4 w-12 h-12"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="bg-gray-200 p-2 rounded-lg w-8 h-8 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function StaffDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
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
  }, [user]);

  // Mock data for summary statistics (fallback if API fails)
  const summaryData = stats ? [
    { name: 'Certificates', value: stats.totals.certificates },
    { name: 'Grievances', value: stats.totals.grievances },
    { name: 'Schemes', value: stats.totals.schemes },
    { name: 'Total', value: stats.totals.total },
  ] : [
    { name: 'Certificates', value: 45 },
    { name: 'Grievances', value: 32 },
    { name: 'Schemes', value: 28 },
    { name: 'Citizens', value: 156 },
  ];

  const monthlyData = [
    { month: 'Jan', certificates: 12, grievances: 8 },
    { month: 'Feb', certificates: 19, grievances: 13 },
    { month: 'Mar', certificates: 15, grievances: 11 },
    { month: 'Apr', certificates: 18, grievances: 14 },
    { month: 'May', certificates: 22, grievances: 17 },
    { month: 'Jun', certificates: 25, grievances: 19 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderActiveTab = () => {
    if (loading) {
      return <StaffDashboardSkeleton />;
    }

    switch (activeTab) {
      case 'certificates':
        return <CertificateManagement />;
      case 'grievances':
        return <GrievanceHandling />;
      case 'citizens':
        return <CitizenRecords />;
      case 'schemes':
        return <SchemeApplications />;
      case 'reports':
        return <ReportsAndAnalytics />;
      case 'profile':
        return <ProfileAndSettings />;
      case 'notifications':
        return <NotificationsCenter />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-white to-emerald-50 rounded-xl shadow-lg p-6 lg:col-span-3 border border-emerald-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Staff Dashboard Overview</h2>
                  <p className="text-gray-600 mb-4 max-w-3xl">
                    Welcome to your administrative dashboard. Here you can manage certificates, handle grievances, 
                    access citizen records, process scheme applications, and view reports.
                  </p>
                </div>
                <div className="bg-emerald-500 rounded-lg p-3 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 p-3 rounded-xl mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-emerald-800">Certificates</h3>
                      <p className="text-sm text-gray-600 mt-1">Process applications</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-xl mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-800">Grievances</h3>
                      <p className="text-sm text-gray-600 mt-1">Track complaints</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-xl mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800">Citizen Records</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage information</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-3 rounded-xl mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-800">Schemes</h3>
                      <p className="text-sm text-gray-600 mt-1">Process applications</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Statistics Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Summary Statistics</h3>
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="certificates" fill="#10B981" name="Certificates" />
                    <Bar dataKey="grievances" fill="#3B82F6" name="Grievances" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Service Distribution</h4>
                <div className="flex flex-col md:flex-row items-center justify-center">
                  <div className="w-full md:w-1/2 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={summaryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={50}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent as number * 100).toFixed(0)}%`}
                        >
                          {summaryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 mt-4 md:mt-0">
                    <div className="space-y-2">
                      {summaryData.map((item, index) => (
                        <div key={item.name} className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                          <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={() => setActiveTab('certificates')}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 group"
                >
                  <div className="flex items-center">
                    <div className="bg-emerald-100 p-3 rounded-xl mr-4 group-hover:bg-emerald-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Process Certificates</h4>
                      <p className="text-sm text-gray-600 mt-1">Review pending applications</p>
                    </div>
                    <div className="ml-auto text-emerald-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('grievances')}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Handle Grievances</h4>
                      <p className="text-sm text-gray-600 mt-1">Resolve citizen complaints</p>
                    </div>
                    <div className="ml-auto text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex">
                      <div className="flex flex-col items-center mr-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="w-0.5 h-full bg-blue-200"></div>
                      </div>
                      <div className="flex-1 pb-3">
                        <div className="flex justify-between flex-wrap">
                          <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                          <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                            activity.status === 'Approved' || activity.status === 'Completed' || activity.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            activity.status === 'Pending' || activity.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                            activity.status === 'In Progress' || activity.status === 'In Process' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                        <div className="flex justify-between items-center mt-1 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {activity.type}
                          </span>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent activity to display</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  // Mobile-friendly tab navigation
  const tabItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'certificates', name: 'Certificates', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'grievances', name: 'Grievances', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'citizens', name: 'Citizens', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'schemes', name: 'Schemes', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'reports', name: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'notifications', name: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'profile', name: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="p-2 md:p-6 w-full">
      {/* Tab Navigation - Enhanced styling */}
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
