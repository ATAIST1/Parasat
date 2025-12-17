import { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { startupService } from '../services/startupService';

interface ProjectFormProps {
  onBack: () => void;
  onSubmit: () => void;
}

const industries = [
  'Fintech',
  'AI/ML',
  'Marketplace',
  'SaaS',
  'EdTech',
  'HealthTech',
  'E-commerce',
];
const stages = ['Идея', 'MVP', 'PMF', 'Рост', 'Скалирование'];
const models = ['B2B', 'B2C', 'B2G', 'B2B2C', 'Marketplace', 'SaaS'];
const technologies = [
  'AI/ML',
  'LLM',
  'Computer Vision',
  'IoT',
  'Blockchain/Web3',
  'AR/VR',
  'Big Data',
];

const currencies = [
  { code: 'KZT', label: 'KZT — тенге' },
  { code: 'USD', label: 'USD — доллар США' },
  { code: 'RUB', label: 'RUB — российский рубль' },
  { code: 'UZS', label: 'UZS — узбекский сум' },
  { code: 'KGS', label: 'KGS — киргизский сом' },
  { code: 'CNY', label: 'CNY — китайский юань' },
  { code: 'KRW', label: 'KRW — южнокорейская вона' },
  { code: 'TRY', label: 'TRY — турецкая лира' },
  { code: 'EUR', label: 'EUR — евро' },
  { code: 'BYN', label: 'BYN — белорусский рубль' },
  { code: 'JPY', label: 'JPY — японская иена' },
  { code: 'GBP', label: 'GBP — британский фунт стерлингов' },
];

export default function ProjectForm({ onBack, onSubmit }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slogan: '',
    pitch: '',
    description: '',
    industries: [] as string[],
    teamMembers: '',
    evidence: '',
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
    externalLink: '',
    currency: '',
  });

  // ✅ хуки должны быть внутри компонента
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);
  const [financialModelFile, setFinancialModelFile] = useState<File | null>(null);

  const addTag = (field: 'industries' | 'technologies', value: string) => {
    if (!formData[field].includes(value)) {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], value] }));
    }
  };

  const removeTag = (field: 'industries' | 'technologies', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item: string) => item !== value),
    }));
  };

  const handlePublish = async () => {
    if (!formData.name || !formData.slogan || !formData.description) {
      toast.error('Название, слоган и описание — обязательны!');
      return;
    }

    setIsLoading(true);

    const city = formData.location.split(',')[0]?.trim() || 'Город не указан';
    const country =
      formData.location.split(',')[1]?.trim() || 'Страна не указана';

    const payload = {
      ownerId: '666f6f2d6261722d71757578', // TODO: заменить после аутентификации

      projectName: formData.name.trim(),
      title: formData.slogan.trim(),

      shortPitch:
        (formData.pitch || '').trim() ||
        (formData.slogan || '').trim() ||
        (formData.description || '').trim(),

      description: (formData.description || formData.pitch || 'Нет описания').trim(),

      industry: formData.industries[0] || 'Отрасль не указана',
      evidence: (formData.evidence || 'Не указано').trim(),

      technologies:
        formData.technologies.length > 0
          ? formData.technologies
          : ['Технологии не указаны'],

      city,
      country: formData.country || 'Страна не указана',

      currency: formData.currency || 'Валюта не указана',

      investmentRequested:
        Number(formData.investment.replace(/\D/g, '')) || 0,

      // stage: formData.stage ? [formData.stage] : ['Идея'],
      // model: formData.model ? [formData.model] : [''],

      revenue: Number(formData.mrr.replace(/\D/g, '')) || 0,
      dau: Number(formData.users.replace(/\D/g, '')) || 0,
      growthPercentage: Number(formData.growth) || 0,

      teamMembers: Number(formData.teamMembers.replace(/\D/g, '')) || 1,

      externalLinks: formData.externalLink
        ? [formData.externalLink.trim()]
        : [],
    };

    try {
      const formDataToSend = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== null && item !== undefined) {
              formDataToSend.append(key, String(item));
            }
          });
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      if (pitchDeckFile) {
        formDataToSend.append('pitchDeck', pitchDeckFile);
      }

      if (financialModelFile) {
        formDataToSend.append('financialModel', financialModelFile);
      }

      await startupService.create(formDataToSend);

      toast.success('Проект опубликован! Скоро будет в ленте');
      onSubmit();
    } catch (err: any) {
      console.error(err);
      toast.error(
        'Ошибка: ' +
          (err?.response?.data?.errors?.OwnerId?.[0] ||
            'Не удалось сохранить'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraft = () => {
    toast.success('Черновик сохранён локально');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-black-200 px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-gray-900">Создать проект</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto text-gray-900">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 text-gray-900">
            <TabsTrigger value="basic">Основное</TabsTrigger>
            <TabsTrigger value="investment">Инвестиции</TabsTrigger>
            <TabsTrigger value="metrics">Метрики</TabsTrigger>
          </TabsList>

          {/* ===== Основное ===== */}
          <TabsContent value="basic" className="space-y-6 mt-6 text-gray-900">
            <div className="space-y-2 text-gray-900">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2 text-gray-900">
              <Label htmlFor="slogan">Слоган</Label>
              <Input
                id="slogan"
                placeholder="Одно предложение о ценности"
                value={formData.slogan}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slogan: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2 text-gray-900">
              <Label htmlFor="pitch">Короткий питч</Label>
              <Textarea
                id="pitch"
                placeholder="до 140 символов"
                value={formData.pitch}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, pitch: e.target.value }))
                }
                maxLength={140}
                rows={3}
              />
            </div>

            <div className="space-y-2 text-gray-900">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Расскажите подробнее о проблеме и решении"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={5}
              />
            </div>

            <div className="space-y-2 text-gray-900">
              <Label>Отрасль</Label>
              <Select
                onValueChange={(value: string) =>
                  addTag('industries', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите отрасль" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.industries.map((industry) => (
                  <Badge
                    key={industry}
                    variant="secondary"
                    className="gap-1"
                  >
                    {industry}
                    <button
                      type="button"
                      onClick={() => removeTag('industries', industry)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-gray-900">
                <Label>Стадия</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value: any) =>
                    setFormData((prev) => ({ ...prev, stage: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-gray-900">
                <Label>Модель</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value: any) =>
                    setFormData((prev) => ({ ...prev, model: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 text-gray-900">
              <Label>Технологии</Label>
              <Select
                onValueChange={(value: any) =>
                  addTag('technologies', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите технологии" />
                </SelectTrigger>
                <SelectContent>
                  {technologies.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2 text-gray-900">
                {formData.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTag('technologies', tech)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-gray-900">
              <Label htmlFor="teamMembers">
                Сколько человек в команде?
              </Label>
              <Input
                id="teamMembers"
                placeholder="4"
                value={formData.teamMembers}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    teamMembers: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2 text-gray-900">
              <Label htmlFor="location">Город</Label>
              <Input
                id="location"
                placeholder="Астана/Алматы/Шымкент или другое"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2 text-gray-900">
              <Label htmlFor="country">Страна</Label>
              <Input
                id="country"
                placeholder="Казахстан/Узбекистан/Турция или другое"
                value={formData.country}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
              />
            </div>
          </TabsContent>

          {/* ===== Инвестиции ===== */}
          <TabsContent value="investment" className="space-y-6 mt-6">
            <div className="space-y-2 text-gray-900">
              <Label htmlFor="investment">Ищу сумму</Label>
              <Input
                id="investment"
                placeholder="25 000 000 KZT"
                value={formData.investment}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    investment: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-gray-900 ">
                Поддерживаем KZT и USD и другие валюты. Пример: 25 000 000 KZT
                или 50 000 USD.
              </p>
            </div>

            <div className="space-y-2 text-gray-900">
              <Label>Валюта</Label>
              <Select
                value={formData.currency}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, currency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите валюту (по умолчанию KZT)" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((cur) => (
                    <SelectItem key={cur.code} value={cur.code}>
                      {cur.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-gray-900">
              <Label>Структура сделки</Label>
              <Select
                value={formData.dealStructure}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({
                    ...prev,
                    dealStructure: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safe">SAFE</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="convertible">
                    Convertible Note
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-gray-900">
              <Label>Доказательства</Label>
              <Textarea
                placeholder="Любые доказательства спроса или заинтересованности клиентов, партнеров или инвесторов"
                rows={5}
                value={formData.evidence}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    evidence: e.target.value,
                  }))
                }
              />
            </div>
          </TabsContent>

          {/* ===== Метрики ===== */}
          <TabsContent value="metrics" className="space-y-6 mt-6 text-gray-900">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mrr">MRR</Label>
                <Input
                  id="mrr"
                  placeholder="KZT"
                  value={formData.mrr}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mrr: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 text-gray-900">
                <Label htmlFor="users">Пользователи</Label>
                <Input
                  id="users"
                  placeholder="DAU"
                  value={formData.users}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      users: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2 text-gray-900">
              <Label htmlFor="growth ">Рост MoM</Label>
              <Input
                id="growth"
                placeholder="%"
                value={formData.growth}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    growth: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-4 text-gray-900">
              <Label>Документы</Label>

{/* Питч-дек */}
<div className="border border-gray-900 rounded-lg p-4 space-y-3">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-900">Питч-дек (PDF)</p>
      <p className="text-xs text-gray-900">до 25 MB</p>
    </div>

    <div>
      <input
        id="pitchDeckInput"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setPitchDeckFile(file);
          // console.log('pitchDeck file:', file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          document.getElementById('pitchDeckInput')?.click()
        }
      >
        <Upload className="w-4 h-4 mr-2" />
        {pitchDeckFile ? pitchDeckFile.name : 'Загрузить'}
      </Button>
    </div>
  </div>
</div>


<div className="border border-gray-200 rounded-lg p-4 space-y-3">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm">Финмодель (XLSX)</p>
      <p className="text-xs text-gray-500">до 25 MB</p>
    </div>

    <div>
      <input
        id="financialModelInput"
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setFinancialModelFile(file);
          // console.log('financial model file:', file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          document.getElementById('financialModelInput')?.click()
        }
      >
        <Upload className="w-4 h-4 mr-2" />
        {financialModelFile ? financialModelFile.name : 'Загрузить'}
      </Button>
    </div>
  </div>
</div>

            </div>

            <div className="space-y-2">
              <Label htmlFor="materials">Другие материалы</Label>
              <Input
                id="materials"
                placeholder="Добавить ссылку"
                value={formData.externalLink}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    externalLink: e.target.value,
                  }))
                }
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Подсказка:</strong> Добавьте цифры тракшна — это
                повышает интерес инвесторов.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-white border-t shadow-lg z-50">
        <div className="px-4 py-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Отмена
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Публикация...' : 'Опубликовать'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
