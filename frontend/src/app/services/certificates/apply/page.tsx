'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { apiClient } from '../../../../lib/api';
import { useToast } from '../../../../components/ToastContainer';

interface ApplyResponse {
  success: boolean;
  applicationId?: string;
  message?: string;
  status?: string;
  downloadUrl?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

const CertificateApplication = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    certificateType: '',
    applicantName: '',
    fatherName: '',
    motherName: '',
    date: '',
    place: '',
    supportingFiles: [] as File[],
    declaration: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationResult, setApplicationResult] = useState<ApplyResponse | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  // New state for submission progress
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState('');

  // Get user data from authentication
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setAuthError(null);
        const userData = await apiClient.getCurrentUser();
        const user: User = {
          id: userData.id || '',
          name: userData.name || '',
          email: userData.email || '',
          userType: userData.userType || 'Citizen'
        };
        setUser(user);
        setFormData(prev => ({
          ...prev,
          applicantName: user.name || ''
        }));
      } catch (error: unknown) {
        console.error('Error fetching user data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to authenticate user. Please login again.';
        setAuthError(errorMessage);
        // Redirect to login if not authenticated
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Limit to 3 files
      if (files.length > 3) {
        setErrors(prev => ({
          ...prev,
          supportingFiles: 'You can upload maximum 3 files'
        }));
        return;
      }
      
      // Validate file types
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const invalidFiles = files.filter(file => !validTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        setErrors(prev => ({
          ...prev,
          supportingFiles: 'Only JPG, PNG, and PDF files are allowed'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        supportingFiles: files
      }));
      
      // Clear error if files are valid
      if (errors.supportingFiles) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.supportingFiles;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.certificateType) {
      newErrors.certificateType = 'Please select a certificate type';
    }
    
    if (!formData.applicantName.trim()) {
      newErrors.applicantName = 'Applicant name is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.place.trim()) {
      newErrors.place = 'Place is required';
    }
    
    // Validate that place is a string
    if (formData.place && typeof formData.place !== 'string') {
      newErrors.place = 'Place must be a valid text';
    }
    
    if (!formData.declaration) {
      newErrors.declaration = 'You must declare that the information is correct';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionProgress(0);
    setSubmissionStatus('Validating your details...');
    
    try {
      // Extended progress simulation for at least 10 seconds with mobile-friendly messages
      const progressSteps = [
        { progress: 10, status: 'Validating your details...' },
        { progress: 20, status: 'Preparing your application...' },
        { progress: 30, status: 'Checking document requirements...' },
        { progress: 40, status: 'Sending to server...' },
        { progress: 50, status: 'Processing your request...' },
        { progress: 60, status: 'Verifying information...' },
        { progress: 70, status: 'Generating certificate...' },
        { progress: 80, status: 'Applying official seal...' },
        { progress: 90, status: 'Finalizing document...' },
        { progress: 100, status: 'Ready for preview!' }
      ];
      
      for (let i = 0; i < progressSteps.length; i++) {
        const { progress, status } = progressSteps[i];
        setSubmissionProgress(progress);
        setSubmissionStatus(status);
        
        // Wait for at least 10 seconds total (10000ms / 10 steps = 1000ms per step)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Prepare form data for submission
      const submissionData = {
        applicantName: formData.applicantName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        certificateType: formData.certificateType,
        date: formData.date,
        place: formData.place,
        supportingFiles: formData.supportingFiles.map(file => file.name),
        declaration: formData.declaration
      };
      
      // Send the form data to the backend
      const response: ApplyResponse = await apiClient.post<ApplyResponse>('/certificates/apply', submissionData);
      
      if (response.success && response.applicationId) {
        // Show success toast
        showToast('Certificate application submitted successfully!', 'success');
        
        // Redirect to preview page with application ID after a short delay
        setTimeout(() => {
          router.push(`/services/certificates/preview?id=${response.applicationId}`);
        }, 500);
      } else {
        setErrors({
          submit: response.message || 'Failed to submit application. Please try again.'
        });
        setSubmissionProgress(0);
        setSubmissionStatus('');
        showToast(response.message || 'Failed to submit application. Please try again.', 'error');
      }
    } catch (error: unknown) {
      console.error('Error submitting application:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
      setErrors({
        submit: errorMessage
      });
      setSubmissionProgress(0);
      setSubmissionStatus('');
      showToast(errorMessage, 'error');
    } finally {
      // Don't setIsSubmitting(false) here as we want to show the redirect
    }
  };

  const handleDownload = async (format: 'pdf' | 'jpg') => {
    try {
      if (!applicationResult?.applicationId) {
        showToast('Application ID not found', 'error');
        return;
      }
      
      // Use the API client to download the file
      const blob = await apiClient.download(`/certificates/${applicationResult.applicationId}/download?format=${format}`);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.certificateType.toLowerCase()}-certificate.${format}`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success toast
      showToast(`Certificate downloaded as ${format.toUpperCase()} successfully!`, 'success');
    } catch (error: unknown) {
      console.error(`Error downloading ${format.toUpperCase()} certificate:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to download certificate in ${format.toUpperCase()} format. Please try again.`;
      showToast(errorMessage, 'error');
    }
  };

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        <main className="flex-grow responsive-container py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show authentication error
  if (authError) {
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
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h1>
              <p className="text-gray-600 mb-6">{authError}</p>
              <p className="text-gray-500 text-sm">Redirecting to login page...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return null; // Will be redirected in the useEffect
  }

  if (applicationResult) {
    return (
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        
        <main className="flex-grow responsive-container py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h1>
              <p className="text-gray-600 mb-6">
                Your {formData.certificateType} certificate application has been processed successfully.
              </p>
              
              <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                <p className="text-emerald-800 font-medium">
                  Application ID: {applicationResult.applicationId}
                </p>
                <p className="text-emerald-700 mt-1">
                  Status: <span className="font-semibold">{applicationResult.status}</span>
                </p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Download Your Certificate</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium flex items-center justify-center transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleDownload('jpg')}
                    className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-6 py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium flex items-center justify-center transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download JPG
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setApplicationResult(null);
                  setFormData({
                    certificateType: '',
                    applicantName: user.name || '',
                    fatherName: '',
                    motherName: '',
                    date: '',
                    place: '',
                    supportingFiles: [],
                    declaration: false
                  });
                }}
                className="text-emerald-600 hover:text-emerald-800 font-medium transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg px-3 py-1"
              >
                Apply for another certificate
              </button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Update the form submission section to show progress with mobile-friendly design
  if (isSubmitting) {
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
              <p className="text-gray-600">{submissionStatus}</p>
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${submissionProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0%</span>
                <span>{submissionProgress}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-1 mt-4">
              {[...Array(10)].map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    submissionProgress >= (index + 1) * 10 ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              {submissionStatus}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      
      <main className="flex-grow responsive-container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 animate-fade-in form-container">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Apply for Certificate</h1>
              <p className="text-gray-600 mt-2">Fill in the details below to apply for your certificate</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-label mb-1">
                  Certificate Type *
                </label>
                <select
                  name="certificateType"
                  value={formData.certificateType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-gray-800 transition-all duration-300 ${
                    errors.certificateType ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                  aria-required="true"
                >
                  <option value="" className="text-gray-800">Select Certificate Type</option>
                  <option value="Birth" className="text-gray-800">Birth Certificate</option>
                  <option value="Death" className="text-gray-800">Death Certificate</option>
                </select>
                {errors.certificateType && (
                  <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{errors.certificateType}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-label mb-1">
                  Applicant Name *
                </label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  readOnly
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 bg-gray-100 cursor-not-allowed text-gray-800"
                  placeholder="Your name"
                  aria-required="true"
                />
                <p className="mt-1 text-xs text-gray-500">Auto-filled from your profile</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-label mb-1">
                    Father&apos;s Name
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 text-gray-800 transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter father&apos;s name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-label mb-1">
                    Mother&apos;s Name
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 text-gray-800 transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter mother&apos;s name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-label mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-gray-800 transition-all duration-300 ${
                      errors.date ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                    aria-required="true"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{errors.date}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-label mb-1">
                    Place *
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-gray-800 transition-all duration-300 ${
                      errors.place ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                    placeholder="Enter place"
                    aria-required="true"
                  />
                  {errors.place && (
                    <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{errors.place}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-label mb-1">
                  Supporting Documents
                </label>
                <div className="mt-1 flex justify-center px-4 py-6 sm:py-8 border-2 border-gray-300 border-dashed rounded-xl transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-50">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex flex-col sm:flex-row text-sm text-gray-600 mt-2">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                        <span>Upload files</span>
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                          aria-label="Upload supporting documents"
                        />
                      </label>
                      <p className="sm:pl-1 mt-1 sm:mt-0">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, or PDF up to 3 files
                    </p>
                  </div>
                </div>
                {errors.supportingFiles && (
                  <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{errors.supportingFiles}</p>
                )}
                {formData.supportingFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected files:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {formData.supportingFiles.map((file, index) => (
                        <li key={index} className="animate-fade-in truncate">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="declaration"
                    name="declaration"
                    type="checkbox"
                    checked={formData.declaration}
                    onChange={handleInputChange}
                    className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded transition-all duration-300"
                    aria-required="true"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="declaration" className="font-medium text-gray-700">
                    I declare that the information provided is correct and complete *
                  </label>
                  {errors.declaration && (
                    <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{errors.declaration}</p>
                  )}
                </div>
              </div>
              
              {errors.submit && (
                <div className="rounded-md bg-red-50 p-3 animate-shake" role="alert">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{errors.submit}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2.5 sm:py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium flex items-center justify-center disabled:opacity-70 transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Generate Certificate'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CertificateApplication;