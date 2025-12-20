import api from '../lib/api';

export type AdminUserDto = {
    id: string;
    name?: string;
    email: string;
    role: string;
    isBanned: boolean;
};

export const adminService = {
    getUsers: async (): Promise<AdminUserDto[]> => {
        const res = await api.get('/api/admin/users');
        return res.data;
    },

    makeAdmin: async (id: string) => {
        await api.post(`/api/admin/users/${id}/role`, 'Admin', {
            headers: { 'Content-Type': 'application/json' },
        });
    },

    ban: async (id: string) => {
        await api.post(`/api/admin/users/${id}/ban`);
    },

    unban: async (id: string) => {
        await api.post(`/api/admin/users/${id}/unban`);
    },
};
