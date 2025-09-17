// API client for making requests to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

// Get token from localStorage or sessionStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  return null;
};

// Define types for API responses
interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  token: string;
  user: User;
}

// Property & Land Services interfaces
interface PropertyTaxData {
  propertyId: string;
  ownerName: string;
  village: string;
  taxDue: number;
  status: string;
  createdAt: string;
}

interface LandRecordData {
  surveyNo: string;
  owner: string;
  area: string;
  landType: string;
  encumbranceStatus: string;
  createdAt: string;
}

interface MutationStatusData {
  applicationId: string;
  propertyId: string;
  statusTimeline: {
    step: string;
    status: string;
    date: string;
  }[];
  createdAt: string;
}

// Define a generic type for API responses
type ApiResponse<T = unknown> = Promise<T>;

// Helper function to handle fetch errors
const handleFetchError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If we can't parse JSON, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return response;
};

export const apiClient = {
  // Generic GET request
  get: async <T = unknown>(endpoint: string): ApiResponse<T> => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        // Add timeout and credentials for better error handling
        credentials: 'include',
      });
      
      await handleFetchError(response);
      return response.json();
    } catch (error) {
      console.error('API GET request failed:', error);
      // Provide more specific error messages
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to the server. Please check if the server is running.');
      }
      throw error;
    }
  },

  // Generic POST request
  post: async <T = unknown>(endpoint: string, data: Record<string, unknown>): ApiResponse<T> => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
        // Add timeout and credentials for better error handling
        credentials: 'include',
      });
      
      await handleFetchError(response);
      return response.json();
    } catch (error) {
      console.error('API POST request failed:', error);
      // Provide more specific error messages
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to the server. Please check if the server is running.');
      }
      throw error;
    }
  },

  // Generic PUT request
  put: async <T = unknown>(endpoint: string, data: Record<string, unknown>): ApiResponse<T> => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
        // Add timeout and credentials for better error handling
        credentials: 'include',
      });
      
      await handleFetchError(response);
      return response.json();
    } catch (error) {
      console.error('API PUT request failed:', error);
      // Provide more specific error messages
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to the server. Please check if the server is running.');
      }
      throw error;
    }
  },

  // Generic DELETE request
  delete: async <T>(endpoint: string): Promise<T> => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
      });
      
      await handleFetchError(response);
      return response.json();
    } catch (error) {
      console.error('API delete request failed:', error);
      throw error;
    }
  },

  // File download request
  download: async (endpoint: string): Promise<Blob> => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        // Add timeout and credentials for better error handling
        credentials: 'include',
      });
      
      await handleFetchError(response);
      return response.blob();
    } catch (error) {
      console.error('API download request failed:', error);
      // Provide more specific error messages
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to the server. Please check if the server is running.');
      }
      throw error;
    }
  },

  // Schemes & Subsidies methods
  getSchemes: async (): Promise<any[]> => {
    return apiClient.get<any[]>('/schemes');
  },

  applyForScheme: async (data: any): Promise<any> => {
    return apiClient.post<any>('/schemes/apply', data);
  },

  getSchemeApplications: async (userId: string): Promise<any[]> => {
    return apiClient.get<any[]>(`/schemes/tracking/${userId}`);
  },

  deleteSchemeApplication: async (applicationId: string): Promise<any> => {
    return apiClient.delete<any>(`/schemes/tracking/${applicationId}`);
  },

  downloadSchemeAcknowledgment: async (applicationId: string, format: 'pdf' | 'jpg' = 'pdf'): Promise<Blob> => {
    return apiClient.download(`/schemes/acknowledgment/${applicationId}?format=${format}`);
  },

  // Grievance Redressal methods
  getGrievances: async (userId: string): Promise<any[]> => {
    return apiClient.get<any[]>(`/grievances/user/${userId}`);
  },

  submitGrievance: async (data: any): Promise<any> => {
    return apiClient.post<any>('/grievances', data);
  },

  downloadGrievanceAcknowledgment: async (grievanceId: string, format: 'pdf' | 'jpg' = 'pdf'): Promise<Blob> => {
    return apiClient.download(`/grievances/acknowledgment/${grievanceId}?format=${format}`);
  },

  downloadGrievanceResolution: async (grievanceId: string, format: 'pdf' | 'jpg' = 'pdf'): Promise<Blob> => {
    return apiClient.download(`/grievances/resolution/${grievanceId}?format=${format}`);
  },

  deleteGrievance: async (grievanceId: string): Promise<any> => {
    return apiClient.delete<any>(`/grievances/view/${grievanceId}`);
  },

  // Property Tax methods
  getPropertyTax: async (propertyId: string, ownerName: string, village: string): Promise<PropertyTaxData> => {
    return apiClient.post<PropertyTaxData>('/property-tax', { propertyId, ownerName, village });
  },

  downloadPropertyTaxReceipt: async (propertyId: string, format: 'pdf' | 'jpg' = 'pdf'): Promise<Blob> => {
    return apiClient.download(`/property-tax/${propertyId}/download?format=${format}`);
  },

  // Updated land record methods to use the new on-demand endpoints
  createLandRecord: async (data: { owner: string; surveyNo: string; area: string; landType: string; encumbranceStatus: string }): Promise<{ landRecordId: string }> => {
    return apiClient.post<{ landRecordId: string }>('/landrecords', data);
  },

  getLandRecord: async (id: string): Promise<{ landRecord: LandRecordData }> => {
    return apiClient.get<{ landRecord: LandRecordData }>(`/landrecords/${id}`);
  },

  downloadLandRecord: async (id: string, format: 'pdf' | 'jpg' = 'pdf'): Promise<Blob> => {
    const endpoint = format === 'pdf' ? `/landrecords/${id}/certificate/pdf` : `/landrecords/${id}/certificate/jpg`;
    return apiClient.download(endpoint);
  },

  getMutationStatus: async (applicationId: string): Promise<MutationStatusData> => {
    return apiClient.post<MutationStatusData>('/mutation-status', { applicationId });
  },

  downloadMutationAcknowledgement: async (applicationId: string, format: 'pdf' | 'jpg' = 'pdf'): Promise<Blob> => {
    return apiClient.download(`/mutation-status/${applicationId}/download?format=${format}`);
  },

  // User authentication methods
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/auth/user/me');
  }
};