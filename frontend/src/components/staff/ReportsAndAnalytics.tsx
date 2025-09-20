'use client';

import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { generateAndDownloadReport } from '../../utils/fileUtils';

export default function ReportsAndAnalytics() {
  // Mock data for certificates processed
  const certificatesData = [
    { date: '2023-05-01', birth: 12, death: 8, marriage: 5, income: 15, caste: 7, residence: 10 },
    { date: '2023-05-08', birth: 15, death: 6, marriage: 7, income: 12, caste: 9, residence: 11 },
    { date: '2023-05-15', birth: 10, death: 9, marriage: 6, income: 18, caste: 5, residence: 13 },
    { date: '2023-05-22', birth: 14, death: 7, marriage: 8, income: 14, caste: 11, residence: 9 },
    { date: '2023-05-29', birth: 11, death: 10, marriage: 9, income: 16, caste: 8, residence: 12 },
    { date: '2023-06-05', birth: 13, death: 8, marriage: 7, income: 17, caste: 6, residence: 14 },
  ];

  // Mock data for grievances resolved
  const grievancesData = [
    { week: 'Week 1', open: 25, inProgress: 15, resolved: 10 },
    { week: 'Week 2', open: 20, inProgress: 18, resolved: 12 },
    { week: 'Week 3', open: 18, inProgress: 16, resolved: 14 },
    { week: 'Week 4', open: 15, inProgress: 14, resolved: 16 },
    { week: 'Week 5', open: 12, inProgress: 12, resolved: 18 },
    { week: 'Week 6', open: 10, inProgress: 10, resolved: 20 },
  ];

  // Mock data for schemes verified
  const schemesData = [
    { name: 'PMAY Housing', value: 45 },
    { name: 'PMKSY Irrigation', value: 32 },
    { name: 'PMJDY Banking', value: 28 },
    { name: 'PMAY Pension', value: 38 },
    { name: 'PMKSY Roads', value: 25 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleExportReport = async (format: 'pdf' | 'jpg') => {
    // Generate comprehensive report data
    const reportData = {
      "Report Summary": {
        "Report Title": "Performance Analytics Report",
        "Reporting Period": "May - June 2023",
        "Generated On": new Date().toLocaleDateString(),
        "Total Certificates Processed": "245",
        "Grievances Resolved": "187",
        "Schemes Verified": "168"
      },
      "Certificates Processed": {
        "Birth Certificates": "45",
        "Death Certificates": "32",
        "Marriage Certificates": "28",
        "Income Certificates": "55",
        "Caste Certificates": "35",
        "Residence Certificates": "50"
      },
      "Grievances Status": {
        "Open Grievances": "10",
        "In Progress": "15",
        "Resolved": "187",
        "Average Resolution Time": "3.2 days"
      },
      "Schemes Verified": {
        "PMAY Housing": "45",
        "PMKSY Irrigation": "32",
        "PMJDY Banking": "28",
        "PMAY Pension": "38",
        "PMKSY Roads": "25"
      },
      "Performance Metrics": {
        "Certificate Processing Rate": "98%",
        "Grievance Resolution Rate": "92%",
        "Scheme Verification Rate": "95%",
        "Citizen Satisfaction Score": "4.2/5.0"
      }
    };

    await generateAndDownloadReport('Performance Analytics Report', reportData, format);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => handleExportReport('pdf')}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PDF
          </button>
          <button 
            onClick={() => handleExportReport('jpg')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export JPG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Certificates Processed Chart */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Certificates Processed (Weekly)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={certificatesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }} 
                />
                <Legend />
                <Bar dataKey="birth" fill="#0088FE" name="Birth Certificates" radius={[4, 4, 0, 0]} />
                <Bar dataKey="death" fill="#00C49F" name="Death Certificates" radius={[4, 4, 0, 0]} />
                <Bar dataKey="marriage" fill="#FFBB28" name="Marriage Certificates" radius={[4, 4, 0, 0]} />
                <Bar dataKey="income" fill="#FF8042" name="Income Certificates" radius={[4, 4, 0, 0]} />
                <Bar dataKey="caste" fill="#8884D8" name="Caste Certificates" radius={[4, 4, 0, 0]} />
                <Bar dataKey="residence" fill="#82ca9d" name="Residence Certificates" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grievances Resolved Chart */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Grievances Status (Weekly)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={grievancesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="open" stroke="#FFBB28" name="Open" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="inProgress" stroke="#00C49F" name="In Progress" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="resolved" stroke="#0088FE" name="Resolved" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schemes Verified Chart */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Schemes Verified
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={schemesData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"

                >
                  {schemesData.map((entry, index) => (
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Summary Statistics
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Certificates Processed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">245</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Grievances Resolved</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">187</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Schemes Verified</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">168</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}