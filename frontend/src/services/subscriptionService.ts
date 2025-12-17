import api from '../lib/api';

export type SubscriptionStatusDto = {
  isActive: boolean;
  expiresAt: string | null;
};

export const subscriptionService = {
  getStatus: async (): Promise<SubscriptionStatusDto> => {
    const res = await api.get('/api/subscription/investor-contacts/status');
    return res.data;
  },

  createOrExtend: async (months: number): Promise<SubscriptionStatusDto> => {
    const res = await api.post('/api/subscription/investor-contacts', { months });
    return res.data;
  },
};
