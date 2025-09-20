import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import React from 'react';
import Button from '../../src/components/Button';

describe('Button Component', () => {
  it('renders correctly with children', () => {
    render(<Button>Click Me</Button>);
    
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('shows loading state when isLoading is true', () => {
    render(<Button isLoading>Submit</Button>);
    
    // Check if the loading text is present
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});