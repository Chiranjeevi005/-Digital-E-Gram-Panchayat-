'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { apiClient } from '../../../../services/api';
import { useToast } from '../../../../components/ToastContainer';

interface CertificateData {
  _id: string;
  id: string;
  applicantName: string;
  fatherName?: string;
  motherName?: string;
  certificateType: string;
  type?: string;
  date?: string;
  place?: string;
  status: string;
  certificateNumber?: string;
  issuedDate?: string;
  // Marriage certificate fields
  brideName?: string;
  groomName?: string;
  witnessNames?: string;
  registrationNo?: string;
  // Income/Caste/Residence certificate fields
  address?: string;
  income?: string;
  caste?: string;
  subCaste?: string;
  ward?: string;
  village?: string;
  district?: string;
  issueDate?: string;
  validity?: string;
  // Death certificate fields
  deceasedName?: string;
  age?: string;
  dateOfDeath?: string;
  placeOfDeath?: string;
}

type Certificate = CertificateData;

const CertificatePreviewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id');
  const { showToast } = useToast();
  
  const [certificateData, setCertificateData] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState<CertificateData>({
    _id: '',
    id: '',
    applicantName: '',
    certificateType: '',
    status: 'Pending'
  });

  const fetchCertificateData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getCertificateById(applicationId as string);
      // Ensure certificateData has both _id and id
      const certificateWithIds = {
        ...response,
        _id: response._id || response.id,
        id: response.id || response._id
      };
      setCertificateData(certificateWithIds);
      setEditData(certificateWithIds);
    } catch (err: unknown) {
      console.error('Error fetching certificate data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load certificate data. Please try again later.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [applicationId, apiClient, showToast]);

  useEffect(() => {
    if (applicationId) {
      fetchCertificateData();
    } else {
      setError('No application ID provided');
      setLoading(false);
    }
  }, [applicationId, fetchCertificateData]);

  const handleEditChange = (field: keyof CertificateData, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && certificateData) {
      // Reset edit data when canceling
      setEditData(certificateData);
    }
  };

  const handleSave = async () => {
    if (!applicationId) return;
    
    try {
      setIsUpdating(true);
      setUpdateSuccess(false);
      setError(null);
      
      // Update the certificate data
      const response = await apiClient.updateCertificate(
        applicationId,
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
      
      // Show immediate feedback that download is starting
      showToast('Preparing your certificate for download...', 'info');
      
      // Use the API client to download the file
      const blob = await apiClient.downloadCertificate(applicationId, format);
      
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
      
      // Show confetti animation for successful download
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Show success message
      showToast(`Certificate downloaded as ${format.toUpperCase()} successfully!`, 'success');
    } catch (error: unknown) {
      console.error(`Error downloading ${format.toUpperCase()} certificate:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to download certificate in ${format.toUpperCase()} format. Please check your connection and try again.`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
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
                  onClick={() => router.push('/services/certificates')}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Back to Certificates
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
                onClick={() => router.push('/services/certificates')}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Back to Certificates
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Function to generate certificate number based on type
  const getCertificateNumber = () => {
    // Use certificateType if available, otherwise fallback to type
    const certType = certificateData.certificateType || certificateData.type || '';
    const prefix = certType === 'Birth' ? 'BC' :
                  certType === 'Death' ? 'DC' :
                  certType === 'Marriage' ? 'MC' :
                  certType === 'Income' ? 'IC' :
                  certType === 'Caste' ? 'CC' : 
                  certType === 'Residence' ? 'RC' : 'XX';
    return `${prefix}-2025-${certificateData._id.substring(0, 5).toUpperCase()}`;
  };

  // Function to format date based on certificate type
  const formatDate = () => {
    if (!certificateData.date) return '';
    return new Date(certificateData.date).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

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
            {updateSuccess && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 sm:p-4 animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <p className="text-sm text-emerald-700">
                      Certificate updated successfully!
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
              <div className="relative border-4 border-double border-blue-800 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-cream-100 shadow-lg max-w-2xl mx-auto">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                  <span className="text-4xl font-serif font-bold text-blue-800 transform -rotate-12">
                    DIGITAL E-PANCHAYAT
                  </span>
                </div>
                
                {/* Government Seal */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-red-700 rounded-full flex items-center justify-center border-4 border-red-900 shadow-lg animate-float">
                  <div className="text-center text-white text-xs font-bold">
                    <div>OFFICIAL</div>
                    <div>SEAL</div>
                  </div>
                </div>
                
                {/* Certificate Content */}
                <div className="relative z-10">
                  {/* Header with Panchayat Logo and Name */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="flex justify-center mb-2">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-blue-900 mb-1">
                      {certificateData.certificateType || certificateData.type} Certificate
                    </h2>
                    <p className="text-lg sm:text-xl font-serif text-gray-700">Digital E-Panchayat</p>
                    
                    {/* Certificate Number */}
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg inline-block">
                      <p className="text-sm text-gray-600">Certificate No: 
                        <span className="font-mono font-bold ml-1">
                          {getCertificateNumber()}
                        </span>
                      </p>
                    </div>
                    
                    {/* Decorative line under title */}
                    <div className="w-24 h-0.5 bg-blue-800 mx-auto mt-4"></div>
                  </div>
                  
                  <div className="mb-6 sm:mb-8">
                    {/* Certificate specific content */}
                    {(certificateData.certificateType || certificateData.type) === 'Birth' && (
                      <div className="text-center">
                        <p className="text-gray-700 text-base mb-4">
                          This is to certify that
                        </p>
                        
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.applicantName || ''}
                            onChange={(e) => handleEditChange('applicantName', e.target.value)}
                            className="text-xl sm:text-2xl font-serif font-bold text-center text-gray-800 border-b-2 border-emerald-500 py-1 w-full mx-auto max-w-md transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            aria-label="Edit child's name"
                          />
                        ) : (
                          <h3 className="text-xl sm:text-2xl font-serif font-bold text-center text-gray-800 mb-4 animate-fade-in">
                            {certificateData.applicantName}
                          </h3>
                        )}
                        
                        <p className="text-gray-700 text-base mb-2">
                          was born on
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-2">
                          {isEditing ? (
                            <input
                              type="date"
                              value={editData.date ? new Date(editData.date).toISOString().split('T')[0] : ''}
                              onChange={(e) => handleEditChange('date', e.target.value)}
                              className="border-b-2 border-emerald-500 py-1 text-gray-800 text-base transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              aria-label="Edit date of birth"
                            />
                          ) : (
                            <span className="font-serif font-semibold text-gray-800 text-base animate-fade-in">
                              {formatDate()}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-700 text-base mb-2">
                          at
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.place || ''}
                              onChange={(e) => handleEditChange('place', e.target.value)}
                              className="border-b-2 border-emerald-500 py-1 text-gray-800 text-base transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              aria-label="Edit place of birth"
                            />
                          ) : (
                            <span className="font-serif font-semibold text-gray-800 text-base animate-fade-in">
                              {certificateData.place}
                            </span>
                          )}
                        </div>
                        
                        <div className="text-gray-700 mb-4">
                          {isEditing ? (
                            <div className="flex flex-col sm:flex-row justify-center gap-2 mt-2">
                              <input
                                type="text"
                                value={editData.fatherName || ''}
                                onChange={(e) => handleEditChange('fatherName', e.target.value)}
                                placeholder="Father's Name"
                                className="border-b-2 border-emerald-500 py-1 text-gray-800 text-base transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                aria-label="Edit father's name"
                              />
                              <span className="self-center text-base">and</span>
                              <input
                                type="text"
                                value={editData.motherName || ''}
                                onChange={(e) => handleEditChange('motherName', e.target.value)}
                                placeholder="Mother's Name"
                                className="border-b-2 border-emerald-500 py-1 text-gray-800 text-base transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                aria-label="Edit mother's name"
                              />
                            </div>
                          ) : (
                            <div className="mt-1 animate-fade-in">
                              {certificateData.fatherName && certificateData.motherName ? (
                                <p className="text-base">to <span className="font-semibold">{certificateData.fatherName}</span> and <span className="font-semibold">{certificateData.motherName}</span></p>
                              ) : certificateData.fatherName ? (
                                <p className="text-base">to <span className="font-semibold">{certificateData.fatherName}</span></p>
                              ) : (
                                <p className="text-base">to <span className="font-semibold">{certificateData.motherName}</span></p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {(certificateData.certificateType || certificateData.type) === 'Death' && (
                      <div className="text-center">
                        <p className="text-gray-700 text-base mb-4">
                          This is to certify that
                        </p>
                        
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.deceasedName || ''}
                            onChange={(e) => handleEditChange('deceasedName', e.target.value)}
                            className="text-xl font-bold text-center border-b-2 border-gray-300 focus:border-emerald-500 focus:outline-none w-full max-w-md mx-auto"
                          />
                        ) : (
                          <h2 className="text-xl font-bold text-center">{certificateData.deceasedName}</h2>
                        )}
                        <p className="text-gray-700 text-base mt-2">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.age || ''}
                              onChange={(e) => handleEditChange('age', e.target.value)}
                              className="border-b-2 border-gray-300 focus:border-emerald-500 focus:outline-none w-20 text-center"
                            />
                          ) : (
                            certificateData.age
                          )} years old
                        </p>
                        <p className="text-gray-700 text-base mt-2">
                          resident of {isEditing ? (
                            <input
                              type="text"
                              value={editData.address || ''}
                              onChange={(e) => handleEditChange('address', e.target.value)}
                              className="border-b-2 border-gray-300 focus:border-emerald-500 focus:outline-none w-full max-w-md text-center"
                            />
                          ) : (
                            certificateData.address
                          )}
                        </p>
                        <p className="text-gray-700 text-base mt-4">
                          died on {isEditing ? (
                            <input
                              type="date"
                              value={editData.dateOfDeath || ''}
                              onChange={(e) => handleEditChange('dateOfDeath', e.target.value)}
                              className="border-b-2 border-gray-300 focus:border-emerald-500 focus:outline-none text-center"
                            />
                          ) : (
                            certificateData.dateOfDeath && new Date(certificateData.dateOfDeath).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                          )}
                        </p>
                        <p className="text-gray-700 text-base mt-2">
                          at {isEditing ? (
                            <input
                              type="text"
                              value={editData.placeOfDeath || ''}
                              onChange={(e) => handleEditChange('placeOfDeath', e.target.value)}
                              className="border-b-2 border-gray-300 focus:border-emerald-500 focus:outline-none w-full max-w-md text-center"
                            />
                          ) : (
                            certificateData.placeOfDeath
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Certificate Footer */}
                  <div className="flex justify-between items-end pt-8 border-t border-gray-300 mt-8">
                    <div>
                      <p className="text-gray-700 text-sm">Date of Issue: {new Date().toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-24 h-24 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xs text-gray-500">Seal</span>
                      </div>
                      <p className="text-gray-700 text-sm font-medium">Authorized Signatory</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                <button
                  onClick={() => router.push('/services/certificates')}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Back to Certificates
                </button>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleEditToggle}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDownload('pdf')}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-green to-deep-blue text-white rounded-xl hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        Download PDF
                      </button>
                      <button
                        onClick={() => handleDownload('jpg')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Download JPG
                      </button>
                    </>
                  )}
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

export default function CertificatePreview() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CertificatePreviewContent />
    </Suspense>
  );
}
