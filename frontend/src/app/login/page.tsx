'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import Link from 'next/link';

export default function LoginPage() {
  const [userType, setUserType] = useState<'Citizen' | 'Officer' | 'Staff'>('Citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // Check for registration success redirect
  useEffect(() => {
    const registered = searchParams.get('registered');
    const emailParam = searchParams.get('email');
    
    if (registered === 'true' && emailParam) {
      setEmail(decodeURIComponent(emailParam));
      setSuccess('Registration successful! Please sign in with your credentials.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Specify the type for the error
      await login(email, password, userType);
      
      // Redirect to home page instead of dashboard as per specifications
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Predefined credentials information
  const getDefaultCredentials = () => {
    if (userType === 'Officer') {
      return { email: 'officer@epanchayat.com', password: 'officer123' };
    } else if (userType === 'Staff') {
      return { email: 'staff1@epanchayat.com or staff2@epanchayat.com', password: 'staff123' };
    }
    return null;
  };

  const defaultCredentials = getDefaultCredentials();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Digital E-Panchayat Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">
              {success}
            </div>
          </div>
        )}
        
        {/* Default credentials information */}
        {defaultCredentials && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="text-sm text-blue-700">
              <p className="font-medium">Default credentials for {userType}:</p>
              <p>Email: {defaultCredentials.email}</p>
              <p>Password: {defaultCredentials.password}</p>
              <p className="mt-1 text-xs">Please change your password after first login.</p>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setUserType('Citizen')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    userType === 'Citizen'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('Officer')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    userType === 'Officer'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Officer
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('Staff')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    userType === 'Staff'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Staff
                </button>
              </div>
            </div>

            <InputField
              label="Email Address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />

            <InputField
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                Forgot your password?
              </a>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              isLoading={loading}
              className="w-full"
            >
              Sign in
            </Button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don{`'`}t have an account?{' '}
            <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
              Register as Citizen
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}