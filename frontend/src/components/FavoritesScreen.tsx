import React, { useState, useEffect } from 'react';
import { ChevronLeft, Bookmark, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';
import { bookmarkService, BookmarkItemType } from '../services/bookmarkService';
import { startupService } from '../services/startupService';
import { developerService } from '../services/developerService';
import { investorService } from '../services/investorService';
import { toast } from 'sonner';

interface FavoritesScreenProps {
  navigateTo: (screen: string) => void;
}

type FavoriteCardType = {
  id: string;
  type: BookmarkItemType;
  data: any;
};

export default function FavoritesScreen({ navigateTo }: FavoritesScreenProps) {
  const [favorites, setFavorites] = useState<FavoriteCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        const bookmarks = await bookmarkService.getAll();
        const favs: FavoriteCardType[] = await Promise.all(
          bookmarks.map(async (bm) => {
            let data = null;
            try {
              switch (bm.itemType) {
                case BookmarkItemType.Startup:
                  data = await startupService.getById(bm.itemId);
                  break;
                case BookmarkItemType.Developer:
                  data = await developerService.getById(bm.itemId);
                  break;
                case BookmarkItemType.Investor:
                  data = await investorService.getById(bm.itemId);
                  break;
                case BookmarkItemType.Business:
                  data = { id: bm.itemId, type: BookmarkItemType.Business, name: 'Business', pitch: '', industry: '', revenue: ''};
                  break;
                default:
                  break;
              }
            } catch (e) {
              data = null;
            }
            return data ? { id: bm.itemId, type: bm.itemType, data } : null;
          })
        );
        setFavorites(favs.filter(Boolean) as FavoriteCardType[]);
      } catch (e) {
        toast('Ошибка загрузки избранного');
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  const removeFavorite = async (fav: FavoriteCardType) => {
    setRemoving(fav.id);
    try {
      await bookmarkService.remove(fav.id, fav.type);
      setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
      toast('Удалено из избранного');
    } catch (e) {
      toast('Ошибка удаления. Попробуйте еще раз');
    } finally {
      setRemoving(null);
    }
  };

  const renderCard = (fav: FavoriteCardType) => {
    const { type, data } = fav;
    let extraInfo = '';
    let subline = '';
    let badge = null;
    let extra = '';
    switch (type) {
      case BookmarkItemType.Startup:
        extraInfo = data.shortPitch || data.pitch || data.ProjectName || '';
        subline = data.industry || data.Industry || '';
        badge = data.stage || data.Stage || null;
        extra = data.revenue ? 'MRR ' + data.revenue + ' ₸' : '';
        break;
      case BookmarkItemType.Investor:
        extraInfo = data.about || '';
        subline = data.city || '';
        badge = data.fullName || data.FullName || '';
        extra = data.investmentRange || '';
        break;
      case BookmarkItemType.Developer:
        extraInfo = data.about || '';
        subline = data.city || '';
        badge = data.techStack?.[0] || '';
        extra = data.workingRate ? data.workingRate + ' ₸/мес' : '';
        break;
      case BookmarkItemType.Business:
        extraInfo = data.pitch || '';
        subline = data.industry || '';
        badge = null;
        extra = data.revenue && 'Выручка ' + data.revenue + ' ₸';
        break;
      default:
        break;
    }
    return (
      <div key={fav.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-gray-900">{data.projectName || data.name || data.fullName || data.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">{subline}</p>
            {extraInfo && <p className="text-sm text-gray-500 mt-2">{extraInfo}</p>}
            {extra && (
              <p className="text-sm font-medium text-gray-900 mt-2">{extra}</p>
            )}
          </div>
          <button
            onClick={() => removeFavorite(fav)}
            className="p-2 hover:bg-gray-100 rounded-lg ml-3"
            disabled={removing === fav.id}
          >
            <Bookmark className="w-5 h-5 fill-blue-600 text-blue-600" />
          </button>
        </div>
        <Button className="mt-4 w-full" size="sm">Подробнее</Button>
      </div>
    );
  };

  const projects = favorites.filter(i => i.type === BookmarkItemType.Startup);
  const investors = favorites.filter(i => i.type === BookmarkItemType.Investor);
  const developers = favorites.filter(i => i.type === BookmarkItemType.Developer);
  const businesses = favorites.filter(i => i.type === BookmarkItemType.Business);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('back')} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
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
          {loading ? <p className="text-center text-gray-500 py-16">Загрузка...</p> :
            (favorites.length === 0 ? (
              <p className="text-center text-gray-500 py-16">Пока ничего не сохранено</p>
            ) : (
              favorites.map(renderCard)
            ))}
        </TabsContent>
        <TabsContent value="projects" className="p-4 space-y-4">
          {loading ? <p className="text-center text-gray-500 py-8">Загрузка...</p> :
             (projects.length === 0 ? <p className="text-center text-gray-500 py-8">Нет сохранённых проектов</p> : projects.map(renderCard))}
        </TabsContent>
        <TabsContent value="investors" className="p-4 space-y-4">
          {loading ? <p className="text-center text-gray-500 py-8">Загрузка...</p> :
            (investors.length === 0 ? <p className="text-center text-gray-500 py-8">Нет сохранённых инвесторов</p> : investors.map(renderCard))}
        </TabsContent>
        <TabsContent value="other" className="p-4 space-y-4">
          {loading ? <p className="text-center text-gray-500 py-8">Загрузка...</p> :
            ((developers.length + businesses.length === 0)
            ? <p className="text-center text-gray-500 py-8">Ничего не сохранено</p>
            : [...developers, ...businesses].map(renderCard))}
        </TabsContent>
      </Tabs>
    </div>
  );
}