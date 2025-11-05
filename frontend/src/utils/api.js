import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// ✅ Add Token Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle Expired Token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Recipe APIs
export const RecipeAPI = {
  getAll: () => api.get('/api/users/getrecipes'),
  getOne: (id) => api.get(`/api/users/getrecipe/${id}`),
  create: (data) => api.post('/api/users/createrecipe', data),
  update: (id, data) => api.put(`/api/users/updaterecipe/${id}`, data),
  delete: (id) => api.delete(`/api/users/deleterecipe/${id}`),
  getCategories: () => api.get('/api/users/categories'),
};

// ✅ User APIs
export const UserAPI = {
  signup: (data) => api.post('/api/users/usersignup', data),
  login: (data) => api.post('/api/users/userlogin', data),
  profile: (id) => api.get(`/api/users/userprofile/${id}`),
  favorites: {
    get: () => api.get('/api/users/favorites'),
    add: (data) => api.post('/api/users/favorites/add', data),
    remove: (data) => api.post('/api/users/favorites/remove', data),
  },
};

export default api;
