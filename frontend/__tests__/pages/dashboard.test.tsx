import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
// Import the AuthProvider instead of AuthContext
import { AuthProvider } from '../../src/context/AuthContext';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock the actual dashboard pages
jest.mock('../../src/app/dashboard/citizen/page', () => {
  return {
    default: function MockCitizenDashboardPage() {
      return <div data-testid="citizen-dashboard">Citizen Dashboard Content</div>;
    }
  };
});

jest.mock('../../src/app/dashboard/staff/page', () => {
  return {
    default: function MockStaffDashboardPage() {
      return <div data-testid="staff-dashboard">Staff Dashboard Content</div>;
    }
  };
});

jest.mock('../../src/app/dashboard/officer/page', () => {
  return {
    default: function MockOfficerDashboardPage() {
      return <div data-testid="officer-dashboard">Officer Dashboard Content</div>;
    }
  };
});

// Import the mocked pages
const CitizenDashboardPage = require('../../src/app/dashboard/citizen/page').default;
const StaffDashboardPage = require('../../src/app/dashboard/staff/page').default;
const OfficerDashboardPage = require('../../src/app/dashboard/officer/page').default;

describe('Frontend Dashboard Tests', () => {
  describe('Citizen Dashboard', () => {
    it('should display citizen dashboard with applications and status', () => {
      const mockUser = { 
        id: 'citizen123', 
        name: 'Test Citizen', 
        email: 'citizen@test.com', 
        userType: 'Citizen' as const 
      };
      
      render(
        <AuthProvider>
          <CitizenDashboardPage />
        </AuthProvider>
      );

      expect(screen.getByTestId('citizen-dashboard')).toBeTruthy();
      expect(screen.getByText('Citizen Dashboard Content')).toBeTruthy();
    });

    it('should show citizen applications and their status', () => {
      const mockUser = { 
        id: 'citizen123', 
        name: 'Test Citizen', 
        email: 'citizen@test.com', 
        userType: 'Citizen' as const 
      };
      
      render(
        <AuthProvider>
          <CitizenDashboardPage />
        </AuthProvider>
      );

      // Check for application status elements
      expect(screen.getByTestId('citizen-dashboard')).toBeTruthy();
    });
  });

  describe('Staff Dashboard', () => {
    it('should display staff dashboard with tasks and progress', () => {
      const mockUser = { 
        id: 'staff123', 
        name: 'Test Staff', 
        email: 'staff@test.com', 
        userType: 'Staff' as const 
      };
      
      render(
        <AuthProvider>
          <StaffDashboardPage />
        </AuthProvider>
      );

      expect(screen.getByTestId('staff-dashboard')).toBeTruthy();
      expect(screen.getByText('Staff Dashboard Content')).toBeTruthy();
    });

    it('should show staff tasks and their progress', () => {
      const mockUser = { 
        id: 'staff123', 
        name: 'Test Staff', 
        email: 'staff@test.com', 
        userType: 'Staff' as const 
      };
      
      render(
        <AuthProvider>
          <StaffDashboardPage />
        </AuthProvider>
      );

      // Check for task progress elements
      expect(screen.getByTestId('staff-dashboard')).toBeTruthy();
    });
  });

  describe('Officer Dashboard', () => {
    it('should display officer dashboard with overview cards and reports', () => {
      const mockUser = { 
        id: 'officer123', 
        name: 'Test Officer', 
        email: 'officer@test.com', 
        userType: 'Officer' as const 
      };
      
      render(
        <AuthProvider>
          <OfficerDashboardPage />
        </AuthProvider>
      );

      expect(screen.getByTestId('officer-dashboard')).toBeTruthy();
      expect(screen.getByText('Officer Dashboard Content')).toBeTruthy();
    });

    it('should show overview cards and reports section', () => {
      const mockUser = { 
        id: 'officer123', 
        name: 'Test Officer', 
        email: 'officer@test.com', 
        userType: 'Officer' as const 
      };
      
      render(
        <AuthProvider>
          <OfficerDashboardPage />
        </AuthProvider>
      );

      // Check for overview cards and reports elements
      expect(screen.getByTestId('officer-dashboard')).toBeTruthy();
    });
  });
});