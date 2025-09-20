// API client for making requests to the backend
// Use NEXT_PUBLIC_API_BASE_URL from environment or fallback to localhost
const API_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api')
  : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api');

console.log('API Base URL (determined at runtime):', API_BASE_URL); // Debug log

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

export interface LandRecordData {
  _id: string;
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

// Additional interfaces for API responses
export interface CertificateApplication {
  id: string;
  userId: string;
  certificateType: string;
  status: string;
  appliedAt: string;
  documents: string[];
  remarks?: string;
}

// Unified tracking interface
export interface TrackingItem {
  id: string;
  type: 'certificate' | 'scheme' | 'grievance';
  title: string;
  status: string;
  date: string;
  referenceNumber: string;
  serviceType: 'Certificates' | 'Schemes' | 'Grievances';
}

export interface ApplicationStats {
  totals: {
    certificates: number;
    schemes: number;
    grievances: number;
    total: number;
  };
  statuses: {
    certificates: Record<string, number>;
    schemes: Record<string, number>;
    grievances: Record<string, number>;
  };
}

export interface RecentActivity {
  id: string;
  title: string;
  date: string;
  status: string;
  type: string;
  details: string;
}

export interface Certificate extends CertificateApplication {
  _id: string;
  id: string;
  applicantName: string;
  fatherName?: string;
  motherName?: string;
  certificateType: string;
  type?: string;
  date?: string;
  place?: string;
  address?: string;
  income?: string;
  caste?: string;
  subCaste?: string;
  ward?: string;
  village?: string;
  district?: string;
  supportingFiles: string[];
  createdAt: string;
  status: string;
  certificateNumber?: string;
  issuedDate?: string;
  // Marriage certificate fields
  brideName?: string;
  groomName?: string;
  witnessNames?: string;
  registrationNo?: string;
}

interface Scheme {
  _id: string;
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  createdAt: string;
}

export interface SchemeApplication {
  id: string;
  userId: string;
  schemeId: string;
  schemeName: string;
  status: string;
  appliedAt: string;
  documents: string[];
  remarks?: string;
  // Additional fields for application form
  applicantName?: string;
  fatherName?: string;
  address?: string;
  phone?: string;
  email?: string;
  aadhaar?: string;
  age?: string;
  gender?: string;
  income?: string;
  caste?: string;
  education?: string;
  landSize?: string;
  // Preview fields
  applicationId?: string;
  date?: string;
}

export interface Grievance {
  _id: string;
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  remarks?: string;
}

export interface GrievanceExtended extends Grievance {
  citizenId: string;
  title: string;
}

export interface CitizenRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  aadharNumber: string;
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
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
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

  // Certificate methods
  applyForCertificate: async (data: Partial<Certificate>): Promise<{success: boolean, applicationId: string, status: string, message: string}> => {
    return apiClient.post<{success: boolean, applicationId: string, status: string, message: string}>('/certificates/apply', data);
  },

  getAllCertificates: async (): Promise<Certificate[]> => {
    return apiClient.get<Certificate[]>('/certificates');
  },

  getCertificateById: async (id: string): Promise<Certificate> => {
    return apiClient.get<Certificate>(`/certificates/${id}/preview`);
  },

  getCertificateStatus: async (id: string): Promise<{status: string}> => {
    return apiClient.get<{status: string}>(`/certificates/${id}/status`);
  },

  updateCertificate: async (id: string, data: Partial<Certificate>): Promise<Certificate> => {
    return apiClient.put<Certificate>(`/certificates/${id}/update`, data);
  },

  downloadCertificate: async (id: string, format: 'pdf' | 'jpg' = 'pdf'): Promise<Blob> => {
    return apiClient.download(`/certificates/${id}/download?format=${format}`);
  },

  // Schemes & Subsidies methods
  getSchemes: async (): Promise<Scheme[]> => {
    return apiClient.get<Scheme[]>('/schemes');
  },

  getAllSchemes: async (): Promise<Scheme[]> => {
    return apiClient.get<Scheme[]>('/schemes');
  },

  applyForScheme: async (data: Partial<SchemeApplication>): Promise<SchemeApplication> => {
    return apiClient.post<SchemeApplication>('/schemes/apply', data);
  },

  getSchemeApplications: async (userId: string): Promise<SchemeApplication[]> => {
    return apiClient.get<SchemeApplication[]>(`/schemes/tracking/${userId}`);
  },

  deleteSchemeApplication: async (applicationId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/schemes/tracking/${applicationId}`);
  },

  downloadSchemeAcknowledgment: async (applicationId: string, format: 'pdf' | 'jpg' = 'pdf'): Promise<Blob> => {
    return apiClient.download(`/schemes/acknowledgment/${applicationId}?format=${format}`);
  },

  // Grievance Redressal methods
  getAllGrievances: async (): Promise<Grievance[]> => {
    return apiClient.get<Grievance[]>('/grievances');
  },

  getGrievances: async (userId: string): Promise<Grievance[]> => {
    return apiClient.get<Grievance[]>(`/grievances/user/${userId}`);
  },

  submitGrievance: async (data: Partial<Grievance>): Promise<Grievance> => {
    return apiClient.post<Grievance>('/grievances', data);
  },

  updateGrievance: async (grievanceId: string, data: Partial<Grievance>): Promise<Grievance> => {
    return apiClient.put<Grievance>(`/grievances/view/${grievanceId}`, data);
  },

  resolveGrievance: async (grievanceId: string, remarks: string): Promise<Grievance> => {
    return apiClient.post<Grievance>(`/grievances/resolve/${grievanceId}`, { remarks });
  },

  downloadGrievanceAcknowledgment: async (grievanceId: string, format: 'pdf' | 'jpg' = 'pdf'): Promise<Blob> => {
    return apiClient.download(`/grievances/acknowledgment/${grievanceId}?format=${format}`);
  },

  downloadGrievanceResolution: async (grievanceId: string, format: 'pdf' | 'jpg' = 'pdf'): Promise<Blob> => {
    return apiClient.download(`/grievances/resolution/${grievanceId}?format=${format}`);
  },

  deleteGrievance: async (grievanceId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/grievances/view/${grievanceId}`);
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

  getAllLandRecords: async (): Promise<LandRecordData[]> => {
    const response = await apiClient.get<{ landRecords: LandRecordData[] }>('/landrecords');
    return response.landRecords;
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
  },
  
  login: async (credentials: { email: string; password: string; userType: string }): Promise<LoginResponse> => {
    console.log('Attempting login with credentials:', {
      email: credentials.email,
      userType: credentials.userType,
      apiBaseUrl: API_BASE_URL
    });
    
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      console.log('Login response:', response);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: { name: string; email: string; password: string }): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/auth/register', userData);
  },
  
  // Staff-specific methods
  updateCertificateStatus: async (certificateId: string, status: string, remarks?: string): Promise<CertificateApplication> => {
    return apiClient.put<CertificateApplication>(`/certificates/${certificateId}/status`, { status, remarks });
  },
  
  updateGrievanceStatus: async (grievanceId: string, status: string, remarks?: string): Promise<Grievance> => {
    return apiClient.put<Grievance>(`/grievances/${grievanceId}/status`, { status, remarks });
  },
  
  getCitizenRecords: async (): Promise<CitizenRecord[]> => {
    return apiClient.get<CitizenRecord[]>('/auth/citizens');
  },
  
  getCitizenRecord: async (citizenId: string): Promise<CitizenRecord> => {
    return apiClient.get<CitizenRecord>(`/auth/citizens/${citizenId}`);
  },
  
  // Tracking methods
  getUserApplications: async (userId: string): Promise<TrackingItem[]> => {
    return apiClient.get<TrackingItem[]>(`/tracking/user/${userId}`);
  },
  
  getApplicationStats: async (userId: string): Promise<ApplicationStats> => {
    return apiClient.get<ApplicationStats>(`/tracking/stats/${userId}`);
  },
  
  getRecentActivity: async (userId: string): Promise<RecentActivity[]> => {
    return apiClient.get<RecentActivity[]>(`/tracking/activity/${userId}`);
  }
};