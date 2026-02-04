import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Gallery API
export const galleryAPI = {
    getAll: (params) => api.get('/gallery', { params }),
    getOne: (id) => api.get(`/gallery/${id}`),
    create: (formData) => api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.put(`/gallery/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/gallery/${id}`)
};

// Content API
export const contentAPI = {
    getAll: (params) => api.get('/content', { params }),
    getByKey: (key) => api.get(`/content/${key}`),
    createOrUpdate: (data) => api.post('/content', data),
    delete: (key) => api.delete(`/content/${key}`)
};

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    verify: () => api.get('/auth/verify')
};

export default api;
