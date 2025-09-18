'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

interface Application {
  id: string;
  serviceType: 'Certificates' | 'Grievances' | 'Schemes' | 'Property';
  title: string;
  status: 'Pending' | 'In Review' | 'Approved' | 'Rejected' | 'Resolved';
  date: string;
  referenceNumber: string;
}

export default function TrackingPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching applications
    const fetchApplications = async () => {
      try {
        // In a real app, you would fetch this data from your API
        setTimeout(() => {
          const mockApplications: Application[] = [
            {
              id: 'CERT-001',
              serviceType: 'Certificates',
              title: 'Birth Certificate Application',
              status: 'Approved',
              date: '2023-05-15',
              referenceNumber: 'REF-2023-001'
            },
            {
              id: 'GRV-002',
              serviceType: 'Grievances',
              title: 'Road Maintenance Complaint',
              status: 'Resolved',
              date: '2023-05-10',
              referenceNumber: 'REF-2023-002'
            },
            {
              id: 'SCH-003',
              serviceType: 'Schemes',
              title: 'Housing Subsidy Application',
              status: 'In Review',
              date: '2023-05-05',
              referenceNumber: 'REF-2023-003'
            },
            {
              id: 'PROP-004',
              serviceType: 'Property',
              title: 'Property Tax Payment',
              status: 'Approved',
              date: '2023-05-01',
              referenceNumber: 'REF-2023-004'
            },
            {
              id: 'CERT-005',
              serviceType: 'Certificates',
              title: 'Caste Certificate Application',
              status: 'Pending',
              date: '2023-04-28',
              referenceNumber: 'REF-2023-005'
            },
          ];
          setApplications(mockApplications);
          setFilteredApplications(mockApplications);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  useEffect(() => {
    // Apply filters
    let result = applications;
    
    if (searchTerm) {
      result = result.filter(app => 
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status.toLowerCase() === statusFilter);
    }
    
    if (serviceFilter !== 'all') {
      result = result.filter(app => app.serviceType === serviceFilter);
    }
    
    setFilteredApplications(result);
  }, [searchTerm, statusFilter, serviceFilter, applications]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Review': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceColor = (serviceType: string) => {
    switch (serviceType) {
      case 'Certificates': return 'bg-blue-100 text-blue-800';
      case 'Grievances': return 'bg-red-100 text-red-800';
      case 'Schemes': return 'bg-green-100 text-green-800';
      case 'Property': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (applicationId: string) => {
    // In a real app, you would download the document
    alert(`Downloading document for application ${applicationId}`);
  };

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['Citizen']}>
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        
        <main className="flex-grow">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 py-12 sm:py-16">
            <div className="responsive-container text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Track Your Applications
              </h1>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                Monitor the status of all your applications and services in one place
              </p>
            </div>
          </div>

          <div className="responsive-container py-8 sm:py-12">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Applications
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      placeholder="Search by title or reference number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type
                  </label>
                  <select
                    id="service"
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Services</option>
                    <option value="Certificates">Certificates</option>
                    <option value="Grievances">Grievances</option>
                    <option value="Schemes">Schemes</option>
                    <option value="Property">Property</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Your Applications ({filteredApplications.length})
                </h2>
              </div>
              
              {loading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              ) : filteredApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reference
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {application.referenceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getServiceColor(application.serviceType)}`}>
                              {application.serviceType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {application.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {application.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                              {application.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleDownload(application.id)}
                              className="text-emerald-600 hover:text-emerald-900 font-medium"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all' || serviceFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria' 
                      : 'You haven\'t submitted any applications yet'}
                  </p>
                  <div className="mt-6">
                    <Link href="/services" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                      Browse Services
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}