'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';

export default function ApiTestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [envInfo, setEnvInfo] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Get environment variables on component mount
    setEnvInfo({
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set'
    });
  }, []);

  const testApiConnection = async () => {
    setLoading(true);
    setResult('Testing API connection...');
    
    try {
      // Test a simple API call to check if the connection works
      const response = await apiClient.get('/auth/user/me');
      setResult(`Success! API is working. Response: ${JSON.stringify(response)}`);
    } catch (error: any) {
      console.error('API Test Error:', error);
      setResult(`Error: ${error.message || 'Unknown error'}. Status: ${error.status || 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  const testSpecificEndpoint = async () => {
    setLoading(true);
    setResult('Testing specific endpoint...');
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api';
      const testUrl = `${baseUrl}/auth/user/me`;
      setResult(`Testing URL: ${testUrl}`);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(`Success! Direct fetch worked. Response: ${JSON.stringify(data)}`);
    } catch (error: any) {
      console.error('Direct Fetch Test Error:', error);
      setResult(`Direct Fetch Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testHealthEndpoint = async () => {
    setLoading(true);
    setResult('Testing health endpoint...');
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api';
      // Remove /api from the base URL for health check since it's at root level
      const healthUrl = baseUrl.replace('/api', '');
      const testUrl = `${healthUrl}/health`;
      setResult(`Testing URL: ${testUrl}`);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(`Success! Health check worked. Response: ${JSON.stringify(data)}`);
    } catch (error: any) {
      console.error('Health Check Error:', error);
      setResult(`Health Check Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testRootEndpoint = async () => {
    setLoading(true);
    setResult('Testing root endpoint...');
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api';
      // Remove /api from the base URL for root check since it's at root level
      const rootUrl = baseUrl.replace('/api', '');
      const testUrl = `${rootUrl}/`;
      setResult(`Testing URL: ${testUrl}`);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(`Success! Root endpoint worked. Response: ${JSON.stringify(data)}`);
    } catch (error: any) {
      console.error('Root Endpoint Error:', error);
      setResult(`Root Endpoint Error: ${error.message || 'Unknown error'}`);
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
          <div className="flex flex-wrap gap-2">
            <button
              onClick={testApiConnection}
              disabled={loading}
              className="flex-1 min-w-[120px] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test API'}
            </button>
            
            <button
              onClick={testSpecificEndpoint}
              disabled={loading}
              className="flex-1 min-w-[120px] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Direct Fetch'}
            </button>
            
            <button
              onClick={testHealthEndpoint}
              disabled={loading}
              className="flex-1 min-w-[120px] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Health Check'}
            </button>
            
            <button
              onClick={testRootEndpoint}
              disabled={loading}
              className="flex-1 min-w-[120px] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Root Test'}
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900">Result:</h3>
            <p className="mt-1 text-sm text-gray-600">{result}</p>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900">Configuration Info:</h3>
            <p className="mt-1 text-sm text-gray-600">
              API Base URL: {envInfo.NEXT_PUBLIC_API_BASE_URL}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Environment: {envInfo.NODE_ENV}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Expected Backend URL: https://digital-e-gram-panchayat-rjkb.onrender.com/api
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}