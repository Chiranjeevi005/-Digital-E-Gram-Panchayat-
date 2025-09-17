'use client';

import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { apiClient } from '../../../lib/api';

interface PropertyTaxData {
  propertyId: string;
  ownerName: string;
  village: string;
  taxDue: number;
  status: string;
  createdAt: string;
}

interface LandRecordData {
  surveyNo: string;
  owner: string;
  area: string;
  landType: string;
  encumbranceStatus: string;
  createdAt: string;
  _id?: string;
}

interface MutationStatusData {
  applicationId: string;
  propertyId: string;
  statusTimeline: {
    step: string;
    status: string;
    date: string;
  }[];
  createdAt: string;
}

const PropertyLandServices = () => {
  // State for property tax
  const [propertyId, setPropertyId] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [village, setVillage] = useState('');
  const [propertyTaxData, setPropertyTaxData] = useState<PropertyTaxData | null>(null);
  const [isPropertyTaxLoading, setIsPropertyTaxLoading] = useState(false);

  // State for land records
  const [surveyNo, setSurveyNo] = useState('');
  const [landRecordData, setLandRecordData] = useState<LandRecordData | null>(null);
  const [landRecordId, setLandRecordId] = useState<string | null>(null);
  const [isLandRecordLoading, setIsLandRecordLoading] = useState(false);

  // State for mutation status
  const [applicationId, setApplicationId] = useState('');
  const [mutationStatusData, setMutationStatusData] = useState<MutationStatusData | null>(null);
  const [isMutationStatusLoading, setIsMutationStatusLoading] = useState(false);

  // State for preview modal
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewType, setPreviewType] = useState<'propertyTax' | 'landRecord' | 'mutationStatus' | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Handle property tax submission
  const handlePropertyTaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPropertyTaxLoading(true);
    
    try {
      const response = await apiClient.getPropertyTax(propertyId, ownerName, village);
      setPropertyTaxData(response);
    } catch (error) {
      console.error('Error fetching property tax data:', error);
      alert('Error fetching property tax data. Please try again.');
    } finally {
      setIsPropertyTaxLoading(false);
    }
  };

  // Handle land record submission
  const handleLandRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLandRecordLoading(true);
    
    try {
      // Create the land record first
      const createResponse = await apiClient.createLandRecord({
        owner: 'Land Owner', // This would typically come from form inputs
        surveyNo,
        area: '1 Acre', // This would typically come from form inputs
        landType: 'Agricultural', // This would typically come from form inputs
        encumbranceStatus: 'Nil' // This would typically come from form inputs
      });
      
      // Get the created land record
      const getResponse = await apiClient.getLandRecord(createResponse.landRecordId);
      setLandRecordData(getResponse.landRecord);
      setLandRecordId(createResponse.landRecordId);
    } catch (error) {
      console.error('Error fetching land record:', error);
      alert('Error fetching land record. Please try again.');
    } finally {
      setIsLandRecordLoading(false);
    }
  };

  // Handle mutation status submission
  const handleMutationStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMutationStatusLoading(true);
    
    try {
      const response = await apiClient.getMutationStatus(applicationId);
      setMutationStatusData(response);
    } catch (error) {
      console.error('Error fetching mutation status:', error);
      alert('Error fetching mutation status. Please try again.');
    } finally {
      setIsMutationStatusLoading(false);
    }
  };

  // Generate receipt for property tax
  const generatePropertyTaxReceipt = async (format: 'pdf' | 'jpg') => {
    if (!propertyTaxData) return;
    
    try {
      const blob = await apiClient.downloadPropertyTaxReceipt(propertyTaxData.propertyId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `property-tax-receipt.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error downloading property tax receipt (${format}):`, error);
      alert(`Error downloading property tax receipt. Please try again.`);
    }
  };

  // Download land record
  const downloadLandRecord = async (format: 'pdf' | 'jpg') => {
    if (!landRecordId) return;
    
    try {
      const blob = await apiClient.downloadLandRecord(landRecordId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `land-record-extract.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error downloading land record (${format}):`, error);
      alert(`Error downloading land record. Please try again.`);
    }
  };

  // Download mutation acknowledgement
  const downloadMutationAcknowledgement = async (format: 'pdf' | 'jpg') => {
    if (!mutationStatusData) return;
    
    try {
      const blob = await apiClient.downloadMutationAcknowledgement(mutationStatusData.applicationId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mutation-status.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error downloading mutation acknowledgement (${format}):`, error);
      alert(`Error downloading mutation acknowledgement. Please try again.`);
    }
  };

  // Open preview modal
  const openPreview = (data: any, type: 'propertyTax' | 'landRecord' | 'mutationStatus') => {
    setPreviewData(data);
    setPreviewType(type);
    setIsPreviewOpen(true);
  };

  // Close preview modal
  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewData(null);
    setPreviewType(null);
  };

  // Villages data for dropdown
  const villages = [
    'Village A',
    'Village B',
    'Village C',
    'Village D',
    'Village E'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-hero py-16 sm:py-20">
          <div className="responsive-container text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <div className="text-4xl">🏠</div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Property & Land Services
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Manage your property and land records efficiently with our digital services.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="responsive-container py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pay Property Tax Card */}
            <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="text-5xl text-center mb-4" aria-hidden="true">🏠</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Pay Property Tax
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                View and generate property tax receipts.
              </p>
              
              <form onSubmit={handlePropertyTaxSubmit} className="space-y-4">
                <div>
                  <label htmlFor="propertyId" className="block text-sm font-medium text-dark-label mb-1">
                    Property ID / Holding Number
                  </label>
                  <input
                    type="text"
                    id="propertyId"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter Property ID or Holding Number"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="ownerName" className="block text-sm font-medium text-dark-label mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter Owner Name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="village" className="block text-sm font-medium text-dark-label mb-1">
                    Village/Ward
                  </label>
                  <select
                    id="village"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="select-field w-full"
                    required
                  >
                    <option value="">Select Village/Ward</option>
                    {villages.map((village, index) => (
                      <option key={index} value={village}>{village}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="submit"
                  disabled={isPropertyTaxLoading}
                  className="w-full bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {isPropertyTaxLoading ? 'Processing...' : 'View Tax Details'}
                </button>
              </form>
              
              {propertyTaxData && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Tax Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Property ID:</span>
                      <span className="font-medium text-gray-900">{propertyTaxData.propertyId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Owner:</span>
                      <span className="font-medium text-gray-900">{propertyTaxData.ownerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Village:</span>
                      <span className="font-medium text-gray-900">{propertyTaxData.village}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tax Due:</span>
                      <span className="font-medium text-emerald-700">₹0 (Digital E-Panchayat – No Fees)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Status:</span>
                      <span className="font-medium text-gray-900">{propertyTaxData.status}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => generatePropertyTaxReceipt('pdf')}
                      className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* View Land Records Card */}
            <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="text-5xl text-center mb-4" aria-hidden="true">📋</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                View Land Records
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Access detailed land records and extract documents.
              </p>
              
              <form onSubmit={handleLandRecordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="surveyNo" className="block text-sm font-medium text-dark-label mb-1">
                    Survey No. / Property ID
                  </label>
                  <input
                    type="text"
                    id="surveyNo"
                    value={surveyNo}
                    onChange={(e) => setSurveyNo(e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter Survey Number or Property ID"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLandRecordLoading}
                  className="w-full bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {isLandRecordLoading ? 'Fetching Records...' : 'View Land Records'}
                </button>
              </form>
              
              {landRecordData && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Land Record Details</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-2 text-sm font-medium text-gray-700">Owner</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{landRecordData.owner}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-medium text-gray-700">Survey No.</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{landRecordData.surveyNo}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-medium text-gray-700">Area</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{landRecordData.area}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-medium text-gray-700">Land Type</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{landRecordData.landType}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-medium text-gray-700">Encumbrance Status</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{landRecordData.encumbranceStatus}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => downloadLandRecord('pdf')}
                      className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mutation Status Card */}
            <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="text-5xl text-center mb-4" aria-hidden="true">🔄</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Mutation Status
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Track your land mutation application status.
              </p>
              
              <form onSubmit={handleMutationStatusSubmit} className="space-y-4">
                <div>
                  <label htmlFor="applicationId" className="block text-sm font-medium text-dark-label mb-1">
                    Application ID
                  </label>
                  <input
                    type="text"
                    id="applicationId"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter Application ID"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isMutationStatusLoading}
                  className="w-full bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {isMutationStatusLoading ? 'Checking Status...' : 'Check Status'}
                </button>
              </form>
              
              {mutationStatusData && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Application Status</h4>
                  <div className="space-y-4">
                    {mutationStatusData.statusTimeline.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === 'Completed' ? 'bg-emerald-500' : 
                          step.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'
                        }`}>
                          <span className="text-white text-xs font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <h5 className="text-sm font-medium text-gray-800">{step.step}</h5>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              step.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                              step.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {step.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{new Date(step.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => downloadMutationAcknowledgement('pdf')}
                      className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyLandServices;