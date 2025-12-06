// frontend/src/services/developerService.ts
import api from '../lib/api';

import type { CreateDeveloperProfileDto } from '../types/developer';

export const developerService = {
  // создать профиль
  create: async (data: CreateDeveloperProfileDto) => {
    const res = await api.post('/api/DeveloperProfiles', data);
    return res.data;
  },

  // получить все профили
  getAll: async () => {
    const res = await api.get('/api/DeveloperProfiles');

    // бэк должен возвращать массив
    if (Array.isArray(res.data)) {
      return res.data;
    }

    // fallback если бэк вернет что-то вроде { data: [...] }
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }

    return [];
  },

  // получить профиль по Id
  getById: async (id: string) => {
    const res = await api.get(`/api/DeveloperProfiles/${id}`);
    return res.data;
  },

  // удалить профиль
  delete: async (id: string) => {
    const res = await api.delete(`/api/DeveloperProfiles/${id}`);
    return res.data;
  },
};
