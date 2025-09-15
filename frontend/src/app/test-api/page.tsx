'use client';

import React, { useState } from 'react';
import { apiClient } from '../../lib/api';

interface ApplyResponse {
  success: boolean;
  applicationId?: string;
  message?: string;
  status?: string;
  downloadUrl?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

const TestAPIPage = () => {
  const [result, setResult] = useState<Record<string, unknown> | ApplyResponse | User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testGetUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData: User = await apiClient.getCurrentUser();
      setResult(userData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testApplyCertificate = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApplyResponse = await apiClient.post<ApplyResponse>('/certificates/apply', {
        applicantName: 'Test User',
        certificateType: 'Birth',
        date: '2023-01-01',
        place: 'Test Place',
        supportingFiles: [],
        declaration: true
      });
      setResult(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply for certificate';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Test Page</h1>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testGetUser}
          disabled={loading}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          {loading ? 'Loading...' : 'Test Get User'}
        </button>
        <button 
          onClick={testApplyCertificate}
          disabled={loading}
          style={{ padding: '10px 20px' }}
        >
          {loading ? 'Loading...' : 'Test Apply Certificate'}
        </button>
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{ 
          backgroundColor: '#efe', 
          color: '#363', 
          padding: '10px', 
          borderRadius: '4px'
        }}>
          <strong>Result:</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestAPIPage;