'use client';

import { useState, useEffect } from 'react';
import { apiClient, Certificate } from '../../services/api';
import { useToast } from '../ToastContainer';

export default function CertificateManagement() {
  const { showToast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<'verify' | 'approve' | 'forward' | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const startTime = Date.now();
        
        // Since the API returns CertificateApplication, we'll need to transform it to Certificate
        // For now, we'll mock the transformation with placeholder data
        const allCertificateApplications = await apiClient.getAllCertificates();
        const allCertificates: Certificate[] = allCertificateApplications.map(app => ({
          id: app.id,
          _id: app.id, // Adding _id since it's required in the interface
          userId: app.userId, // Adding userId since it's required in the interface
          applicantName: 'John Doe', // Placeholder - would come from actual data
          fatherName: 'Robert Doe', // Placeholder
          motherName: 'Jane Doe', // Placeholder
          certificateType: 'Income Certificate', // Placeholder - would come from actual data
          date: new Date().toISOString(), // Placeholder
          place: 'Village Panchayat', // Placeholder
          address: '123 Main St', // Placeholder
          income: '50000', // Placeholder
          caste: 'General', // Placeholder
          supportingFiles: app.documents || [],
          status: app.status,
          appliedAt: app.appliedAt, // Adding appliedAt since it's required in the interface
          createdAt: app.appliedAt,
          documents: app.documents || [] // Adding documents since it's required in the interface
        }));
        setCertificates(allCertificates.filter(c => 
          c.status === 'Submitted' || c.status === 'In Process'
        ));
        
        // Ensure minimum loading time of 1-2 seconds for better UX
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 1000; // 1 second minimum
        if (elapsedTime < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in progress':
      case 'in process':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'open':
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowModal(true);
  };

  const handleAction = (actionType: 'verify' | 'approve' | 'forward') => {
    setAction(actionType);
    // In a real implementation, this would call the appropriate API endpoint
    // For now, we'll just show a confirmation
    showToast(`Action ${actionType} performed on certificate ${selectedCertificate?.id}`, 'success');
    setShowModal(false);
    setAction(null);
    setComment('');
  };

  const handleDownloadDocument = (fileUrl: string) => {
    // In a real implementation, this would download the document
    showToast(`Downloading document: ${fileUrl}`, 'info');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Certificate Management</h2>
          <p className="text-gray-600 mt-1">Process and manage citizen certificate applications</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search certificates..."
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
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
          <div className="bg-emerald-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates found</h3>
          <p className="text-gray-600 max-w-md mx-auto">There are no pending certificate applications at the moment. New applications will appear here once submitted.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((certificate) => (
                <tr key={certificate.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{certificate.applicantName}</div>
                    <div className="text-sm text-gray-500">{certificate.village || certificate.district || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {certificate.certificateType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {certificate.date ? new Date(certificate.date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(certificate.status)}`}>
                      {certificate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(certificate)}
                      className="text-emerald-600 hover:text-emerald-800 mr-4 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Certificate Detail Modal */}
      {showModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedCertificate.certificateType} Certificate
                  </h3>
                  <p className="text-gray-600 mt-1">Application ID: {selectedCertificate.id.substring(0, 8)}</p>
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
                      <span className="text-gray-900">{selectedCertificate.applicantName}</span>
                    </div>
                    {selectedCertificate.fatherName && (
                      <div className="flex">
                        <span className="font-medium w-36 text-gray-700">Father&apos;s Name:</span>
                        <span className="text-gray-900">{selectedCertificate.fatherName}</span>
                      </div>
                    )}
                    {selectedCertificate.motherName && (
                      <div className="flex">
                        <span className="font-medium w-36 text-gray-700">Mother&apos;s Name:</span>
                        <span className="text-gray-900">{selectedCertificate.motherName}</span>
                      </div>
                    )}
                    <div className="flex">
                      <span className="font-medium w-36 text-gray-700">Issuance Date:</span>
                      <span className="text-gray-900">{selectedCertificate.date ? new Date(selectedCertificate.date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-36 text-gray-700">Place of Issue:</span>
                      <span className="text-gray-900">{selectedCertificate.place}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Address Information
                  </h4>
                  <div className="space-y-3">
                    {selectedCertificate.address && (
                      <div className="flex">
                        <span className="font-medium w-24 text-gray-700">Address:</span>
                        <span className="text-gray-900">{selectedCertificate.address}</span>
                      </div>
                    )}
                    {selectedCertificate.ward && (
                      <div className="flex">
                        <span className="font-medium w-24 text-gray-700">Ward:</span>
                        <span className="text-gray-900">{selectedCertificate.ward}</span>
                      </div>
                    )}
                    {selectedCertificate.village && (
                      <div className="flex">
                        <span className="font-medium w-24 text-gray-700">Village:</span>
                        <span className="text-gray-900">{selectedCertificate.village}</span>
                      </div>
                    )}
                    {selectedCertificate.district && (
                      <div className="flex">
                        <span className="font-medium w-24 text-gray-700">District:</span>
                        <span className="text-gray-900">{selectedCertificate.district}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedCertificate.income && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Income Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="font-medium w-24 text-gray-700">Income:</span>
                        <span className="text-gray-900">{selectedCertificate.income}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedCertificate.caste && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Caste Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="font-medium w-24 text-gray-700">Caste:</span>
                        <span className="text-gray-900">{selectedCertificate.caste}</span>
                      </div>
                      {selectedCertificate.subCaste && (
                        <div className="flex">
                          <span className="font-medium w-24 text-gray-700">Sub-Caste:</span>
                          <span className="text-gray-900">{selectedCertificate.subCaste}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Supporting Documents
                </h4>
                {selectedCertificate.supportingFiles && selectedCertificate.supportingFiles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedCertificate.supportingFiles.map((file, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-gray-100 transition-colors">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700 truncate">Document {index + 1}</span>
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

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => handleAction('verify')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verify Documents
                </button>
                <button
                  onClick={() => handleAction('approve')}
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
                <button
                  onClick={() => handleAction('forward')}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Forward to Officer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}