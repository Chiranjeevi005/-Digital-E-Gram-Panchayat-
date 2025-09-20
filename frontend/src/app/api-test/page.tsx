'use client';

import { useState } from 'react';
import { apiClient } from '../../services/api';

export default function ApiTestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testApiConnection = async () => {
    setLoading(true);
    setResult('Testing API connection...');
    
    try {
      // Test a simple API call to check if the connection works
      const response = await apiClient.get('/auth/user/me');
      setResult(`Success! API is working. Response: ${JSON.stringify(response)}`);
    } catch (error) {
      setResult(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            API Connection Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test if the frontend can connect to the backend
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <button
            onClick={testApiConnection}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900">Result:</h3>
            <p className="mt-1 text-sm text-gray-600">{result}</p>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900">Configuration Info:</h3>
            <p className="mt-1 text-sm text-gray-600">
              API Base URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Expected Backend URL: https://digital-e-gram-panchayat-rjkb.onrender.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}