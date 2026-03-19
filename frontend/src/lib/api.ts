// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - automatically add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get a 401, the token is invalid or expired
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      
      // Redirect to login (only if not already on login page)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;