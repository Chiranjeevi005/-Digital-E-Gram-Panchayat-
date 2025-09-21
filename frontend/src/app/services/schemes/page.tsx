'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { apiClient } from '../../../services';
import { useToast } from '../../../components/ToastContainer';
import { useAuth } from '../../../context/AuthContext';

interface Scheme {
  _id: string;
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  createdAt: string;
}

interface SchemeApplication {
  _id: string;
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
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  itemName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              Are you sure you want to delete this application? This action cannot be undone.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Application: <span className="font-medium">{itemName}</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SchemesPage = () => {
  const { showToast } = useToast();
  const { user } = useAuth(); // Get authenticated user
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applications, setApplications] = useState<SchemeApplication[]>([]);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<{id: string, name: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Multi-step form states
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationFormData, setApplicationFormData] = useState({
    citizenId: user?.id || '', // Use authenticated user ID
    schemeId: '',
    schemeName: '',
    applicantName: '',
    fatherName: '',
    address: '',
    phone: '',
    email: '',
    aadhaar: '',
    age: '',
    gender: '',
    income: '',
    caste: '',
    education: '',
    landSize: '',
    documents: [] as string[]
  });
  const [applicationFormErrors, setApplicationFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  interface SchemeApplicationPreview {
    applicationId: string;
    date: string;
    citizenId: string;
    schemeId: string;
    schemeName: string;
    applicantName: string;
    fatherName: string;
    address: string;
    phone: string;
    email: string;
    aadhaar: string;
    age: string;
    gender: string;
    income: string;
    caste: string;
    education: string;
    landSize: string;
    documents: string[];
    id: string;
    userId: string;
    status: string;
    appliedAt: string;
    remarks?: string;
  }

  const [previewData, setPreviewData] = useState<SchemeApplicationPreview | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch schemes
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const startTime = Date.now();
        
        console.log('Fetching schemes from API'); // Debug log
        const data = await apiClient.get<Scheme[]>('/schemes');
        console.log('Fetched schemes data:', data); // Debug log
        setSchemes(data);
        
        // Ensure minimum loading time of 1-2 seconds for better UX
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 1000; // 1 second minimum
        if (elapsedTime < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
        }
      } catch (err) {
        console.error('Error fetching schemes:', err);
        setError('Failed to load schemes. Please try again later.');
        showToast('Failed to load schemes', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [showToast]);

  // Fetch user applications for tracking - Updated to use authenticated user
  const fetchApplications = async () => {
    try {
      setIsTrackingLoading(true);
      const startTime = Date.now();
      
      // Use authenticated user ID - only fetch if user is logged in
      if (!user?.id) {
        setApplications([]);
        setIsTrackingLoading(false);
        return;
      }
      
      const userId = user.id;
      const data = await apiClient.get<SchemeApplication[]>(`/schemes/tracking/${userId}`);
      setApplications(data);
      
      // Ensure minimum loading time of 1-2 seconds for better UX
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 1000; // 1 second minimum
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      showToast('Failed to load applications', 'error');
    } finally {
      setIsTrackingLoading(false);
    }
  };

  // Fetch applications when user changes or component mounts
  useEffect(() => {
    if (user?.id) { // Only fetch if user is authenticated
      fetchApplications();
    } else {
      // Clear applications if user is not authenticated
      setApplications([]);
    }
  }, [user]);

  // Filter schemes based on search term and category, and remove Housing Subsidy Program
  const filteredSchemes = schemes.filter(scheme => {
    console.log('Filtering scheme:', scheme.name); // Debug log
    // Exclude Housing Subsidy Program
    if (scheme.name === 'Housing Subsidy Program') {
      return false;
    }
    
    const matchesSearch = searchTerm === '' || 
                          scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scheme.eligibility.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scheme.benefits.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Fix the category filtering logic to match actual scheme categories
    // When 'all' is selected, show all schemes (except Housing Subsidy Program)
    // When a specific category is selected, show schemes that match that category
    const matchesCategory = filterCategory === 'all' || 
                           (filterCategory === 'agriculture' && (scheme.name.includes('Agricultural') || scheme.name.includes('Farm') || scheme.name.includes('Agriculture'))) ||
                           (filterCategory === 'education' && (scheme.name.includes('Educational') || scheme.name.includes('Scholarship') || scheme.name.includes('Education'))) ||
                           (filterCategory === 'healthcare' && (scheme.name.includes('Healthcare') || scheme.name.includes('Welfare') || scheme.name.includes('Health')));
    
    console.log('Scheme matches search:', matchesSearch, 'matches category:', matchesCategory); // Debug log
    return matchesSearch && matchesCategory;
  });

  const openSchemeDetails = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setIsModalOpen(true);
  };

  const closeSchemeDetails = () => {
    setIsModalOpen(false);
    setSelectedScheme(null);
  };

  const openApplicationForm = (scheme: Scheme) => {
    setApplicationFormData({
      citizenId: user?.id || '', // Use authenticated user ID
      schemeId: scheme._id,
      schemeName: scheme.name,
      applicantName: '',
      fatherName: '',
      address: '',
      phone: '',
      email: '',
      aadhaar: '',
      age: '',
      gender: '',
      income: '',
      caste: '',
      education: '',
      landSize: '',
      documents: []
    });
    setApplicationFormErrors({});
    setCurrentStep(1);
    setIsApplicationFormOpen(true);
    closeSchemeDetails();
  };

  const closeApplicationForm = () => {
    setIsApplicationFormOpen(false);
    setApplicationFormData({
      citizenId: user?.id || '', // Use authenticated user ID
      schemeId: '',
      schemeName: '',
      applicantName: '',
      fatherName: '',
      address: '',
      phone: '',
      email: '',
      aadhaar: '',
      age: '',
      gender: '',
      income: '',
      caste: '',
      education: '',
      landSize: '',
      documents: []
    });
    setApplicationFormErrors({});
    setCurrentStep(1);
  };

  const handleApplicationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplicationFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (applicationFormErrors[name]) {
      setApplicationFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!applicationFormData.applicantName.trim()) errors.applicantName = 'Applicant name is required';
      if (!applicationFormData.fatherName.trim()) errors.fatherName = 'Father\'s name is required';
      if (!applicationFormData.address.trim()) errors.address = 'Address is required';
      if (!applicationFormData.aadhaar.trim()) errors.aadhaar = 'Aadhaar number is required';
      else if (!/^\d{12}$/.test(applicationFormData.aadhaar)) errors.aadhaar = 'Aadhaar must be 12 digits';
    } else if (currentStep === 2) {
      if (!applicationFormData.age.trim()) errors.age = 'Age is required';
      if (!applicationFormData.gender) errors.gender = 'Gender is required';
      if (!applicationFormData.phone.trim()) errors.phone = 'Phone number is required';
      if (!applicationFormData.email.trim()) errors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationFormData.email)) errors.email = 'Invalid email format';
    }
    
    return errors;
  };

  const nextStep = () => {
    const errors = validateCurrentStep();
    if (Object.keys(errors).length > 0) {
      setApplicationFormErrors(errors);
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setApplicationFormErrors({});
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const openPreview = () => {
    const errors = validateCurrentStep();
    if (Object.keys(errors).length > 0) {
      setApplicationFormErrors(errors);
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    setPreviewData({
      ...applicationFormData,
      id: '',
      userId: applicationFormData.citizenId,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      applicationId: `APP-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    });
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewData(null);
  };

  const handleApplicationSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.post('/schemes/apply', applicationFormData);
      showToast('Scheme application submitted successfully!', 'success');
      closePreview();
      closeApplicationForm();
      fetchApplications(); // Refresh applications list
    } catch (err) {
      console.error('Error submitting application:', err);
      showToast('Failed to submit application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (applicationId: string, format: 'pdf' | 'jpg' = 'pdf') => {
    try {
      const blob = await apiClient.download(`/schemes/acknowledgment/${applicationId}?format=${format}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scheme-application-${applicationFormData.schemeName}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading acknowledgment:', err);
      showToast('Failed to download acknowledgment', 'error');
    }
  };

  const handleDelete = async (applicationId: string, schemeName: string) => {
    setApplicationToDelete({ id: applicationId, name: schemeName });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!applicationToDelete) return;
    
    try {
      await apiClient.deleteSchemeApplication(applicationToDelete.id);
      showToast('Application deleted successfully', 'success');
      fetchApplications(); // Refresh applications list
    } catch (err) {
      console.error('Error deleting application:', err);
      showToast('Failed to delete application', 'error');
    } finally {
      setIsDeleteModalOpen(false);
      setApplicationToDelete(null);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setApplicationToDelete(null);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="responsive-container text-center relative z-10">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <div className="text-4xl">💰</div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Schemes & Subsidies
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover government schemes and apply for benefits digitally
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="responsive-container py-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
              <svg className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <div className="relative">
              <button
                onClick={toggleFilter}
                className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                <span>Filter</span>
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-10 p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Filter by Category</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={filterCategory === 'all'}
                        onChange={() => setFilterCategory('all')}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-gray-700">All Categories</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value="agriculture"
                        checked={filterCategory === 'agriculture'}
                        onChange={() => setFilterCategory('agriculture')}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-gray-700">Agriculture</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value="education"
                        checked={filterCategory === 'education'}
                        onChange={() => setFilterCategory('education')}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-gray-700">Education</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value="healthcare"
                        checked={filterCategory === 'healthcare'}
                        onChange={() => setFilterCategory('healthcare')}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-gray-700">Healthcare</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Schemes Section */}
        <div className="responsive-container py-6 sm:py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Available Schemes
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSchemes.map((scheme) => (
                <div 
                  key={scheme._id}
                  className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 focus-within:ring-2 focus-within:ring-emerald-500"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {scheme.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {scheme.description}
                  </p>
                  
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Eligibility: {scheme.eligibility}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => openSchemeDetails(scheme)}
                    className="w-full bg-gradient-to-r from-emerald-green to-deep-blue text-white py-2.5 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Tracking Section */}
        <div className="responsive-container py-8 sm:py-12 bg-gray-50 rounded-2xl mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">
              Track Your Applications
            </h2>
            <button
              onClick={fetchApplications}
              disabled={isTrackingLoading}
              className="bg-emerald-green text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center disabled:opacity-70"
            >
              {isTrackingLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Refresh'
              )}
            </button>
          </div>
          
          {isTrackingLoading ? (
            <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-16 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {applications.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Application ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Scheme
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app) => (
                          <tr key={app._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {app._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {app.schemeName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(app.submittedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                app.status === 'pending' ? 'bg-green-100 text-green-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                Approved
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button 
                                onClick={() => handleDownload(app._id, 'pdf')}
                                className="text-emerald-green hover:text-emerald-700 font-medium mr-3"
                              >
                                Download
                              </button>
                              <button 
                                onClick={() => handleDelete(app._id, app.schemeName)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Mobile Accordion View */}
                  <div className="md:hidden">
                    {applications.map((app) => (
                      <div key={app._id} className="border-b border-gray-200 last:border-b-0">
                        <div className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{app.schemeName}</h3>
                              <p className="text-sm text-gray-500 mt-1">ID: {app._id}</p>
                            </div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              app.status === 'approved' ? 'bg-green-100 text-green-800' :
                              app.status === 'pending' ? 'bg-green-100 text-green-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              Approved
                            </span>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              {new Date(app.submittedAt).toLocaleDateString()}
                            </p>
                            <div className="flex space-x-3">
                              <button 
                                onClick={() => handleDownload(app._id, 'pdf')}
                                className="text-emerald-green hover:text-emerald-700 font-medium text-sm"
                              >
                                Download
                              </button>
                              <button 
                                onClick={() => handleDelete(app._id, app.schemeName)}
                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by applying for a scheme.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Scheme Details Modal */}
      {isModalOpen && selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedScheme.name}
                </h2>
                <button
                  onClick={closeSchemeDetails}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">
                  {selectedScheme.description}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Eligibility Criteria</h3>
                <p className="text-gray-600">
                  {selectedScheme.eligibility}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Benefits</h3>
                <p className="text-gray-600">
                  {selectedScheme.benefits}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openApplicationForm(selectedScheme)}
                  className="flex-1 bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  Apply Now
                </button>
                <button
                  onClick={closeSchemeDetails}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Multi-step Application Form Modal */}
      {isApplicationFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Apply for {applicationFormData.schemeName}
                </h2>
                <button
                  onClick={closeApplicationForm}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              {/* Progress Bar - Sticky on mobile */}
              <div className="mb-6 sticky top-0 bg-white pt-2 z-10">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
                  <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-emerald-green h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <form className="space-y-5">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-dark-label mb-1">
                        Applicant Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="applicantName"
                        value={applicationFormData.applicantName}
                        onChange={handleApplicationFormChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 transition-all duration-300 ${
                          applicationFormErrors.applicantName ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        }`}
                        placeholder="Enter applicant's full name"
                      />
                      {applicationFormErrors.applicantName && (
                        <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{applicationFormErrors.applicantName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-label mb-1">
                        Father&apos;s Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={applicationFormData.fatherName}
                        onChange={handleApplicationFormChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 transition-all duration-300 ${
                          applicationFormErrors.fatherName ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        }`}
                        placeholder="Enter father's full name"
                      />
                      {applicationFormErrors.fatherName && (
                        <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{applicationFormErrors.fatherName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-label mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={applicationFormData.address}
                        onChange={handleApplicationFormChange}
                        rows={3}
                        className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 transition-all duration-300 ${
                          applicationFormErrors.address ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        }`}
                        placeholder="Enter complete address"
                      />
                      {applicationFormErrors.address && (
                        <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{applicationFormErrors.address}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-label mb-1">
                        Aadhaar Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="aadhaar"
                        value={applicationFormData.aadhaar}
                        onChange={handleApplicationFormChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 transition-all duration-300 ${
                          applicationFormErrors.aadhaar ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        }`}
                        placeholder="Enter 12-digit Aadhaar number"
                        maxLength={12}
                      />
                      {applicationFormErrors.aadhaar && (
                        <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{applicationFormErrors.aadhaar}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Step 2: Contact & Demographics */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-label mb-1">
                          Age <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={applicationFormData.age}
                          onChange={handleApplicationFormChange}
                          className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 transition-all duration-300 ${
                            applicationFormErrors.age ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                          }`}
                          placeholder="Enter age"
                        />
                        {applicationFormErrors.age && (
                          <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{applicationFormErrors.age}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-label mb-1">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="gender"
                          value={applicationFormData.gender}
                          onChange={handleApplicationFormChange}
                          className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 transition-all duration-300 ${
                            applicationFormErrors.gender ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                          }`}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {applicationFormErrors.gender && (
                          <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{applicationFormErrors.gender}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-label mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={applicationFormData.phone}
                          onChange={handleApplicationFormChange}
                          className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 transition-all duration-300 ${
                            applicationFormErrors.phone ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                          }`}
                          placeholder="Enter phone number"
                        />
                        {applicationFormErrors.phone && (
                          <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{applicationFormErrors.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-label mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={applicationFormData.email}
                          onChange={handleApplicationFormChange}
                          className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 transition-all duration-300 ${
                            applicationFormErrors.email ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                          }`}
                          placeholder="Enter email address"
                        />
                        {applicationFormErrors.email && (
                          <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{applicationFormErrors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-label mb-1">
                          Annual Income
                        </label>
                        <input
                          type="text"
                          name="income"
                          value={applicationFormData.income}
                          onChange={handleApplicationFormChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-800 transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter annual income"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-label mb-1">
                          Caste
                        </label>
                        <select
                          name="caste"
                          value={applicationFormData.caste}
                          onChange={handleApplicationFormChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-800 transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Select caste</option>
                          <option value="General">General</option>
                          <option value="OBC">OBC</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Scheme-Specific Fields */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-label mb-1">
                          Education
                        </label>
                        <select
                          name="education"
                          value={applicationFormData.education}
                          onChange={handleApplicationFormChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-800 transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Select education level</option>
                          <option value="None">None</option>
                          <option value="Primary">Primary</option>
                          <option value="Secondary">Secondary</option>
                          <option value="Higher Secondary">Higher Secondary</option>
                          <option value="Graduate">Graduate</option>
                          <option value="Post Graduate">Post Graduate</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-label mb-1">
                          Land Size (in acres)
                        </label>
                        <input
                          type="text"
                          name="landSize"
                          value={applicationFormData.landSize}
                          onChange={handleApplicationFormChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-800 transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter land size"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-label mb-1">
                        Supporting Documents
                      </label>
                      <div className="mt-1 flex justify-center px-4 py-6 border-2 border-gray-300 border-dashed rounded-xl transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-50">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex flex-col sm:flex-row text-sm text-gray-600 mt-2">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                              <span>Upload files</span>
                              <input
                                type="file"
                                multiple
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="sr-only"
                              />
                            </label>
                            <p className="sm:pl-1 mt-1 sm:mt-0">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, or PDF up to 3 files
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex-1 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      currentStep === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openPreview}
                      className="flex-1 bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      Preview & Submit
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={closeApplicationForm}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Preview Modal */}
      {isPreviewOpen && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Preview Application
                </h2>
                <button
                  onClick={closePreview}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Scheme Application Acknowledgment</h3>
                  <p className="text-gray-700">Please review your application details before submitting</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-700">Application ID</p>
                    <p className="font-medium text-gray-900">{previewData.applicationId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Date</p>
                    <p className="font-medium text-gray-900">{previewData.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Scheme</p>
                    <p className="font-medium text-gray-900">{previewData.schemeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Applicant Name</p>
                    <p className="font-medium text-gray-900">{previewData.applicantName}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-700">Father&apos;s Name</p>
                  <p className="font-medium text-gray-900">{previewData.fatherName}</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-700">Address</p>
                  <p className="font-medium text-gray-900">{previewData.address}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-700">Aadhaar Number</p>
                    <p className="font-medium text-gray-900">{previewData.aadhaar}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Age</p>
                    <p className="font-medium text-gray-900">{previewData.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Gender</p>
                    <p className="font-medium text-gray-900">{previewData.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Contact</p>
                    <p className="font-medium text-gray-900">{previewData.email || previewData.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-700">Annual Income</p>
                    <p className="font-medium text-gray-900">{previewData.income || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Caste</p>
                    <p className="font-medium text-gray-900">{previewData.caste || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Education</p>
                    <p className="font-medium text-gray-900">{previewData.education || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Land Size</p>
                    <p className="font-medium text-gray-900">{previewData.landSize || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-300 pt-4">
                  <p className="text-sm text-gray-700">
                    By submitting this application, you confirm that the information provided is accurate to the best of your knowledge.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleApplicationSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
                <button
                  onClick={closePreview}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={applicationToDelete?.name || 'this application'}
      />
      
      <Footer />
    </div>
  );
};

export default SchemesPage;