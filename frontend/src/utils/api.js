import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// This interceptor ADDS the token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ▼▼▼ ADD THIS NEW INTERCEPTOR ▼▼▼
// This interceptor CHECKS for token errors in responses
api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Remove the expired token from storage
      localStorage.removeItem('token');
      
      // Dispatch a custom event to notify the app of logout
      window.dispatchEvent(new Event('auth-change'));
      
      // Redirect to the login page
      // You might need to adjust the path depending on your router setup
      window.location.href = '/login'; 
      
      console.error("Session expired. Please log in again.");
    }
    
    // Return the error to be handled by the component's .catch block
    return Promise.reject(error);
  }
);

export default api;