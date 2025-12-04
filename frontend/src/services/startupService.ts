import api from '../lib/api';

export const startupService = {
  create: async (data: any) => {
    return api.post('/api/Startup', data);
  },

  getAll: async () => {
    const res = await api.get('/api/Startup');

    // ВРЕМЕННО: посмотри глазами, что реально возвращает бэк
    console.log('GET /api/Startup →', res.data);

    // Нормализуем: если пришёл массив – ок, если объект с data – берём его
    if (Array.isArray(res.data)) {
      return res.data;
    }

    if (Array.isArray((res.data as any).data)) {
      return (res.data as any).data;
    }

    // На всякий — пусть вернётся пустой массив, чтобы не падало
    return [];
  },

  getById: async (id: string) => {
    const res = await api.get(`/api/Startup/${id}`);
    return res.data;
  },
};
