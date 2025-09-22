'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface TestResult {
  timestamp?: string;
  userAgent?: string;
  isMobile?: boolean;
  online?: boolean;
}

interface ApiTestResult {
  status?: number;
  ok?: boolean;
  statusText?: string;
  data?: any;
  error?: string;
}

export default function MobileTestPage() {
  const [testResults, setTestResults] = useState<{
    connectivity: TestResult;
    api: ApiTestResult;
    mobileApi: ApiTestResult;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runConnectivityTest = async () => {
    setLoading(true);
    setError('');
    setTestResults(null);

    try {
      // Test 1: Basic connectivity
      const connectivityTest: TestResult = {
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        isMobile: typeof navigator !== 'undefined' && 
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        online: typeof navigator !== 'undefined' ? navigator.onLine : false
      };

      // Test 2: API connectivity
      let apiTest: ApiTestResult = {};
      try {
        const apiResponse = await fetch('/api/health');
        apiTest = {
          status: apiResponse.status,
          ok: apiResponse.ok,
          statusText: apiResponse.statusText
        };
        
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          apiTest.data = data;
        }
      } catch (apiError: any) {
        apiTest = {
          error: apiError instanceof Error ? apiError.message : 'Unknown API error'
        };
      }

      // Test 3: Mobile-specific API connectivity
      let mobileApiTest: ApiTestResult = {};
      try {
        const mobileApiResponse = await fetch('/api/health/mobile');
        mobileApiTest = {
          status: mobileApiResponse.status,
          ok: mobileApiResponse.ok,
          statusText: mobileApiResponse.statusText
        };
        
        if (mobileApiResponse.ok) {
          const data = await mobileApiResponse.json();
          mobileApiTest.data = data;
        }
      } catch (mobileApiError: any) {
        mobileApiTest = {
          error: mobileApiError instanceof Error ? mobileApiError.message : 'Unknown mobile API error'
        };
      }

      setTestResults({
        connectivity: connectivityTest,
        api: apiTest,
        mobileApi: mobileApiTest
      });
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run test automatically when page loads
    runConnectivityTest();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gradient-hero py-16 sm:py-20">
          <div className="responsive-container text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Mobile Connectivity Test
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Diagnose mobile login issues
            </p>
          </div>
        </div>

        <div className="responsive-container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Connectivity Diagnostics</h2>
              
              <button
                onClick={runConnectivityTest}
                disabled={loading}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Running Tests...' : 'Run Connectivity Tests'}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {testResults && (
                <div className="mt-6 space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Connectivity Test</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Timestamp</p>
                        <p className="font-medium">{testResults.connectivity.timestamp}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Is Mobile Device</p>
                        <p className="font-medium">{testResults.connectivity.isMobile ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Online Status</p>
                        <p className="font-medium">{testResults.connectivity.online ? 'Online' : 'Offline'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">User Agent</p>
                        <p className="font-medium text-xs truncate">{testResults.connectivity.userAgent}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">API Connectivity Test</h3>
                    {testResults.api.error ? (
                      <div className="text-red-700">
                        <p>Error: {testResults.api.error}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="font-medium">{testResults.api.status} {testResults.api.statusText}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Success</p>
                          <p className="font-medium">{testResults.api.ok ? 'Yes' : 'No'}</p>
                        </div>
                        {testResults.api.data && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">Response Data</p>
                            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(testResults.api.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Mobile API Test</h3>
                    {testResults.mobileApi.error ? (
                      <div className="text-red-700">
                        <p>Error: {testResults.mobileApi.error}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="font-medium">{testResults.mobileApi.status} {testResults.mobileApi.statusText}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Success</p>
                          <p className="font-medium">{testResults.mobileApi.ok ? 'Yes' : 'No'}</p>
                        </div>
                        {testResults.mobileApi.data && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">Response Data</p>
                            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(testResults.mobileApi.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Troubleshooting Tips</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>Check your internet connection and try switching between Wi-Fi and mobile data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>Clear your browser cache and cookies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>Try using a different browser (Chrome, Safari, Firefox)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>Disable any ad blockers or privacy extensions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>If using a corporate network, check with your IT department about firewall restrictions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}