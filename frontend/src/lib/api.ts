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
  console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, { 
    token: token ? '✓ есть' : '✗ нет', 
    data: config.data 
  });
  return config;
});

// Логирование ответов
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Ответ ${response.status}:`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ Ошибка ${error.response?.status}:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;