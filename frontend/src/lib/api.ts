import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5073',
  headers: {
    'Content-Type': 'application/json',
  },
});


// автоматом подставлять accessToken, если он есть 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;