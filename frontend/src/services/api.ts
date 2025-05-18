import axios from 'axios';

const cache = new Map();
const cacheTTL = 5 * 60 * 1000; 

const getFromCache = (url: string) => {
  const cachedData = cache.get(url);
  if (!cachedData) return null;
  
  if (Date.now() - cachedData.timestamp > cacheTTL) {
    cache.delete(url);
    return null;
  }
  
  return cachedData.data;
};

interface CacheData {
  data: unknown;
  timestamp: number;
}

const setInCache = (url: string, data: unknown) => {
  cache.set(url, {
    data,
    timestamp: Date.now()
  } as CacheData);
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

console.log('API Service - Initializing with URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 60000, 
  validateStatus: (status) => {
    return status < 500;
  }
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`API Service - Adding token to request: ${config.method?.toUpperCase()} ${config.url}`);
      } else {
        console.log(`API Service - No token available for request: ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      config.headers['Cache-Control'] = config.method?.toLowerCase() === 'get' 
        ? 'public, max-age=300' 
        : 'no-cache, no-store';
      
      if (config.method?.toLowerCase() === 'get' && config.url) {
        const fullUrl = config.baseURL + config.url;
        const cachedData = getFromCache(fullUrl);
        
        if (cachedData) {
          console.log(`API Service - Using cached data for: ${config.method.toUpperCase()} ${config.url}`);
          config.adapter = () => {
            return Promise.resolve({
              data: cachedData,
              status: 200,
              statusText: 'OK',
              headers: config.headers,
              config: config,
              request: { fromCache: true }
            });
          };
        }
      }
    }
    return config;
  },
  (error) => {
    console.error('API Service - Request error interceptor:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Service - Response success: ${response.config.method?.toUpperCase()} ${response.config.url}`, 
      { status: response.status, data: response.data });
      
    if (response.config.method?.toLowerCase() === 'get' && !response.request.fromCache) {
      const baseURL = response.config.baseURL || '';
      const fullUrl = baseURL + response.config.url;
      setInCache(fullUrl, response.data);
      console.log(`API Service - Cached response for: ${response.config.method.toUpperCase()} ${response.config.url}`);
    }
    
    if (response.config.url?.includes('/users/me') && typeof window !== 'undefined') {
      localStorage.setItem('user-data-cache', JSON.stringify({
        data: response.data,
        timestamp: Date.now()
      }));
    }
    
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Service - Response error:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('API Service - Network error: No response received', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        error: error.message
      });
      
      if (error.config?.url?.includes('/users/me') && typeof window !== 'undefined') {
        const cachedData = localStorage.getItem('user-data-cache');
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            const cacheAge = Date.now() - parsedData.timestamp;
            
            if (cacheAge < 60 * 60 * 1000) {
              console.log('API Service - Returning cached user data due to network error');
              error.cachedData = parsedData.data;
            }
          } catch (e) {
            console.error('API Service - Error parsing cached data:', e);
          }
        }
      }
    } else {
      console.error('API Service - Request setup error:', error.message);
    }

    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        console.log('API Service - Unauthorized access (401), redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

import type { AxiosInstance } from 'axios';

interface CustomAxiosInstance extends AxiosInstance {
  clearCache: (url: string) => void;
  clearAllCache: () => void;
}

const customApi = api as CustomAxiosInstance;

customApi.clearCache = (url: string) => {
  if (url) {
    cache.delete(url);
    console.log(`API Service - Cache cleared for ${url}`);
  }
};

customApi.clearAllCache = () => {
  cache.clear();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user-data-cache');
    console.log('API Service - All cache cleared');
  }
};

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });
  return response.data.path; 
}

export default customApi;