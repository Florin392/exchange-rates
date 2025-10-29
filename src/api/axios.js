import axios from 'axios';
import { API_BASE_URL, APP_CONFIG } from '@/config';

// Base URL
const currencyApiClient = axios.create({
  baseURL: `${API_BASE_URL}latest/v1`,
  timeout: APP_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
currencyApiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
currencyApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error: ', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error: ', error.message);
    } else {
      console.error('Error: ', error.message);
    }
    return Promise.reject(error);
  }
);

export default currencyApiClient;
