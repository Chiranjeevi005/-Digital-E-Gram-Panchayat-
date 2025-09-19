'use client';

import { useState, useEffect } from 'react';
import { generateAndDownloadReport } from '../../utils/fileUtils';
import { useToast } from '../../components/ToastContainer';
import { apiClient } from '../../lib/api';

interface SchemeApplication {
  _id: string;
  citizenId: string;
  schemeId: string;
  schemeName: string;
  applicantName: string;
  fatherName: string;
  address: string;
  phone: string;
  email: string;
  income: string;
  caste: string;
  documents: string[];
  status: string;
  submittedAt: string;
  updatedAt: string;
  remarks?: string;
}

export default function SchemeApplications() {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<SchemeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<SchemeApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('pending');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const startTime = Date.now();
        
        // Fetch scheme applications from API
        const schemeApplications: SchemeApplication[] = await apiClient.getSchemeApplications('all');
        
        // Ensure minimum loading time of 1-2 seconds for better UX
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 1000; // 1 second minimum
        if (elapsedTime < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
        }
        
        setApplications(schemeApplications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scheme applications:', error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (application: SchemeApplication) => {
    setSelectedApplication(application);
    setStatus(application.status);
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication) return;
    
    try {
      // In a real implementation, this would call the API to update the application
      // await apiClient.updateSchemeApplication(selectedApplication._id, { status, remarks });
      
      // Update local state
      const updatedApplications = applications.map(app => 
        app._id === selectedApplication._id ? { ...app, status, remarks } : app
      );
      setApplications(updatedApplications);
      
      // Update selected application
      setSelectedApplication({ ...selectedApplication, status, remarks });
      
      showToast(`Application status updated to ${status}`, 'success');
      setShowModal(false);
    } catch (error) {
      console.error('Error updating application:', error);
      showToast('Failed to update application status', 'error');
    }
  };

  const handleDownloadDocument = (fileUrl: string) => {
    // In a real implementation, this would download the document
    // For now, we'll simulate a document download
    const link = document.createElement('a');
    link.href = '#'; // In a real app, this would be the actual file URL
    link.download = fileUrl;
    link.click();
    showToast(`Downloading document: ${fileUrl}`, 'info');
  };

  const handleVerifyDocs = async (application: SchemeApplication) => {
    // Generate document verification report
    const verificationData = {
      "Verification Report": {
        "Application ID": application._id,
        "Applicant Name": application.applicantName,
        "Scheme Name": application.schemeName,
        "Verification Date": new Date().toLocaleDateString(),
        "Verification Status": "Verified",
        "Verified By": "Staff User"
      },
      "Document Details": {
        "Total Documents": application.documents.length,
        "Documents Verified": application.documents.join(', '),
        "Verification Notes": "All documents verified successfully",
        "Additional Remarks": "No discrepancies found"
      },
      "Verification Checklist": {
        "Aadhaar Verification": "Completed",
        "Income Certificate": "Verified",
        "Land Ownership": "Confirmed",
        "Caste Certificate": "Validated",
        "Bank Passbook": "Authenticated"
      }
    };

    await generateAndDownloadReport(`Document Verification - ${application.applicantName}`, verificationData, 'pdf');
  };

  const handleExportReport = async () => {
    // Generate scheme-wise progress report
    const reportData = {
      "Report Summary": {
        "Report Title": "Scheme Applications Progress Report",
        "Reporting Period": "June 2023",
        "Generated On": new Date().toLocaleDateString(),
        "Total Applications": "156",
        "Approved Applications": "98",
        "Pending Applications": "32",
        "Rejected Applications": "26"
      },
      "Scheme Distribution": {
        "PMAY Housing Scheme": "45 applications",
        "PMKSY Irrigation Scheme": "32 applications",
        "PMJDY Banking Scheme": "28 applications",
        "PMAY Pension Scheme": "25 applications",
        "PMKSY Roads Scheme": "26 applications"
      },
      "Application Status": {
        "Approved": "98 applications (63%)",
        "Pending Review": "32 applications (20%)",
        "In Progress": "15 applications (10%)",
        "Rejected": "26 applications (7%)"
      },
      "Performance Metrics": {
        "Average Processing Time": "2.8 days",
        "Approval Rate": "86%",
        "Rejection Rate": "14%",
        "Pending Resolution": "32 cases"
      }
    };

    // Default to PDF format for reports
    await generateAndDownloadReport('Scheme Applications Progress Report', reportData, 'pdf');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Scheme Applications</h2>
          <p className="text-gray-600 mt-1">Review and process citizen scheme applications</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
            <option>All Schemes</option>
            <option>PMAY Housing Scheme</option>
            <option>PMKSY Irrigation Scheme</option>
            <option>PMJDY Banking Scheme</option>
          </select>
          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button 
            onClick={handleExportReport}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
          <div className="bg-amber-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600 max-w-md mx-auto">There are no scheme applications at the moment. New applications will appear here once submitted.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheme</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{application.applicantName}</div>
                    <div className="text-sm text-gray-500">
                      {application.address.split(',')[application.address.split(',').length - 1].trim() || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.schemeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(application)}
                      className="text-emerald-600 hover:text-emerald-800 mr-4 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                    <button 
                      onClick={() => handleVerifyDocs(application)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verify Docs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedApplication.schemeName} Application
                  </h3>
                  <p className="text-gray-600">Application ID: {selectedApplication._id.substring(0, 8)}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Applicant Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium w-36 text-gray-700">Full Name:</span>
                      <span className="text-gray-900">{selectedApplication.applicantName}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-36 text-gray-700">Father's Name:</span>
                      <span className="text-gray-900">{selectedApplication.fatherName}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-36 text-gray-700">Address:</span>
                      <span className="text-gray-900">{selectedApplication.address}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-36 text-gray-700">Phone:</span>
                      <span className="text-gray-900">{selectedApplication.phone}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-36 text-gray-700">Email:</span>
                      <span className="text-gray-900">{selectedApplication.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Scheme Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium w-24 text-gray-700">Scheme:</span>
                      <span className="text-gray-900">{selectedApplication.schemeName}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24 text-gray-700">Income:</span>
                      <span className="text-gray-900">{selectedApplication.income}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24 text-gray-700">Caste:</span>
                      <span className="text-gray-900">{selectedApplication.caste}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24 text-gray-700">Status:</span>
                      <span>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedApplication.status)}`}>
                          {selectedApplication.status}
                        </span>
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24 text-gray-700">Submitted:</span>
                      <span className="text-gray-900">{new Date(selectedApplication.submittedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Supporting Documents
                </h4>
                {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedApplication.documents.map((file, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-gray-100 transition-colors">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700 truncate">{file}</span>
                        </div>
                        <button
                          onClick={() => handleDownloadDocument(file)}
                          className="text-emerald-600 hover:text-emerald-800 p-1 rounded-full hover:bg-emerald-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No supporting documents uploaded.</p>
                )}
              </div>

              <div className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Processing Actions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Add remarks about the verification process..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    showToast('Recommendation for approval sent to Officer', 'success');
                    setShowModal(false);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Recommend Approval
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}