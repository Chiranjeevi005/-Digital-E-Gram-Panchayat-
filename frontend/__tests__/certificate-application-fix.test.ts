import { apiClient } from '../src/services/api';

// Define the type for our response
interface CertificateResponse {
  id: string;
  type: string;
  applicantName: string;
  applicationDate: string;
  status: string;
}

// Mock the browser APIs that aren't available in Node.js
global.fetch = jest.fn() as jest.Mock;

describe('Certificate Application Fix', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should send correct field names to backend', async () => {
    // Mock the fetch implementation for API calls
    (global.fetch as jest.Mock).mockImplementation((url: string, options: any) => {
      // Check that the request body contains the correct field names
      if (url.includes('/api/certificates/apply') && options.method === 'POST') {
        const body = JSON.parse(options.body as string);
        
        // Verify that the field names match what the backend expects
        expect(body).toHaveProperty('type');
        expect(body).toHaveProperty('applicantName');
        expect(body.type).toBe('Birth');
        expect(body.applicantName).toBe('Test Applicant');
        
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 'test-cert-123',
            type: 'Birth',
            applicantName: 'Test Applicant',
            applicationDate: '2023-01-15',
            status: 'Pending'
          })
        });
      }
      
      // Default response for unhandled requests
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      });
    });

    // Test data that matches what the frontend form would send
    const applicationData = {
      userId: 'test-user-id', // Add userId for authentication
      type: 'Birth', // This is the correct field name that the backend expects
      applicantName: 'Test Applicant',
      fatherName: 'Test Father',
      motherName: 'Test Mother',
      date: '2023-01-15',
      place: 'District Hospital'
    };

    // Send the application data to the backend
    const response: CertificateResponse = await apiClient.post('/certificates/apply', applicationData) as CertificateResponse;
    
    // Verify the response
    expect(response).toHaveProperty('id');
    expect(response.type).toBe('Birth');
    expect(response.applicantName).toBe('Test Applicant');
    expect(response.status).toBe('Pending');
    
    // Verify that the fetch call was made with the correct URL and method
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/certificates/apply'),
      expect.objectContaining({
        method: 'POST'
      })
    );
  });
});