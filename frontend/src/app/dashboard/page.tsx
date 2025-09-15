'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  userType: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // Check if token exists
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // In a real app, you would validate the token with your backend
        // For now, we'll just check if it exists
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          router.push('/login');
          return;
        }

        // Set user data (in a real app, fetch from backend)
        setUser({
          name: payload.userType === 'Citizen' ? 'Citizen User' : payload.userType,
          email: payload.userType === 'Citizen' ? 'citizen@example.com' : 
                 payload.userType === 'Officer' ? 'officer@epanchayat.com' : 
                 'staff@epanchayat.com',
          userType: payload.userType
        });
      } catch (error) {
        // Invalid token
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Digital E-Panchayat Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, {user?.name} ({user?.userType})
            </span>
            <button
              onClick={handleLogout}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-sky-50 rounded-lg p-6 border border-sky-100">
              <h3 className="text-lg font-medium text-sky-800 mb-2">Services</h3>
              <p className="text-gray-600">Access various panchayat services and applications.</p>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-100">
              <h3 className="text-lg font-medium text-emerald-800 mb-2">Applications</h3>
              <p className="text-gray-600">Track your submitted applications and requests.</p>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
              <h3 className="text-lg font-medium text-amber-800 mb-2">Notifications</h3>
              <p className="text-gray-600">Stay updated with important announcements.</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600">No recent activity to display.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}