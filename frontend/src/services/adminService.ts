import api from '../lib/api';

export type AdminUserDto = {
    id: string;
    name?: string;
    email: string;
    role: string;
    isBanned: boolean;
    investorVerificationStatus?: number; // 0 = None, 1 = Verified, 2 = Rejected
    investorVerificationNote?: string | null;
    investorVerifiedAt?: string | null;
    investorVerifiedBy?: string | null;
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

export type AdminNewsDto = {
    id: string;
    title: string;
    content: string;
    description: string;
    date: string;
    category: string;
    badge: string;
    isFeatured: boolean;
    imageKey: string;
};

export type DealStatus = 0 | 1 | 2 | 3 | 4;

export interface AdminDealDto {
    dealId: string;
    conversationId: string;

    contextType: number;
    contextId: string;
    contextTitle: string;

    owner: { id: string; email: string; name: string };
    initiator: { id: string; email: string; name: string };

    ownerAccepted: boolean;
    initiatorAccepted: boolean;
    status: DealStatus;

    createdAtUtc: string;
    activatedAtUtc?: string | null;
    closedAtUtc?: string | null;
}

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

    getDeals: async (): Promise<AdminDealDto[]> => {
        const res = await api.get('/api/admin/deals');
        return res.data;
    },

    getNews: async (): Promise<AdminNewsDto[]> => {
        const res = await api.get('/api/News');
        return res.data;
    },

    createNews: async (data: {
        title: string;
        content: string;
        description: string;
        category: string;
        badge: string;
        isFeatured: boolean;
        date?: string; // ISO
        image?: File | null;
    }): Promise<AdminNewsDto> => {
        const fd = new FormData();
        fd.append('Title', data.title);
        fd.append('Content', data.content);
        fd.append('Description', data.description);
        fd.append('Category', data.category);
        fd.append('Badge', data.badge);
        fd.append('IsFeatured', String(data.isFeatured));
        if (data.date) fd.append('Date', data.date);
        if (data.image) fd.append('image', data.image);

        const res = await api.post('/api/News', fd, {
            headers: { 'Content-Type': undefined as any },
        });
        return res.data;
    },

    updateNews: async (
        id: string,
        data: {
            title?: string;
            content?: string;
            description?: string;
            category?: string;
            badge?: string;
            isFeatured?: boolean;
            date?: string;
            image?: File | null;
        }
    ): Promise<AdminNewsDto> => {
        const fd = new FormData();
        if (data.title != null) fd.append('Title', data.title);
        if (data.content != null) fd.append('Content', data.content);
        if (data.description != null) fd.append('Description', data.description);
        if (data.category != null) fd.append('Category', data.category);
        if (data.badge != null) fd.append('Badge', data.badge);
        if (data.isFeatured != null) fd.append('IsFeatured', String(data.isFeatured));
        if (data.date != null) fd.append('Date', data.date);
        if (data.image) fd.append('image', data.image);

        const res = await api.put(`/api/News/${id}`, fd, {
            headers: { 'Content-Type': undefined as any },
        });
        return res.data;
    },

    deleteNews: async (id: string) => {
        await api.delete(`/api/News/${id}`);
    },

    getNewsImageUrl: async (id: string): Promise<string | null> => {
        try {
            const res = await api.get(`/api/News/${id}/image`);
            return res.data?.url ?? null;
        } catch {
            return null;
        }
    },

    updateInvestorVerification: async (id: string, status: number, note?: string | null) => {
        await api.patch(`/api/admin/users/${id}/investor-verification`, {
            status,
            note: note || null,
        });
    },
};

