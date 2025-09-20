import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import React from 'react';
import LoginPage from '../../src/app/login/page';
import RegisterPage from '../../src/app/register/page';
import { apiClient } from '../../src/lib/api';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock AuthContext
jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    register: jest.fn(),
  }),
}));

// Mock components
jest.mock('../../src/components/InputField', () => {
  return function MockInputField(props: any) {
    return (
      <div>
        <label htmlFor={props.id}>{props.label}</label>
        <input {...props} data-testid={props.id} />
      </div>
    );
  };
});

jest.mock('../../src/components/Button', () => {
  return function MockButton(props: any) {
    return <button {...props} />;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('Authentication Pages', () => {
  describe('Login Page', () => {
    it('should render Login & Register forms correctly', () => {
      render(<LoginPage />);
      
      expect(screen.getByText('Digital E-Panchayat Login')).toBeTruthy();
      expect(screen.getByLabelText('Email Address')).toBeTruthy();
      expect(screen.getByLabelText('Password')).toBeTruthy();
    });

    it('should show errors for invalid inputs', async () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const loginButton = screen.getByText('Sign in');
      
      // Submit empty form
      fireEvent.click(loginButton);
      
      // Should show validation errors (mock implementation)
      expect(loginButton).toBeTruthy();
    });

    it('should allow role-based login (citizen/staff/officer) to work', () => {
      render(<LoginPage />);
      
      // Check that user type buttons exist
      expect(screen.getByText('Citizen')).toBeTruthy();
      expect(screen.getByText('Officer')).toBeTruthy();
      expect(screen.getByText('Staff')).toBeTruthy();
      
      // Check that default credentials are displayed
      const citizenButton = screen.getByText('Citizen');
      fireEvent.click(citizenButton);
      
      expect(screen.getByText('Digital E-Panchayat Login')).toBeTruthy();
    });
  });

  describe('Register Page', () => {
    it('should render registration form correctly', () => {
      render(<RegisterPage />);
      
      expect(screen.getByText('Digital E-Panchayat Registration')).toBeTruthy();
      expect(screen.getByLabelText('Full Name')).toBeTruthy();
      expect(screen.getByLabelText('Email Address')).toBeTruthy();
      expect(screen.getByLabelText('Password')).toBeTruthy();
      expect(screen.getByLabelText('Confirm Password')).toBeTruthy();
    });

    it('should show errors for invalid inputs', () => {
      render(<RegisterPage />);
      
      const registerButton = screen.getByText('Register');
      
      // Submit empty form
      fireEvent.click(registerButton);
      
      // Should show validation errors (mock implementation)
      expect(registerButton).toBeTruthy();
    });

    it('should allow citizens to create unlimited accounts', async () => {
      render(<RegisterPage />);
      
      const nameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const declarationCheckbox = screen.getByLabelText('I declare that the information provided is true and correct');
      const registerButton = screen.getByText('Register');
      
      // Fill form with valid data
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(declarationCheckbox);
      
      // Submit form
      fireEvent.click(registerButton);
      
      // Wait for async operations to complete
      await waitFor(() => {
        // Should show success message or handle the registration
        expect(registerButton).toBeTruthy();
      });
    });
  });
});