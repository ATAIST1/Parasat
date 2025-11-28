import { TrendingUp, Award, Users, Briefcase, ChevronRight, Calendar, Star } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface ParasatScreenProps {
  navigateTo: (screen: any) => void;
}

export default function ParasatScreen({ navigateTo }: ParasatScreenProps) {
  const news = [
    {
      id: 1,
      title: 'Запуск платформы Parasat Invest',
      date: '15 октября 2024',
      category: 'Новость',
      description: 'Parasat Business Club запустил инвестиционную платформу для стартаперов и инвесторов СНГ',
      image: 'platform launch',
      badge: 'Новое',
    },
    {
      id: 2,
      title: 'Первая успешная сделка на $500K',
      date: '8 ноября 2024',
      category: 'Достижение',
      description: 'Стартап в сфере FinTech привлек инвестиции через нашу платформу',
      image: 'business success',
      badge: 'Сделка',
    },
    {
      id: 3,
      title: '1000+ пользователей за первый месяц',
      date: '20 ноября 2024',
      category: 'Достижение',
      description: 'Наше сообщество растет! Спасибо за доверие',
      image: 'community growth',
      badge: 'Рост',
    },
    {
      id: 4,
      title: 'Партнерство с ведущими акселераторами',
      date: '2 декабря 2024',
      category: 'Новость',
      description: 'Подписаны соглашения о сотрудничестве с крупнейшими акселераторами региона',
      image: 'business partnership',
      badge: 'Партнерство',
    },
  ];

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

          <div className="space-y-3">
            {news.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={item.category === 'Достижение' ? 'default' : 'secondary'}
                          className={item.category === 'Достижение' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {item.badge}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </div>
                      </div>
                      <h3 className="text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
