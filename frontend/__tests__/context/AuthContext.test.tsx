import { render, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import React from 'react';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

// Mock the apiClient
jest.mock('../../src/lib/api', () => ({
  apiClient: {
    post: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

// Test component to use the auth context
const TestComponent = () => {
  const { user, loading, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      <button data-testid="login-button" onClick={() => login('test@example.com', 'password', 'Citizen')}>
        Login
      </button>
      <button data-testid="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  it('provides initial state correctly', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(getByTestId('loading')).toBeTruthy();
    expect(getByTestId('isAuthenticated')).toBeTruthy();
  });

  it('handles login correctly', async () => {
    const mockLoginResponse = {
      token: 'test-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        userType: 'Citizen'
      }
    };
    
    const { apiClient } = require('../../src/lib/api');
    apiClient.post.mockResolvedValue(mockLoginResponse);
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Click login button
    await act(async () => {
      getByTestId('login-button').click();
    });
    
    // Check that token was stored
    expect(localStorage.getItem('token')).toBe('test-token');
  });
});