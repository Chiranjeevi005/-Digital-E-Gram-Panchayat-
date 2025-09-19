'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import CitizenRecords from '../../../components/staff/CitizenRecords';

export default function StaffRecordsPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Citizen Records</h1>
            <p className="text-gray-600 mt-1">Access and manage citizen information</p>
          </div>
          <CitizenRecords />
        </div>
      </div>
    </ProtectedRoute>
  );
}