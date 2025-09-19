'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import StaffDashboard from '../../../components/staff/StaffDashboard';
import { apiClient } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

interface Certificate {
  _id: string;
  applicantName: string;
  certificateType: string;
  status: string;
  createdAt: string;
}

interface Grievance {
  _id: string;
  citizenId: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
}

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
        const certificates: Certificate[] = await apiClient.getAllCertificates();
        const pendingCertificates = certificates.filter(cert => 
          cert.status === 'pending' || cert.status === 'in-progress'
        ).length;
        
        // Fetch grievances
        const grievances: Grievance[] = await apiClient.getAllGrievances();
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
                        <p className="text-base md:text-lg font-bold text-gray-800">{loading ? '...' : stats.pendingCertificates}</p>
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
                        <p className="text-base md:text-lg font-bold text-gray-800">{loading ? '...' : stats.assignedGrievances}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-30 rounded-lg p-2 md:p-3 backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="bg-emerald-600 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] md:text-xs text-emerald-900 font-medium">Citizen Records</p>
                        <p className="text-base md:text-lg font-bold text-gray-800">{loading ? '...' : stats.citizenRecords}</p>
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
                        <p className="text-base md:text-lg font-bold text-gray-800">{loading ? '...' : stats.pendingSchemes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <StaffDashboard />
            </div>
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}