import { Rocket, TrendingUp, Users } from 'lucide-react';
import { UserRole } from '../App';
import { Button } from './ui/button';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface RoleSelectionScreenProps {
  onRoleSelect: (role: UserRole) => void;
}

export default function RoleSelectionScreen({ onRoleSelect }: RoleSelectionScreenProps) {
  const roles = [
    {
      id: 'startup' as UserRole,
      icon: Rocket,
      title: 'Стартап',
      description: 'Ищу инвестиции, партнёрства и менторство',
    },
    {
      id: 'investor' as UserRole,
      icon: TrendingUp,
      title: 'Инвестор',
      description: 'Ищу проекты по стадиям и отраслям',
    },
    {
      id: 'mentor' as UserRole,
      icon: Users,
      title: 'Ментор',
      description: 'Готов помогать командам',
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto space-y-8 pt-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-slate-900 rounded-xl p-3">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-gray-900 mb-2">Кто вы?</h1>
        </div>

        <div className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="border border-gray-200 rounded-2xl p-6 space-y-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{role.title}</h3>
                    <p className="text-gray-600 text-sm">{role.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => onRoleSelect(role.id)}
                  className="w-full"
                  variant="outline"
                >
                  Выбрать
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
