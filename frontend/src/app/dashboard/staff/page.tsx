'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import { apiClient } from '../../../lib/api';

// Define types for our data
interface Task {
  id: number;
  title: string;
  citizen: string;
  date: string;
  status: string;
  priority: string;
}

interface CitizenRecord {
  id: number;
  name: string;
  service: string;
  date: string;
  status: string;
}

interface Stats {
  pendingCertificates: number;
  grievancesAssigned: number;
  requestsInQueue: number;
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

interface Certificate {
  _id: string;
  applicantName: string;
  certificateType: string;
  status: string;
  createdAt: string;
}

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [citizenRecords, setCitizenRecords] = useState<CitizenRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    pendingCertificates: 0,
    grievancesAssigned: 0,
    requestsInQueue: 0
  });

  useEffect(() => {
    // Fetch real-time data from the backend
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all grievances
        const allGrievances: Grievance[] = await apiClient.getAllGrievances();
        
        // Fetch all certificates
        const allCertificates: Certificate[] = await apiClient.getAllCertificates();
        
        // Filter grievances that might be assigned to this staff member
        const grievances = allGrievances.filter(g => 
          g.status === 'pending' || g.status === 'in-progress'
        );
        
        // Filter certificates that need processing
        const pendingCertificates = allCertificates.filter(c => 
          c.status === 'Submitted' || c.status === 'Processing'
        );
        
        // Process grievances into tasks format
        const grievanceTasks: Task[] = grievances.map((grievance, index) => ({
          id: index + 1,
          title: 'Grievance Review',
          citizen: grievance.citizenName || 'Unknown Citizen',
          date: new Date(grievance.createdAt).toLocaleDateString(),
          status: grievance.status,
          priority: grievance.priority || 'Medium'
        }));
        
        // Process certificates into tasks format
        const certificateTasks: Task[] = pendingCertificates.map((certificate, index) => ({
          id: index + 100, // Different ID range to avoid conflicts
          title: `${certificate.certificateType} Certificate`,
          citizen: certificate.applicantName || 'Unknown Citizen',
          date: new Date(certificate.createdAt).toLocaleDateString(),
          status: certificate.status,
          priority: 'Medium'
        }));
        
        // For now, we'll use placeholder data for schemes
        // since we don't have specific endpoints for these
        const schemeTasks: Task[] = [];
        
        // Combine all tasks
        const allTasks = [...grievanceTasks, ...certificateTasks, ...schemeTasks];
        setTasks(allTasks);
        
        // Set citizen records (this would come from a real API)
        setCitizenRecords([
          // This would be populated from real data
        ]);
        
        // Update stats
        setStats({
          pendingCertificates: certificateTasks.length,
          grievancesAssigned: grievanceTasks.length,
          requestsInQueue: schemeTasks.length
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching real-time data:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (user?.userType !== 'Staff') {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['Staff']}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex">
        {/* Sidebar */}
        <Sidebar userType="Staff" />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col md:ml-0">
          {/* Header */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
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
              {/* Dashboard Widgets */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Pending Certificates</h3>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingCertificates}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-red-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Grievances Assigned</h3>
                        <p className="text-2xl font-bold text-gray-900">{stats.grievancesAssigned}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Requests in Queue</h3>
                        <p className="text-2xl font-bold text-gray-900">{stats.requestsInQueue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Tracker and Citizen Records */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Task Tracker */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Task Tracker</h2>
                    <Link href="/services" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                      View All
                    </Link>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : tasks.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citizen</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.citizen}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                  {task.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No tasks assigned at the moment.</p>
                  )}
                </div>

                {/* Citizen Records */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Citizen Records</h2>
                    <Link href="/citizens" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                      View All
                    </Link>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : citizenRecords.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {citizenRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.service}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No citizen records to display.</p>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}