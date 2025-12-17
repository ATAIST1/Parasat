import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Bookmark,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
  MessageCircle,
  Briefcase,
  Code,
  Building2,
  Target,
  PieChart,
} from 'lucide-react';

import { Avatar, AvatarFallback } from './ui/avatar';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';
import { bookmarkService, BookmarkItemType } from '../services/bookmarkService';
import { startupService } from '../services/startupService';
import { developerService } from '../services/developerService';
import { investorService } from '../services/investorService';
import { investmentRequestService } from '../services/investmentRequestService';
import { toast } from 'sonner';

interface FavoritesScreenProps {
  navigateTo: (screen: any) => void;
  onProjectClick: (projectId: string) => void;
}

type FavoriteCardType = {
  id: string;
  type: BookmarkItemType;
  data: any;
};

export default function FavoritesScreen({ navigateTo, onProjectClick  }: FavoritesScreenProps) {
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
                  data = await investmentRequestService.getById(bm.itemId);
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

  // const openDetails = (id: string) => onProjectClick(id);

  const renderCard = (fav: FavoriteCardType) => {
    const { type, data } = fav;

    if (type === BookmarkItemType.Startup) {
      const project = {
        id: fav.id,
        name: data.projectName || data.ProjectName || data.name || '',
        stage: Array.isArray(data.stage) ? data.stage[0] : (data.stage || data.Stage?.[0]),
        industry: data.industry || data.Industry || '',
        location: data.city || data.City || '',
        pitch: data.shortPitch || data.ShortPitch || data.pitch || '',
        mrr: data.revenue ?? data.Revenue ?? 0,
        users: data.dau ?? data.DAU ?? 0,
        team: data.teamMembers ?? data.TeamMembers ?? 0,
        tags: [...(Array.isArray(data.model) ? data.model : (data.Model || [])), (data.currency || data.Currency || '')].filter(Boolean),
        createdAt: data.createdAt || data.CreatedAt,
      };

      return (
          <ProjectCard
              key={fav.id}
              project={project}
              isSaved={true}
              onSave={() => removeFavorite(fav)}
              onClick={() => onProjectClick(project.id)}
          />
      );
    }

    if (type === BookmarkItemType.Investor) {
      const investor = {
        id: fav.id,
        name: data.fullName || data.FullName || data.name || '',
        title: data.about || data.About || '',
        location: data.city || data.City || '',
        bio: data.description || data.Description || '',
        checkSize: data.investmentRange || data.InvestmentRange || '',
        industries: data.industries || data.Industries || [],
        deals: data.dealCount ?? data.DealCount ?? 0,
        verified: true,
      };

      return (
          <InvestorCard
              key={fav.id}
              investor={investor}
              isSaved={true}
              onSave={() => removeFavorite(fav)}
          />
      );
    }

    if (type === BookmarkItemType.Developer) {
      const types = data.types || data.Types || [];
      const typeEnum = Array.isArray(types) && types.length ? types[0] : '';

      const developer = {
        id: fav.id,
        name: data.fullName || data.FullName || data.name || '',
        typeLabel: typeEnum || 'Тип не указан',
        location: data.city || data.City || '',
        description: data.about || data.About || '',
        stack: data.techStack || data.TechStack || [],
        projects: data.projectCount ?? data.ProjectCount ?? 0,
        experienceLabel: data.experience || data.Experience || '',
        rate: data.workingRate ? `${Number(data.workingRate).toLocaleString('ru-RU')} ₸/месяц` : '',
        available: data.isAvailable ?? data.IsAvailable ?? false,
        isRemote: data.isRemote ?? data.IsRemote ?? false,
        firstLink: data.firstLink || data.FirstLink || '',
        secondLink: data.secondLink || data.SecondLink || '',
        createdAt: data.createdAt || data.CreatedAt || '',
      };

      return (
          <DeveloperCard
              key={fav.id}
              developer={developer}
              isSaved={true}
              onSave={() => removeFavorite(fav)}
          />
      );
    }

    if (type === BookmarkItemType.Business) {
      const business = {
        id: fav.id,
        name: data.title || data.Title || 'Business',
        industry: data.industry || data.Industry || '',
        location: data.city || data.City || '',
        description: data.description || data.Description || '',
        revenue: String(data.revenueLastYear ?? data.RevenueLastYear ?? '0'),
        profit: String(data.profitLastYear ?? data.ProfitLastYear ?? '0'),
        employees: data.numberOfEmployees ?? data.NumberOfEmployees ?? 0,
        founded: data.yearOfFoundation ?? data.YearOfFoundation ?? '',
        investmentNeeded: String(data.investmentNeeded ?? data.InvestmentNeeded ?? '0'),
        investmentGoal: data.investmentPurpose || data.InvestmentPurpose || '',
        equity: `${data.equityOfferedPercent ?? data.EquityOfferedPercent ?? ''}%`,
        verified: true,
      };

      return (
          <BusinessCard
              key={fav.id}
              business={business}
              isSaved={true}
              onSave={() => removeFavorite(fav)}
              onClick={() => onProjectClick(business.id)}
          />
      );
    }

    return null;
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
const formatDateRu = (dateStr?: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

function ProjectCard({ project, isSaved, onSave, onClick }: any) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <h3 className="text-gray-900">{project.name}</h3>
            {project.createdAt && (
                <p className="text-xs text-gray-400">Добавлено {formatDate(project.createdAt)}</p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {project.stage && <Badge variant="secondary">{project.stage}</Badge>}
              {project.industry && <Badge variant="outline">{project.industry}</Badge>}
              {project.location && <Badge variant="outline">{project.location}</Badge>}
              {project.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>

          <button
              onClick={onSave}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-400'}`} />
          </button>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">{project.pitch}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" />
            <span>MRR {Number(project.mrr || 0).toLocaleString('ru-RU')} ₸</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>{Number(project.users || 0).toLocaleString('ru-RU')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{project.team || 0}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
              onClick={() => onClick?.(project.id)}
              className="flex-1"
              size="sm"
          >
            Подробнее
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5" onClick={() => toast('Интерес отправлен')}>
            <MessageCircle className="w-4 h-4" />
            Связаться
          </Button>
        </div>
      </div>
  );
}

function InvestorCard({ investor, isSaved, onSave }: any) {
  return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 flex-1">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {(investor.name || 'I').split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900">{investor.name}</h3>
                {investor.verified && <CheckCircle className="w-4 h-4 text-blue-600 fill-blue-600" />}
              </div>
              <p className="text-sm text-gray-600">{investor.title}</p>
              <Badge variant="outline" className="text-xs">{investor.location}</Badge>
            </div>
          </div>

          <button onClick={onSave} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-400'}`} />
          </button>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">{investor.bio}</p>

        <div className="flex flex-wrap gap-1.5">
          {(investor.industries || []).map((industry: string) => (
              <Badge key={industry} variant="secondary" className="text-xs">{industry}</Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" />
            <span>{investor.checkSize}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            <span>{investor.deals} сделок</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" size="sm" onClick={() => toast('Запрос на встречу отправлен')}>
            Встреча
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5" onClick={() => toast('Сообщение отправлено')}>
            <MessageCircle className="w-4 h-4" />
            Написать
          </Button>
        </div>
      </div>
  );
}

function DeveloperCard({ developer, isSaved, onSave }: any) {
  return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 flex-1">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Code className="w-7 h-7 text-white" />
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="text-gray-900">{developer.name}</h3>
              <p className="text-sm text-gray-600">{developer.typeLabel}</p>

              <div className="flex flex-wrap items-center gap-2">
                {developer.location && <Badge variant="outline" className="text-xs">{developer.location}</Badge>}

                {developer.available ? (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Доступны</Badge>
                ) : (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">Заняты</Badge>
                )}

                {developer.isRemote && (
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">Удалённо</Badge>
                )}
              </div>

              {developer.createdAt && (
                  <p className="text-xs text-gray-400">Добавлено {formatDateRu(developer.createdAt)}</p>
              )}
            </div>
          </div>

          <button onClick={onSave} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-400'}`} />
          </button>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">{developer.description}</p>

        {developer.stack?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {developer.stack.map((tech: string) => (
                  <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
              ))}
            </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            <span>{developer.projects || 0} проектов</span>
          </div>
          {developer.experienceLabel && (
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>{developer.experienceLabel}</span>
              </div>
          )}
          {developer.rate && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                <span>{developer.rate}</span>
              </div>
          )}
        </div>

        {(developer.firstLink || developer.secondLink) && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500">Больше можете узнать здесь:</p>
              <div className="flex flex-wrap gap-2 text-sm">
                {developer.firstLink && (
                    <button
                        onClick={() => window.open(developer.firstLink.startsWith('http') ? developer.firstLink : `https://${developer.firstLink}`, '_blank')}
                        className="underline text-blue-600 hover:text-blue-800"
                    >
                      {developer.firstLink.replace(/^https?:\/\//, '')}
                    </button>
                )}
                {developer.secondLink && (
                    <button
                        onClick={() => window.open(developer.secondLink.startsWith('http') ? developer.secondLink : `https://${developer.secondLink}`, '_blank')}
                        className="underline text-blue-600 hover:text-blue-800"
                    >
                      {developer.secondLink.replace(/^https?:\/\//, '')}
                    </button>
                )}
              </div>
            </div>
        )}

        <div className="flex gap-2">
          <Button className="flex-1" size="sm" onClick={() => toast('Запрос на коммерческое предложение отправлен')}>
            Запросить КП
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5" onClick={() => toast('Чат создан')}>
            <MessageCircle className="w-4 h-4" />
            Обсудить
          </Button>
        </div>
      </div>
  );
}

function BusinessCard({ business, isSaved, onSave, onClick }: any) {
  const formatNumber = (num: string) => {
    const cleanNum = String(num || '0').replace(/,/g, '');
    const n = parseInt(cleanNum);
    return Number.isFinite(n) ? n.toLocaleString('ru-RU') : '0';
  };

  return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 flex-1">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900">{business.name}</h3>
                {business.verified && <CheckCircle className="w-4 h-4 text-blue-600 fill-blue-600" />}
              </div>
              {business.founded && <p className="text-sm text-gray-600">Основан в {business.founded}</p>}
              <div className="flex items-center gap-2">
                {business.industry && <Badge variant="outline" className="text-xs">{business.industry}</Badge>}
                {business.location && <Badge variant="outline" className="text-xs">{business.location}</Badge>}
              </div>
            </div>
          </div>

          <button onClick={onSave} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-400'}`} />
          </button>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">{business.description}</p>

        <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Выручка</p>
            <p className="text-sm text-gray-900">{formatNumber(business.revenue)} ₸</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Прибыль</p>
            <p className="text-sm text-gray-900">{formatNumber(business.profit)} ₸</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Сотрудники</p>
            <p className="text-sm text-gray-900">{business.employees}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Цель инвестиций</p>
              <p className="text-sm text-gray-900">{business.investmentGoal}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-green-600">{formatNumber(business.investmentNeeded)} ₸</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <PieChart className="w-4 h-4 text-purple-600" />
              <span className="text-purple-600">{business.equity} доли</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
              onClick={() => onClick?.(business.id)}
              className="flex-1"
              size="sm"
          >
            Подробнее
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5" onClick={() => toast('Чат создан')}>
            <MessageCircle className="w-4 h-4" />
            Обсудить
          </Button>
        </div>
      </div>
  );
}
