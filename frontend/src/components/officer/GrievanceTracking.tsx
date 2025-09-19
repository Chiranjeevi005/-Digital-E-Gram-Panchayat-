'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateAndDownloadReport } from '../../utils/fileUtils';
import { apiClient } from '../../lib/api';

interface Grievance {
  _id: string;
  citizenId: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function GrievanceTracking() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        setLoading(true);
        setError(null);
        const allGrievances: Grievance[] = await apiClient.getAllGrievances();
        setGrievances(allGrievances);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching grievances:', error);
        setError('Failed to fetch grievances data');
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-amber-100 text-amber-800';
      case 'in-progress':
        return 'bg-emerald-100 text-emerald-800';
      case 'resolved':
        return 'bg-teal-100 text-teal-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    // Since priority isn't in the model, we'll derive it from status or category
    // For now, we'll use a default color scheme
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const COLORS = ['#F59E0B', '#10B981', '#0D9488', '#6B7280'];

  const handleDownloadReport = async (format: 'pdf' | 'jpg') => {
    const reportData = {
      "Grievance Summary": {
        "Total Grievances": grievances.length.toString(),
        "Open Grievances": grievances.filter(g => g.status === 'open').length.toString(),
        "Resolved Grievances": grievances.filter(g => g.status === 'resolved').length.toString(),
        "In Progress Grievances": grievances.filter(g => g.status === 'in-progress').length.toString(),
        "Closed Grievances": grievances.filter(g => g.status === 'closed').length.toString()
      },
      "Grievance Status Distribution": {
        "Open": grievances.filter(g => g.status === 'open').length.toString(),
        "In Progress": grievances.filter(g => g.status === 'in-progress').length.toString(),
        "Resolved": grievances.filter(g => g.status === 'resolved').length.toString(),
        "Closed": grievances.filter(g => g.status === 'closed').length.toString()
      },
      "Report Generated": new Date().toLocaleString()
    };

    await generateAndDownloadReport('Grievance Report', reportData, format);
  };

  // Calculate statistics for the charts
  const grievanceStats = {
    open: grievances.filter(g => g.status === 'open').length,
    resolved: grievances.filter(g => g.status === 'resolved').length,
    inProgress: grievances.filter(g => g.status === 'in-progress').length,
    closed: grievances.filter(g => g.status === 'closed').length
  };

  const statusData = [
    { name: 'Open', value: grievances.filter(g => g.status === 'open').length },
    { name: 'In Progress', value: grievances.filter(g => g.status === 'in-progress').length },
    { name: 'Resolved', value: grievances.filter(g => g.status === 'resolved').length },
    { name: 'Closed', value: grievances.filter(g => g.status === 'closed').length }
  ];

  // Get unique categories for the charts
  const categories = [...new Set(grievances.map(g => g.category))];
  const categoryData = categories.map(category => ({
    name: category,
    value: grievances.filter(g => g.category === category).length
  }));

  // Prepare data for the bar chart
  const barChartData = [
    { name: 'Open', count: grievanceStats.open },
    { name: 'In Progress', count: grievanceStats.inProgress },
    { name: 'Resolved', count: grievanceStats.resolved },
    { name: 'Closed', count: grievanceStats.closed }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Grievance Tracking</h2>
          <p className="text-gray-600 mt-1">Monitor citizen grievances and resolution status</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => handleDownloadReport('pdf')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
          <button 
            onClick={() => handleDownloadReport('jpg')}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download JPG
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Grievance Statistics */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Grievance Statistics
          </h3>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-amber-600">{grievanceStats.open}</div>
              <div className="text-sm text-gray-600">Open</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-emerald-600">{grievanceStats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-teal-600">{grievanceStats.resolved}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-600">{grievanceStats.closed}</div>
              <div className="text-sm text-gray-600">Closed</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }} 
                />
                <Bar dataKey="count" fill="#10B981" name="Grievances" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grievance Category Distribution */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Grievance Category Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => {
                    const percentage = typeof percent === 'number' ? percent : 0;
                    return `${name} ${(percentage * 100).toFixed(0)}%`;
                  }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Grievances */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Recent Grievances
        </h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : grievances.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No grievances found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citizen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grievances.map((grievance) => (
                  <tr key={grievance._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {grievance.citizenId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grievance.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grievance.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(grievance.status)}`}>
                        {grievance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(grievance.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}