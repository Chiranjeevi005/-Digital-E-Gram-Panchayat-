'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { apiClient } from '../../../../lib/api';

interface CertificateData {
  _id: string;
  applicantName: string;
  certificateType: string;
  date: string;
  place: string;
  status: string;
  // Add other fields as needed
}

const CertificatePreview = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id');
  
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<CertificateData>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (applicationId) {
      fetchCertificateData();
    } else {
      setError('No application ID provided');
      setLoading(false);
    }
  }, [applicationId]);

  const fetchCertificateData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<CertificateData>(`/certificates/${applicationId}/preview`);
      setCertificateData(response);
      setEditData(response);
    } catch (err) {
      console.error('Error fetching certificate data:', err);
      setError('Failed to load certificate data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (field: keyof CertificateData, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    if (!applicationId) return;
    
    try {
      setIsUpdating(true);
      setUpdateSuccess(false);
      
      // Update the certificate data
      const response = await apiClient.put<CertificateData>(
        `/certificates/${applicationId}/update`,
        editData
      );
      
      // Update the certificate data with the response
      setCertificateData(response);
      setIsEditing(false);
      setUpdateSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating certificate:', err);
      setError('Failed to update certificate data');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'jpg') => {
    try {
      if (!applicationId || !certificateData) {
        alert('Application ID not found');
        return;
      }
      
      // Create a proper filename based on certificate type
      const fileName = `${certificateData.certificateType.toLowerCase()}-certificate.${format}`;
      
      // Create a temporary link for download
      const downloadUrl = `http://localhost:3002/api/certificates/${applicationId}/download?format=${format}`;
      
      // Create an anchor element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert(`Failed to download certificate in ${format.toUpperCase()} format. Please try again.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading certificate preview...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => router.push('/services/certificates/apply')}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Apply for New Certificate
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!certificateData) {
    return (
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Certificate Not Found</h1>
              <p className="text-gray-600 mb-6">The certificate you're looking for could not be found.</p>
              <button
                onClick={() => router.push('/services/certificates/apply')}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Apply for New Certificate
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Certificate Preview Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white">Certificate Preview</h1>
                  <p className="text-emerald-100 mt-1">Review and download your certificate</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                    {certificateData.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Success Message */}
            {updateSuccess && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-emerald-700">
                      Certificate updated successfully!
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Certificate Preview Area */}
            <div className="p-6 sm:p-8">
              <div className="relative border-2 border-gray-200 rounded-xl p-8 bg-white">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  <span className="text-6xl font-bold text-gray-400 transform -rotate-45">
                    Digital e-Gram Panchayat - Official
                  </span>
                </div>
                
                {/* Government Seal */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                
                {/* Certificate Content */}
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">CERTIFICATE</h2>
                    <p className="text-xl text-gray-600">OF {certificateData.certificateType.toUpperCase()}</p>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-center text-gray-700 mb-6">
                      This is to certify that
                    </p>
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.applicantName || ''}
                        onChange={(e) => handleEditChange('applicantName', e.target.value)}
                        className="text-2xl font-bold text-center text-gray-800 border-b-2 border-emerald-500 py-1 w-full mx-auto max-w-md"
                      />
                    ) : (
                      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        {certificateData.applicantName}
                      </h3>
                    )}
                    
                    <p className="text-center text-gray-700 mb-2">
                      was involved in a {certificateData.certificateType.toLowerCase()} event
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                      <div className="flex items-center">
                        <span className="text-gray-700 mr-2">on</span>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editData.date ? new Date(editData.date).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleEditChange('date', e.target.value)}
                            className="border-b-2 border-emerald-500 py-1 text-gray-800"
                          />
                        ) : (
                          <span className="font-semibold text-gray-800">
                            {new Date(certificateData.date).toDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-700 mr-2">at</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.place || ''}
                            onChange={(e) => handleEditChange('place', e.target.value)}
                            className="border-b-2 border-emerald-500 py-1 text-gray-800"
                          />
                        ) : (
                          <span className="font-semibold text-gray-800">
                            {certificateData.place}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-gray-600">
                    <div>
                      <p>Application ID:</p>
                      <p className="font-semibold">{certificateData._id}</p>
                    </div>
                    <div>
                      <p>Status:</p>
                      <p className="font-semibold">{certificateData.status}</p>
                    </div>
                  </div>
                  
                  {/* Signature Area */}
                  <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-300">
                    <div>
                      <p className="text-gray-600 text-sm">Generated by</p>
                      <p className="font-semibold text-gray-800">Digital e-Gram Panchayat</p>
                    </div>
                    <div className="text-center">
                      <div className="mb-2">
                        <div className="border-t border-gray-400 w-32 mx-auto"></div>
                      </div>
                      <p className="text-gray-600 text-sm">Authorized Officer Signature</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:opacity-70"
                      >
                        {isUpdating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          'Update Changes'
                        )}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Details
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:shadow-md transition-all font-medium flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleDownload('jpg')}
                    className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-6 py-3 rounded-xl hover:shadow-md transition-all font-medium flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download JPG
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/services/certificates/apply')}
              className="text-emerald-600 hover:text-emerald-800 font-medium"
            >
              ← Apply for another certificate
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CertificatePreview;