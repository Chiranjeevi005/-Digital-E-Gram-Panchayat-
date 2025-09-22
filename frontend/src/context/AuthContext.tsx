'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'Citizen' | 'Officer' | 'Staff';
}

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, userType: 'Citizen' | 'Officer' | 'Staff') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        try {
          const userData = await apiClient.getCurrentUser();
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            userType: userData.userType as 'Citizen' | 'Officer' | 'Staff'
          });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, userType: 'Citizen' | 'Officer' | 'Staff') => {
    try {
      // Log login attempt for debugging
      console.log('Attempting login:', { email, userType });
      
      const response = await apiClient.login({
        email,
        password,
        userType,
      });

      // Store token in localStorage or sessionStorage based on rememberMe
      // For now, we'll store in localStorage
      localStorage.setItem('token', response.token);
      
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        userType: response.user.userType as 'Citizen' | 'Officer' | 'Staff'
      });
      
      console.log('Login successful:', { userId: response.user.id, email: response.user.email });

    } catch (error) {
      // Enhanced error handling with mobile detection
      const isMobile = typeof window !== 'undefined' && 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      console.error('Login failed:', {
        error,
        email,
        userType,
        isMobile,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown'
      });
      
      // Re-throw the error with additional context for mobile
      if (isMobile && error instanceof Error) {
        // Check if this is a network error
        if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
          throw new Error(`Mobile Network Connection Error: Unable to connect to the server. Please check your internet connection, try switching between Wi-Fi and mobile data, and ensure you're not using any ad blockers or privacy extensions that might block the connection.`);
        } else {
          throw new Error(`Mobile Login Error: ${error.message}. Please check your internet connection and try again.`);
        }
      }
      
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};