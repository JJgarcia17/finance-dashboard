import axios from 'axios';
import { getCommonHeaders } from './headers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with common configuration
const http = axios.create({
  baseURL: API_URL,
  timeout: 180000, // 3 minutes timeout for chat responses (Ollama can be slow)
});

// Request interceptor to add headers
http.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      ...getCommonHeaders(),
    } as any;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// HTTP methods
export const httpGet = async (url: string, params?: any) => {
  const response = await http.get(url, { params });
  return response.data;
};

export const httpPost = async (url: string, data?: any) => {
  const response = await http.post(url, data);
  return response.data;
};

export const httpPut = async (url: string, data?: any) => {
  const response = await http.put(url, data);
  return response.data;
};

export const httpDelete = async (url: string) => {
  const response = await http.delete(url);
  return response.data;
};

export default http;
