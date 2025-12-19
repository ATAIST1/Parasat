import api from '../lib/api';
import type {
  CreateClubMembershipApplicationDto,
  ClubMembershipApplicationResponseDto,
} from '../types/clubMembership';

export const clubMembershipService = {
  getMy: async () => {
    const res = await api.get<ClubMembershipApplicationResponseDto>('/api/club-membership/me');
    return res.data;
  },

  create: async (payload: CreateClubMembershipApplicationDto) => {
    const res = await api.post('/api/club-membership/applications', payload);
    return res.data;
  },
};
