'use client';

import { useState, useEffect } from 'react';
import { generateAndDownloadReport } from '../../utils/fileUtils';
import { apiClient, CitizenRecord } from '../../lib/api';

// Extend the API interface with additional fields needed for the UI
interface UICitizenRecord extends CitizenRecord {
  village: string;
  applications: number;
  grievances: number;
  schemes: number;
  lastAccessed: string;
  aadhaar: string; // Alias for aadharNumber
}

export default function CitizenRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<UICitizenRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitizenRecords = async () => {
      try {
        setLoading(true);
        const startTime = Date.now();
        
        // Fetch citizen records from API
        const apiRecords: CitizenRecord[] = await apiClient.getCitizenRecords();
        
        // Transform API records to include UI-specific fields
        const transformedRecords: UICitizenRecord[] = apiRecords.map(record => ({
          ...record,
          aadhaar: record.aadharNumber, // Create alias for aadharNumber
          village: 'Not specified', // Default value, would come from address or separate field
          applications: 0, // Default value, would come from API
          grievances: 0, // Default value, would come from API
          schemes: 0, // Default value, would come from API
          lastAccessed: new Date(record.createdAt).toLocaleDateString() // Transform createdAt
        }));
        
        // Ensure minimum loading time of 1-2 seconds for better UX
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 1000; // 1 second minimum
        if (elapsedTime < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
        }
        
        setRecords(transformedRecords);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching citizen records:', error);
        setLoading(false);
      }
    };

    fetchCitizenRecords();
  }, []);

  const filteredRecords = records.filter(record => 
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.aadhaar.includes(searchTerm) ||
    record.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewHistory = async (record: UICitizenRecord) => {
    // Generate citizen history report
    const historyData = {
      "Citizen Information": {
        "Name": record.name,
        "Aadhaar Number": record.aadhaar,
        "Email": record.email,
        "Phone": record.phone,
        "Village": record.village
      },
      "Record Summary": {
        "Total Applications": record.applications.toString(),
        "Grievances Filed": record.grievances.toString(),
        "Schemes Applied": record.schemes.toString(),
        "Last Accessed": record.lastAccessed
      },
      "Application History": {
        "Certificate Applications": "3",
        "Scheme Applications": "2",
        "Grievance Records": "1",
        "Property Records": "0"
      },
      "Status Overview": {
        "Pending Applications": "1",
        "Resolved Grievances": "0",
        "Active Schemes": "2"
      }
    };

    await generateAndDownloadReport(`Citizen History - ${record.name}`, historyData, 'pdf');
  };

  const handleDownloadReport = async (record: UICitizenRecord) => {
    // Generate citizen report
    const reportData = {
      "Citizen Profile": {
        "Full Name": record.name,
        "Aadhaar ID": record.aadhaar,
        "Contact Email": record.email,
        "Phone Number": record.phone,
        "Residential Village": record.village
      },
      "Service Utilization": {
        "Certificates Processed": record.applications.toString(),
        "Grievances Filed": record.grievances.toString(),
        "Schemes Enrolled": record.schemes.toString(),
        "Last Activity": record.lastAccessed
      },
      "Detailed Records": {
        "Birth Certificates": "1",
        "Income Certificates": "2",
        "Housing Scheme Applications": "1",
        "Irrigation Scheme Applications": "1",
        "Open Grievances": "1"
      }
    };

    await generateAndDownloadReport(`Citizen Report - ${record.name}`, reportData, 'pdf');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Citizen Records</h2>
          <p className="text-gray-600 mt-1">Access and manage citizen information and records</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by name, Aadhaar, or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No records found</h3>
          <p className="text-gray-600 max-w-md mx-auto">Try adjusting your search criteria to find citizen records.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citizen</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Village</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grievances</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schemes</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Accessed</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.name}</div>
                    <div className="text-sm text-gray-500">Aadhaar: {record.aadhaar}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.email}</div>
                    <div className="text-sm text-gray-500">{record.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.village}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      {record.applications}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                      {record.grievances}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                      {record.schemes}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.lastAccessed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewHistory(record)}
                      className="text-emerald-600 hover:text-emerald-800 mr-4 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View History
                    </button>
                    <button
                      onClick={() => handleDownloadReport(record)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}