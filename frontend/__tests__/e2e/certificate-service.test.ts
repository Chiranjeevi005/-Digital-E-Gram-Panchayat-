import { apiClient } from '../../src/lib/api';

// Define types for our test
interface CertificateApplication {
  id: string;
  applicantName: string;
  certificateType: string;
  status: string;
  createdAt: string;
}

interface CertificatePreview {
  _id: string;
  applicantName: string;
  fatherName?: string;
  motherName?: string;
  certificateType: string;
  date: string;
  place: string;
  status: string;
}

// Mock the browser APIs that aren't available in Node.js
const mockBlob = jest.fn(() => Promise.resolve('mock blob content'));
global.fetch = jest.fn();
global.Blob = jest.fn(() => ({ type: 'application/pdf' })) as any;

describe('Certificate Service End-to-End Flow', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should complete the full certificate application and download flow', async () => {
    // Mock the fetch implementation for API calls
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      // Mock certificate application submission
      if (url.includes('/api/certificates/apply') && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 'test-cert-123',
            applicantName: 'John Doe',
            certificateType: 'Birth',
            status: 'Submitted',
            createdAt: new Date().toISOString()
          }),
          blob: mockBlob
        });
      }
      
      // Mock certificate preview data
      if (url.includes('/api/certificates/test-cert-123/preview') && options.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            _id: 'test-cert-123',
            applicantName: 'John Doe',
            fatherName: 'Richard Doe',
            motherName: 'Jane Doe',
            certificateType: 'Birth',
            date: '2023-01-15',
            place: 'District Hospital',
            status: 'Approved'
          }),
          blob: mockBlob
        });
      }
      
      // Mock certificate download
      if (url.includes('/api/certificates/test-cert-123/download') && options.method === 'GET') {
        // Return a mock blob for the download
        return Promise.resolve({
          ok: true,
          blob: mockBlob,
          json: () => Promise.resolve({})
        });
      }
      
      // Default response for unhandled requests
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        blob: mockBlob
      });
    });

    // Step 1: Submit certificate application
    const applicationData = {
      applicantName: 'John Doe',
      fatherName: 'Richard Doe',
      motherName: 'Jane Doe',
      certificateType: 'Birth',
      date: '2023-01-15',
      place: 'District Hospital'
    };

    const applicationResponse: CertificateApplication = await apiClient.post('/certificates/apply', applicationData) as CertificateApplication;
    
    // Verify application was submitted successfully
    expect(applicationResponse).toHaveProperty('id');
    expect(applicationResponse.applicantName).toBe('John Doe');
    expect(applicationResponse.certificateType).toBe('Birth');
    expect(applicationResponse.status).toBe('Submitted');
    
    const applicationId = applicationResponse.id;
    
    // Step 2: Get certificate preview data
    const previewData: CertificatePreview = await apiClient.get(`/certificates/${applicationId}/preview`) as CertificatePreview;
    
    // Verify preview data is correct
    expect(previewData._id).toBe(applicationId);
    expect(previewData.applicantName).toBe('John Doe');
    expect(previewData.certificateType).toBe('Birth');
    expect(previewData.status).toBe('Approved');
    
    // Step 3: Download certificate as PDF
    const pdfBlob = await apiClient.download(`/certificates/${applicationId}/download?format=pdf`);
    
    // Verify PDF download
    expect(pdfBlob).toBeDefined();
    
    // Step 4: Download certificate as JPG
    const jpgBlob = await apiClient.download(`/certificates/${applicationId}/download?format=jpg`);
    
    // Verify JPG download
    expect(jpgBlob).toBeDefined();
    
    // Verify all API calls were made
    expect(global.fetch).toHaveBeenCalledTimes(4);
    
    // Check that we made the expected calls
    const calls = (global.fetch as jest.Mock).mock.calls;
    expect(calls[0][0]).toEqual(expect.stringContaining('/api/certificates/apply'));
    expect(calls[1][0]).toEqual(expect.stringContaining(`/api/certificates/${applicationId}/preview`));
    expect(calls[2][0]).toEqual(expect.stringContaining(`/api/certificates/${applicationId}/download?format=pdf`));
    expect(calls[3][0]).toEqual(expect.stringContaining(`/api/certificates/${applicationId}/download?format=jpg`));
  });

  it('should handle certificate application errors gracefully', async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          message: 'Invalid application data'
        })
      });
    });

    // Try to submit an invalid certificate application
    const invalidApplicationData = {
      // Missing required fields
      certificateType: 'Birth'
    };

    await expect(apiClient.post('/certificates/apply', invalidApplicationData))
      .rejects
      .toThrow('Invalid application data');
  });
});