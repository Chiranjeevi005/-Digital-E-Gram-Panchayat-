import { createGrievance, updateGrievance, resolveGrievance, deleteGrievance } from '../../../src/controllers/grievance.controller';
import Grievance from '../../../src/models/Grievance';
import { emitApplicationUpdate } from '../../../src/utils/socket';

// Mock the Grievance model
jest.mock('../../../src/models/Grievance');

// Mock the socket utility
jest.mock('../../../src/utils/socket', () => ({
  emitApplicationUpdate: jest.fn()
}));

// Mock the PDF generation utilities
jest.mock('../../../src/utils/documentGenerator', () => ({
  generateGrievanceAcknowledgmentPDF: jest.fn(),
  convertPDFToJPG: jest.fn(),
  generateGrievanceResolutionPDF: jest.fn()
}));

describe('Grievance Controller - Real-time Updates', () => {
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      setHeader: jest.fn(),
      sendFile: jest.fn()
    };
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createGrievance', () => {
    it('should emit real-time update when grievance is created', async () => {
      const mockGrievance = {
        _id: '123',
        citizenId: 'user123',
        title: 'Test Grievance',
        status: 'open',
        save: jest.fn().mockResolvedValue(true)
      };
      
      (Grievance.prototype as any) = mockGrievance;
      (Grievance as any).mockImplementation(() => mockGrievance);
      
      mockRequest.body = {
        citizenId: 'user123',
        title: 'Test Grievance',
        description: 'Test Description',
        category: 'Test Category'
      };
      
      await createGrievance(mockRequest, mockResponse);
      
      expect(emitApplicationUpdate).toHaveBeenCalledWith(
        'user123',
        '123',
        'Grievances',
        'open',
        'Grievance "Test Grievance" filed successfully'
      );
    });
  });

  describe('updateGrievance', () => {
    it('should emit real-time update when grievance is updated', async () => {
      const mockGrievance = {
        _id: '123',
        citizenId: 'user123',
        title: 'Test Grievance',
        status: 'in-progress'
      };
      
      (Grievance.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockGrievance);
      
      mockRequest.params = { id: '123' };
      mockRequest.body = { status: 'in-progress' };
      
      await updateGrievance(mockRequest, mockResponse);
      
      expect(emitApplicationUpdate).toHaveBeenCalledWith(
        'user123',
        '123',
        'Grievances',
        'in-progress',
        'Grievance status updated to in-progress'
      );
    });
  });

  describe('resolveGrievance', () => {
    it('should emit real-time update when grievance is resolved', async () => {
      const mockGrievance = {
        _id: '123',
        citizenId: 'user123',
        title: 'Test Grievance',
        status: 'resolved'
      };
      
      (Grievance.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockGrievance);
      
      mockRequest.params = { id: '123' };
      mockRequest.body = { remarks: 'Test remarks' };
      
      await resolveGrievance(mockRequest, mockResponse);
      
      expect(emitApplicationUpdate).toHaveBeenCalledWith(
        'user123',
        '123',
        'Grievances',
        'Resolved',
        'Grievance "Test Grievance" resolved'
      );
    });
  });

  describe('deleteGrievance', () => {
    it('should emit real-time update when grievance is deleted', async () => {
      const mockGrievance = {
        _id: '123',
        citizenId: 'user123',
        title: 'Test Grievance'
      };
      
      (Grievance.findByIdAndDelete as jest.Mock).mockResolvedValue(mockGrievance);
      
      mockRequest.params = { grievanceId: '123' };
      
      await deleteGrievance(mockRequest, mockResponse);
      
      expect(emitApplicationUpdate).toHaveBeenCalledWith(
        'user123',
        '123',
        'Grievances',
        'Deleted',
        'Grievance "Test Grievance" deleted'
      );
    });
  });
});