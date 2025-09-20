import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  back: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock Next.js image component
jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: any) => {
      // eslint-disable-next-line jsx-a11y/alt-text
      const { alt, ...rest } = props;
      return React.createElement('img', { alt, ...rest });
    },
  };
});

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';