import axios from 'axios';
import store from '../../../store/store'; 
import { logoutUser } from '../../../store/slices/userSlice'; 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:1010/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.user.token;
  
  // Only add Authorization header if it's not a login/register request
  const isAuthRequest = 
    config.url?.includes('/auth/login') || 
    config.url?.includes('/auth/register-client') || 
    config.url?.includes('/auth/register-partner');
  
  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      // Dispatch logout action
      store.dispatch(logoutUser());
      
      // Redirect to login page
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export { api };