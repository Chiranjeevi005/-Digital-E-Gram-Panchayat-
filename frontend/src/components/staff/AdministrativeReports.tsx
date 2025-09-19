'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AdministrativeReports = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('performance');
  
  // Mock data for reports
  const reportData = {
    performance: {
      'Staff Information': {
        'Staff Name': user?.name || 'N/A',
        'Staff ID': user?.id ? user.id.substring(0, 8).toUpperCase() : 'N/A',
        'Role': user?.userType || 'N/A',
        'Department': 'Administration',
        'Reporting Period': 'Jan 2025 - Dec 2025'
      },
      'Performance Metrics': {
        'Certificates Processed': '142',
        'Grievances Resolved': '87',
        'Citizen Records Updated': '215',
        'Scheme Applications Reviewed': '96',
        'Average Response Time': '2.3 days'
      },
      'Achievements': {
        'On-time Delivery Rate': '94%',
        'Citizen Satisfaction': '4.7/5.0',
        'Special Recognition': 'Q1 Excellence Award'
      }
    },
    activity: {
      'Staff Information': {
        'Staff Name': user?.name || 'N/A',
        'Staff ID': user?.id ? user.id.substring(0, 8).toUpperCase() : 'N/A',
        'Role': user?.userType || 'N/A',
        'Department': 'Administration',
        'Reporting Period': 'Jan 2025 - Dec 2025'
      },
      'Recent Activities': {
        'Certificates Issued': '32',
        'Grievances Handled': '18',
        'Records Updated': '45',
        'Applications Processed': '27'
      },
      'Upcoming Tasks': {
        'Pending Certificates': '12',
        'Open Grievances': '5',
        'Scheduled Reviews': '8'
      }
    }
  };

  const downloadReport = async (format: 'pdf' | 'jpg') => {
    const reportElement = document.getElementById('admin-report');
    if (!reportElement) return;

    try {
      // Use html2canvas to capture the report element
      const canvas = await html2canvas(reportElement, {
        scale: 2, // Higher quality
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });

      if (format === 'jpg') {
        // Convert to JPG and download
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `admin-report-${selectedReport}-${user?.id}.jpg`;
        link.click();
      } else {
        // Convert to PDF and download
        const imgWidth = 180;
        const pageHeight = 250;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 15, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`admin-report-${selectedReport}-${user?.id}.pdf`);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Report Selection */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedReport('performance')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedReport === 'performance'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Performance Report
        </button>
        <button
          onClick={() => setSelectedReport('activity')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedReport === 'activity'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Activity Summary
        </button>
      </div>

      {/* Hidden Report for rendering */}
      <div 
        id="admin-report" 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg w-full max-w-2xl hidden print:block"
        style={{ 
          fontFamily: 'Arial, sans-serif',
          width: '700px',
          minHeight: '500px'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Digital E-Panchayat</h1>
              <p className="text-blue-600 font-medium">
                {selectedReport === 'performance' ? 'Staff Performance Report' : 'Activity Summary Report'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full inline-block">
              CONFIDENTIAL
            </div>
            <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {Object.entries(reportData[selectedReport as keyof typeof reportData]).map(([section, data]) => (
            <div key={section} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                <h2 className="text-lg font-bold text-white">{section}</h2>
              </div>
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 font-medium">{key}</span>
                      <span className="text-gray-900 font-semibold">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            This is an official report generated by Digital E-Panchayat System
          </p>
          <p className="text-xs text-gray-400 mt-1">
            For administrative use only. Unauthorized distribution is prohibited.
          </p>
        </div>
      </div>

      {/* Visible Report Preview */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg w-full max-w-2xl mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Digital E-Panchayat</h1>
              <p className="text-blue-600 font-medium">
                {selectedReport === 'performance' ? 'Staff Performance Report' : 'Activity Summary Report'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full inline-block">
              CONFIDENTIAL
            </div>
            <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {Object.entries(reportData[selectedReport as keyof typeof reportData]).map(([section, data]) => (
            <div key={section} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                <h2 className="text-lg font-bold text-white">{section}</h2>
              </div>
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 font-medium">{key}</span>
                      <span className="text-gray-900 font-semibold">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            This is an official report generated by Digital E-Panchayat System
          </p>
          <p className="text-xs text-gray-400 mt-1">
            For administrative use only. Unauthorized distribution is prohibited.
          </p>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => downloadReport('pdf')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
        <button
          onClick={() => downloadReport('jpg')}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download JPG
        </button>
      </div>
    </div>
  );
};

export default AdministrativeReports;