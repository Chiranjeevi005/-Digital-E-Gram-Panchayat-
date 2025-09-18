'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import { apiClient } from '../../../lib/api';

// Define types for our data
interface Metrics {
  totalApplications: number;
  grievancesResolved: number;
  grievancesPending: number;
  activeSchemes: number;
}

interface StaffTask {
  id: number;
  staff: string;
  tasksCompleted: number;
  tasksPending: number;
}

interface Approval {
  id: number;
  title: string;
  citizen: string;
  date: string;
  priority: string;
}

interface Grievance {
  _id: string;
  citizenId: string;
  citizenName: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

interface Scheme {
  _id: string;
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  createdAt: string;
  updatedAt: string;
}

interface Certificate {
  _id: string;
  applicantName: string;
  certificateType: string;
  status: string;
  createdAt: string;
}

export default function OfficerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics>({
    totalApplications: 0,
    grievancesResolved: 0,
    grievancesPending: 0,
    activeSchemes: 0,
  });
  const [staffTasks, setStaffTasks] = useState<StaffTask[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real-time data from the backend
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all grievances to calculate metrics
        const allGrievances: Grievance[] = await apiClient.getAllGrievances();
        
        // Fetch all schemes
        const allSchemes: Scheme[] = await apiClient.getAllSchemes();
        
        // Fetch all certificates
        const allCertificates: Certificate[] = await apiClient.getAllCertificates();
        
        // Calculate metrics based on grievances
        const resolvedGrievances = allGrievances.filter(g => g.status === 'resolved').length;
        const pendingGrievances = allGrievances.filter(g => 
          g.status === 'pending' || g.status === 'in-progress'
        ).length;
        
        const realMetrics: Metrics = {
          totalApplications: allGrievances.length + allCertificates.length,
          grievancesResolved: resolvedGrievances,
          grievancesPending: pendingGrievances,
          activeSchemes: allSchemes.length,
        };
        
        // Fetch staff performance data
        // This would require a new endpoint in the backend
        const staffPerformance: StaffTask[] = [];
        
        // Create approvals from pending grievances that might need officer attention
        const pendingApprovals: Approval[] = allGrievances
          .filter(g => g.status === 'pending')
          .map((grievance, index) => ({
            id: index + 1,
            title: 'Grievance Review',
            citizen: grievance.citizenName || 'Unknown Citizen',
            date: new Date(grievance.createdAt).toLocaleDateString(),
            priority: grievance.priority || 'Medium'
          }));
        
        setMetrics(realMetrics);
        setStaffTasks(staffPerformance);
        setApprovals(pendingApprovals);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching real-time data:', error);
        setLoading(false);
      }
    };

    if (user?.userType === 'Officer') {
      fetchData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (user?.userType !== 'Officer') {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['Officer']}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex">
        {/* Sidebar */}
        <Sidebar userType="Officer" />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col md:ml-0">
          {/* Header */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Officer Dashboard</h1>
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

          <main className="flex-1 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Overview Metrics */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Total Applications</h3>
                        <p className="text-2xl font-bold text-gray-900">{metrics.totalApplications}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Grievances Resolved</h3>
                        <p className="text-2xl font-bold text-gray-900">{metrics.grievancesResolved}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Grievances Pending</h3>
                        <p className="text-2xl font-bold text-gray-900">{metrics.grievancesPending}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Active Schemes</h3>
                        <p className="text-2xl font-bold text-gray-900">{metrics.activeSchemes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Performance and Pending Approvals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Staff Performance */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Staff Performance</h2>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : staffTasks.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks Completed</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks Pending</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {staffTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.staff}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.tasksCompleted}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.tasksPending}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No staff performance data available.</p>
                  )}
                </div>

                {/* Pending Approvals */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Pending Approvals</h2>
                    <Link href="/approvals" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                      View All
                    </Link>
                  </div>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : approvals.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citizen</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {approvals.map((approval) => (
                            <tr key={approval.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{approval.title}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{approval.citizen}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{approval.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(approval.priority)}`}>
                                  {approval.priority}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No pending approvals at the moment.</p>
                  )}
                </div>
              </div>

              {/* Reports Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports & Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-800">Application Trends</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">View monthly application statistics and trends.</p>
                    <Link href="/reports/applications" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                      View Report
                    </Link>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-800">Grievance Resolution</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Track grievance resolution times and effectiveness.</p>
                    <Link href="/reports/grievances" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                      View Report
                    </Link>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-800">Scheme Impact</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Analyze the impact and reach of government schemes.</p>
                    <Link href="/reports/schemes" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                      View Report
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}