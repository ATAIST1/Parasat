import api from '../lib/api';

export enum BookmarkItemType {
  Startup = 0,
  Investor = 1,
  Developer = 2,
  Business = 3,
}

export interface BookmarkDto {
  id: string;
  userId: string;
  itemId: string;
  itemType: BookmarkItemType;
  createdAtUtc: string;
}

export interface CreateBookmarkDto {
  itemId: string;
  itemType: BookmarkItemType;
}

export const bookmarkService = {
  getAll: async (): Promise<BookmarkDto[]> => {
    const res = await api.get('/api/Bookmark/user');
    return Array.isArray(res.data) ? res.data : [];
  },

  add: async (dto: CreateBookmarkDto): Promise<void> => {
    await api.post('/api/Bookmark', dto);
  },

  remove: async (itemId: string, itemType: BookmarkItemType): Promise<void> => {
    await api.delete('/api/Bookmark', {
      params: { itemId, itemType },
    });
  },
};
