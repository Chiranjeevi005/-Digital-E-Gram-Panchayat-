# Testing the Contact Page

This document explains how to test the Contact page functionality.

## Manual Testing

### 1. Page Loading
- Navigate to `/contact` and verify the page loads correctly
- Check that all sections are visible:
  - Header with title and subtitle
  - Panchayat Office Info card
  - Quick Contact Form
  - Important Contacts grid
  - Location Map section
  - FAQ section
  - Chatbot placeholder

### 2. Responsive Design
- Test on different screen sizes:
  - Desktop (1200px+)
  - Tablet (768px)
  - Mobile (320px-480px)
- Verify that the grid layouts adjust properly
- Check that form elements are usable on mobile

### 3. Form Functionality
- Test form submission:
  - Fill in all fields
  - Click "Send Message"
  - Verify loading spinner appears
  - Confirm success message is displayed
  - Check that form fields are cleared after submission

### 4. Navigation
- Verify the "Contact" link appears in the navbar
- Test that clicking the link navigates to the contact page
- Check that all links in the Important Contacts section work

### 5. Animations
- Verify that the animated blobs in the header are visible
- Check that hover effects work on cards and buttons

## Automated Testing

To implement automated testing, you would need to:

1. Install testing dependencies:
   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   ```

2. Create a test file `contact.test.tsx`:
   ```tsx
   import { render, screen } from '@testing-library/react';
   import ContactPage from './page';
   
   describe('ContactPage', () => {
     it('renders the contact page title', () => {
       render(<ContactPage />);
       expect(screen.getByText('Contact Digital E-Panchayat')).toBeInTheDocument();
     });
     
     it('renders the contact form', () => {
       render(<ContactPage />);
       expect(screen.getByLabelText('Name')).toBeInTheDocument();
       expect(screen.getByLabelText('Email / Phone')).toBeInTheDocument();
       expect(screen.getByLabelText('Subject')).toBeInTheDocument();
       expect(screen.getByLabelText('Message')).toBeInTheDocument();
     });
   });
   ```

3. Configure Jest in `jest.config.js`:
   ```js
   module.exports = {
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
     moduleNameMapping: {
       '^@/(.*)$': '<rootDir>/src/$1',
     },
   };
   ```

4. Add test script to package.json:
   ```json
   {
     "scripts": {
       "test": "jest"
     }
   }
   ```

## Accessibility Testing

- Verify that all form fields have proper labels
- Check that links have descriptive text
- Ensure sufficient color contrast
- Test keyboard navigation
- Validate ARIA attributes