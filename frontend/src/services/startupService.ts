import api from '../lib/api';

export const startupService = {
  create: async (formData: FormData) => {
    return api.post('/api/Startup', formData, {
      transformRequest: [
        (data, headers) => {
          delete headers['Content-Type'];
          return data;
        },
      ],
    });
  },

  getAll: async () => {
    const res = await api.get('/api/Startup');

    console.log('GET /api/Startup →', res.data);

    if (Array.isArray(res.data)) {
      return res.data;
    }

    if (Array.isArray((res.data as any).data)) {
      return (res.data as any).data;
    }

    return [];
  },

  getById: async (id: string) => {
    const res = await api.get(`/api/Startup/${id}`);
    return res.data;
  },

  getPitchDeckUrl: async (id: string) => {
    const res = await api.get(`/api/Startup/${id}/pitchdeck`);
    return res.data as { url: string };
  },

  getFinancialModelUrl: async (id: string) => {
    const res = await api.get(`/api/Startup/${id}/financialmodel`);
    return res.data as { url: string };
  },
};
