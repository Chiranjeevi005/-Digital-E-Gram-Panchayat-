'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface DiagnosticResult {
  timestamp: string;
  userAgent: string;
  isMobile: boolean;
  online: boolean;
  apiBaseUrl: string;
  apiAccessible: boolean;
  apiError?: string;
  corsIssue?: boolean;
  networkType?: string;
  connection?: any;
}

export default function MobileDiagnosticsPage() {
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runDiagnostics = async () => {
    setLoading(true);
    setError('');
    setDiagnosticResults(null);

    try {
      // Collect device information
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
      const isMobile = typeof navigator !== 'undefined' && 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const online = typeof navigator !== 'undefined' ? navigator.onLine : false;
      
      // Get API base URL
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://digital-e-gram-panchayat-rjkb.onrender.com/api';
      
      // Test API connectivity
      let apiAccessible = false;
      let apiError = '';
      let corsIssue = false;
      
      try {
        // Test basic connectivity to API
        const response = await fetch(`${apiBaseUrl}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Mobile-specific options
          ...(isMobile && {
            cache: 'no-store',
            keepalive: true
          })
        });
        
        apiAccessible = response.ok;
        if (!response.ok) {
          apiError = `HTTP ${response.status}: ${response.statusText}`;
          if (response.status === 0) {
            corsIssue = true;
          }
        }
      } catch (err: any) {
        apiAccessible = false;
        apiError = err.message || 'Unknown error';
        // Detect CORS issues
        if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
          corsIssue = true;
        }
      }
      
      // Get network information if available
      let networkType = 'unknown';
      let connection: any = null;
      
      if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        // @ts-ignore
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
          networkType = conn.effectiveType || 'unknown';
          connection = {
            downlink: conn.downlink,
            rtt: conn.rtt,
            saveData: conn.saveData
          };
        }
      }
      
      const result: DiagnosticResult = {
        timestamp: new Date().toISOString(),
        userAgent,
        isMobile,
        online,
        apiBaseUrl,
        apiAccessible,
        ...(apiError && { apiError }),
        ...(corsIssue && { corsIssue }),
        networkType,
        ...(connection && { connection })
      };
      
      setDiagnosticResults(result);
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run diagnostics automatically when page loads
    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gradient-hero py-16 sm:py-20">
          <div className="responsive-container text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Mobile Diagnostics
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive mobile connectivity diagnostics
            </p>
          </div>
        </div>

        <div className="responsive-container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Mobile Connectivity Diagnostics</h2>
              
              <button
                onClick={runDiagnostics}
                disabled={loading}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 mb-6"
              >
                {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {diagnosticResults && (
                <div className="mt-6 space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Device Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Timestamp</p>
                        <p className="font-medium">{diagnosticResults.timestamp}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Is Mobile Device</p>
                        <p className="font-medium">{diagnosticResults.isMobile ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Online Status</p>
                        <p className="font-medium">{diagnosticResults.online ? 'Online' : 'Offline'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Network Type</p>
                        <p className="font-medium">{diagnosticResults.networkType}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">User Agent</p>
                        <p className="font-medium text-xs truncate">{diagnosticResults.userAgent}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">API Connectivity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">API Base URL</p>
                        <p className="font-medium text-xs truncate">{diagnosticResults.apiBaseUrl}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">API Accessible</p>
                        <p className="font-medium">{diagnosticResults.apiAccessible ? 'Yes' : 'No'}</p>
                      </div>
                      {diagnosticResults.apiError && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">API Error</p>
                          <p className="font-medium text-red-600">{diagnosticResults.apiError}</p>
                        </div>
                      )}
                      {diagnosticResults.corsIssue && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">CORS Issue Detected</p>
                          <p className="font-medium text-orange-600">This may be causing the login problem</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {diagnosticResults.connection && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2">Network Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Downlink Speed</p>
                          <p className="font-medium">{diagnosticResults.connection.downlink} Mbps</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Round Trip Time</p>
                          <p className="font-medium">{diagnosticResults.connection.rtt} ms</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Data Saver</p>
                          <p className="font-medium">{diagnosticResults.connection.saveData ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Troubleshooting Guide</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-emerald-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-800">Network Issues</h3>
                  <p className="text-gray-600 text-sm">
                    If API is not accessible, try switching between Wi-Fi and mobile data. 
                    Restart your device and check your internet connection.
                  </p>
                </div>
                
                <div className="border-l-4 border-emerald-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-800">CORS Issues</h3>
                  <p className="text-gray-600 text-sm">
                    If CORS issues are detected, the backend server may not be properly configured 
                    to accept requests from your mobile device. This requires backend configuration changes.
                  </p>
                </div>
                
                <div className="border-l-4 border-emerald-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-800">Browser Cache</h3>
                  <p className="text-gray-600 text-sm">
                    Clear your browser cache and cookies. Try using an incognito/private browsing window.
                  </p>
                </div>
                
                <div className="border-l-4 border-emerald-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-800">Different Browser</h3>
                  <p className="text-gray-600 text-sm">
                    Try using a different browser (Chrome, Safari, Firefox) to see if the issue is browser-specific.
                  </p>
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