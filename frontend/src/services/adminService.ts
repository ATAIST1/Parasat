import api from '../lib/api';

export type AdminUserDto = {
    id: string;
    name?: string;
    email: string;
    role: string;
    isBanned: boolean;
};

export type AdminConversationDto = {
    conversationId: string;
    contextType: number;
    contextId: string;
    contextTitle: string;
    owner: { id: string; email: string; name: string };
    initiator: { id: string; email: string; name: string };
    createdAtUtc: string;
    updatedAtUtc: string;
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

    getConversations: async (): Promise<AdminConversationDto[]> => {
        const res = await api.get('/api/admin/conversations');
        return res.data;
    },
};
