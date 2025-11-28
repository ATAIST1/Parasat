import { Settings, CreditCard, Shield, HelpCircle, ChevronRight, Bookmark, FileText, Calculator } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface ProfileScreenProps {
  user: any;
  navigateTo: (screen: any) => void;
}

export default function ProfileScreen({ user, navigateTo }: ProfileScreenProps) {
  const menuItems = [
    {
      icon: FileText,
      title: 'Мои проекты',
      subtitle: '2 активных',
      action: () => {},
    },
    {
      icon: Bookmark,
      title: 'Избранное',
      subtitle: '5 проектов',
      action: () => {},
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
      icon: Shield,
      title: 'Верификация',
      subtitle: 'Не верифицирован',
      action: () => {},
    },
    {
      icon: Settings,
      title: 'Настройки',
      action: () => navigateTo('settings'),
    },
    {
      icon: HelpCircle,
      title: 'Справка и поддержка',
      action: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg p-1.5">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-gray-900">Профиль</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
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
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Редактировать профиль
            </Button>
          </div>
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
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-gray-900">{item.title}</h3>
                  {item.subtitle && (
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                  )}
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