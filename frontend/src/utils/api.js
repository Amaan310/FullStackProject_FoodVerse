import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Request Interceptor — Add Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor — Handle Expired Token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth-change'));
      window.location.href = '/login';
      console.error('Session expired. Please log in again.');
    }
    return Promise.reject(error);
  }
);

// ✅ Recipe APIs
export const RecipeAPI = {
  getAll: () => api.get('/api/recipes'),
  getOne: (id) => api.get(`/api/recipes/${id}`),
  create: (data) => api.post('/api/recipes', data),
  update: (id, data) => api.put(`/api/recipes/${id}`, data),
  delete: (id) => api.delete(`/api/recipes/${id}`),
  getCategories: () => api.get('/api/recipes/categories/all'),
};

// ✅ User APIs
export const UserAPI = {
  signup: (data) => api.post('/api/users/signup', data),
  login: (data) => api.post('/api/users/login', data),
  profile: (id) => api.get(`/api/users/profile/${id}`),
  favorites: {
    get: () => api.get('/api/users/favorites'),
    add: (data) => api.post('/api/users/favorites/add', data),
    remove: (data) => api.post('/api/users/favorites/remove', data),
  },
};

export default api;
