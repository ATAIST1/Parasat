import api from '../lib/api';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  about?: string;
  isVerified: boolean;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  about?: string;
}

export const userService = {
  getCurrentUser: () => {
    console.log('🔍 Загружаем текущего пользователя...');
    return api.get<UserDto>('/api/User/me');
  },

  getUserById: (id: string) => {
    console.log('🔍 Загружаем пользователя:', id);
    return api.get<UserDto>(`/api/User/${id}`);
  },

  updateUser: (id: string, data: UpdateUserDto) => {
    console.log('📤 Отправляем PUT запрос на /api/User/' + id);
    console.log('📦 Данные:', data);
    return api.put<UserDto>(`/api/User/${id}`, data);
  },

  getAll: () => {
    console.log('🔍 Загружаем всех пользователей...');
    return api.get<UserDto[]>('/api/User');
  },
};
