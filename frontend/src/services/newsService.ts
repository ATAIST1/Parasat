import api from '../lib/api';

export type NewsDto = {
  id: string;
  title: string;
  content: string;
  description: string;
  date: string;
  category: string;
  badge: string;
  isFeatured: boolean;
  imageKey: string;
  formattedDate?: string;
};

export const newsService = {
  // получить все новости
  getAll: async (): Promise<NewsDto[]> => {
    const res = await api.get('/api/News');
    
    if (Array.isArray(res.data)) {
      return res.data as NewsDto[];
    }
    
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data as NewsDto[];
    }
    
    return [];
  },

  // получить последние новости
  getRecent: async (limit: number = 10): Promise<NewsDto[]> => {
    const res = await api.get('/api/News/recent', { params: { limit } });
    
    if (Array.isArray(res.data)) {
      return res.data as NewsDto[];
    }
    
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data as NewsDto[];
    }
    
    return [];
  },

  // получить рекомендуемые новости
  getFeatured: async (limit: number = 5): Promise<NewsDto[]> => {
    const res = await api.get('/api/News/featured', { params: { limit } });
    
    if (Array.isArray(res.data)) {
      return res.data as NewsDto[];
    }
    
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data as NewsDto[];
    }
    
    return [];
  },

  // получить новость по ID
  getById: async (id: string): Promise<NewsDto | null> => {
    try {
      const res = await api.get(`/api/News/${id}`);
      return res.data as NewsDto;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // получить новости по категории
  getByCategory: async (category: string): Promise<NewsDto[]> => {
    const res = await api.get(`/api/News/category/${category}`);
    
    if (Array.isArray(res.data)) {
      return res.data as NewsDto[];
    }
    
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data as NewsDto[];
    }
    
    return [];
  },

  // поиск новостей
  search: async (term: string): Promise<NewsDto[]> => {
    const res = await api.get('/api/News/search', { params: { term } });
    
    if (Array.isArray(res.data)) {
      return res.data as NewsDto[];
    }
    
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data as NewsDto[];
    }
    
    return [];
  },

  // создать новость с загрузкой изображения
  create: async (data: {
    title: string;
    content: string;
    description: string;
    category: string;
    badge: string;
    isFeatured?: boolean;
    date?: string;
    imageUrl?: string;
    image?: File;
  }): Promise<NewsDto> => {
    const formData = new FormData();
    
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('badge', data.badge);
    
    if (data.isFeatured !== undefined) {
      formData.append('isFeatured', String(data.isFeatured));
    }
    
    if (data.date) {
      formData.append('date', data.date);
    }
    
    if (data.imageUrl) {
      formData.append('imageUrl', data.imageUrl);
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }

    const res = await api.post('/api/News', formData, {
      transformRequest: [
        (data, headers) => {
          delete headers['Content-Type'];
          return data;
        },
      ],
    });
    
    return res.data as NewsDto;
  },

  update: async (
    id: string,
    data: {
      title?: string;
      content?: string;
      description?: string;
      category?: string;
      badge?: string;
      isFeatured?: boolean;
      date?: string;
      imageUrl?: string;
      image?: File;
    }
  ): Promise<NewsDto> => {
    const formData = new FormData();
    
    if (data.title !== undefined) {
      formData.append('title', data.title);
    }
    if (data.content !== undefined) {
      formData.append('content', data.content);
    }
    if (data.description !== undefined) {
      formData.append('description', data.description);
    }
    if (data.category !== undefined) {
      formData.append('category', data.category);
    }
    if (data.badge !== undefined) {
      formData.append('badge', data.badge);
    }
    if (data.isFeatured !== undefined) {
      formData.append('isFeatured', String(data.isFeatured));
    }
    if (data.date !== undefined) {
      formData.append('date', data.date);
    }
    if (data.imageUrl !== undefined) {
      formData.append('imageUrl', data.imageUrl);
    }
    
    // Add image file if provided
    if (data.image) {
      formData.append('image', data.image);
    }

    const res = await api.put(`/api/News/${id}`, formData, {
      transformRequest: [
        (data, headers) => {
          delete headers['Content-Type'];
          return data;
        },
      ],
    });
    
    return res.data as NewsDto;
  },

  // получить URL изображения новости
  getImageUrl: async (id: string): Promise<string | null> => {
    try {
      const res = await api.get(`/api/News/${id}/image`);
      return res.data?.url || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

export async function getNewsImageUrl(news: NewsDto): Promise<string> {
    if (!news.imageKey) return '';
    const res = await fetch(`/api/news/${news.id}/image`);
    if (!res.ok) throw new Error('Could not fetch image URL');
    const data = await res.json();
    return data.url;
}

