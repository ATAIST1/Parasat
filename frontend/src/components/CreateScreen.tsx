import { Rocket, TrendingUp, Code, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import ProjectForm from './ProjectForm';
import InvestorMandateForm from './InvestorMandateForm';
import DeveloperForm from './DeveloperForm';
import BusinessForm from './BusinessForm';

interface CreateScreenProps {
  userRole: 'startup' | 'investor' | 'mentor' | null;
  navigateTo: (screen: any) => void;
}

export default function CreateScreen({ userRole, navigateTo }: CreateScreenProps) {
  const [selectedType, setSelectedType] = useState<'project' | 'mandate' | 'developer' | 'business' | null>(null);

  if (selectedType === 'project') {
    return (
      <ProjectForm
        onBack={() => setSelectedType(null)}
        onSubmit={() => {
          setSelectedType(null);
          navigateTo('feed');
        }}
      />
    );
  }

  if (selectedType === 'mandate') {
    return (
      <InvestorMandateForm
        onBack={() => setSelectedType(null)}
        onSubmit={() => {
          setSelectedType(null);
          navigateTo('feed');
        }}
      />
    );
  }

  if (selectedType === 'developer') {
    return (
      <DeveloperForm
        onBack={() => setSelectedType(null)}
        onSubmit={() => {
          setSelectedType(null);
          navigateTo('feed');
        }}
      />
    );
  }

  if (selectedType === 'business') {
    return (
      <BusinessForm
        onBack={() => setSelectedType(null)}
        onSubmit={() => {
          setSelectedType(null);
          navigateTo('feed');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto space-y-8 pt-8">
        <div className="text-center">
          <h1 className="text-gray-900 mb-2">Что вы хотите создать?</h1>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-2xl p-6 space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Rocket className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Проект стартапа</h3>
                <p className="text-gray-600 text-sm">
                  Заполните профиль и загрузите питч-дек
                </p>
              </div>
            </div>
            <Button onClick={() => setSelectedType('project')} className="w-full">
              Создать проект
            </Button>
          </div>

          {(userRole === 'investor' || userRole === null) && (
            <div className="border border-gray-200 rounded-2xl p-6 space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">Инвесторский мандат</h3>
                  <p className="text-gray-600 text-sm">
                    Опубликуйте критерии и диапазон тикета
                  </p>
                </div>
              </div>
              <Button onClick={() => setSelectedType('mandate')} className="w-full">
                Создать мандат
              </Button>
            </div>
          )}

          <div className="border border-gray-200 rounded-2xl p-6 space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Профиль разработчика</h3>
                <p className="text-gray-600 text-sm">
                  Укажите стек технологий и опыт работы
                </p>
              </div>
            </div>
            <Button onClick={() => setSelectedType('developer')} className="w-full">
              Создать профиль
            </Button>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Действующий бизнес</h3>
                <p className="text-gray-600 text-sm">
                  Опубликуйте запрос на инвестиции в бизнес
                </p>
              </div>
            </div>
            <Button onClick={() => setSelectedType('business')} className="w-full">
              Создать запрос
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}