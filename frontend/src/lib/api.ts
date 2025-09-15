// API client for making requests to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

// Get token from localStorage or sessionStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  return null;
};

// Define a generic type for API responses
type ApiResponse<T = unknown> = Promise<T>;

export const apiClient = {
  // Generic GET request
  get: async <T = unknown>(endpoint: string): ApiResponse<T> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    return response.json();
  },

  // Generic POST request
  post: async <T = unknown>(endpoint: string, data: Record<string, unknown>): ApiResponse<T> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Generic PUT request
  put: async <T = unknown>(endpoint: string, data: Record<string, unknown>): ApiResponse<T> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Generic DELETE request
  delete: async <T = unknown>(endpoint: string): ApiResponse<T> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    return response.json();
  },

  // File download request
  download: async (endpoint: string): Promise<Blob> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    return response.blob();
  },

  // Login method
  login: async (email: string, password: string, userType: string) => {
    return apiClient.post('/auth/login', { email, password, userType });
  },

  // Register method
  register: async (name: string, email: string, password: string) => {
    return apiClient.post('/auth/register', { name, email, password });
  },

  // Get current user
  getCurrentUser: async () => {
    return apiClient.get('/auth/user/me');
  }
};