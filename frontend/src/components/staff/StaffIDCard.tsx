'use client';

import { useAuth } from '../../context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const StaffIDCard = () => {
  const { user } = useAuth();

  const downloadStaffID = async (format: 'pdf' | 'jpg') => {
    const idCardElement = document.getElementById('staff-id-card');
    if (!idCardElement) return;

    try {
      // Use html2canvas to capture the ID card element
      const canvas = await html2canvas(idCardElement, {
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
        link.download = `staff-id-${user?.id}.jpg`;
        link.click();
      } else {
        // Convert to PDF and download
        const imgWidth = 80;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [imgWidth, imgHeight + 10] // Add some padding
        });
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 5, imgWidth, imgHeight);
        pdf.save(`staff-id-${user?.id}.pdf`);
      }
    } catch (error) {
      console.error('Error generating ID card:', error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hidden ID Card for rendering */}
      <div 
        id="staff-id-card" 
        className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border-2 border-blue-200 shadow-xl w-80 hidden print:block"
        style={{ 
          fontFamily: 'Arial, sans-serif',
          width: '320px',
          minHeight: '200px'
        }}
      >
        {/* Header with logo and title */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-blue-300">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-800">Digital E-Panchayat</h1>
              <p className="text-xs text-blue-600">Official Staff Identification</p>
            </div>
          </div>
          <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            OFFICIAL
          </div>
        </div>

        {/* Staff Photo Placeholder */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Staff Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="text-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">{user?.name || 'Staff Member'}</h2>
            <p className="text-sm text-blue-600 font-medium">{user?.userType || 'Staff'}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Staff ID:</span>
              <span className="font-medium text-gray-800">{user?.id ? user.id.substring(0, 8).toUpperCase() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="font-medium text-gray-800 truncate max-w-[120px]">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Issued:</span>
              <span className="font-medium text-gray-800">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Valid Until:</span>
              <span className="font-medium text-gray-800">Dec 31, 2025</span>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure ID</span>
          </div>
          <div>
            <span>www.epanchayat.gov.in</span>
          </div>
        </div>
      </div>

      {/* Visible ID Card Preview */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border-2 border-blue-200 shadow-xl w-80 mb-6">
        {/* Header with logo and title */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-blue-300">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-800">Digital E-Panchayat</h1>
              <p className="text-xs text-blue-600">Official Staff Identification</p>
            </div>
          </div>
          <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            OFFICIAL
          </div>
        </div>

        {/* Staff Photo Placeholder */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Staff Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="text-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">{user?.name || 'Staff Member'}</h2>
            <p className="text-sm text-blue-600 font-medium">{user?.userType || 'Staff'}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Staff ID:</span>
              <span className="font-medium text-gray-800">{user?.id ? user.id.substring(0, 8).toUpperCase() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="font-medium text-gray-800 truncate max-w-[120px]">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Issued:</span>
              <span className="font-medium text-gray-800">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Valid Until:</span>
              <span className="font-medium text-gray-800">Dec 31, 2025</span>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure ID</span>
          </div>
          <div>
            <span>www.epanchayat.gov.in</span>
          </div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => downloadStaffID('pdf')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
        <button
          onClick={() => downloadStaffID('jpg')}
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

export default StaffIDCard;