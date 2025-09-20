'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('Citizen' | 'Officer' | 'Staff')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // If allowedRoles is specified, check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.userType as 'Citizen' | 'Officer' | 'Staff')) {
    // Redirect to appropriate dashboard based on user role
    switch (user.userType) {
      case 'Citizen':
        router.push('/dashboard/citizen');
        break;
      case 'Staff':
        router.push('/dashboard/staff');
        break;
      case 'Officer':
        router.push('/dashboard/officer');
        break;
      default:
        router.push('/');
    }
    return null;
  }

  return <>{children}</>;
}