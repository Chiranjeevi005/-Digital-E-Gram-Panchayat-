import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import { downloadCertificate } from '../../../src/controllers/certificate.controller';
import { emitApplicationUpdate } from '../../../src/utils/socket';

// Mock the socket utility
jest.mock('../../../src/utils/socket', () => ({
  emitApplicationUpdate: jest.fn()
}));

// Mock the document generator
jest.mock('../../../src/utils/documentGenerator', () => ({
  generateCertificatePDF: jest.fn().mockImplementation(() => Promise.resolve('/tmp/certificate.pdf')),
  convertPDFToJPG: jest.fn().mockImplementation(() => Promise.resolve('/tmp/certificate.jpg'))
}));

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  unlinkSync: jest.fn()
}));

describe('Certificate Controller - Real-time Updates', () => {
  const mockRequest: any = {
    params: { id: '1' },
    query: { format: 'pdf' }
  };
  
  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    setHeader: jest.fn(),
    send: jest.fn(),
    sendFile: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('downloadCertificate', () => {
    it('should emit real-time update event when certificate is downloaded', async () => {
      await downloadCertificate(mockRequest, mockResponse);
      
      // Verify that emitApplicationUpdate was called
      expect(emitApplicationUpdate).toHaveBeenCalledWith(
        'user1', // userId from mock certificate
        '1', // certificate id
        'Certificates', 
        'Approved', 
        'Certificate downloaded in pdf format'
      );
    });

    it('should emit real-time update event when certificate is downloaded in JPG format', async () => {
      const jpgRequest: any = {
        params: { id: '1' },
        query: { format: 'jpg' }
      };
      
      await downloadCertificate(jpgRequest, mockResponse);
      
      // Verify that emitApplicationUpdate was called
      expect(emitApplicationUpdate).toHaveBeenCalledWith(
        'user1', // userId from mock certificate
        '1', // certificate id
        'Certificates', 
        'Approved', 
        'Certificate downloaded in jpg format'
      );
    });
  });
});