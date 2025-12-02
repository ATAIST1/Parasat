import { useState } from 'react';
import { Bookmark, DollarSign, TrendingUp, Users, MessageCircle, ChevronLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface MyProjectsScreenProps {
  navigateTo: (screen: string) => void;
}

const myProjects = [
  {
    id: 'my1',
    name: 'PayFlow',
    stage: 'MVP',
    industry: 'Fintech',
    pitch: 'Упрощаем платежи для малого бизнеса в СНГ через единое API',
    mrr: '450,000',
    users: '1,200',
    team: '4',
    tags: ['B2B', 'SaaS'],
  },
  {
    id: 'my2',
    name: 'EduKZ',
    stage: 'Рост',
    industry: 'EdTech',
    pitch: 'AI-платформа адаптивного обучения для школьников Казахстана',
    mrr: '1,200,000',
    users: '15,000',
    team: '8',
    tags: ['B2C', 'AI/ML'],
  },
];

export default function MyProjectsScreen({ navigateTo }: MyProjectsScreenProps) {
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    const newSaved = new Set(saved);
    newSaved.has(id) ? newSaved.delete(id) : newSaved.add(id);
    setSaved(newSaved);
    toast(newSaved.has(id) ? 'Добавлено в избранное' : 'Удалено из избранного');
  };

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => navigateTo('back')} className="p-2 -ml-2">
          <ChevronLeft className="w-5 h-5" />
             </button>
         <div className="w-10 h-10 bg-slate-900 rounded-lg p-1.5">
         <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
         </div>
        <h1 className="text-gray-900">Мои проекты</h1>
    </div>
      <div className="p-4 space-y-4">
        {myProjects.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">У вас пока нет проектов</p>
            <Button onClick={() => navigateTo('create-project')} className="mt-4">
              Создать проект
            </Button>
          </div>
        ) : (
          myProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg text-gray-900">{project.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{project.stage}</Badge>
                    <Badge variant="outline">{project.industry}</Badge>
                    {project.tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => toggleSave(project.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Bookmark
                    className={`w-5 h-5 ${saved.has(project.id) ? 'fill-blue-600 text-blue-600' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              <p className="text-sm text-gray-600">{project.pitch}</p>

              <div className="flex gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>MRR {project.mrr} ₸</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>{project.users} users</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{project.team} team</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  Редактировать
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  Заявки
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}