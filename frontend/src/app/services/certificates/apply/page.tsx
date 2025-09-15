'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { apiClient } from '../../../../lib/api';

interface ApplyResponse {
  success: boolean;
  applicationId?: string;
  message?: string;
}

const CertificateApplication = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    certificateType: '',
    applicantName: '',
    date: '',
    place: '',
    supportingFiles: [] as File[],
    declaration: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationResult, setApplicationResult] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock user data - in a real app, this would come from authentication
  useEffect(() => {
    // Simulate auto-filled user data
    setFormData(prev => ({
      ...prev,
      applicantName: 'John Doe' // This would come from user context/auth
    }));
  }, []);

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
    
    if (!formData.declaration) {
      newErrors.declaration = 'You must declare that the information is correct';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send the form data to the backend
      const response: ApplyResponse = await apiClient.post('/certificates/apply', {
        applicantName: formData.applicantName,
        certificateType: formData.certificateType,
        date: formData.date,
        place: formData.place,
        supportingFiles: formData.supportingFiles.map(file => file.name), // In a real app, you'd upload the files
        declaration: formData.declaration
      });
      
      if (response.success && response.applicationId) {
        // Redirect to preview page with application ID
        router.push(`/services/certificates/preview?id=${response.applicationId}`);
      } else {
        setErrors({
          submit: response.message || 'Failed to submit application. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors({
        submit: 'Failed to submit application. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'jpg') => {
    try {
      if (!applicationResult?.applicationId) {
        alert('Application ID not found');
        return;
      }
      
      // Download the certificate from the backend
      const response = await fetch(`http://localhost:3002/api/certificates/${applicationResult.applicationId}/download?format=${format}`);
      
      if (!response.ok) {
        throw new Error(`Failed to download certificate: ${response.statusText}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate_${applicationResult.applicationId}.${format}`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert(`Failed to download certificate in ${format.toUpperCase()} format. Please try again.`);
    }
  };

  if (applicationResult) {
    return (
      <div className="min-h-screen flex flex-col bg-off-white">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
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
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleDownload('jpg')}
                    className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-6 py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium flex items-center justify-center"
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
                    applicantName: 'John Doe',
                    date: '',
                    place: '',
                    supportingFiles: [],
                    declaration: false
                  });
                }}
                className="text-emerald-600 hover:text-emerald-800 font-medium"
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

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Apply for Certificate</h1>
            <p className="text-gray-600 mb-6">Fill in the details below to apply for your certificate</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-label mb-1">
                  Certificate Type *
                </label>
                <select
                  name="certificateType"
                  value={formData.certificateType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border text-gray-800 ${
                    errors.certificateType ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                >
                  <option value="" className="text-gray-800">Select Certificate Type</option>
                  <option value="Birth" className="text-gray-800">Birth Certificate</option>
                  <option value="Death" className="text-gray-800">Death Certificate</option>
                  <option value="Marriage" className="text-gray-800">Marriage Certificate</option>
                  <option value="Income" className="text-gray-800">Income Certificate</option>
                  <option value="Caste" className="text-gray-800">Caste Certificate</option>
                  <option value="Residence" className="text-gray-800">Residence Certificate</option>
                </select>
                {errors.certificateType && (
                  <p className="mt-1 text-sm text-red-600">{errors.certificateType}</p>
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 cursor-not-allowed text-gray-800"
                  placeholder="Your name"
                />
                <p className="mt-1 text-xs text-gray-500">Auto-filled from your profile</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-label mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border text-gray-800 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
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
                  className={`w-full px-4 py-3 rounded-xl border text-gray-800 ${
                    errors.place ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                  placeholder="Enter place"
                />
                {errors.place && (
                  <p className="mt-1 text-sm text-red-600">{errors.place}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-label mb-1">
                  Supporting Documents
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500">
                        <span>Upload files</span>
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, or PDF up to 3 files
                    </p>
                  </div>
                </div>
                {errors.supportingFiles && (
                  <p className="mt-1 text-sm text-red-600">{errors.supportingFiles}</p>
                )}
                {formData.supportingFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected files:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {formData.supportingFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
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
                    className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="declaration" className="font-medium text-gray-700">
                    I declare that the information provided is correct and complete *
                  </label>
                  {errors.declaration && (
                    <p className="mt-1 text-sm text-red-600">{errors.declaration}</p>
                  )}
                </div>
              </div>
              
              {errors.submit && (
                <div className="rounded-md bg-red-50 p-4">
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
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium flex items-center justify-center disabled:opacity-70"
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