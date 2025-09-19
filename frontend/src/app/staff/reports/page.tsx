'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import ReportsAndAnalytics from '../../../components/staff/ReportsAndAnalytics';

export default function StaffReportsPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.userType !== 'Staff') {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['Staff']}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">View performance metrics and generate reports</p>
          </div>
          <ReportsAndAnalytics />
        </div>
      </div>
    </ProtectedRoute>
  );
}