import { ArrowLeft, Bookmark, MessageCircle, Share2, DollarSign, TrendingUp, Users, FileText, ExternalLink, Building2, Target, PieChart, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';

interface ProjectDetailScreenProps {
  projectId: string;
  onBack: () => void;
  navigateTo: (screen: any) => void;
}

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

const mockBusinesses: any = {
  'biz1': {
    id: 'biz1',
    name: 'Сеть кофеен CoffeeHub',
    slogan: 'Кофе премиального качества в каждом районе',
    industry: 'HoReCa',
    location: 'Алматы, Казахстан',
    founded: '2019',
    description: 'Сеть из 8 кофеен с устойчивой клиентской базой и узнаваемым брендом. Мы создали уникальную концепцию кофейни с местным колоритом, которая привлекает более 500 посетителей ежедневно в каждой локации. Планируем расширение в Астану с открытием 5 новых точек в премиальных локациях.',
    aboutPoints: [
      '8 действующих кофеен в центральных районах Алматы',
      'Собственная обжарочная с уникальными блендами',
      'Программа лояльности с 12,000+ активными участниками',
      'Средний чек вырос на 25% за последний год',
    ],
    revenue: '180,000,000',
    profit: '36,000,000',
    employees: '45',
    investmentNeeded: '50,000,000',
    investmentGoal: 'Открытие 5 новых точек в Астане',
    equity: '15%',
    verified: true,
    metrics: {
      revenue: '180,000,000',
      profit: '36,000,000',
      profitMargin: '20',
      employees: '45',
      locationsCount: '8',
    },
    team: [
      { name: 'Асель Нурланова', role: 'Основатель и CEO', linkedin: 'linkedin.com/in/asel' },
      { name: 'Даулет Касымов', role: 'COO', linkedin: 'linkedin.com/in/daulet' },
    ],
    highlights: [
      'Рост выручки на 35% год к году последние 3 года',
      'Net Promoter Score (NPS) - 68 баллов',
      'Окупаемость новой точки в среднем 14 месяцев',
      'Контракты с 5 бизнес-центрами на корнер-кофейни',
    ],
    documents: [
      { name: 'Инвестиционный меморандум', type: 'PDF', size: '4.2 MB' },
      { name: 'Финансовая отчетность 2024', type: 'PDF', size: '2.8 MB' },
      { name: 'Бизнес-план расширения', type: 'XLSX', size: '1.5 MB' },
    ],
  },
  'biz2': {
    id: 'biz2',
    name: 'ProLogistics KZ',
    slogan: 'Надежная логистика по всему СНГ',
    industry: 'Логистика',
    location: 'Астана, Казахстан',
    founded: '2017',
    description: 'Логистическая компания с собственным автопарком из 25 грузовых автомобилей. Работаем с крупнейшими ритейлерами СНГ, обеспечивая своевременную доставку грузов по всему региону. Планируем увеличить автопарк и внедрить современную IT-систему управления логистикой.',
    aboutPoints: [
      '25 собственных грузовых автомобилей различной тоннажности',
      'Контракты с 15+ крупными ритейлерами',
      'Покрытие всех регионов Казахстана и стран СНГ',
      '98% показатель своевременной доставки',
    ],
    revenue: '420,000,000',
    profit: '84,000,000',
    employees: '78',
    investmentNeeded: '120,000,000',
    investmentGoal: 'Покупка 15 новых грузовиков и IT-система',
    equity: '20%',
    verified: true,
    metrics: {
      revenue: '420,000,000',
      profit: '84,000,000',
      profitMargin: '20',
      employees: '78',
      fleetSize: '25',
    },
    team: [
      { name: 'Ержан Сабитов', role: 'Основатель и CEO', linkedin: 'linkedin.com/in/erzhan' },
      { name: 'Алмат Тулеуов', role: 'Директор по операциям', linkedin: 'linkedin.com/in/almat' },
    ],
    highlights: [
      'Рост выручки на 28% год к году',
      'Долгосрочные контракты на 3 год с топ ритейлерами',
      'Собственная сервисная станция для автопарка',
      'Лицензии на международные перевозки в 5 странах',
    ],
    documents: [
      { name: 'Инвестиционный меморандум', type: 'PDF', size: '5.1 MB' },
      { name: 'Финансовая отчетность', type: 'PDF', size: '3.2 MB' },
      { name: 'Контракты с клиентами (образцы)', type: 'PDF', size: '2.4 MB' },
    ],
  },
};

export default function ProjectDetailScreen({ projectId, onBack, navigateTo }: ProjectDetailScreenProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [shareMandate, setShareMandate] = useState(false);

  // Определяем тип контента - бизнес или стартап
  const isBusiness = projectId.startsWith('biz');
  const currentBusiness = isBusiness ? mockBusinesses[projectId] : null;
  const currentProject = isBusiness ? null : mockProject;

  const formatNumber = (num: string) => {
    // Убираем запятые перед парсингом
    const cleanNum = num.replace(/,/g, '');
    return parseInt(cleanNum).toLocaleString('ru-RU');
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

  if (isBusiness && currentBusiness) {
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
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`} />
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
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-gray-900">{currentBusiness.name}</h1>
                  {currentBusiness.verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">Верифицирован</Badge>
                  )}
                </div>
                <p className="text-gray-600">{currentBusiness.slogan}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{currentBusiness.industry}</Badge>
                  <Badge variant="outline">{currentBusiness.location}</Badge>
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    С {currentBusiness.founded}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-gray-900">О бизнесе</h2>
            <p className="text-gray-600 leading-relaxed">{currentBusiness.description}</p>
            <ul className="space-y-2">
              {currentBusiness.aboutPoints.map((point: string, index: number) => (
                <li key={index} className="flex gap-2 text-gray-700">
                  <span className="text-blue-600 flex-shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 space-y-3">
            <h3 className="text-gray-900">Инвестиционное предложение</h3>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <p className="text-gray-700">{currentBusiness.investmentGoal}</p>
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Запрашиваемая сумма</p>
                  <p className="text-gray-900">{formatNumber(currentBusiness.investmentNeeded)} ₸</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Предлагаемая доля</p>
                  <p className="text-gray-900">{currentBusiness.equity}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-gray-900">Финансовые показатели</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Годовая выручка</span>
                </div>
                <p className="text-gray-900">{formatNumber(currentBusiness.metrics.revenue)} ₸</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Прибыль</span>
                </div>
                <p className="text-gray-900">{formatNumber(currentBusiness.metrics.profit)} ₸</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <PieChart className="w-4 h-4" />
                  <span className="text-sm">Маржа прибыли</span>
                </div>
                <p className="text-gray-900">{currentBusiness.metrics.profitMargin}%</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Сотрудники</span>
                </div>
                <p className="text-gray-900">{currentBusiness.metrics.employees} человек</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-gray-900">Команда управления</h2>
            <div className="space-y-3">
              {currentBusiness.team.map((member: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
                      {member.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-gray-900">Ключевые достижения</h2>
            <ul className="space-y-2">
              {currentBusiness.highlights.map((item: string, index: number) => (
                <li key={index} className="flex gap-2 text-gray-700">
                  <span className="text-green-600 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-gray-900">Документы</h2>
            <div className="space-y-2">
              {currentBusiness.documents.map((doc: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Открыть
                  </Button>
                </div>
              ))}
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
              <DialogTitle>Отправить интерес {currentBusiness.name}</DialogTitle>
              <DialogDescription>
                Владельцы бизнеса получат уведомление и смогут связаться с вами
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
                  onCheckedChange={(checked) => setShareMandate(checked as boolean)}
                />
                <label htmlFor="share-mandate" className="text-sm text-gray-700">
                  Поделиться моим мандатом
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowInterestDialog(false)} className="flex-1">
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

  // Оригинальный код для стартапов
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
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`} />
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
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div className="space-y-3">
            <h1 className="text-gray-900">{mockProject.name}</h1>
            <p className="text-gray-600">{mockProject.slogan}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{mockProject.stage}</Badge>
              <Badge variant="outline">{mockProject.industry}</Badge>
              <Badge variant="outline">{mockProject.location}</Badge>
              <Badge variant="outline">{mockProject.model}</Badge>
              {mockProject.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-900">О проекте</h2>
          <p className="text-gray-600 leading-relaxed">{mockProject.description}</p>
          <ul className="space-y-2">
            {mockProject.aboutPoints.map((point, index) => (
              <li key={index} className="flex gap-2 text-gray-700">
                <span className="text-blue-600 flex-shrink-0">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {mockProject.investment && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-gray-900 mb-2">Запрос инвестиций</h3>
            <p className="text-gray-700">{mockProject.investment}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-900">Метрики</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">MRR</span>
              </div>
              <p className="text-gray-900">{mockProject.metrics.mrr} ₸</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Рост MoM</span>
              </div>
              <p className="text-gray-900">{mockProject.metrics.growth}%</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">Пользователи</span>
              </div>
              <p className="text-gray-900">{mockProject.metrics.users}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">Команда</span>
              </div>
              <p className="text-gray-900">{mockProject.metrics.team} человека</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-900">Команда</h2>
          <div className="space-y-3">
            {mockProject.team.map((member, index) => (
              <div key={index} className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-900">Доказательства / Тракшн</h2>
          <ul className="space-y-2">
            {mockProject.traction.map((item, index) => (
              <li key={index} className="flex gap-2 text-gray-700">
                <span className="text-green-600 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-900">Документы</h2>
          <div className="space-y-2">
            {mockProject.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Открыть
                </Button>
              </div>
            ))}
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
            <DialogTitle>Отправить интерес проекту {mockProject.name}</DialogTitle>
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
                onCheckedChange={(checked) => setShareMandate(checked as boolean)}
              />
              <label htmlFor="share-mandate" className="text-sm text-gray-700">
                Поделиться моим мандатом
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowInterestDialog(false)} className="flex-1">
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