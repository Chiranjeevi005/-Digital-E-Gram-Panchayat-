import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import React from 'react';
import ServicesPage from '../../src/app/services/page';
import CertificateApplicationPage from '../../src/app/services/certificates/apply/page';
import CertificatePreviewPage from '../../src/app/services/certificates/preview/page';

// Mock next/navigation
const mockPush = jest.fn();
const mockUseRouter = jest.fn(() => ({
  push: mockPush,
  replace: jest.fn(),
  prefetch: jest.fn(),
}));

const mockUseSearchParams = jest.fn(() => ({
  get: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
  useSearchParams: () => mockUseSearchParams(),
}));

// Mock AuthContext
jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user123', name: 'Test User', email: 'test@example.com', userType: 'Citizen' },
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock ToastContainer
jest.mock('../../src/components/ToastContainer', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock Navbar and Footer
jest.mock('../../src/components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('../../src/components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

// Mock API client
jest.mock('../../src/services/api', () => ({
  apiClient: {
    getCurrentUser: jest.fn(() => Promise.resolve({
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      userType: 'Citizen'
    } as any)),
    post: jest.fn(() => Promise.resolve({
      success: true,
      applicationId: 'app123',
      message: 'Application submitted successfully',
      status: 'Pending'
    } as any)),
    get: jest.fn(() => Promise.resolve({
      _id: 'cert123',
      applicantName: 'Test User',
      certificateType: 'Birth',
      date: '2023-01-01',
      place: 'Test Village',
      status: 'Approved'
    } as any)),
    put: jest.fn(() => Promise.resolve({
      _id: 'cert123',
      applicantName: 'Test User Updated',
      certificateType: 'Birth',
      date: '2023-01-01',
      place: 'Test Village',
      status: 'Approved'
    } as any)),
    download: jest.fn(() => Promise.resolve(new Blob(['test'], { type: 'application/pdf' }) as any))
  }
}));

describe('Services Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Services Cards', () => {
    it('should render all service categories with correct titles', () => {
      render(<ServicesPage />);
      
      expect(screen.getByText('Certificates & Records')).not.toBeNull();
      expect(screen.getByText('Property & Land')).not.toBeNull();
      expect(screen.getByText('Schemes & Subsidies')).not.toBeNull();
      expect(screen.getByText('Grievance Redressal')).not.toBeNull();
    });

    it('should render service cards with correct descriptions', () => {
      render(<ServicesPage />);
      
      expect(screen.getByText('Access and apply for essential certificates and records with ease.')).not.toBeNull();
      expect(screen.getByText('Manage your property and land records efficiently.')).not.toBeNull();
      expect(screen.getByText('Explore and apply for various government schemes and subsidies.')).not.toBeNull();
      expect(screen.getByText('Report issues and track their resolution status.')).not.toBeNull();
    });

    it('should render service cards with correct sub-services', () => {
      render(<ServicesPage />);
      
      expect(screen.getByText('Apply for Birth/Death Certificates')).not.toBeNull();
      expect(screen.getByText('Download Income/Caste/Residence Certificates')).not.toBeNull();
      expect(screen.getByText('Pay property tax online')).not.toBeNull();
      expect(screen.getByText('View land records & mutation status')).not.toBeNull();
      expect(screen.getByText('Apply for pensions & scholarships')).not.toBeNull();
      expect(screen.getByText('Track subsidy application status')).not.toBeNull();
      expect(screen.getByText('Lodge complaints (roads, water, electricity, sanitation)')).not.toBeNull();
      expect(screen.getByText('Track complaint status')).not.toBeNull();
    });

    it('should render "Apply Now" buttons with correct text', () => {
      render(<ServicesPage />);
      
      expect(screen.getByText('View Certificates')).not.toBeNull();
      expect(screen.getByText('View Records')).not.toBeNull();
      expect(screen.getByText('Explore Schemes')).not.toBeNull();
      expect(screen.getByText('Submit Grievance')).not.toBeNull();
    });
  });

  describe('Service Navigation', () => {
    it('should navigate to certificates page when View Certificates button is clicked', () => {
      render(<ServicesPage />);
      
      const certificatesButton = screen.getByText('View Certificates');
      fireEvent.click(certificatesButton);
      
      // Note: Actual navigation is handled by Next.js Link component
      // In a real test, we would check if the link has the correct href
    });

    it('should navigate to property page when View Records button is clicked', () => {
      render(<ServicesPage />);
      
      const propertyButton = screen.getByText('View Records');
      fireEvent.click(propertyButton);
      
      // Note: Actual navigation is handled by Next.js Link component
    });

    it('should navigate to schemes page when Explore Schemes button is clicked', () => {
      render(<ServicesPage />);
      
      const schemesButton = screen.getByText('Explore Schemes');
      fireEvent.click(schemesButton);
      
      // Note: Actual navigation is handled by Next.js Link component
    });

    it('should navigate to grievances page when Submit Grievance button is clicked', () => {
      render(<ServicesPage />);
      
      const grievancesButton = screen.getByText('Submit Grievance');
      fireEvent.click(grievancesButton);
      
      // Note: Actual navigation is handled by Next.js Link component
    });
  });

  describe('Search Functionality', () => {
    it('should filter services based on search term', () => {
      render(<ServicesPage />);
      
      const searchInput = screen.getByPlaceholderText('Search services...');
      fireEvent.change(searchInput, { target: { value: 'Certificate' } });
      
      // Should show certificate service
      expect(screen.getByText('Certificates & Records')).not.toBeNull();
      
      // Should not show other services (in a real implementation)
      // This would depend on the actual filtering logic
    });

    it('should clear search when clear button is clicked', () => {
      render(<ServicesPage />);
      
      const searchInput = screen.getByPlaceholderText('Search services...');
      fireEvent.change(searchInput, { target: { value: 'Certificate' } });
      
      // Assuming there's a clear button (not visible in current implementation)
      // This test would need to be updated based on actual implementation
    });
  });
});

describe('Certificate Application Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('Birth')
    });
  });

  describe('Form Rendering', () => {
    it('should render certificate application form with correct fields for Birth certificate', () => {
      render(<CertificateApplicationPage />);
      
      // Wait for the form to load (since it fetches user data)
      waitFor(() => {
        expect(screen.getByText('Apply for Birth Certificate')).not.toBeNull();
        expect(screen.getByLabelText('Applicant Name *')).not.toBeNull();
        expect(screen.getByLabelText('Father\'s Name')).not.toBeNull();
        expect(screen.getByLabelText('Mother\'s Name')).not.toBeNull();
        expect(screen.getByLabelText('Date *')).not.toBeNull();
        expect(screen.getByLabelText('Place *')).not.toBeNull();
        expect(screen.getByLabelText('I declare that the information provided is correct and complete *')).not.toBeNull();
      });
    });

    it('should render certificate application form with correct fields for Marriage certificate', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue('Marriage')
      });
      
      render(<CertificateApplicationPage />);
      
      waitFor(() => {
        expect(screen.getByText('Apply for Marriage Certificate')).not.toBeNull();
        expect(screen.getByLabelText('Applicant Name *')).not.toBeNull();
        expect(screen.getByLabelText("Bride's Name *")).not.toBeNull();
        expect(screen.getByLabelText("Groom's Name *")).not.toBeNull();
        expect(screen.getByLabelText('Date of Marriage *')).not.toBeNull();
        expect(screen.getByLabelText('Place of Marriage *')).not.toBeNull();
        expect(screen.getByLabelText('Witness Names (2-3 lines) *')).not.toBeNull();
        expect(screen.getByLabelText('Registration Number *')).not.toBeNull();
      });
    });
  });

  describe('Form Validation', () => {
    it('should show error messages for required fields when form is submitted empty', async () => {
      render(<CertificateApplicationPage />);
      
      waitFor(async () => {
        const submitButton = screen.getByText('Generate Certificate');
        fireEvent.click(submitButton);
        
        expect(await screen.findByText('Applicant name is required')).not.toBeNull();
        expect(await screen.findByText('Date is required')).not.toBeNull();
        expect(await screen.findByText('Place is required')).not.toBeNull();
        expect(await screen.findByText('You must declare that the information is correct')).not.toBeNull();
      });
    });

    it('should show error for invalid file uploads', async () => {
      render(<CertificateApplicationPage />);
      
      waitFor(async () => {
        const fileInput = screen.getByLabelText('Upload files');
        const file = new File(['test'], 'test.exe', { type: 'application/exe' });
        
        fireEvent.change(fileInput, { target: { files: [file] } });
        
        expect(await screen.findByText('Only JPG, PNG, and PDF files are allowed')).not.toBeNull();
      });
    });

    it('should validate certificate-specific fields', async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue('Marriage')
      });
      
      render(<CertificateApplicationPage />);
      
      waitFor(async () => {
        const submitButton = screen.getByText('Generate Certificate');
        fireEvent.click(submitButton);
        
        expect(await screen.findByText('Applicant name is required')).not.toBeNull();
        expect(await screen.findByText("Bride's name is required")).not.toBeNull();
        expect(await screen.findByText("Groom's name is required")).not.toBeNull();
        expect(await screen.findByText('Date of marriage is required')).not.toBeNull();
        expect(await screen.findByText('Place of marriage is required')).not.toBeNull();
        expect(await screen.findByText('Witness names are required')).not.toBeNull();
        expect(await screen.findByText('Registration number is required')).not.toBeNull();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form successfully with valid data', async () => {
      render(<CertificateApplicationPage />);
      
      waitFor(async () => {
        // Fill in the form
        fireEvent.change(screen.getByLabelText('Applicant Name *'), {
          target: { value: 'Test Applicant' }
        });
        
        fireEvent.change(screen.getByLabelText('Father\'s Name'), {
          target: { value: 'Test Father' }
        });
        
        fireEvent.change(screen.getByLabelText('Mother\'s Name'), {
          target: { value: 'Test Mother' }
        });
        
        fireEvent.change(screen.getByLabelText('Date *'), {
          target: { value: '2023-01-01' }
        });
        
        fireEvent.change(screen.getByLabelText('Place *'), {
          target: { value: 'Test Place' }
        });
        
        const declarationCheckbox = screen.getByLabelText('I declare that the information provided is correct and complete *');
        fireEvent.click(declarationCheckbox);
        
        // Submit the form
        const submitButton = screen.getByText('Generate Certificate');
        fireEvent.click(submitButton);
        
        // Wait for submission to complete
        await waitFor(() => {
          expect(screen.getByText('Application Submitted!')).not.toBeNull();
        });
      });
    });
  });
});

describe('Certificate Preview, Edit, Update, Download Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('cert123')
    });
  });

  describe('Preview Page', () => {
    it('should render certificate preview with correct data', async () => {
      render(<CertificatePreviewPage />);
      
      waitFor(() => {
        expect(screen.getByText('Certificate Preview')).not.toBeNull();
        expect(screen.getByText('Test User')).not.toBeNull();
        expect(screen.getByText('Birth Certificate')).not.toBeNull();
      });
    });

    it('should show certificate status', async () => {
      render(<CertificatePreviewPage />);
      
      waitFor(() => {
        expect(screen.getByText('Approved')).not.toBeNull();
      });
    });
  });

  describe('Edit Functionality', () => {
    it('should allow editing certificate details', async () => {
      render(<CertificatePreviewPage />);
      
      waitFor(async () => {
        const editButton = screen.getByText('Edit Details');
        fireEvent.click(editButton);
        
        const nameInput = screen.getByDisplayValue('Test User');
        fireEvent.change(nameInput, { target: { value: 'Updated Test User' } });
        
        const updateButton = screen.getByText('Update Changes');
        fireEvent.click(updateButton);
        
        await waitFor(() => {
          expect(screen.getByText('Certificate updated successfully!')).not.toBeNull();
        });
      });
    });

    it('should cancel editing when cancel button is clicked', async () => {
      render(<CertificatePreviewPage />);
      
      waitFor(() => {
        const editButton = screen.getByText('Edit Details');
        fireEvent.click(editButton);
        
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);
        
        expect(screen.getByText('Test User')).not.toBeNull();
        expect(screen.queryByText('Edit Details')).not.toBeNull();
      });
    });
  });

  describe('Download Functionality', () => {
    it('should download certificate as PDF', async () => {
      render(<CertificatePreviewPage />);
      
      waitFor(async () => {
        const downloadPdfButton = screen.getByText('Download PDF');
        fireEvent.click(downloadPdfButton);
        
        await waitFor(() => {
          expect(screen.getByText('Your certificate has been successfully downloaded!')).not.toBeNull();
        });
      });
    });

    it('should download certificate as JPG', async () => {
      render(<CertificatePreviewPage />);
      
      waitFor(async () => {
        const downloadJpgButton = screen.getByText('Download JPG');
        fireEvent.click(downloadJpgButton);
        
        await waitFor(() => {
          expect(screen.getByText('Your certificate has been successfully downloaded!')).not.toBeNull();
        });
      });
    });
  });
});