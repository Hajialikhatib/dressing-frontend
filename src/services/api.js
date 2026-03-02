import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh });
        localStorage.setItem('access_token', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  registerUser: (data) => api.post('/auth/register/user/', data),
  registerTailor: (data) => api.post('/auth/register/tailor/', data),
  login: (data) => api.post('/auth/login/', data),
  getMe: () => api.get('/auth/me/'),
  getApprovedTailors: () => api.get('/auth/tailors/'),
};

// ─── Admin ──────────────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers: () => api.get('/auth/admin/users/'),
  getTailors: () => api.get('/auth/admin/tailors/'),
  tailorAction: (tailorId, action) => api.post(`/auth/admin/tailors/${tailorId}/action/`, { action }),
  deleteUser: (userId) => api.delete(`/auth/admin/users/${userId}/delete/`),
};

// ─── Designs ─────────────────────────────────────────────────────────────────
export const designAPI = {
  getAll: (params) => api.get('/designs/', { params }),
  getByTailor: (tailorId) => api.get(`/designs/tailor/${tailorId}/`),
  getMyDesigns: () => api.get('/designs/my/'),
  create: (data) => api.post('/designs/my/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/designs/my/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/designs/my/${id}/`),
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const orderAPI = {
  getMyOrders: () => api.get('/orders/'),
  placeOrder: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) formData.append(k, v); });
    return api.post('/orders/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getTailorOrders: () => api.get('/orders/tailor/'),
  orderAction: (id, data) => api.post(`/orders/tailor/${id}/action/`, data),
};

export default api;
