'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { apiClient } from '../../../../lib/api';
import { useToast } from '../../../../components/ToastContainer';

interface CertificateData {
  _id: string;
  applicantName: string;
  fatherName?: string;
  motherName?: string;
  certificateType: string;
  date: string;
  place: string;
  status: string;
}

const CertificatePreviewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id');
  const { showToast } = useToast();
  
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<CertificateData>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  // New states for download progress
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

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
      setError(null);
      const response = await apiClient.get<CertificateData>(`/certificates/${applicationId}/preview`);
      setCertificateData(response);
      setEditData(response);
    } catch (err: unknown) {
      console.error('Error fetching certificate data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load certificate data. Please try again later.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
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
      setError(null);
      
      // Update the certificate data
      const response = await apiClient.put<CertificateData>(
        `/certificates/${applicationId}/update`,
        editData
      );
      
      // Update the certificate data with the response
      setCertificateData(response);
      setIsEditing(false);
      
      // Show success message
      setUpdateSuccess(true);
      showToast('Certificate updated successfully!', 'success');
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: unknown) {
      console.error('Error updating certificate:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update certificate data. Please try again later.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'jpg') => {
    try {
      if (!applicationId || !certificateData) {
        showToast('Application ID not found', 'error');
        return;
      }
      
      // Show download progress for at least 10 seconds with mobile-friendly design
      setIsDownloading(true);
      setDownloadProgress(0);
      setDownloadStatus('Preparing your certificate...');
      
      // Extended progress simulation for at least 10 seconds
      const progressSteps = [
        { progress: 10, status: 'Validating certificate details...' },
        { progress: 20, status: 'Generating document...' },
        { progress: 30, status: 'Adding official seal...' },
        { progress: 40, status: 'Applying watermark...' },
        { progress: 50, status: 'Formatting document...' },
        { progress: 60, status: 'Optimizing file size...' },
        { progress: 70, status: 'Preparing download...' },
        { progress: 80, status: 'Almost ready...' },
        { progress: 90, status: 'Finalizing...' },
        { progress: 100, status: 'Download ready!' }
      ];
      
      for (let i = 0; i < progressSteps.length; i++) {
        const { progress, status } = progressSteps[i];
        setDownloadProgress(progress);
        setDownloadStatus(status);
        
        // Wait for at least 10 seconds total (10000ms / 10 steps = 1000ms per step)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Use the API client to download the file
      const blob = await apiClient.download(`/certificates/${applicationId}/download?format=${format}`);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificateData.certificateType.toLowerCase()}-certificate.${format}`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message and confetti
      setTimeout(() => {
        setIsDownloading(false);
        setShowConfetti(true);
        // Show success toast
        showToast(`Certificate downloaded as ${format.toUpperCase()} successfully!`, 'success');
        setUpdateSuccess(true);
        setTimeout(() => {
          setUpdateSuccess(false);
          setShowConfetti(false);
        }, 3000);
      }, 500);
    } catch (error: unknown) {
      console.error(`Error downloading ${format.toUpperCase()} certificate:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to download certificate in ${format.toUpperCase()} format. Please check your connection and try again.`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        <main className="flex-grow responsive-container py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              {/* Certificate Preview Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <div className="h-6 bg-emerald-500 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-emerald-400 rounded w-64"></div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="h-6 bg-emerald-500 rounded w-24"></div>
                  </div>
                </div>
              </div>
              
              {/* Certificate Preview Area */}
              <div className="p-6 sm:p-8">
                <div className="relative border-2 border-gray-300 rounded-xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
                  {/* Skeleton content */}
                  <div className="space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
                    <div className="h-px bg-gray-200 w-32 mx-auto"></div>
                    
                    <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-8"></div>
                    <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    
                    <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-8"></div>
                    <div className="flex justify-center space-x-8">
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-12">
                      <div className="h-16 bg-gray-200 rounded"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                    
                    <div className="flex justify-between items-end pt-10 border-t border-gray-200">
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="h-12 bg-gray-200 rounded w-48"></div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="h-12 bg-gray-200 rounded w-48"></div>
                    <div className="h-12 bg-gray-200 rounded w-48"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Update the download progress section for better mobile responsiveness
  if (isDownloading) {
    return (
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        <main className="flex-grow responsive-container py-8 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Your Certificate</h2>
              <p className="text-gray-600">{downloadStatus}</p>
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0%</span>
                <span>{downloadProgress}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-1 mt-4">
              {[...Array(10)].map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    downloadProgress >= (index + 1) * 10 ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              {downloadStatus}
            </p>
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
        <main className="flex-grow responsive-container py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={fetchCertificateData}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  Retry
                </button>
                <button
                  onClick={() => router.push('/services/certificates/apply')}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Apply for New Certificate
                </button>
              </div>
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
        <main className="flex-grow responsive-container py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Certificate Not Found</h1>
              <p className="text-gray-600 mb-6">The certificate you&apos;re looking for could not be found.</p>
              <button
                onClick={() => router.push('/services/certificates/apply')}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      
      {/* Confetti effect when download is successful */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}
      
      <main className="flex-grow responsive-container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Certificate Preview Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Certificate Preview</h1>
                  <p className="text-emerald-100 mt-1 text-sm sm:text-base">Review and download your certificate</p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-white bg-opacity-20 text-white">
                    {certificateData.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Success Message */}
            {(updateSuccess || isDownloading === false && downloadProgress === 100) && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 sm:p-4 animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <p className="text-sm text-emerald-700">
                      {isDownloading === false && downloadProgress === 100 
                        ? "Your certificate has been successfully downloaded!" 
                        : "Certificate updated successfully!"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 animate-shake">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Certificate Preview Area - Optimized for better flow and responsiveness */}
            <div className="p-4 sm:p-6">
              <div className="relative border-2 border-gray-300 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg max-w-2xl mx-auto">
                {/* Elegant border/frame around page */}
                <div className="absolute inset-0 border-2 sm:border-4 border-blue-800 rounded-xl pointer-events-none"></div>
                
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  <span className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-blue-200 transform -rotate-12">
                    Digital e-Gram Panchayat - Official
                  </span>
                </div>
                
                {/* Government Seal */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-amber-800 rounded-full flex items-center justify-center border-2 sm:border-4 border-amber-900 shadow-lg animate-float">
                  <div className="text-center text-white text-[0.5rem] sm:text-xs font-semibold">
                    <div>Digital</div>
                    <div>e-Gram</div>
                    <div>Panchayat</div>
                    <div>Official</div>
                    <div>Seal</div>
                  </div>
                </div>
                
                {/* Certificate Content */}
                <div className="relative z-10">
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-blue-800 mb-1">CERTIFICATE</h2>
                    <p className="text-lg sm:text-xl font-serif text-gray-700">OF {certificateData.certificateType.toUpperCase()}</p>
                    
                    {/* Decorative line under title */}
                    <div className="w-16 sm:w-24 h-0.5 bg-blue-800 mx-auto mt-2 sm:mt-3"></div>
                  </div>
                  
                  <div className="mb-6 sm:mb-8">
                    <p className="text-center text-gray-700 text-sm sm:text-base mb-4 sm:mb-6">
                      This is to certify that
                    </p>
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.applicantName || ''}
                        onChange={(e) => handleEditChange('applicantName', e.target.value)}
                        className="text-xl sm:text-2xl font-serif font-bold text-center text-gray-800 border-b-2 border-emerald-500 py-1 w-full mx-auto max-w-md transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        aria-label="Edit applicant name"
                      />
                    ) : (
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-center text-gray-800 mb-4 sm:mb-6 animate-fade-in">
                        {certificateData.applicantName}
                      </h3>
                    )}
                    
                    {/* Parents' names if available */}
                    {(certificateData.fatherName || certificateData.motherName) && (
                      <div className="text-center text-gray-700 mb-4 sm:mb-6">
                        {isEditing ? (
                          <div className="flex flex-col sm:flex-row justify-center gap-2 mt-2">
                            <input
                              type="text"
                              value={editData.fatherName || ''}
                              onChange={(e) => handleEditChange('fatherName', e.target.value)}
                              placeholder="Father&apos;s Name"
                              className="border-b-2 border-emerald-500 py-1 text-gray-800 text-center text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              aria-label="Edit father&apos;s name"
                            />
                            <span className="self-center text-sm sm:text-base">and</span>
                            <input
                              type="text"
                              value={editData.motherName || ''}
                              onChange={(e) => handleEditChange('motherName', e.target.value)}
                              placeholder="Mother&apos;s Name"
                              className="border-b-2 border-emerald-500 py-1 text-gray-800 text-center text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              aria-label="Edit mother&apos;s name"
                            />
                          </div>
                        ) : (
                          <div className="mt-1 animate-fade-in">
                            {certificateData.fatherName && certificateData.motherName ? (
                              <p className="text-sm sm:text-base">Son/Daughter of <span className="font-semibold">{certificateData.fatherName}</span> and <span className="font-semibold">{certificateData.motherName}</span></p>
                            ) : certificateData.fatherName ? (
                              <p className="text-sm sm:text-base">Son/Daughter of <span className="font-semibold">{certificateData.fatherName}</span></p>
                            ) : (
                              <p className="text-sm sm:text-base">Son/Daughter of <span className="font-semibold">{certificateData.motherName}</span></p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-center text-gray-700 text-sm sm:text-base mb-2 sm:mb-3">
                      was involved in a {certificateData.certificateType.toLowerCase()} event
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <div className="flex items-center">
                        <span className="text-gray-700 text-sm sm:text-base mr-1 sm:mr-2">on</span>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editData.date ? new Date(editData.date).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleEditChange('date', e.target.value)}
                            className="border-b-2 border-emerald-500 py-1 text-gray-800 text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            aria-label="Edit date"
                          />
                        ) : (
                          <span className="font-serif font-semibold text-gray-800 text-sm sm:text-base animate-fade-in">
                            {new Date(certificateData.date).toDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-700 text-sm sm:text-base mr-1 sm:mr-2">at</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.place || ''}
                            onChange={(e) => handleEditChange('place', e.target.value)}
                            className="border-b-2 border-emerald-500 py-1 text-gray-800 text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            aria-label="Edit place"
                          />
                        ) : (
                          <span className="font-serif font-semibold text-gray-800 text-sm sm:text-base animate-fade-in">
                            {certificateData.place}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 text-gray-700">
                    <div className="bg-blue-50 p-2 sm:p-3 rounded-lg transition-all duration-300 hover:shadow-md">
                      <p className="text-xs sm:text-sm text-gray-600">Application ID</p>
                      <p className="font-mono text-xs sm:text-sm font-semibold truncate">{certificateData._id}</p>
                    </div>
                    <div className="bg-blue-50 p-2 sm:p-3 rounded-lg transition-all duration-300 hover:shadow-md">
                      <p className="text-xs sm:text-sm text-gray-600">Status</p>
                      <p className="font-semibold text-sm sm:text-base">{certificateData.status}</p>
                    </div>
                  </div>
                  
                  {/* Signature Area */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 border-t border-gray-300">
                    <div className="mb-3 sm:mb-0">
                      <p className="text-gray-600 text-xs sm:text-sm">Generated by</p>
                      <p className="font-serif font-semibold text-gray-800 text-sm sm:text-base">Digital e-Gram Panchayat</p>
                    </div>
                    <div className="text-center">
                      <div className="mb-1">
                        <div className="border-t border-gray-400 w-24 sm:w-32 mx-auto"></div>
                      </div>
                      <p className="text-gray-600 text-xs italic">Authorized Officer Signature</p>
                    </div>
                  </div>
                  
                  {/* Official Stamp */}
                  <div className="text-center mt-3 sm:mt-4">
                    <p className="text-[0.6rem] sm:text-xs text-gray-500 uppercase tracking-wider">Official Document</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons - Better organized for mobile and desktop */}
              <div className="mt-6 sm:mt-8 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="bg-emerald-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:opacity-70 transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-busy={isUpdating}
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
                        className="bg-gray-200 text-gray-800 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:bg-gray-300 transition-colors transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-emerald-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Details
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:shadow-md transition-all font-medium flex items-center justify-center transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleDownload('jpg')}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:shadow-md transition-all font-medium flex items-center justify-center transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download JPG
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-6 text-center">
            <button
              onClick={() => router.push('/services/certificates/apply')}
              className="text-emerald-600 hover:text-emerald-800 font-medium transform hover:scale-105 duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg px-2 py-1"
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

const CertificatePreview = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        <main className="flex-grow responsive-container py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              {/* Certificate Preview Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <div className="h-6 bg-emerald-500 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-emerald-400 rounded w-64"></div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="h-6 bg-emerald-500 rounded w-24"></div>
                  </div>
                </div>
              </div>
              
              {/* Certificate Preview Area */}
              <div className="p-6 sm:p-8">
                <div className="relative border-2 border-gray-300 rounded-xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
                  {/* Skeleton content */}
                  <div className="space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
                    <div className="h-px bg-gray-200 w-32 mx-auto"></div>
                    
                    <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-8"></div>
                    <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    
                    <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-8"></div>
                    <div className="flex justify-center space-x-8">
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-12">
                      <div className="h-16 bg-gray-200 rounded"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                    
                    <div className="flex justify-between items-end pt-10 border-t border-gray-200">
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="h-12 bg-gray-200 rounded w-48"></div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="h-12 bg-gray-200 rounded w-48"></div>
                    <div className="h-12 bg-gray-200 rounded w-48"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <CertificatePreviewContent />
    </Suspense>
  );
};

export default CertificatePreview;
