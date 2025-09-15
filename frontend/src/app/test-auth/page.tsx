'use client';

import { useState } from 'react';
import { apiClient } from '../../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  token: string;
  user: User;
}

export default function TestAuthPage() {
  const [result, setResult] = useState<Record<string, unknown> | RegisterResponse | LoginResponse | User | null>(null);
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    try {
      const res: RegisterResponse = await apiClient.register('Test User', 'test@example.com', 'password123');
      setResult(res);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const res: LoginResponse = await apiClient.login('test@example.com', 'password123', 'Citizen');
      setResult(res);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const testGetCurrentUser = async () => {
    setLoading(true);
    try {
      const res: User = await apiClient.getCurrentUser();
      setResult(res);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Auth Test Page</h1>
        
        <div className="space-y-4">
          <button
            onClick={testRegister}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Test Register
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Test Login
          </button>
          
          <button
            onClick={testGetCurrentUser}
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Test Get Current User
          </button>
        </div>
        
        {loading && (
          <div className="mt-4 text-center">
            <p>Loading...</p>
          </div>
        )}
        
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h2 className="font-bold mb-2">Result:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}