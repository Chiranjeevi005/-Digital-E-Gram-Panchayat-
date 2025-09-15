// API client for making requests to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

// Define a generic type for API responses
type ApiResponse<T = unknown> = Promise<T>;

export const apiClient = {
  // Generic GET request
  get: async <T = unknown>(endpoint: string): ApiResponse<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Generic POST request
  post: async <T = unknown>(endpoint: string, data: Record<string, unknown>): ApiResponse<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Generic PUT request
  put: async <T = unknown>(endpoint: string, data: Record<string, unknown>): ApiResponse<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Generic DELETE request
  delete: async <T = unknown>(endpoint: string): ApiResponse<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // File download request
  download: async (endpoint: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.blob();
  },
};