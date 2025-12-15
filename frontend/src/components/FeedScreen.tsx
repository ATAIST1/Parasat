import React from "react";
import { useState, useEffect } from 'react';
import { Bookmark, MessageCircle, TrendingUp, Users, DollarSign, Briefcase, Star, Code, CheckCircle, Search, Filter, Building2, Target, PieChart } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { toast } from 'sonner@2.0.3';
import { toast } from 'sonner';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';
import { startupService } from '../services/startupService';
import { developerService } from '../services/developerService';
import { investorService } from '../services/investorService';
import { investmentRequestService } from '../services/investmentRequestService';
import { bookmarkService, BookmarkItemType } from '../services/bookmarkService';
import type { InvestorProfileResponseDto } from '../types/investor';
import { startConversationWithStartup } from '../services/chatService';


interface FeedScreenProps {
  onProjectClick: (projectId: string) => void;
  navigateTo: (screen: Screen) => void;
  openChat: (conversationId: string, title: string) => void;
}


/*
// ⛔ Моковые стартапы — оставляю как пример, но теперь не используем
const mockProjects = [
  {
    id: '1',
    name: 'PayFlow',
    stage: 'MVP',
    industry: 'Fintech',
    location: 'Алматы',
    pitch: 'Упрощаем платежи для малого бизнеса в СНГ через единое API',
    mrr: '450,000',
    users: '1,200',
    team: '4',
    tags: ['B2B', 'SaaS'],
  },
  ...
];
*/

/*const mockInvestors = [
  {
    id: 'inv1',
    name: 'Кайрат Сатыбалды',
    title: 'Серийный инвестор, основатель Parasat Business Club',
    location: 'Алматы',
    bio: 'Инвестирую в ранние стадии технологических стартапов СНГ. Портфолио: 15+ компаний, 3 выхода.',
    checkSize: '$50K - $500K',
    industries: ['Fintech', 'AI/ML', 'B2B SaaS'],
    deals: '15',
    exits: '3',
    verified: true,
  },
  {
    id: 'inv2',
    name: 'Алия Нурбекова',
    title: 'Managing Partner, Central Asia Ventures',
    location: 'Астана',
    bio: 'Фокус на EdTech и HealthTech проектах с доказанной бизнес-моделью и растущей выручкой.',
    checkSize: '$100K - $1M',
    industries: ['EdTech', 'HealthTech', 'Enterprise'],
    deals: '22',
    exits: '5',
    verified: true,
  },
  {
    id: 'inv3',
    name: 'Тимур Жумабеков',
    title: 'Angel Investor, ex-CEO KASE',
    location: 'Алматы',
    bio: 'Поддерживаю основателей с опытом в финансах и блокчейне. Активный ментор.',
    checkSize: '$25K - $250K',
    industries: ['Fintech', 'Blockchain', 'RegTech'],
    deals: '8',
    exits: '1',
    verified: true,
  },
];
*/



/*
const mockDevelopers = [
  {
    id: 'dev1',
    name: 'TechForge Team',
    type: 'Full-Stack разработка',
    location: 'Алматы',
    description: 'Команда из 5 разработчиков с опытом создания MVP для стартапов за 4-8 недель.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    projects: '12',
    experience: '5+ лет',
    rate: '800,000 ₸/месяц',
    available: true,
  },
  {
    id: 'dev2',
    name: 'AI Solutions KZ',
    type: 'AI/ML разработка',
    location: 'Астана',
    description: 'Специализируемся на интеграции AI и машинного обучения в существующие продукты.',
    stack: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
    projects: '8',
    experience: '3+ года',
    rate: '1,200,000 ₸/месяц',
    available: true,
  },
  {
    id: 'dev3',
    name: 'Mobile Masters',
    type: 'Мобильная разработка',
    location: 'Шымкент',
    description: 'Разрабатываем нативные и кросс-платформенные мобильные приложения под iOS и Android.',
    stack: ['React Native', 'Swift', 'Kotlin', 'Firebase'],
    projects: '15',
    experience: '4+ года',
    rate: '950,000 ₸/месяц',
    available: false,
  },
];

const mockBusinesses = [
  {
    id: 'biz1',
    name: 'Сеть кофеен CoffeeHub',
    industry: 'HoReCa',
    location: 'Алматы',
    description: 'Сеть из 8 кофеен с устойчивой клиентской базой. Планируем открыть 5 новых точек в Астане и расширить линейку продуктов.',
    revenue: '180,000,000',
    profit: '36,000,000',
    employees: '45',
    founded: '2019',
    investmentNeeded: '50,000,000',
    investmentGoal: 'Открытие 5 новых точек в Астане',
    equity: '15%',
    verified: true,
  },
  {
    id: 'biz2',
    name: 'ProLogistics KZ',
    industry: 'Логистика',
    location: 'Астана',
    description: 'Логистическая компания с собственным автопарком из 25 грузовых автомобилей. Работаем с крупными ритейлерами СНГ.',
    revenue: '420,000,000',
    profit: '84,000,000',
    employees: '78',
    founded: '2017',
    investmentNeeded: '120,000,000',
    investmentGoal: 'Покупка 15 новых грузовиков и IT-система',
    equity: '20%',
    verified: true,
  },
  {
    id: 'biz3',
    name: 'FitFactory',
    industry: 'Фитнес',
    location: 'Алматы',
    description: 'Сеть премиум фитнес-клубов с 3 действующими локациями и 2,500 активными членами.',
    revenue: '95,000,000',
    profit: '19,000,000',
    employees: '32',
    founded: '2020',
    investmentNeeded: '80,000,000',
    investmentGoal: 'Открытие флагманского клуба 1500м²',
    equity: '25%',
    verified: true,
  },
  {
    id: 'biz4',
    name: 'EcoPackaging Solutions',
    industry: 'Производство',
    location: 'Шымкент',
    description: 'Производство экологичной упаковки из переработанных материалов. Контракты с крупными FMCG компаниями.',
    revenue: '220,000,000',
    profit: '55,000,000',
    employees: '65',
    founded: '2018',
    investmentNeeded: '150,000,000',
    investmentGoal: 'Запуск второй производственной линии',
    equity: '18%',
    verified: false,
  },
  {
    id: 'biz5',
    name: 'Digital Marketing Pro',
    industry: 'Маркетинг',
    location: 'Алматы',
    description: 'Digital-агентство с 50+ постоянными клиентами. Специализируемся на performance-маркетинге и продвижении e-commerce.',
    revenue: '72,000,000',
    profit: '21,600,000',
    employees: '18',
    founded: '2021',
    investmentNeeded: '25,000,000',
    investmentGoal: 'Расширение команды и запуск AI-инструментов',
    equity: '12%',
    verified: true,
  },
];
*/

const DEV_TYPE_LABELS: Record<string, string> = {
  FullStack: 'Full-Stack разработка',
  Frontend: 'Frontend разработка',
  Backend: 'Backend разработка',
  Mobile: 'Мобильная разработка',
  AIML: 'AI/ML разработка',
  DevOps: 'DevOps',
  UIUX: 'UI/UX дизайн',
  QA: 'QA/Тестирование',
};

const EXPERIENCE_LABELS: Record<string, string> = {
  None: 'Нет опыта',
  Junior: '1–2 года',
  Middle: '3–4 года',
  Senior: '5+ лет',
  Lead: '10+ лет',
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  KZT: '₸',
  USD: '$',
  RUB: '₽',
  EUR: '€',
  UZS: 'сум',
  KGS: 'сом',
  CNY: '¥',
  KRW: '₩',
  TRY: '₺',
  BYN: 'Br',
  JPY: '¥',
  GBP: '£',
};

const formatRate = (workingRate?: number, currencyCode?: string) => {
  if (!workingRate) return '';
  const amount = Number(workingRate).toLocaleString('ru-RU');
  const symbol = currencyCode && CURRENCY_SYMBOLS[currencyCode];
  if (symbol) return `${amount} ${symbol}/месяц`;
  if (currencyCode) return `${amount} ${currencyCode}/месяц`;
  return `${amount} /месяц`;
};

const formatDateRu = (dateStr?: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};


export default function FeedScreen({ onProjectClick, navigateTo, openChat }: FeedScreenProps) {
  const [savedBookmarks, setSavedBookmarks] = useState<Map<string, BookmarkItemType>>(new Map());
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  // Стартапы с бэка
  const [startups, setStartups] = useState<any[]>([]);
  const [isLoadingStartups, setIsLoadingStartups] = useState<boolean>(true);
  
  // Разработчики с бэка
const [developers, setDevelopers] = useState<any[]>([]);
const [isLoadingDevelopers, setIsLoadingDevelopers] = useState<boolean>(true);

// Инвесторы с бэка
const [investors, setInvestors] = useState<any[]>([]);
const [isLoadingInvestors, setIsLoadingInvestors] = useState<boolean>(true);


const handleOpenStartupChat = async (project: any) => {
  try {
    const conversationId = await startConversationWithStartup(project.id);
    openChat(conversationId, project.name);
  } catch (e) {
    console.error('Не удалось открыть чат', e);
    toast('Не удалось открыть чат');
  }
};


const [businesses, setBusinesses] = useState<any[]>([]);
const [isLoadingBusinesses, setIsLoadingBusinesses] = useState<boolean>(true);

  // Search and filter states
  const [startupSearch, setStartupSearch] = useState('');
  const [startupStage, setStartupStage] = useState('all');
  const [startupIndustry, setStartupIndustry] = useState('all');

  const [investorSearch, setInvestorSearch] = useState('');
  const [investorIndustry, setInvestorIndustry] = useState('all');

  const [developerSearch, setDeveloperSearch] = useState('');
  const [developerType, setDeveloperType] = useState('all');
  const [developerAvailability, setDeveloperAvailability] = useState('all');

  const [businessSearch, setBusinessSearch] = useState('');
  const [businessIndustry, setBusinessIndustry] = useState('all');
  const [businessRevenue, setBusinessRevenue] = useState('all');

  useEffect(() => {
    setLoadingBookmarks(true);
    bookmarkService.getAll()
      .then((bookmarks) => {
        const m = new Map<string, BookmarkItemType>();
        bookmarks.forEach(b => m.set(b.itemId, b.itemType));
        setSavedBookmarks(m);
      })
      .catch(() => toast('Не удалось получить избранное'))
      .finally(() => setLoadingBookmarks(false));

    const loadStartups = async () => {
      try {
        const data = await startupService.getAll();

        const mapped = (data || []).map((s: any) => {
          const id = s.id || s._id || s.Id || s._Id;
          const createdAt = s.createdAt || s.CreatedAt;
          return {
            raw: s,
            id,
            name: s.projectName || s.ProjectName,
            stage: Array.isArray(s.stage) ? s.stage[0] : s.Stage?.[0],
            industry: s.industry || s.Industry,
            location: s.city || s.City,
            pitch: s.shortPitch || s.ShortPitch || '',
            mrr: s.revenue ?? s.Revenue ?? 0,
            users: s.dau ?? s.DAU ?? 0,
            team: s.teamMembers ?? s.TeamMembers ?? 0,
            tags: [
              ...(Array.isArray(s.model) ? s.model : s.Model || []),
              s.currency || s.Currency || '',
            ].filter(Boolean),
            createdAt,
          };
        });

        mapped.sort((a: any, b: any) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setStartups(mapped);
      } catch (e) {
        console.error(e);
        toast('Не удалось загрузить стартапы');
      } finally {
        setIsLoadingStartups(false);
      }
    };


      const loadDevelopers = async () => {
    try {
      const data = await developerService.getAll();

      const mapped = (data || []).map((d: any) => {
        const id = d.id || d._id || d.Id || d._Id;
        const types = d.types || d.Types || [];
        const typeEnum = Array.isArray(types) && types.length ? types[0] : '';
        const currency = d.currency || d.Currency;
        const workingRate = d.workingRate ?? d.WorkingRate;

        return {
          raw: d,
          id,
          name: d.fullName || d.FullName || '',
          typeEnum,
          typeLabel: DEV_TYPE_LABELS[typeEnum] || typeEnum || 'Тип не указан',
          location: d.city || d.City || '',
          description: d.about || d.About || '',
          stack: d.techStack || d.TechStack || [],
          projects: d.projectCount ?? d.ProjectCount ?? 0,
          experienceEnum: d.experience || d.Experience || '',
          experienceLabel:
            EXPERIENCE_LABELS[d.experience || d.Experience] ||
            d.experience ||
            d.Experience ||
            '',
          rate: formatRate(workingRate, currency),
          workingRate,
          currency,
          available: d.isAvailable ?? d.IsAvailable ?? false,
          isRemote: d.isRemote ?? d.IsRemote ?? false,
          firstLink: d.firstLink || d.FirstLink || '',
          secondLink: d.secondLink || d.SecondLink || '',
          createdAt: d.createdAt || d.CreatedAt || '',
        };
      });

      setDevelopers(mapped);
 } catch (e: any) {
      console.error('Ошибка загрузки разработчиков:', e);
      console.log('Ответ бэка:', e?.response?.status, e?.response?.data);
      toast('Не удалось загрузить разработчиков');
    } finally {
      setIsLoadingDevelopers(false);
    }
  };

    const loadInvestors = async () => {
    try {
      const data = await investorService.getAll();

      const mapped = (data || []).map((i: InvestorProfileResponseDto) => ({
        raw: i,
        id: i.id,
        name: i.fullName,
        title: i.about,
        location: i.city,
        bio: i.description,
        checkSize: i.investmentRange,
        industries: i.industries || [],
        deals: i.dealCount ?? 0,
        verified: true, // пока просто показываем галочку всегда
      }));

      setInvestors(mapped);
    } catch (e: any) {
      console.error('Ошибка загрузки инвесторов:', e);
      console.log('Ответ бэка:', e?.response?.status, e?.response?.data);
      toast('Не удалось загрузить инвесторов');
    } finally {
      setIsLoadingInvestors(false);
    }
  };

    const loadBusinesses = async () => {
      try {
        const data = await investmentRequestService.getAll();

        const mapped = (data || []).map((r: any) => {
          const id = r.id || r._id || r.Id;

          return {
            id,
            name: r.title || r.Title || 'Без названия',
            industry: r.industry || r.Industry || '',
            location: r.city || r.City || '',
            description: r.description || r.Description || '',
            revenue: String(r.revenueLastYear ?? r.RevenueLastYear ?? '0'),
            profit: String(r.profitLastYear ?? r.ProfitLastYear ?? '0'),
            employees: r.numberOfEmployees ?? r.NumberOfEmployees ?? 0,
            founded: r.yearOfFoundation ?? r.YearOfFoundation ?? '',
            investmentNeeded: String(r.investmentNeeded ?? r.InvestmentNeeded ?? '0'),
            investmentGoal: r.investmentPurpose || r.InvestmentPurpose || '',
            equity: `${r.equityOfferedPercent ?? r.EquityOfferedPercent ?? ''}%`,
            verified: true, // если на бэке появится флаг — подставишь
            createdAt: r.createdAt || r.CreatedAt,
          };
        });

        mapped.sort((a: any, b: any) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setBusinesses(mapped);
      } catch (e: any) {
        console.error('Ошибка загрузки business/investment requests:', e);
        toast('Не удалось загрузить бизнесы');
      } finally {
        setIsLoadingBusinesses(false);
      }
    };

    const loadAllData = async () => {
      try {
        await Promise.all([
          loadStartups(),
          loadDevelopers(),
          loadInvestors(),
          loadBusinesses()
        ]);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    loadAllData();
  }, []);

  const handleBookmarkToggle = async (itemId: string, itemType: BookmarkItemType) => {
    if (loadingBookmarks) return;
    const key = itemId;
    const isSaved = savedBookmarks.has(key) && savedBookmarks.get(key) === itemType;
    setLoadingBookmarks(true);
    try {
      if (isSaved) {
        await bookmarkService.remove(itemId, itemType);
      } else {
        await bookmarkService.add({ itemId, itemType });
      }
      setSavedBookmarks(prev => {
        const m = new Map(prev);
        if (isSaved) m.delete(key);
        else m.set(key, itemType);
        return m;
      });
      toast(isSaved ? 'Удалено из избранного' : 'Добавлено в избранное');
    } catch (e) {
      toast('Произошла ошибка. Попробуйте ещё раз');
    } finally {
      setLoadingBookmarks(false);
    }
  };

  // Filter functions
  const filteredProjects = startups.filter((project) => {
    const query = startupSearch.toLowerCase();
    const matchesSearch =
      !query ||
      project.name?.toLowerCase().includes(query) ||
      project.industry?.toLowerCase().includes(query) ||
      project.location?.toLowerCase().includes(query) ||
      project.pitch?.toLowerCase().includes(query) ||
      project.tags?.some((tag: string) => tag.toLowerCase().includes(query));

    const matchesStage =
      startupStage === 'all' || project.stage === startupStage;

    const matchesIndustry =
      startupIndustry === 'all' || project.industry === startupIndustry;

    return matchesSearch && matchesStage && matchesIndustry;
  });

const filteredInvestors = investors.filter((investor) => {
  const query = investorSearch.toLowerCase();

  const matchesSearch =
    !query ||
    investor.name.toLowerCase().includes(query) ||
    investor.title.toLowerCase().includes(query) ||
    investor.location.toLowerCase().includes(query) ||
    investor.bio.toLowerCase().includes(query) ||
    investor.industries.some((industry: string) =>
      industry.toLowerCase().includes(query)
    );

  const matchesIndustry =
    investorIndustry === 'all' ||
    investor.industries.includes(investorIndustry);

  return matchesSearch && matchesIndustry;
});


const filteredDevelopers = developers.filter((developer) => {
  const query = developerSearch.toLowerCase();

  const matchesSearch =
    !query ||
    developer.name.toLowerCase().includes(query) ||
    developer.typeLabel.toLowerCase().includes(query) ||
    developer.location.toLowerCase().includes(query) ||
    developer.description.toLowerCase().includes(query) ||
    developer.stack.some((tech: string) => tech.toLowerCase().includes(query));

  const matchesType =
    developerType === 'all' ||
    developer.typeEnum === developerType;

  const matchesAvailability =
    developerAvailability === 'all' ||
    (developerAvailability === 'available' && developer.available) ||
    (developerAvailability === 'busy' && !developer.available);

  return matchesSearch && matchesType && matchesAvailability;
});


  const filteredBusinesses = businesses.filter((business) => {
    const query = businessSearch.toLowerCase();

    const matchesSearch =
        !query ||
        business.name.toLowerCase().includes(query) ||
        business.industry.toLowerCase().includes(query) ||
        business.location.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query) ||
        (business.investmentGoal || '').toLowerCase().includes(query);

    const matchesIndustry =
        businessIndustry === 'all' || business.industry === businessIndustry;

    const revenueNum = parseInt(String(business.revenue || '0').replace(/[^\d]/g, '') || '0', 10);

    const matchesRevenue =
        businessRevenue === 'all' ||
        (businessRevenue === 'small' && revenueNum < 100000000) ||
        (businessRevenue === 'medium' && revenueNum >= 100000000 && revenueNum < 300000000) ||
        (businessRevenue === 'large' && revenueNum >= 300000000);

    return matchesSearch && matchesIndustry && matchesRevenue;
  });


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg p-1.5">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-gray-900">Лента</h1>
        </div>
      </div>

      <Tabs defaultValue="for-you" className="w-full">
        <div className="bg-white border-b border-gray-200 px-4">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="for-you">Стартапы</TabsTrigger>
            <TabsTrigger value="trends">Инвесторы</TabsTrigger>
            <TabsTrigger value="new">Разработчики</TabsTrigger>
            <TabsTrigger value="businesses">Бизнесы</TabsTrigger>
          </TabsList>
        </div>

        {/* СТАРТАПЫ */}
        <TabsContent value="for-you" className="mt-0">
          <div className="bg-white border-b border-gray-200 px-4 py-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск стартапов..."
                value={startupSearch}
                onChange={(e) => setStartupSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={startupStage} onValueChange={setStartupStage}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Стадия" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все стадии</SelectItem>
                  <SelectItem value="Идея">Идея</SelectItem>
                  <SelectItem value="MVP">MVP</SelectItem>
                  <SelectItem value="PMF">PMF</SelectItem>
                  <SelectItem value="Рост">Рост</SelectItem>
                  <SelectItem value="Скалирование">Скалирование</SelectItem>
                </SelectContent>
              </Select>
              <Select value={startupIndustry} onValueChange={setStartupIndustry}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Индустрия" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все индустрии</SelectItem>
                  <SelectItem value="Fintech">Fintech</SelectItem>
                  <SelectItem value="SaaS">SaaS</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="EdTech">EdTech</SelectItem>
                  <SelectItem value="HealthTech">HealthTech</SelectItem>
                  <SelectItem value="Marketplace">Marketplace</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {isLoadingStartups ? (
              <div className="text-center py-12 text-gray-500">
                Загрузка стартапов…
              </div>
            ) : filteredProjects.length > 0 ? (
filteredProjects.map((project: any) => (
  <ProjectCard
    key={project.id}
    project={project}
    isSaved={
      savedBookmarks.has(project.id) &&
      savedBookmarks.get(project.id) === BookmarkItemType.Startup
    }
    onSave={() => handleBookmarkToggle(project.id, BookmarkItemType.Startup)}
    onClick={onProjectClick}
    onContact={() => handleOpenStartupChat(project)}
  />
))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Ничего не найдено</p>
                <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ИНВЕСТОРЫ */}
        <TabsContent value="trends" className="mt-0">
          <div className="bg-white border-b border-gray-200 px-4 py-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск инвесторов..."
                value={investorSearch}
                onChange={(e) => setInvestorSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={investorIndustry} onValueChange={setInvestorIndustry}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Индустрия" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все индустрии</SelectItem>
                  <SelectItem value="Fintech">Fintech</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="B2B SaaS">B2B SaaS</SelectItem>
                  <SelectItem value="EdTech">EdTech</SelectItem>
                  <SelectItem value="HealthTech">HealthTech</SelectItem>
                  <SelectItem value="Blockchain">Blockchain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
            <div className="p-4 space-y-4">
    {isLoadingInvestors ? (
      <div className="text-center py-12 text-gray-500">
        Загрузка инвесторов…
      </div>
    ) : filteredInvestors.length > 0 ? (
      filteredInvestors.map((investor) => (
        <InvestorCard
          key={investor.id}
          investor={investor}
          isSaved={savedBookmarks.has(investor.id) && savedBookmarks.get(investor.id) === BookmarkItemType.Investor}
          onSave={() => handleBookmarkToggle(investor.id, BookmarkItemType.Investor)}
        />
      ))
    ) : (
      <div className="text-center py-12 text-gray-500">
        <p>Ничего не найдено</p>
        <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
      </div>
    )}
  </div>

        </TabsContent>

        {/* РАЗРАБОТЧИКИ */}
        <TabsContent value="new" className="mt-0">
          <div className="bg-white border-b border-gray-200 px-4 py-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск разработчиков..."
                value={developerSearch}
                onChange={(e) => setDeveloperSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={developerType} onValueChange={setDeveloperType}>
  <SelectTrigger className="flex-1">
    <SelectValue placeholder="Тип" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Все типы</SelectItem>
    <SelectItem value="FullStack">Full-Stack</SelectItem>
    <SelectItem value="AIML">AI/ML</SelectItem>
    <SelectItem value="Mobile">Мобильная</SelectItem>
    <SelectItem value="Frontend">Frontend</SelectItem>
    <SelectItem value="Backend">Backend</SelectItem>
  </SelectContent>
</Select>

              <Select value={developerAvailability} onValueChange={setDeveloperAvailability}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Доступность" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="available">Доступны</SelectItem>
                  <SelectItem value="busy">Заняты</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {filteredDevelopers.length > 0 ? (
              filteredDevelopers.map((developer) => (
                <DeveloperCard
                  key={developer.id}
                  developer={developer}
                  isSaved={savedBookmarks.has(developer.id) && savedBookmarks.get(developer.id) === BookmarkItemType.Developer}
                  onSave={() => handleBookmarkToggle(developer.id, BookmarkItemType.Developer)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Ничего не найдено</p>
                <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* БИЗНЕСЫ */}
        <TabsContent value="businesses" className="mt-0">
          <div className="bg-white border-b border-gray-200 px-4 py-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск бизнесов..."
                value={businessSearch}
                onChange={(e) => setBusinessSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={businessIndustry} onValueChange={setBusinessIndustry}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Индустрия" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все индустрии</SelectItem>
                  <SelectItem value="HoReCa">HoReCa</SelectItem>
                  <SelectItem value="Логистика">Логистика</SelectItem>
                  <SelectItem value="Фитнес">Фитнес</SelectItem>
                  <SelectItem value="Производство">Производство</SelectItem>
                  <SelectItem value="Маркетинг">Маркетинг</SelectItem>
                </SelectContent>
              </Select>
              <Select value={businessRevenue} onValueChange={setBusinessRevenue}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Выручка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Любая</SelectItem>
                  <SelectItem value="small">До 100М ₸</SelectItem>
                  <SelectItem value="medium">100-300М ₸</SelectItem>
                  <SelectItem value="large">От 300М ₸</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {isLoadingBusinesses ? (
                <div className="text-center py-12 text-gray-500">Загрузка бизнесов…</div>
            ) : filteredBusinesses.length > 0 ? (
                filteredBusinesses.map((business) => (
                    <BusinessCard
                        key={business.id}
                        business={business}
                        isSaved={savedBookmarks.has(business.id) && savedBookmarks.get(business.id) === BookmarkItemType.Business}
                        onSave={() => handleBookmarkToggle(business.id, BookmarkItemType.Business)}
                        onClick={onProjectClick}
                    />
                ))
            ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Ничего не найдено</p>
                  <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
                </div>
            )}

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectCard({ project, isSaved, onSave, onClick, onContact }: any) {

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <h3 className="text-gray-900">{project.name}</h3>
          {project.createdAt && (
            <p className="text-xs text-gray-400">
              Добавлено {formatDate(project.createdAt)}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {project.stage && <Badge variant="secondary">{project.stage}</Badge>}
            {project.industry && <Badge variant="outline">{project.industry}</Badge>}
            {project.location && <Badge variant="outline">{project.location}</Badge>}
            {project.tags?.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <button
          onClick={() => onSave(project.id)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <Bookmark
            className={`w-5 h-5 ${
              isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">{project.pitch}</p>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4" />
          <span>
            MRR {Number(project.mrr || 0).toLocaleString('ru-RU')} ₸
          </span>
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
          onClick={() => onClick(project.id)}
          className="flex-1"
          size="sm"
        >
          Подробнее
        </Button>
<Button
  variant="outline"
  size="sm"
  className="flex items-center gap-1.5"
  onClick={onContact}
>
  <MessageCircle className="w-4 h-4" />
  Связаться
</Button>

      </div>
    </div>
  );
}

// InvestorCard, DeveloperCard, BusinessCard — твои, я их не трогал (кроме импорта toast сверху)
function InvestorCard({ investor, isSaved, onSave }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 flex-1">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {investor.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-gray-900">{investor.name}</h3>
              {investor.verified && (
                <CheckCircle className="w-4 h-4 text-blue-600 fill-blue-600" />
              )}
            </div>
            <p className="text-sm text-gray-600">{investor.title}</p>
            <Badge variant="outline" className="text-xs">
              {investor.location}
            </Badge>
          </div>
        </div>
        <button
          onClick={() => onSave(investor.id)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <Bookmark
            className={`w-5 h-5 ${
              isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">{investor.bio}</p>

      <div className="flex flex-wrap gap-1.5">
        {investor.industries.map((industry: string) => (
          <Badge key={industry} variant="secondary" className="text-xs">
            {industry}
          </Badge>
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
        <Button
          className="flex-1"
          size="sm"
          onClick={() => toast('Запрос на встречу отправлен')}
        >
          Встреча
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
          onClick={() => toast('Сообщение отправлено')}
        >
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
          {/* зелёная картинка как на скрине */}
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Code className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-gray-900">{developer.name}</h3>
            <p className="text-sm text-gray-600">{developer.typeLabel}</p>

            <div className="flex flex-wrap items-center gap-2">
              {developer.location && (
                <Badge variant="outline" className="text-xs">
                  {developer.location}
                </Badge>
              )}

              {developer.available ? (
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-700"
                >
                  Доступны
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-600"
                >
                  Заняты
                </Badge>
              )}

              {developer.isRemote && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-50 text-blue-700"
                >
                  Удалённо
                </Badge>
              )}
            </div>

            {developer.createdAt && (
              <p className="text-xs text-gray-400">
                Добавлено {formatDateRu(developer.createdAt)}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => onSave(developer.id)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <Bookmark
            className={`w-5 h-5 ${
              isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">
        {developer.description}
      </p>

      {/* стек технологий */}
      {developer.stack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {developer.stack.map((tech: string) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      )}

      {/* проекты / опыт / ставка */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-4 h-4" />
          <span>
            {developer.projects || 0} проектов
          </span>
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
          onClick={() =>
            window.open(
              developer.firstLink.startsWith('http')
                ? developer.firstLink
                : `https://${developer.firstLink}`,
              '_blank'
            )
          }
          className="underline text-blue-600 hover:text-blue-800"
        >
          {developer.firstLink.replace(/^https?:\/\//, '')}
        </button>
      )}

      {developer.secondLink && (
        <button
          onClick={() =>
            window.open(
              developer.secondLink.startsWith('http')
                ? developer.secondLink
                : `https://${developer.secondLink}`,
              '_blank'
            )
          }
          className="underline text-blue-600 hover:text-blue-800"
        >
          {developer.secondLink.replace(/^https?:\/\//, '')}
        </button>
      )}
    </div>
  </div>
)}


      <div className="flex gap-2">
        <Button
          className="flex-1"
          size="sm"
          onClick={() => toast('Запрос на коммерческое предложение отправлен')}
        >
          Запросить КП
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
          onClick={() => toast('Чат создан')}
        >
          <MessageCircle className="w-4 h-4" />
          Обсудить
        </Button>
      </div>
    </div>
  );
}


function BusinessCard({ business, isSaved, onSave, onClick }: any) {
  const formatNumber = (num: string) => {
    const cleanNum = num.replace(/,/g, '');
    return parseInt(cleanNum).toLocaleString('ru-RU');
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
              {business.verified && (
                <CheckCircle className="w-4 h-4 text-blue-600 fill-blue-600" />
              )}
            </div>
            <p className="text-sm text-gray-600">Основан в {business.founded}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {business.industry}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {business.location}
              </Badge>
            </div>
          </div>
        </div>
        <button
          onClick={() => onSave(business.id)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <Bookmark
            className={`w-5 h-5 ${
              isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">
        {business.description}
      </p>

      <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Выручка</p>
          <p className="text-sm text-gray-900">
            {formatNumber(business.revenue)} ₸
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Прибыль</p>
          <p className="text-sm text-gray-900">
            {formatNumber(business.profit)} ₸
          </p>
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
            <span className="text-green-600">
              {formatNumber(business.investmentNeeded)} ₸
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <PieChart className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600">
              {business.equity} доли
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onClick(business.id)}
          className="flex-1"
          size="sm"
        >
          Подробнее
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
          onClick={() => toast('Чат создан')}
        >
          <MessageCircle className="w-4 h-4" />
          Обсудить
        </Button>
      </div>
    </div>
  );
}
