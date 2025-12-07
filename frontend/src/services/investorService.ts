import api from '../lib/api';
import type {
  CreateInvestorProfileDto,
  UpdateInvestorProfileDto,
  InvestorProfileResponseDto,
} from '../types/investor';

export const investorService = {
  create: async (data: CreateInvestorProfileDto) => {
    const res = await api.post('/api/InvestorProfiles', data);
    return res.data as { message: string };
  },

  getAll: async () => {
    const res = await api.get('/api/InvestorProfiles');

    if (Array.isArray(res.data)) {
      return res.data as InvestorProfileResponseDto[];
    }

    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data as InvestorProfileResponseDto[];
    }

    return [];
  },

  getById: async (id: string) => {
    const res = await api.get(`/api/InvestorProfiles/${id}`);
    return res.data as InvestorProfileResponseDto;
  },

  getMe: async () => {
    const res = await api.get('/api/InvestorProfiles/me');
    return res.data as InvestorProfileResponseDto;
  },

  update: async (id: string, data: UpdateInvestorProfileDto) => {
    const res = await api.put(`/api/InvestorProfiles/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/api/InvestorProfiles/${id}`);
    return res.data;
  },
};
