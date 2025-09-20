'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateAndDownloadReport } from '../../utils/fileUtils';
import { apiClient, CertificateApplication, Certificate } from '../../lib/api';



export default function CertificatesMonitor() {
  const [certificates, setCertificates] = useState<CertificateApplication[]>([]); // Changed from Certificate[] to CertificateApplication[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        const certificateApplications: CertificateApplication[] = await apiClient.getAllCertificates();
        // No need to transform since we're using the correct type
        setCertificates(certificateApplications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setError('Failed to fetch certificates data');
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-emerald-100 text-emerald-800';
      case 'in process':
        return 'bg-amber-100 text-amber-800';
      case 'ready':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const COLORS = ['#10B981', '#F59E0B', '#0D9488'];

  const handleDownloadReport = async (format: 'pdf' | 'jpg') => {
    const reportData = {
      "Certificate Applications Summary": {
        "Total Applications": certificates.length.toString(),
        "Birth Certificates": certificates.filter(c => c.certificateType === 'Birth').length.toString(),
        "Death Certificates": certificates.filter(c => c.certificateType === 'Death').length.toString(),
        "Marriage Certificates": certificates.filter(c => c.certificateType === 'Marriage').length.toString(),
        "Income Certificates": certificates.filter(c => c.certificateType === 'Income').length.toString(),
        "Caste Certificates": certificates.filter(c => c.certificateType === 'Caste').length.toString(),
        "Residence Certificates": certificates.filter(c => c.certificateType === 'Residence').length.toString()
      },
      "Application Status": {
        "Submitted": certificates.filter(c => c.status === 'Submitted').length.toString(),
        "In Process": certificates.filter(c => c.status === 'In Process').length.toString(),
        "Ready": certificates.filter(c => c.status === 'Ready').length.toString()
      },
      "Report Generated": new Date().toLocaleString()
    };

    await generateAndDownloadReport('Certificates Report', reportData, format);
  };

  // Calculate statistics for the charts
  const certificateStats = {
    birth: certificates.filter(c => c.certificateType === 'Birth').length,
    death: certificates.filter(c => c.certificateType === 'Death').length,
    marriage: certificates.filter(c => c.certificateType === 'Marriage').length,
    income: certificates.filter(c => c.certificateType === 'Income').length,
    caste: certificates.filter(c => c.certificateType === 'Caste').length,
    residence: certificates.filter(c => c.certificateType === 'Residence').length
  };

  const statusData = [
    { name: 'Submitted', value: certificates.filter(c => c.status === 'Submitted').length },
    { name: 'In Process', value: certificates.filter(c => c.status === 'In Process').length },
    { name: 'Ready', value: certificates.filter(c => c.status === 'Ready').length }
  ];

  // Prepare data for the bar chart
  const barChartData = [
    { name: 'Birth', count: certificateStats.birth },
    { name: 'Death', count: certificateStats.death },
    { name: 'Marriage', count: certificateStats.marriage },
    { name: 'Income', count: certificateStats.income },
    { name: 'Caste', count: certificateStats.caste },
    { name: 'Residence', count: certificateStats.residence }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Certificates Monitor</h2>
          <p className="text-gray-600 mt-1">Track certificate applications by type and status</p>
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
        {/* Certificate Applications by Type */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Certificate Applications by Type
          </h3>
          <div className="h-80">
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
                <Bar dataKey="count" fill="#10B981" name="Applications" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Status Distribution */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Application Status Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
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
                  {statusData.map((entry, index) => (
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

      {/* Recent Certificate Applications */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Recent Certificate Applications
        </h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No certificate applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certificates.map((certificate) => (
                  <tr key={certificate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {certificate.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {certificate.certificateType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(certificate.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(certificate.status)}`}>
                        {certificate.status}
                      </span>
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