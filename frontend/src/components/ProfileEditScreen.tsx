import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { userService, UserDto } from '../services/userService';
import { toast } from 'sonner';

interface ProfileEditScreenProps {
  navigateTo: (screen: any) => void;
}

export default function ProfileEditScreen({ navigateTo }: ProfileEditScreenProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserDto | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    about: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await userService.getCurrentUser();
      const userData = response.data;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        about: userData.about || '',
      });
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Ошибка: пользователь не загружен');
      return;
    }

    // Валидация
    if (!formData.name.trim()) {
      toast.error('Имя не может быть пустым');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email не может быть пустым');
      return;
    }

    try {
      setSaving(true);
      console.log('📤 Отправляем запрос на обновление профиля...');
      console.log('User ID:', user.id);
      console.log('Data:', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        about: formData.about.trim(),
      });

      const response = await userService.updateUser(user.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        location: formData.location.trim() || undefined,
        about: formData.about.trim() || undefined,
      });

      console.log('✅ Профиль обновлен успешно:', response.data);
      toast.success('Профиль успешно обновлён! ✓');
      
      // Обновляем локальное состояние
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        location: response.data.location || '',
        about: response.data.about || '',
      });
      
      // Возвращаемся в профиль через 1 сек
      setTimeout(() => {
        navigateTo('back');
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Ошибка при обновлении профиля:', error);
      
      // Детальный лог ошибки
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      
      const message = 
        error?.response?.data?.message || 
        error?.response?.data ||
        error?.message ||
        'Ошибка при обновлении профиля';
      
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
        <button
          onClick={() => navigateTo('back')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Редактировать профиль</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Avatar Section */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900 font-medium">Имя</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Ваше имя"
              value={formData.name}
              onChange={handleInputChange}
              className="text-gray-900"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
              className="text-gray-900"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-900 font-medium">Телефон</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+7 (XXX) XXX-XX-XX"
              value={formData.phone}
              onChange={handleInputChange}
              className="text-gray-900"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-900 font-medium">Локация</Label>
            <Input
              id="location"
              name="location"
              type="text"
              placeholder="Город, Страна"
              value={formData.location}
              onChange={handleInputChange}
              className="text-gray-900"
            />
          </div>

          {/* About */}
          <div className="space-y-2">
            <Label htmlFor="about" className="text-gray-900 font-medium">О себе</Label>
            <textarea
              id="about"
              name="about"
              placeholder="Расскажите о себе..."
              value={formData.about}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigateTo('back')}
              disabled={saving}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
