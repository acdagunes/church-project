import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

// Parish API
export const parishAPI = {
    register: (userData) => api.post('/parish/register', userData),
    login: (credentials) => api.post('/parish/login', credentials),
    getPendingMembers: () => api.get('/parish/members/pending'),
    updateMemberStatus: (id, status) => api.put(`/parish/members/status/${id}`, { status }),
    togglePresence: () => api.put('/parish/presence/toggle'),
    getPresence: () => api.get('/parish/presence/status'),
    getCommunalChat: () => api.get('/parish/chat/communal'),
    sendMessage: (data) => api.post('/parish/chat/send', data),
    bookService: (data) => api.post('/parish/appointments', data),
    getMyBookings: () => api.get('/parish/appointments/me'),
    getBusySlots: (date) => api.get(`/parish/appointments/busy/${date}`),
    getAllMembers: () => api.get('/parish/members/all'),
    getAllAppointments: () => api.get('/parish/appointments/all'),
    updateAppointmentStatus: (id, status) => api.put(`/parish/appointments/status/${id}`, { status }),
    updateAppointment: (id, data) => api.put(`/parish/appointments/${id}`, data),
    updateMember: (id, data) => api.put(`/parish/members/${id}`, data),
    resetMemberPassword: (id, password) => api.put(`/parish/members/${id}/password`, { password }),
    deleteMember: (id) => api.delete(`/parish/members/${id}`)
};

export default api;
