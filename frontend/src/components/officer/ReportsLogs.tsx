'use client';

import { useState } from 'react';
import { generateAndDownloadReport } from '../../services/fileUtils';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export default function ReportsLogs() {
  const [logs] = useState<LogEntry[]>([
    { id: '1', timestamp: '2023-05-15 09:30:22', user: 'Rajesh Kumar', action: 'Certificate Application', details: 'Applied for Birth Certificate' },
    { id: '2', timestamp: '2023-05-15 10:15:45', user: 'Staff Member 1', action: 'Certificate Processed', details: 'Birth Certificate #BC-7892 processed' },
    { id: '3', timestamp: '2023-05-15 11:22:18', user: 'Priya Sharma', action: 'Grievance Filed', details: 'Water supply issue in Sector 3' },
    { id: '4', timestamp: '2023-05-15 14:05:33', user: 'Staff Member 2', action: 'Grievance Assigned', details: 'Grievance #G-7892 assigned to maintenance team' },
    { id: '5', timestamp: '2023-05-15 16:45:12', user: 'Amit Patel', action: 'Scheme Application', details: 'Applied for PMAY Housing Scheme' },
    { id: '6', timestamp: '2023-05-16 09:15:27', user: 'Staff Member 3', action: 'Scheme Verified', details: 'PMAY application #PMAY-4567 verified' },
    { id: '7', timestamp: '2023-05-16 11:30:55', user: 'Sunita Verma', action: 'Land Record Request', details: 'Requested land record for Survey No. SUR-1234' },
    { id: '8', timestamp: '2023-05-16 14:22:41', user: 'Staff Member 1', action: 'Certificate Issued', details: 'Birth Certificate #BC-7892 issued to Rajesh Kumar' },
  ]);

  const reportTypes = [
    { id: 'certificates', name: 'Certificates Report', description: 'Detailed report of all certificate applications and processing' },
    { id: 'grievances', name: 'Grievance Report', description: 'Comprehensive report of citizen grievances and resolutions' },
    { id: 'schemes', name: 'Schemes Report', description: 'Analysis of government scheme applications and beneficiaries' },
    { id: 'land', name: 'Land & Property Report', description: 'Summary of land records and property transactions' },
    { id: 'staff', name: 'Staff Activity Report', description: 'Performance metrics and activity logs for all staff members' },
    { id: 'audit', name: 'Audit Log Report', description: 'Complete audit trail of all system activities' }
  ];

  const handleDownloadReport = async (reportType: string, format: 'pdf' | 'jpg') => {
    let reportData: Record<string, Record<string, string> | string> = {};
    let reportTitle = '';

    switch (reportType) {
      case 'certificates':
        reportTitle = 'Certificates Report';
        reportData = {
          "Report Summary": {
            "Total Applications": "245",
            "Processed": "220",
            "Pending": "25",
            "Report Period": "May 2023"
          },
          "Certificate Types": {
            "Birth Certificates": "45",
            "Death Certificates": "32",
            "Marriage Certificates": "28",
            "Income Certificates": "55",
            "Caste Certificates": "35",
            "Residence Certificates": "50"
          }
        };
        break;
      case 'grievances':
        reportTitle = 'Grievance Report';
        reportData = {
          "Report Summary": {
            "Total Grievances": "229",
            "Resolved": "187",
            "Pending": "25",
            "Closed": "17",
            "Report Period": "May 2023"
          },
          "Grievance Categories": {
            "Water Supply": "45",
            "Road Maintenance": "38",
            "Electricity": "32",
            "Sanitation": "28",
            "Other": "86"
          }
        };
        break;
      case 'schemes':
        reportTitle = 'Schemes Report';
        reportData = {
          "Report Summary": {
            "Total Schemes": "24",
            "Active Schemes": "18",
            "Applications": "1,245",
            "Beneficiaries": "987",
            "Report Period": "May 2023"
          },
          "Top Schemes": {
            "PMAY Housing": "450",
            "PMKSY Irrigation": "320",
            "PMJDY Banking": "280",
            "PMAY Pension": "195"
          }
        };
        break;
      case 'land':
        reportTitle = 'Land & Property Report';
        reportData = {
          "Report Summary": {
            "Total Records": "1,248",
            "Transfers": "87",
            "Mutations": "32",
            "Report Period": "May 2023"
          },
          "Land Types": {
            "Agricultural": "780",
            "Residential": "320",
            "Commercial": "148"
          }
        };
        break;
      case 'staff':
        reportTitle = 'Staff Activity Report';
        reportData = {
          "Report Summary": {
            "Total Staff": "12",
            "Active Staff": "10",
            "Average Certificates Processed": "42.5",
            "Average Grievances Handled": "35.2",
            "Report Period": "May 2023"
          },
          "Top Performers": {
            "Amit Sharma": "Certificates: 45, Grievances: 32",
            "Priya Patel": "Certificates: 38, Grievances: 29",
            "Rajesh Kumar": "Certificates: 52, Grievances: 41"
          }
        };
        break;
      case 'audit':
        reportTitle = 'Audit Log Report';
        reportData = {
          "Report Summary": {
            "Total Activities": "1,245",
            "User Registrations": "24",
            "Applications Submitted": "342",
            "Applications Processed": "298",
            "Report Period": "May 2023"
          },
          "Activity Types": {
            "Certificate Applications": "245",
            "Grievance Filings": "187",
            "Scheme Applications": "168",
            "Land Record Requests": "87",
            "System Logins": "558"
          }
        };
        break;
      default:
        reportTitle = 'General Report';
        reportData = {
          "Report Generated": new Date().toLocaleString()
        };
    }

    await generateAndDownloadReport(reportTitle, reportData, format);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Logs</h2>
          <p className="text-gray-600 mt-1">Download comprehensive reports and view system logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Report Types */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Available Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 mb-2">{report.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDownloadReport(report.id, 'pdf')}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    PDF
                  </button>
                  <button 
                    onClick={() => handleDownloadReport(report.id, 'jpg')}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-xs py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    JPG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          System Audit Logs
        </h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="truncate" title={log.details}>
                      {log.details}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}