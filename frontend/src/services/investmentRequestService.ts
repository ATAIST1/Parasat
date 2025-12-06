// frontend/src/services/investmentRequestService.ts
import api from '../lib/api';
import type {
  CreateInvestmentRequestDto,
  UpdateInvestmentRequestDto,
  InvestmentRequestResponseDto,
} from '../types/investment';

export const investmentRequestService = {
  // создать запрос на инвестиции
  create: async (data: CreateInvestmentRequestDto) => {
    const res = await api.post('/api/InvestmentRequests', data);
    return res.data as { message: string };
  },

  // получить все запросы (с фильтрами или без)
  getAll: async (params?: {
    search?: string;
    industry?: string;
    profitRange?: string;
    equityRange?: string;
  }) => {
    const res = await api.get('/api/InvestmentRequests', { params });

    if (Array.isArray(res.data)) {
      return res.data as InvestmentRequestResponseDto[];
    }

    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data as InvestmentRequestResponseDto[];
    }

    return [];
  },

  // получить один по id
  getById: async (id: string) => {
    const res = await api.get(`/api/InvestmentRequests/${id}`);
    return res.data as InvestmentRequestResponseDto;
  },

  // обновить
  update: async (id: string, data: UpdateInvestmentRequestDto) => {
    const res = await api.put(`/api/InvestmentRequests/${id}`, data);
    return res.data;
  },

  // удалить
  delete: async (id: string) => {
    const res = await api.delete(`/api/InvestmentRequests/${id}`);
    return res.data;
  },

  // опубликовать (POST /api/InvestmentRequests/{id}/publish)
  publish: async (id: string) => {
    const res = await api.post(`/api/InvestmentRequests/${id}/publish`);
    return res.data;
  },
};
