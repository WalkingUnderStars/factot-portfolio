// ===============================
// API.js Comunicare cu backend-ul
// ===============================

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// ===============================
// interceptor - adauga token automat
// ===============================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// Auth routes
// ===============================
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// ===============================
// Task routes
// ===============================
export const createTask = (data) => api.post('/tasks', data);
export const getTasks = (params) => api.get('/tasks', { params });
export const getTaskById = (id) => api.get(`/tasks/${id}`);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// ===============================
// Proposal routes
// ===============================
export const createProposal = (data) => api.post('/proposals', data);
export const getProposalsByTask = (taskId) => api.get(`/proposals/task/${taskId}`);
export const getMyProposals = () => api.get('/proposals/my');
export const acceptProposal = (id) => api.put(`/proposals/${id}/accept`);
export const rejectProposal = (id) => api.put(`/proposals/${id}/reject`);
export const cancelProposal = (id) => api.put(`/proposals/${id}/cancel`);

// ===============================
// Review routes
// ===============================
export const createReview = (data) => api.post('/reviews', data);
export const getUserReviews = (userId) => api.get(`/reviews/user/${userId}`);
export const completeTask = (taskId) => api.put(`/reviews/task/${taskId}/complete`);

export default api;