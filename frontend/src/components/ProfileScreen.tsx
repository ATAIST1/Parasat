import React, { useState, useEffect } from 'react';
import {
  Settings,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronRight,
  Bookmark,
  FileText,
  Calculator,
  Edit2,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

import MyProjectsScreen from './MyProjectsScreen';
import FavoritesScreen from './FavoritesScreen';
import { bookmarkService } from '../services/bookmarkService';
import { startupService } from '../services/startupService';


interface ProfileScreenProps {
  user: any;
  navigateTo: (screen: any) => void;
}

export default function ProfileScreen({ user, navigateTo }: ProfileScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<'profile' | 'my-projects' | 'favorites'>('profile');
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    bookmarkService.getAll().then(bookmarks => {
      setFavoritesCount(bookmarks.length);
    });
  }, []);

  const [myProjectsCount, setMyProjectsCount] = useState(0);

  useEffect(() => {
    startupService.getMine().then(list => setMyProjectsCount(list.length)).catch(() => setMyProjectsCount(0));
  }, []);

  if (currentScreen === 'my-projects') {
    return (
      <MyProjectsScreen
        navigateTo={(screen) => {
          if (screen === 'back') {
            startupService.getMine().then(list => setMyProjectsCount(list.length));
            setCurrentScreen('profile');
          }

          else navigateTo(screen);
        }}
      />
    );
  }

  if (currentScreen === 'favorites') {
    return (
      <FavoritesScreen
        navigateTo={(screen) => {
          if (screen === 'back') {
            bookmarkService.getAll().then(bookmarks => {
              setFavoritesCount(bookmarks.length);
            });
            setCurrentScreen('profile');
          }
          else navigateTo(screen);
        }}
        onProjectClick={(id: string) => navigateTo('project-detail')}
      />
    );
  }

  const menuItems = [
    {
      icon: FileText,
  title: 'Подписки',
  subtitle: 'Контакты инвесторов',
  action: () => navigateTo('subscriptions'),
    },
    {
      icon: FileText,
      title: 'Мои проекты',
      subtitle: `${myProjectsCount} активных`,
      action: () => setCurrentScreen('my-projects'),
    },
    {
      icon: Bookmark,
      title: 'Избранное',
      subtitle: `${favoritesCount} элементов`,
      action: () => setCurrentScreen('favorites'),
    },
    {
      icon: Calculator,
      title: 'Калькулятор ROI',
      subtitle: 'Рассчитайте доходность',
      action: () => navigateTo('calculator'),
    },
    {
      icon: CreditCard,
      title: 'Условия оплаты',
      subtitle: '2,5% от инвестиций',
      action: () => navigateTo('pricing'),
    },

    {
      icon: Settings,
      title: 'Настройки',
      action: () => navigateTo('settings'),
    },
    {
      icon: HelpCircle,
      title: 'Справка и поддержка',
      action: () => navigateTo('tech-support'),
    },
  ];

  if (user?.role === 'Admin') {
    menuItems.unshift({
      icon: Shield,
      title: 'Панель Администратора',
      subtitle: 'Управление системой',
      action: () => navigateTo('admin'),
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="p-4 space-y-4 tabs-area no-lift">
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-gray-900 mb-1">{user?.name || user?.email || 'Пользователь'}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {user?.role === 'startup' ? 'Стартап' : user?.role === 'investor' ? 'Инвестор' : 'Ментор'}
                </Badge>
                <Badge variant="outline">Алматы, Казахстан</Badge>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigateTo('profile-edit')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl p-4 flex items-center justify-between transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Edit2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Редактировать профиль</h3>
                <p className="text-xs text-white/80">Обновить ваши данные</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/80" />
          </button>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" color="#111827" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-gray-900">{item.title}</h3>
                  {item.subtitle && <p className="text-sm text-gray-500">{item.subtitle}</p>}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}