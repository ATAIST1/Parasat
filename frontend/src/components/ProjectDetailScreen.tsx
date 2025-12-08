import { ArrowLeft, Bookmark, MessageCircle, Share2, DollarSign, TrendingUp, Users, FileText, ExternalLink, Building2, Target, PieChart, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useState, useEffect } from 'react';
// import { toast } from 'sonner@2.0.3';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { startupService } from '../services/startupService';

interface ProjectDetailScreenProps {
  projectId: string;
  onBack: () => void;
  navigateTo: (screen: any) => void;
}

/*
//
const mockProject = {
  id: '1',
  name: 'PayFlow',
  slogan: 'Платежи для малого бизнеса стали проще',
  stage: 'MVP',
  industry: 'Fintech',
  location: 'Алматы, Казахстан',
  model: 'B2B',
  technologies: ['AI/ML', 'API'],
  pitch: 'Упрощаем платежи для малого бизнеса в СНГ через единое API',
  description: 'PayFlow предоставляет малому бизнесу простой способ принимать платежи через единое API. Мы интегрируемся со всеми популярныи платежными системами в СНГ и предоставляем аналитику в реальном времени.',
  aboutPoints: [
    'Единое API для всех платежных систем СНГ',
    'Автоматическая сверка платежей',
    'Аналитика и отчетность в реальном времени',
    'Поддержка множественных валют',
  ],
  investment: '25,000,000 KZT за 10%',
  metrics: {
    mrr: '450,000',
    growth: '15',
    users: '1,200',
    team: '4',
  },
  team: [
    { name: 'Алексей Петров', role: 'CEO & Co-founder', linkedin: 'linkedin.com/in/alexey' },
    { name: 'Марина Сидорова', role: 'CTO & Co-founder', linkedin: 'linkedin.com/in/marina' },
  ],
  traction: [
    '5 платных клиентов (B2B)',
    'Партнерство с Kaspi и Halyk Bank',
    'Победитель Astana Hub Hackathon 2024',
  ],
  documents: [
    { name: 'Питч-дек', type: 'PDF', size: '2.3 MB' },
    { name: 'Финмодель', type: 'XLSX', size: '1.1 MB' },
  ],
};
*/

const mockBusinesses: any = {
  biz1: { /* ... */ },
  biz2: { /* ... */ },
};

export default function ProjectDetailScreen({ projectId, onBack, navigateTo }: ProjectDetailScreenProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [shareMandate, setShareMandate] = useState(false);

  const isBusiness = projectId.startsWith('biz');
  const currentBusiness = isBusiness ? mockBusinesses[projectId] : null;

  const [project, setProject] = useState<any | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(!isBusiness);

  useEffect(() => {
    if (isBusiness) return;

    const loadProject = async () => {
      try {
        const data = await startupService.getById(projectId);
        setProject(data);
      } catch (e) {
        console.error(e);
        toast('Не удалось загрузить проект');
      } finally {
        setIsLoadingProject(false);
      }
    };

    loadProject();
  }, [projectId, isBusiness]);

  const formatNumber = (num: any) => {
    if (num === null || num === undefined) return '0';
    const n = typeof num === 'number' ? num : parseInt(String(num).replace(/,/g, ''));
    if (Number.isNaN(n)) return '0';
    return n.toLocaleString('ru-RU');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast(isSaved ? 'Удалено из избранного' : 'Сохранено в избранное');
  };

  const handleSendInterest = () => {
    toast('Интерес отправлен');
    setShowInterestDialog(false);
    setInterestMessage('');
    setShareMandate(false);
  };

    const handleOpenPitchDeck = async () => {
    try {
      const { url } = await startupService.getPitchDeckUrl(projectId);
      if (!url) {
        toast('Питч-дек пока не загружен');
        return;
      }
      window.open(url, '_blank');
    } catch (e) {
      console.error(e);
      toast('Питч-дек пока не доступен');
    }
  };

  const handleOpenFinancialModel = async () => {
    try {
      const { url } = await startupService.getFinancialModelUrl(projectId);
      if (!url) {
        toast('Финмодель пока не загружена');
        return;
      }
      window.open(url, '_blank');
    } catch (e) {
      console.error(e);
      toast('Финмодель пока не доступна');
    }
  };


  if (isBusiness && currentBusiness) {
    return (
      <div className="min-h-screen bg-gray-50">
      </div>
    );
  }


  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Загрузка проекта…</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Проект не найден</p>
        <Button variant="outline" onClick={onBack}>
          Назад
        </Button>
      </div>
    );
  }

  const name = project.projectName || project.ProjectName;
  const slogan = project.title || project.Title || project.shortPitch || project.ShortPitch;
  const stage = Array.isArray(project.stage) ? project.stage[0] : project.Stage?.[0];
  const industry = project.industry || project.Industry;
  const city = project.city || project.City;
  const country = project.country || project.Country;
  const location = [city, country].filter(Boolean).join(', ');
  const model = Array.isArray(project.model) ? project.model[0] : project.Model?.[0];
  const technologies = project.technologies || project.Technologies || [];
  const description = project.description || project.Description;
  const investmentRequested = project.investmentRequested ?? project.InvestmentRequested;
  const currency = project.currency || project.Currency || 'KZT';
  const revenue = project.revenue ?? project.Revenue ?? 0;
  const growth = project.growthPercentage ?? project.GrowthPercentage ?? 0;
  const users = project.dau ?? project.DAU ?? 0;
  const teamMembers = project.teamMembers ?? project.TeamMembers ?? 0;
  const evidence = project.evidence || project.Evidence || '';
  const externalLinks = project.externalLinks || project.ExternalLinks || [];

  const evidencePoints =
    evidence && evidence.includes('\n')
      ? evidence.split('\n').filter((x: string) => x.trim().length > 0)
      : evidence
      ? [evidence]
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-600'
                }`}
              />
            </button>
            <button
              onClick={() => toast('Ссылка скопирована')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Основной блок */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div className="space-y-3">
            <h1 className="text-gray-900">{name}</h1>
            {slogan && <p className="text-gray-600">{slogan}</p>}
            <div className="flex flex-wrap gap-2">
              {stage && <Badge variant="secondary">{stage}</Badge>}
              {industry && <Badge variant="outline">{industry}</Badge>}
              {location && <Badge variant="outline">{location}</Badge>}
              {model && <Badge variant="outline">{model}</Badge>}
              {Array.isArray(technologies) &&
                technologies.map((tech: string) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {/* О проекте */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-900">О проекте</h2>
          {description && (
            <p className="text-gray-600 leading-relaxed">{description}</p>
          )}
        </div>

        {/* Запрос инвестиций */}
        {investmentRequested && investmentRequested > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-gray-900 mb-2">Запрос инвестиций</h3>
            <p className="text-gray-700">
              {formatNumber(investmentRequested)} {currency}
            </p>
          </div>
        )}

        {/* Метрики */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-900">Метрики</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">MRR</span>
              </div>
              <p className="text-gray-900">
                {formatNumber(revenue)} {currency}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Рост MoM</span>
              </div>
              <p className="text-gray-900">{growth}%</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">Пользователи (DAU)</span>
              </div>
              <p className="text-gray-900">
                {formatNumber(users)}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">Команда</span>
              </div>
              <p className="text-gray-900">{teamMembers} человек</p>
            </div>
          </div>
        </div>

        {/*
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-900">Команда</h2>
          ...
        </div>
        */}

        {/* Доказательства / Тракшн */}
        {evidencePoints.length > 0 && (
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-gray-900">Доказательства / Тракшн</h2>
            <ul className="space-y-2">
              {evidencePoints.map((item: string, index: number) => (
                <li key={index} className="flex gap-2 text-gray-700">
                  <span className="text-green-600 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Документы из S3 */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-900">Документы</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">Питч-дек</p>
                  <p className="text-xs text-gray-500">PDF, хранится в S3</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleOpenPitchDeck}>
                Открыть
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">Финмодель</p>
                  <p className="text-xs text-gray-500">XLSX, хранится в S3</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleOpenFinancialModel}>
                Открыть
              </Button>
            </div>
          </div>
        </div>

        </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-4 space-y-2">
        <Button
          onClick={() => setShowInterestDialog(true)}
          className="w-full"
          size="lg"
        >
          Отправить интерес
        </Button>
        <Button
          onClick={() => navigateTo('chat')}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Сообщение
        </Button>
      </div>

      <Dialog open={showInterestDialog} onOpenChange={setShowInterestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отправить интерес проекту {name}</DialogTitle>
            <DialogDescription>
              Команда проекта получит уведомление и сможет связаться с вами
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Коротко о вас и ожиданиях…"
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="share-mandate"
                checked={shareMandate}
                onCheckedChange={(checked) =>
                  setShareMandate(checked as boolean)
                }
              />
              <label
                htmlFor="share-mandate"
                className="text-sm text-gray-700"
              >
                Поделиться моим мандатом
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInterestDialog(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button onClick={handleSendInterest} className="flex-1">
              Отправить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
