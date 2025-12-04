// frontend/src/components/ProjectForm.tsx
import { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { startupService } from '../services/startupService';

interface ProjectFormProps {
  onBack: () => void;
  onSubmit: () => void;
}

const industries = ['Fintech', 'AI/ML', 'Marketplace', 'SaaS', 'EdTech', 'HealthTech', 'E-commerce'];
const stages = ['Идея', 'MVP', 'PMF', 'Рост', 'Скалирование'];
const models = ['B2B', 'B2C', 'B2G', 'B2B2C', 'Marketplace', 'SaaS'];
const technologies = ['AI/ML', 'LLM', 'Computer Vision', 'IoT', 'Blockchain/Web3', 'AR/VR', 'Big Data'];

export default function ProjectForm({ onBack, onSubmit }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slogan: '',
    pitch: '',
    description: '',
    industries: [] as string[],
    stage: '',
    model: '',
    technologies: [] as string[],
    location: '',
    country: '',
    investment: '',
    minCheck: '',
    valuation: '',
    dealStructure: '',
    mrr: '',
    users: '',
    growth: '',
  });

  const addTag = (field: 'industries' | 'technologies', value: string) => {
    if (!formData[field].includes(value)) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }));
    }
  };

  const removeTag = (field: 'industries' | 'technologies', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((item: string) => item !== value),
    }));
  };

  const handlePublish = async () => {
    if (!formData.name || !formData.slogan) {
      toast.error('Название и слоган — обязательны!');
      return;
    }

    setIsLoading(true);

    const city = formData.location.split(',')[0]?.trim() || 'Astana';

    const payload = {
      ProjectName: formData.name.trim(),
      Title: formData.slogan.trim(),
      Description: (formData.description || formData.pitch || 'Нет описания').trim(),
      Industry: formData.industries[0] || 'IT',
      SubIndustry: formData.industries[1] || formData.industries[0] || 'Software',
      Technologies: formData.technologies.length > 0 ? formData.technologies : ['Не указано'],
      City: city,
      Country: formData.country,
      Currency: formData.investment.toLowerCase().includes('usd') ? 'USD' : 'KZT',
      InvestmentRequested: Number(formData.investment.replace(/\D/g, '')) || 0,
      SpendPlan: ['Marketing', 'Development', 'Sales'],
      Revenue: Number(formData.mrr.replace(/\D/g, '')) || 0,
      DAU: Number(formData.users.split('/')[0]?.replace(/\D/g, '')) || 0,
      MAU: Number(formData.users.split('/')[1]?.replace(/\D/g, '')) || 0,
      GrowthPercentage: Number(formData.growth) || 0,
      PitchDeckUrl: '',
      FinancialModelUrl: '',
      ExternalLinks: [],
      Status: 'published',
      OwnerId: '666f6f2d6261722d71757578',
    };

    try {
      await startupService.create(payload);
      toast.success('Проект опубликован! Скоро будет в ленте');
      onSubmit();
    } catch (err: any) {
      console.error(err);
      toast.error('Ошибка: ' + (err.response?.data?.errors?.OwnerId?.[0] || 'Не удалось сохранить'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraft = () => {
    toast.success('Черновик сохранён локально');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-gray-900">Создать проект</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Основное</TabsTrigger>
            <TabsTrigger value="investment">Инвестиции</TabsTrigger>
            <TabsTrigger value="metrics">Метрики</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" placeholder="Project Name" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slogan">Слоган</Label>
              <Input id="slogan" placeholder="Одно предложение о ценности" value={formData.slogan} onChange={e => setFormData(prev => ({ ...prev, slogan: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pitch">Короткий питч</Label>
              <Textarea id="pitch" placeholder="до 140 символов" value={formData.pitch} onChange={e => setFormData(prev => ({ ...prev, pitch: e.target.value }))} maxLength={140} rows={3} />
              <p className="text-xs text-gray-500">{formData.pitch.length}/140</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea id="description" placeholder="Расскажите подробнее о проблеме и решении" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={5} />
            </div>

            <div className="space-y-2">
              <Label>Отрасль</Label>
              <Select onValueChange={(value: string) => addTag('industries', value)}>
                <SelectTrigger><SelectValue placeholder="Выберите отрасль" /></SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.industries.map((industry) => (
                  <Badge key={industry} variant="secondary" className="gap-1">
                    {industry}
                    <button onClick={() => removeTag('industries', industry)}><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Стадия</Label>
                <Select value={formData.stage} onValueChange={(value: any) => setFormData(prev => ({ ...prev, stage: value }))}>
                  <SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Модель</Label>
                <Select value={formData.model} onValueChange={(value: any) => setFormData(prev => ({ ...prev, model: value }))}>
                  <SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                  <SelectContent>
                    {models.map((model) => <SelectItem key={model} value={model}>{model}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Технологии</Label>
              <Select onValueChange={(value: any) => addTag('technologies', value)}>
                <SelectTrigger><SelectValue placeholder="Выберите технологии" /></SelectTrigger>
                <SelectContent>
                  {technologies.map((tech) => <SelectItem key={tech} value={tech}>{tech}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="gap-1">
                    {tech}
                    <button onClick={() => removeTag('technologies', tech)}><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Город</Label>
              <Input id="location" placeholder="Астана/Алматы/Шымкент или другое" value={formData.location} onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Страна</Label>
              <Input id="location" placeholder="Казахстан/Узбекистан/Турция или другое" value={formData.country} onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))} />
            </div>
          </TabsContent>

          <TabsContent value="investment" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="investment">Ищу сумму</Label>
              <Input id="investment" placeholder="25 000 000 KZT" value={formData.investment} onChange={e => setFormData(prev => ({ ...prev, investment: e.target.value }))} />
              <p className="text-xs text-gray-500">Поддерживаем KZT и USD. Пример: 25 000 000 KZT или 50 000 USD.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minCheck">Минимальный чек</Label>
              <Input id="minCheck" placeholder="KZT / USD" value={formData.minCheck} onChange={e => setFormData(prev => ({ ...prev, minCheck: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valuation">Оценка (pre-money)</Label>
              <Input id="valuation" placeholder="Необязательно" value={formData.valuation} onChange={e => setFormData(prev => ({ ...prev, valuation: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label>Структура сделки</Label>
              <Select value={formData.dealStructure} onValueChange={(value: any) => setFormData(prev => ({ ...prev, dealStructure: value }))}>
                <SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="safe">SAFE</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="convertible">Convertible Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Использование средств</Label>
              <Textarea
                placeholder="• Маркетинг&#10;• Разработка&#10;• Продажи&#10;• Оборотка"
                rows={5}
              />
            </div>
          </TabsContent>

          

          <TabsContent value="metrics" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mrr">MRR</Label>
                <Input id="mrr" placeholder="KZT" value={formData.mrr} onChange={e => setFormData(prev => ({ ...prev, mrr: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="users">Пользователи</Label>
                <Input id="users" placeholder="DAU/MAU" value={formData.users} onChange={e => setFormData(prev => ({ ...prev, users: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="growth">Рост MoM</Label>
              <Input id="growth" placeholder="%" value={formData.growth} onChange={e => setFormData(prev => ({ ...prev, growth: e.target.value }))} />
            </div>

            <div className="space-y-4">
              <Label>Документы</Label>
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Питч-дек (PDF)</p>
                    <p className="text-xs text-gray-500">до 25 MB</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Загрузить
                  </Button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Финмодель (XLSX)</p>
                    <p className="text-xs text-gray-500">до 25 MB</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Загрузить
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="materials">Другие материалы</Label>
                <Input
                  id="materials"
                  placeholder="Добавить ссылку"
                />
              </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Подсказка:</strong> Добавьте цифры тракшна — это повышает интерес инвесторов.
              </p>
            </div>
          </TabsContent>
                </Tabs>

      </div> {/* ← ЗАКРЫВАЕМ <div className="px-4 py-6 max-w-2xl mx-auto"> */}

      {/* КНОПКИ — ВНЕ КОНТЕЙНЕРА, ВСЕГДА ВИДНЫ */}
      <div className="fixed inset-x-0 bottom-0 bg-white border-t shadow-lg z-50">
        <div className="px-4 py-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Отмена
            </Button>
            <Button onClick={handlePublish} disabled={isLoading} className="flex-1">
              {isLoading ? 'Публикация...' : 'Опубликовать'}
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}