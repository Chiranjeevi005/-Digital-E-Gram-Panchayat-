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
  delete: async <T = unknown>(endpoint: string): ApiResponse<T> => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        // Add timeout and credentials for better error handling
        credentials: 'include',
      });
      
      await handleFetchError(response);
      return response.json();
    } catch (error) {
      console.error('API DELETE request failed:', error);
      // Provide more specific error messages
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to the server. Please check if the server is running.');
      }
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

  // Login method
  login: async (email: string, password: string, userType: string): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', { email, password, userType });
  },

  // Register method
  register: async (name: string, email: string, password: string): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/auth/register', { name, email, password });
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/auth/user/me');
  }
};