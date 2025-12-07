import { useState, useEffect } from 'react';
import { TrendingUp, Award, Users, Briefcase, ChevronRight, Calendar, Star } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';
import { newsService, type NewsDto } from '../services/newsService';

import type { Screen } from '../App';

interface ParasatScreenProps {
  navigateTo: (screen: Screen) => void;
  openNews: (id: string) => void;
}

export default function ParasatScreen({ navigateTo, openNews }: ParasatScreenProps) {
  const [news, setNews] = useState<NewsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedNews = await newsService.getRecent(10);
        setNews(fetchedNews);
      } catch (err: any) {
        console.error('Error fetching news:', err);
        setError('Не удалось загрузить новости');
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const achievements = [
    {
      icon: Users,
      value: '1,200+',
      label: 'Активных пользователей',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Briefcase,
      value: '150+',
      label: 'Проектов на платформе',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: TrendingUp,
      value: '$2.5M',
      label: 'Привлечено инвестиций',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Award,
      value: '45',
      label: 'Успешных сделок',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white rounded-xl p-2">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-white">Parasat Business Club</h1>
            <p className="text-sm text-gray-300">Новости и достижения</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <p className="text-white text-sm">
            <span className="font-medium">Миссия:</span> Объединяем стартаперов, инвесторов и разработчиков СНГ для создания успешных бизнесов
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-gray-900">Ключевые показатели</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className={`w-10 h-10 bg-gradient-to-br ${achievement.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl text-gray-900">{achievement.value}</p>
                  <p className="text-xs text-gray-600">{achievement.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Последние новости</h2>
            <Badge variant="secondary">Все актуально</Badge>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Загрузка новостей...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Новостей пока нет
            </div>
          ) : (
            <div className="space-y-3">
              {news.map((item) => {
                const displayDate = item.formattedDate || 
                  (item.date ? new Date(item.date).toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  }) : '');
                
                return (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => openNews(item.id)}
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={item.category === 'Достижение' ? 'default' : 'secondary'}
                              className={item.category === 'Достижение' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                            >
                              {item.badge}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {displayDate}
                            </div>
                          </div>
                          <h3 className="text-gray-900 font-medium mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-gray-900 mb-2">О Parasat Business Club</h3>
          <p className="text-sm text-gray-600 mb-4">
            Мы создаем экосистему для развития предпринимательства в странах СНГ. Наша платформа помогает стартапам находить инвесторов, 
            разработчиков и менторов, а инвесторам — перспективные проекты.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              Прозрачные условия — 2,5% от сделки
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              Проверенные участники платформы
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              Поддержка на всех этапах сделки
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
