'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import StaffDashboard from '../../../components/staff/StaffDashboard';
import { apiClient, CertificateApplication, Grievance } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';



// Skeleton Loader Component for Staff Dashboard
const StaffDashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Hero Welcome Section with Quick Stats Skeleton */}
    <div className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-5 text-white shadow-lg">
      <div className="animate-pulse">
        <div className="h-6 bg-white bg-opacity-30 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-white bg-opacity-30 rounded w-1/2 mb-4"></div>
        {/* Quick stats cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          {[1, 2, 3, 4].map((i) => (
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

    {/* Staff Dashboard Tabs and Content Skeleton */}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certificate Management Skeleton */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 text-center animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center p-3 border border-gray-200 rounded">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent Activity Skeleton */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function StaffDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    pendingCertificates: 0,
    assignedGrievances: 0,
    citizenRecords: 0,
    pendingSchemes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const startTime = Date.now();
        
        // Fetch certificates
        const certificates: CertificateApplication[] = await apiClient.getAllCertificates();
        const pendingCertificates = certificates.filter(cert => 
          cert.status === 'pending' || cert.status === 'in-progress'
        ).length;
        
        // Fetch grievances
        const apiGrievances: Grievance[] = await apiClient.getAllGrievances();
        // Transform API Grievance to local Grievance interface
        const grievances = apiGrievances.map(g => ({
          id: g._id,
          description: g.description,
          status: g.status,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt
        }));
        const assignedGrievances = grievances.filter(g => 
          g.status === 'open' || g.status === 'in-progress'
        ).length;
        
        // Update stats
        setStats({
          pendingCertificates,
          assignedGrievances,
          citizenRecords: 0, // This would come from a citizen records API
          pendingSchemes: 0 // This would come from a schemes API
        });
        
        // Ensure minimum loading time of 1-2 seconds for better UX
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 1000; // 1 second minimum
        if (elapsedTime < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    if (user?.userType === 'Staff') {
      fetchData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (user?.userType !== 'Staff') {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['Staff']}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex flex-col">
        {/* Navbar at the top */}
        <Navbar />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 w-full">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome, {user?.name} <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Staff</span></p>
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
                <StaffDashboardSkeleton />
              ) : (
                <>
                  {/* Hero Welcome Section with Quick Stats */}
                  <div className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-5 text-white shadow-lg">
                    <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Welcome, {user?.name}!</h1>
                    <p className="text-emerald-100 text-xs md:text-sm mb-3 md:mb-4">Your administrative dashboard for efficient service delivery.</p>
                    {/* Quick stats cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                      <div className="bg-white bg-opacity-30 rounded-lg p-2 md:p-3 backdrop-blur-sm">
                        <div className="flex items-center">
                          <div className="bg-emerald-600 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs text-emerald-900 font-medium">Pending Certificates</p>
                            <p className="text-base md:text-lg font-bold text-gray-800">{stats.pendingCertificates}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-30 rounded-lg p-2 md:p-3 backdrop-blur-sm">
                        <div className="flex items-center">
                          <div className="bg-emerald-600 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs text-emerald-900 font-medium">Assigned Grievances</p>
                            <p className="text-base md:text-lg font-bold text-gray-800">{stats.assignedGrievances}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-30 rounded-lg p-2 md:p-3 backdrop-blur-sm">
                        <div className="flex items-center">
                          <div className="bg-emerald-600 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs text-emerald-900 font-medium">Citizen Records</p>
                            <p className="text-base md:text-lg font-bold text-gray-800">{stats.citizenRecords}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-30 rounded-lg p-2 md:p-3 backdrop-blur-sm">
                        <div className="flex items-center">
                          <div className="bg-emerald-600 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs text-emerald-900 font-medium">Pending Schemes</p>
                            <p className="text-base md:text-lg font-bold text-gray-800">{stats.pendingSchemes}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Staff Dashboard Components */}
                  <StaffDashboard />
                </>
              )}
            </div>
          </main>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}