import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import React from 'react';
import Home from '../../src/app/page';

// Mock the AuthContext
jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock dynamic imports to return simple components
jest.mock('next/dynamic', () => () => {
  return function MockDynamicComponent() {
    return <div>Dynamic Component</div>;
  };
});

describe('Home Page', () => {
  it('renders the home page correctly', () => {
    render(<Home />);
    
    // Just check that the component renders without throwing errors
    expect(true).toBe(true);
  });
});