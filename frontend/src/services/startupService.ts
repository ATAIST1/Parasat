import api from '../lib/api';

export const startupService = {
  create: async (data: any) => {
    return api.post('/api/Startup', data);
  },
  getAll: async () => {
    const res = await api.get('/api/Startup');
    return res.data;
  },
};