'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { generateAndDownloadReport } from '../../services/fileUtils';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  certificatesHandled: number;
  grievancesUpdated: number;
  schemesProcessed: number;
}

export default function StaffActivity() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [performanceData] = useState([
    { name: 'Staff 1', certificates: 45, grievances: 32, schemes: 28 },
    { name: 'Staff 2', certificates: 38, grievances: 29, schemes: 35 },
    { name: 'Staff 3', certificates: 52, grievances: 41, schemes: 22 },
    { name: 'Staff 4', certificates: 31, grievances: 27, schemes: 30 },
    { name: 'Staff 5', certificates: 44, grievances: 35, schemes: 26 }
  ]);

  useEffect(() => {
    const fetchStaffActivity = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would fetch actual data
        // const staffData: StaffMember[] = await apiClient.getStaffActivity();
        // setStaffMembers(staffData);
        
        // Mock data for demonstration
        const mockStaff: StaffMember[] = [
          { id: '1', name: 'Amit Sharma', role: 'Certificate Processor', certificatesHandled: 45, grievancesUpdated: 32, schemesProcessed: 28 },
          { id: '2', name: 'Priya Patel', role: 'Grievance Handler', certificatesHandled: 38, grievancesUpdated: 29, schemesProcessed: 35 },
          { id: '3', name: 'Rajesh Kumar', role: 'Scheme Verifier', certificatesHandled: 52, grievancesUpdated: 41, schemesProcessed: 22 },
          { id: '4', name: 'Sunita Verma', role: 'General Staff', certificatesHandled: 31, grievancesUpdated: 27, schemesProcessed: 30 },
          { id: '5', name: 'Vikram Singh', role: 'Certificate Processor', certificatesHandled: 44, grievancesUpdated: 35, schemesProcessed: 26 },
        ];
        setStaffMembers(mockStaff);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching staff activity:', error);
        setLoading(false);
      }
    };

    fetchStaffActivity();
  }, []);

  const handleDownloadReport = async (format: 'pdf' | 'jpg') => {
    const reportData = {
      "Staff Activity Summary": {
        "Total Staff Members": staffMembers.length.toString(),
        "Average Certificates Handled": (staffMembers.reduce((sum, staff) => sum + staff.certificatesHandled, 0) / staffMembers.length).toFixed(2),
        "Average Grievances Updated": (staffMembers.reduce((sum, staff) => sum + staff.grievancesUpdated, 0) / staffMembers.length).toFixed(2),
        "Average Schemes Processed": (staffMembers.reduce((sum, staff) => sum + staff.schemesProcessed, 0) / staffMembers.length).toFixed(2)
      },
      "Staff Performance Details": staffMembers.reduce((acc, staff) => {
        acc[staff.name] = `Role: ${staff.role}, Certificates: ${staff.certificatesHandled}, Grievances: ${staff.grievancesUpdated}, Schemes: ${staff.schemesProcessed}`;
        return acc;
      }, {} as Record<string, string>),
      "Report Generated": new Date().toLocaleString()
    };

    await generateAndDownloadReport('Staff Activity Report', reportData, format);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Activity</h2>
          <p className="text-gray-600 mt-1">Monitor staff performance and workload distribution</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Staff Performance Overview */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Staff Performance Overview
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
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
                <Bar dataKey="certificates" fill="#10B981" name="Certificates" radius={[4, 4, 0, 0]} />
                <Bar dataKey="grievances" fill="#0D9488" name="Grievances" radius={[4, 4, 0, 0]} />
                <Bar dataKey="schemes" fill="#8B5CF6" name="Schemes" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Performance Trend */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Staff Performance Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                <Line type="monotone" dataKey="certificates" stroke="#10B981" name="Certificates" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="grievances" stroke="#0D9488" name="Grievances" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="schemes" stroke="#8B5CF6" name="Schemes" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Staff Activity List */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Staff Activity Details
        </h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : staffMembers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No staff activity data found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificates Handled</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grievances Updated</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schemes Processed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffMembers.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {staff.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.certificatesHandled}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.grievancesUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.schemesProcessed}
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