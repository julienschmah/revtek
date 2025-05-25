import axios from 'axios';

const cache = new Map();
const cacheTTL = 10 * 60 * 1000; // 10 minutos
const maxCacheSize = 50; // Limitar tamanho do cache

const getFromCache = (url: string) => {
  const cachedData = cache.get(url);
  if (!cachedData) return null;
  
  if (Date.now() - cachedData.timestamp > cacheTTL) {
    cache.delete(url);
    return null;
  }
  
  // Atualizar timestamp para manter itens frequentemente acessados
  cachedData.timestamp = Date.now();
  return cachedData.data;
};

interface CacheData {
  data: unknown;
  timestamp: number;
}

// Limitar o tamanho do cache
const setInCache = (url: string, data: unknown) => {
  // Se o cache está cheio, remover o item mais antigo
  if (cache.size >= maxCacheSize) {
    let oldestKey = null;
    let oldestTime = Date.now();
    
    cache.forEach((value, key) => {
      if (value.timestamp < oldestTime) {
        oldestKey = key;
        oldestTime = value.timestamp;
      }
    });
    
    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }
  
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
      const isDebug = process.env.NODE_ENV === 'development';
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        if (isDebug) {
          console.log(`API Service - Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
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
    const isDebug = process.env.NODE_ENV === 'development';
    
    // Reduzir logs em produção
    if (isDebug) {
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
      
    if (response.config.method?.toLowerCase() === 'get' && !response.request.fromCache) {
      const baseURL = response.config.baseURL || '';
      const fullUrl = baseURL + response.config.url;
      setInCache(fullUrl, response.data);
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
  
  // Get the token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Check if token exists before attempting upload
  if (!token) {
    console.error('Upload Image - No token available for image upload');
    throw new Error('Autenticação necessária. Por favor, faça login para enviar imagens.');
  }
  
  // Check if file is valid
  if (!file || !(file instanceof File)) {
    console.error('Upload Image - Invalid file object:', file);
    throw new Error('Arquivo inválido. Por favor, tente novamente com uma imagem válida.');
  }
  
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    console.error('Upload Image - Invalid file type:', file.type);
    throw new Error(`Tipo de arquivo não suportado (${file.type}). Apenas imagens JPEG, PNG, GIF e WebP são permitidas.`);
  }
  
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    console.error('Upload Image - File too large:', file.size);
    throw new Error('Arquivo muito grande. O tamanho máximo permitido é 5MB.');
  }
  
  // Prepare headers with authentication
  const headers: Record<string, string> = {};
  
  // Don't set Content-Type manually, let the browser set it with boundary for multipart/form-data
  headers['Authorization'] = `Bearer ${token}`;
  console.log('Upload Image - Adding token to request');
  
  try {
    console.log('Upload Image - Starting upload:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });
    
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers,
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      }
    });
    
    console.log('Upload Image - Success:', response.data);
    return response.data.path;
  } catch (error: any) {
    console.error('Upload Image - Error:', error);
    
    // Handle specific error responses
    if (error.response) {
      const { status, data } = error.response;
      
      // Authentication errors
      if (status === 401) {
        console.error('Erro de autenticação no upload (401 Unauthorized)');
        localStorage.removeItem('token');
        
        if (data && data.code === 'TOKEN_EXPIRED') {
          throw new Error('Sua sessão expirou. Por favor, faça login novamente.');
        } else {
          throw new Error('Não autorizado. Por favor, faça login novamente.');
        }
      }
      
      // Bad request errors (validation)
      if (status === 400) {
        const errorMessage = data.message || 'Erro no processamento do arquivo';
        console.error(`Upload validation error: ${errorMessage}`);
        throw new Error(errorMessage);
      }
      
      // Server errors
      if (status >= 500) {
        throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.');
      }
      
      // Other errors with response data
      if (data && data.message) {
        throw new Error(data.message);
      }
    }
    
    // Network errors
    if (error.request && !error.response) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }
    
    // Default error
    throw error;
  }
}

export default customApi;

/**
 * Check if the stored token is valid and not expired
 * @returns Object containing token validity status
 */
export async function checkTokenValidity(): Promise<{
  isValid: boolean;
  isExpired: boolean;
  remainingTimeMinutes?: number;
  message?: string;
}> {
  try {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token) {
      return {
        isValid: false,
        isExpired: true,
        message: 'No token found'
      };
    }
    
    // Basic token format check
    if (!token.includes('.') || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      return {
        isValid: false,
        isExpired: false,
        message: 'Invalid token format'
      };
    }
    
    try {
      // Decode token (without verification)
      const decodedBase64 = token.split('.')[1];
      const decodedJson = atob(decodedBase64);
      const decoded = JSON.parse(decodedJson);
      
      // Check expiration
      const expirationTime = decoded.exp * 1000; // convert to milliseconds
      const now = Date.now();
      
      if (expirationTime < now) {
        localStorage.removeItem('token');
        return {
          isValid: false,
          isExpired: true,
          message: 'Token has expired'
        };
      }
      
      // Calculate remaining time
      const remainingTimeMinutes = Math.floor((expirationTime - now) / (1000 * 60));
      
      // Check if token will expire soon (within 10 minutes)
      if (remainingTimeMinutes < 10) {
        return {
          isValid: true,
          isExpired: false,
          remainingTimeMinutes,
          message: `Token will expire in ${remainingTimeMinutes} minutes`
        };
      }
      
      return {
        isValid: true,
        isExpired: false,
        remainingTimeMinutes,
        message: 'Token is valid'
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return {
        isValid: false,
        isExpired: false,
        message: 'Error decoding token'
      };
    }
  } catch (error) {
    console.error('Error checking token validity:', error);
    return {
      isValid: false,
      isExpired: false,
      message: 'Error checking token'
    };
  }
}