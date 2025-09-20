'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error occurred:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Something Went Wrong</h1>
          <p className="text-gray-600 mb-4">
            We&apos;re sorry, but an unexpected error occurred.
          </p>
          <p className="text-sm text-gray-500 mb-8 bg-gray-50 p-3 rounded-lg">
            {error.message || 'An unknown error occurred'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-white text-emerald-600 border border-emerald-200 rounded-lg font-medium hover:bg-emerald-50 transition-colors shadow-sm hover:shadow-md"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}