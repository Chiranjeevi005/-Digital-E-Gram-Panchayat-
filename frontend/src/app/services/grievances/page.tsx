'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { apiClient, Grievance } from '../../../lib/api';
import { useToast } from '../../../components/ToastContainer';

interface LocalGrievance {
  _id: string;
  citizenId: string;
  subject: string; // Changed from title to subject to match API
  description: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  remarks?: string;
  createdAt: string;
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
              Are you sure you want to delete this grievance? This action cannot be undone.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Grievance: <span className="font-medium">{itemName}</span>
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

const GrievancePage = () => {
  const { showToast } = useToast();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Multi-step form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    citizenId: 'CIT-001', // This would come from auth context in a real app
    subject: '', // Changed from title to subject
    description: '',
    category: '',
    name: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  interface GrievancePreview {
    _id: string;
    userId: string;
    subject: string; // This is correct
    description: string;
    category: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed'; // Fixed to match API
    priority: string;
    createdAt: string;
    updatedAt: string;
    grievanceId: string;
    date: string;
  }

  const [previewData, setPreviewData] = useState<GrievancePreview | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [grievanceToDelete, setGrievanceToDelete] = useState<{id: string, subject: string} | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const startTime = Date.now();
      
      // In a real implementation, this would use the actual user ID
      const userId = 'CIT-001'; // This would come from auth context
      const data = await apiClient.get<Grievance[]>(`/grievances/user/${userId}`);
      setGrievances(data);
      
      // Ensure minimum loading time of 1-2 seconds for better UX
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 1000; // 1 second minimum
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
    } catch (err) {
      console.error('Error fetching grievances:', err);
      setError('Failed to load grievances. Please try again later.');
      showToast('Failed to load grievances', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [showToast]);

  const openForm = () => {
    setIsFormOpen(true);
    setCurrentStep(1);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormData({
      citizenId: 'CIT-001',
      subject: '',
      description: '',
      category: '',
      name: '',
      email: '',
      phone: ''
    });
    setFormErrors({});
    setCurrentStep(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.subject.trim()) errors.subject = 'Subject is required';
      if (!formData.category) errors.category = 'Category is required';
    } else if (currentStep === 2) {
      if (!formData.description.trim()) errors.description = 'Description is required';
    }
    
    return errors;
  };

  const nextStep = () => {
    const errors = validateCurrentStep();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      setFormErrors({});
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
      setFormErrors(errors);
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    setPreviewData({
      _id: '',
      userId: formData.citizenId,
      subject: formData.subject,
      description: formData.description,
      category: formData.category,
      status: 'open',
      priority: 'Medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      grievanceId: `GRV-${Date.now()}`,
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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Submit the grievance to the backend with only the required fields
      const grievanceData = {
        citizenId: formData.citizenId,
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        // Note: name, email, and phone are collected in the form but not sent to the API
        // as they are not part of the Grievance interface
      };
      
      const response = await apiClient.post('/grievances', grievanceData);
      
      showToast('Grievance submitted successfully!', 'success');
      closePreview();
      closeForm();
      
      // Refresh grievances list
      const userId = 'CIT-001';
      const data = await apiClient.get<Grievance[]>(`/grievances/user/${userId}`);
      setGrievances(data);
    } catch (err) {
      console.error('Error submitting grievance:', err);
      showToast('Failed to submit grievance. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (grievanceId: string, format: 'pdf' | 'jpg' = 'pdf', type: 'acknowledgment' | 'resolution' = 'acknowledgment') => {
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      // Show loading state with animation
      showToast('Preparing your document...', 'info');
      
      // Add a delay to show the animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const blob = type === 'resolution' 
        ? await apiClient.downloadGrievanceResolution(grievanceId, format)
        : await apiClient.downloadGrievanceAcknowledgment(grievanceId, format);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `grievance-${type}-${grievanceId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      showToast('Document downloaded successfully!', 'success');
    } catch (err) {
      console.error('Error downloading document:', err);
      showToast('Failed to download document. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async (grievanceId: string, subject: string) => {
    setGrievanceToDelete({ id: grievanceId, subject });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!grievanceToDelete) return;
    
    try {
      await apiClient.deleteGrievance(grievanceToDelete.id);
      showToast('Grievance deleted successfully', 'success');
      fetchGrievances(); // Refresh grievances list
    } catch (err) {
      console.error('Error deleting grievance:', err);
      showToast('Failed to delete grievance', 'error');
    } finally {
      setIsDeleteModalOpen(false);
      setGrievanceToDelete(null);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setGrievanceToDelete(null);
  };

  const openResolutionModal = (grievance: Grievance) => {
    setSelectedGrievance(grievance);
    setIsResolutionModalOpen(true);
  };

  const closeResolutionModal = () => {
    setIsResolutionModalOpen(false);
    setSelectedGrievance(null);
  };

  const openViewModal = (grievance: Grievance) => {
    setSelectedGrievance(grievance);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedGrievance(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-orange-100 text-orange-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSteps = 2;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Filter grievances based on search term, category, and status
  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = grievance.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          grievance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          grievance.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || grievance.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || grievance.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="responsive-container text-center relative z-10">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <div className="text-4xl">📬</div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Grievance Redressal
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Submit complaints or suggestions and track their resolution online
            </p>
            
            {/* Floating Action Button for Mobile */}
            <div className="md:hidden fixed bottom-6 right-6 z-10">
              <button
                onClick={openForm}
                className="bg-gradient-to-r from-emerald-green to-deep-blue text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="responsive-container py-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search grievances..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-gray-800"
                >
                  <option value="all" className="text-gray-800">All Categories</option>
                  <option value="Roads and Infrastructure">Roads and Infrastructure</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-gray-800"
                >
                  <option value="all" className="text-gray-800">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Grievance Section */}
        <div className="responsive-container py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Submit a Grievance
                </h2>
                <p className="text-gray-600">
                  Fill out the form below to report your issue or suggestion
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    How It Works
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-bold">1</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-800">Submit Your Grievance</h4>
                        <p className="text-gray-600 mt-1">
                          Fill out the form with your details and complaint
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-bold">2</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-800">Review & Confirm</h4>
                        <p className="text-gray-600 mt-1">
                          Preview your grievance and confirm submission
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-bold">3</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-800">Track Progress</h4>
                        <p className="text-gray-600 mt-1">
                          Monitor the status of your grievance online
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-bold">4</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-800">Resolution</h4>
                        <p className="text-gray-600 mt-1">
                          Download resolution certificate when resolved
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 h-full flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Ready to Submit?
                    </h3>
                    <p className="text-gray-600 mb-6 flex-grow">
                      Your grievance will be reviewed by our team and you&apos;ll receive updates on its progress.
                    </p>
                    <button
                      onClick={openForm}
                      className="w-full bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      Submit Grievance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Track Grievance Status */}
        <div className="responsive-container py-8 sm:py-12 bg-gray-50 rounded-2xl mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">
              Track Grievance Status
            </h2>
          </div>
          
          {loading ? (
            <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-16 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {filteredGrievances.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grievance ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
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
                        {filteredGrievances.map((grievance) => (
                          <tr key={grievance._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {grievance._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {grievance.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(grievance.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(grievance.status)}`}>
                                {grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button 
                                onClick={() => openViewModal(grievance)}
                                className="text-emerald-green hover:text-emerald-700 font-medium mr-3"
                              >
                                View
                              </button>
                              <div className="inline-flex gap-2">
                                <button 
                                  onClick={() => handleDownload(grievance._id, 'pdf')}
                                  disabled={isDownloading}
                                  className={`text-emerald-green hover:text-emerald-700 font-medium ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  PDF
                                </button>
                                <span className="text-gray-300">|</span>
                                <button 
                                  onClick={() => handleDownload(grievance._id, 'jpg')}
                                  disabled={isDownloading}
                                  className={`text-blue-500 hover:text-blue-700 font-medium ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  JPG
                                </button>
                              </div>
                              <button 
                                onClick={() => handleDelete(grievance._id, grievance.subject)}
                                className="text-red-600 hover:text-red-800 font-medium ml-3"
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
                    {filteredGrievances.map((grievance) => (
                      <div key={grievance._id} className="border-b border-gray-200 last:border-b-0">
                        <div className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{grievance.subject}</h3>
                              <p className="text-sm text-gray-500 mt-1">{grievance.category}</p>
                            </div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(grievance.status)}`}>
                              {grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              {new Date(grievance.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex space-x-3">
                              <button 
                                onClick={() => openViewModal(grievance)}
                                className="text-emerald-green hover:text-emerald-700 font-medium text-sm"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => handleDownload(grievance._id, 'pdf')}
                                className="text-emerald-green hover:text-emerald-700 font-medium text-sm"
                              >
                                Download
                              </button>
                              <button 
                                onClick={() => handleDelete(grievance._id, grievance.subject)}
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No grievances found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria' 
                      : 'Get started by submitting a grievance.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Multi-step Grievance Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Submit Grievance
                </h2>
                <button
                  onClick={closeForm}
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
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <form className="space-y-5">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-dark-label mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 transition-all duration-300 ${
                          formErrors.subject ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        }`}
                        placeholder="Enter a brief title for your grievance"
                      />
                      {formErrors.subject && (
                        <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{formErrors.subject}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-label mb-1">
                        Complaint Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 transition-all duration-300 ${
                          formErrors.category ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        }`}
                      >
                        <option value="" className="text-gray-800">Select a category</option>
                        <option value="Roads and Infrastructure" className="text-gray-800">Roads and Infrastructure</option>
                        <option value="Water Supply" className="text-gray-800">Water Supply</option>
                        <option value="Electricity" className="text-gray-800">Electricity</option>
                        <option value="Sanitation" className="text-gray-800">Sanitation</option>
                        <option value="Healthcare" className="text-gray-800">Healthcare</option>
                        <option value="Education" className="text-gray-800">Education</option>
                        <option value="Other" className="text-gray-800">Other</option>
                      </select>
                      {formErrors.category && (
                        <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{formErrors.category}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Step 2: Detailed Description */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-dark-label mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 transition-all duration-300 ${
                          formErrors.description ? 'border-red-500 shake' : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        }`}
                        placeholder="Describe your grievance in detail"
                      />
                      {formErrors.description && (
                        <p className="mt-1 text-sm text-red-600 animate-shake" role="alert">{formErrors.description}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-label mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-800 transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-label mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-800 transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter your email"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-label mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-800 transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter your phone number"
                        />
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
                    onClick={closeForm}
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
                  Preview Grievance
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
                  <h3 className="text-xl font-bold text-gray-800">Grievance Acknowledgment</h3>
                  <p className="text-gray-700">Please review your grievance details before submitting</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-700">Grievance ID</p>
                    <p className="font-medium text-gray-900">{previewData.grievanceId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Date</p>
                    <p className="font-medium text-gray-900">{previewData.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Name</p>
                    <p className="font-medium text-gray-900">{'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Contact</p>
                    <p className="font-medium text-gray-900">{'Not provided'}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-700">Subject</p>
                  <p className="font-medium text-gray-900">{previewData.subject}</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-700">Category</p>
                  <p className="font-medium text-gray-900">{previewData.category}</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-700">Description</p>
                  <p className="font-medium text-gray-900 whitespace-pre-wrap">{previewData.description}</p>
                </div>
                
                <div className="border-t border-gray-300 pt-4">
                  <p className="text-sm text-gray-700">
                    By submitting this grievance, you confirm that the information provided is accurate to the best of your knowledge.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmit}
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
                    'Submit Grievance'
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
      
      {/* Resolution Modal */}
      {isResolutionModalOpen && selectedGrievance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Grievance Resolution
                </h2>
                <button
                  onClick={closeResolutionModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Resolution Certificate</h3>
                  <p className="text-gray-700">Grievance has been resolved</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-700">Grievance ID</p>
                    <p className="font-medium text-gray-900">{selectedGrievance._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Date Resolved</p>
                    <p className="font-medium text-gray-900">{new Date(selectedGrievance.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Category</p>
                    <p className="font-medium text-gray-900">{selectedGrievance.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Status</p>
                    <p className="font-medium">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Resolved
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-700">Subject</p>
                  <p className="font-medium text-gray-900">{selectedGrievance.subject}</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-700">Resolution Remarks</p>
                  <p className="font-medium text-gray-900">{selectedGrievance.remarks || 'No remarks provided'}</p>
                </div>
                
                <div className="border-t border-gray-300 pt-4">
                  <p className="text-sm text-gray-700">
                    This certificate confirms that the grievance has been resolved by the Panchayat authorities.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={() => handleDownload(selectedGrievance._id, 'pdf', 'resolution')}
                    disabled={isDownloading}
                    className={`flex-1 bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isDownloading ? 'Preparing...' : 'Download PDF'}
                  </button>
                  <button
                    onClick={() => handleDownload(selectedGrievance._id, 'jpg', 'resolution')}
                    disabled={isDownloading}
                    className={`flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isDownloading ? 'Preparing...' : 'Download JPG'}
                  </button>
                </div>
                <button
                  onClick={closeResolutionModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Grievance Modal */}
      {isViewModalOpen && selectedGrievance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Grievance Details
                </h2>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedGrievance.subject}</h3>
                    <p className="text-gray-600">{selectedGrievance.category}</p>
                  </div>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Approved
                  </span>
                </div>
                
                {selectedGrievance.status === 'open' && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <span className="font-medium">Note:</span> This grievance is awaiting review by the authorities.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-700">Grievance ID</p>
                    <p className="font-medium text-gray-900">{selectedGrievance._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Date Submitted</p>
                    <p className="font-medium text-gray-900">{new Date(selectedGrievance.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Name</p>
                    <p className="font-medium text-gray-900">{'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Contact</p>
                    <p className="font-medium text-gray-900">{'Not provided'}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-700">Description</p>
                  <p className="font-medium text-gray-900 whitespace-pre-wrap">{selectedGrievance.description}</p>
                </div>
                
                {selectedGrievance.status === 'resolved' && selectedGrievance.remarks && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-700">Resolution Remarks</p>
                    <p className="font-medium text-gray-900">{selectedGrievance.remarks}</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={() => handleDownload(selectedGrievance._id, 'pdf')}
                    disabled={isDownloading}
                    className={`flex-1 bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isDownloading ? 'Preparing...' : 'Download PDF'}
                  </button>
                  <button
                    onClick={() => handleDownload(selectedGrievance._id, 'jpg')}
                    disabled={isDownloading}
                    className={`flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isDownloading ? 'Preparing...' : 'Download JPG'}
                  </button>
                </div>
                <button
                  onClick={closeViewModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
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
        itemName={grievanceToDelete?.subject || ''}
      />
      
      <Footer />
    </div>
  );
};

export default GrievancePage;