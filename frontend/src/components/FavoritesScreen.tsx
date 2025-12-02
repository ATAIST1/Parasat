import { useState } from 'react';
import { ChevronLeft, Bookmark, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface FavoritesScreenProps {
  navigateTo: (screen: string) => void;
}

const favorites = [
  { id: '1', type: 'project', name: 'PayFlow', industry: 'Fintech', pitch: 'Платежи для СНГ', mrr: '450K' },
  { id: 'inv1', type: 'investor', name: 'Кайрат Сатыбалды', title: 'Angel • Almaty', checkSize: '$50K–$500K', verified: true },
  { id: 'dev1', type: 'developer', name: 'TechForge Team', stack: ['React', 'Node.js'], rate: '800K ₸/мес' },
  { id: 'biz1', type: 'business', name: 'CoffeeHub', industry: 'HoReCa', revenue: '180M ₸', verified: true },
];

export default function FavoritesScreen({ navigateTo }: FavoritesScreenProps) {
  const [saved, setSaved] = useState<Set<string>>(new Set(favorites.map(f => f.id)));

  const toggleSave = (id: string) => {
    const newSaved = new Set(saved);
    newSaved.delete(id);
    setSaved(newSaved);
  };

  const renderCard = (item: any) => (
    <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-gray-900">{item.name}</h3>
            {item.verified && <CheckCircle className="w-4 h-4 text-blue-600 fill-blue-600" />}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {item.title || item.industry || item.stack?.join(' • ')}
          </p>
          {item.pitch && <p className="text-sm text-gray-500 mt-2">{item.pitch}</p>}
          {(item.mrr || item.checkSize || item.rate || item.revenue) && (
            <p className="text-sm font-medium text-gray-900 mt-2">
              {item.mrr && `MRR ${item.mrr} ₸`}
              {item.checkSize && item.checkSize}
              {item.rate && item.rate}
              {item.revenue && `Выручка ${item.revenue}`}
            </p>
          )}
        </div>
        <button
          onClick={() => toggleSave(item.id)}
          className="p-2 hover:bg-gray-100 rounded-lg ml-3"
        >
          <Bookmark className="w-5 h-5 fill-blue-600 text-blue-600" />
        </button>
      </div>
      <Button className="mt-4 w-full" size="sm">Подробнее</Button>
    </div>
  );

  const projects = favorites.filter(i => i.type === 'project');
  const investors = favorites.filter(i => i.type === 'investor');
  const developers = favorites.filter(i => i.type === 'developer');
  const businesses = favorites.filter(i => i.type === 'business');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigateTo('back')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-slate-900 rounded-lg p-1.5">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-gray-900 font-medium">Избранное</h1>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 w-full bg-white border-b">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="projects">Проекты</TabsTrigger>
          <TabsTrigger value="investors">Инвесторы</TabsTrigger>
          <TabsTrigger value="other">Другое</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="p-4 space-y-4">
          {favorites.length === 0 ? (
            <p className="text-center text-gray-500 py-16">Пока ничего не сохранено</p>
          ) : (
            favorites.map(renderCard)
          )}
        </TabsContent>

        <TabsContent value="projects" className="p-4 space-y-4">
          {projects.length === 0 ? <p className="text-center text-gray-500 py-8">Нет сохранённых проектов</p> : projects.map(renderCard)}
        </TabsContent>

        <TabsContent value="investors" className="p-4 space-y-4">
          {investors.length === 0 ? <p className="text-center text-gray-500 py-8">Нет сохранённых инвесторов</p> : investors.map(renderCard)}
        </TabsContent>

        <TabsContent value="other" className="p-4 space-y-4">
          {(developers.length + businesses.length === 0) ? 
            <p className="text-center text-gray-500 py-8">Ничего не сохранено</p> : 
            [...developers, ...businesses].map(renderCard)
          }
        </TabsContent>
      </Tabs>
    </div>
  );
}