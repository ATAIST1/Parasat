import { ArrowLeft, Currency, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { toast } from 'sonner';
import { developerService } from '../services/developerService';


const DEV_TYPE_OPTIONS = [
  { value: 'FullStack', label: 'Full-Stack разработка' },
  { value: 'Frontend', label: 'Frontend разработка' },
  { value: 'Backend', label: 'Backend разработка' },
  { value: 'Mobile', label: 'Мобильная разработка' },
  { value: 'AIML', label: 'AI/ML разработка' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'UIUX', label: 'UI/UX дизайн' },
  { value: 'QA', label: 'QA/Тестирование' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'None', label: 'Нет опыта' },
  { value: 'Junior', label: '1–2 года' },
  { value: 'Middle', label: '3–4 года' },
  { value: 'Senior', label: '5+ лет' },
  { value: 'Lead', label: '10+ лет' },
];

const CURRENCIES = [
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

const HARDCODED_USER_ID = 'replace-with-real-user-id';

interface DeveloperFormProps {
  onBack: () => void;
  onSubmit: () => void;
}

export default function DeveloperForm({ onBack, onSubmit }: DeveloperFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    description: '',
    experience: '',
    rate: '',
    available: 'true',
    currency: '',
    firstLink: '',
    secondLink: '',
    isRemote: 'false',
  });

  const [techStack, setTechStack] = useState<string[]>([]);
  const [currentTech, setCurrentTech] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTech = () => {
    if (currentTech.trim() && !techStack.includes(currentTech.trim())) {
      setTechStack([...techStack, currentTech.trim()]);
      setCurrentTech('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !formData.location || !formData.description) {
      toast('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (techStack.length === 0) {
      toast('Добавьте хотя бы одну технологию в стек');
      return;
    }

    if (!formData.experience) {
      toast('Пожалуйста, выберите опыт работы');
      return;
    }

    if (!formData.currency) {
      toast('Пожалуйста, выберите валюту');
      return;
    }

    const workingRate = formData.rate
      ? Number(formData.rate.replace(/\D/g, '')) || 0
      : 0;

    const payload = {
      userId: HARDCODED_USER_ID,
      fullName: formData.name,
      workingRate,
      currency: formData.currency,
      firstLink: formData.firstLink?.trim() || null,
      secondLink: formData.secondLink?.trim() || null,
      types: formData.type ? [formData.type] : [],
      city: formData.location,
      isRemote: formData.isRemote === 'true',
      techStack,
      experience: formData.experience,
      about: formData.description,
      isAvailable: formData.available === 'true',
      projectCount: formData.projectCount
    };

    try {
      setIsSubmitting(true);
      await developerService.create(payload);
      toast('Профиль разработчика создан');
      onSubmit();
    } catch (error) {
      console.error(error);
      toast('Ошибка при создании профиля разработчика');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10 text-gray-900">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-gray-900">Профиль разработчика</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 pb-24 space-y-6">
        <div className="bg-white rounded-2xl p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Название команды / Имя *</Label>
            <Input
              id="name"
              placeholder="Например: TechForge Team"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Тип разработки *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {DEV_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Локация *</Label>
            <Input
              id="location"
              placeholder="Например: Астана, Пекин, Seoul"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание *</Label>
            <Textarea
              id="description"
              placeholder="Опишите ваш опыт, специализацию и подход к работе..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-5">
          <h3 className="text-gray-900">Технологический стек</h3>

          <div className="space-y-2">
            <Label htmlFor="tech">Добавить технологию *</Label>
            <div className="flex gap-2">
              <Input
                id="tech"
                placeholder="Например: React, Node.js"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTech} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="pl-3 pr-1 py-1.5">
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-5">
          <h3 className="text-gray-900">Дополнительная информация</h3>

          <div className="space-y-2">
            <Label htmlFor="experience">Опыт работы</Label>
            <Select
              value={formData.experience}
              onValueChange={(value) => setFormData({ ...formData, experience: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите опыт" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">Ставка</Label>
            <Input
              id="rate"
              type="text"
              placeholder="Например: 800,000 в месяц"
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="currency">Валюта</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData({ ...formData, currency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          
          <div className="space-y-2">
            <Label htmlFor="projectCount">Количество завершенных проектов</Label>
            <Input
              id="projectCount"
              type="text"
              placeholder="Например: 5"
              value={formData.projectCount}
              onChange={(e) => setFormData({ ...formData, projectCount: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="available">Доступность</Label>
            <Select
              value={formData.available}
              onValueChange={(value) => setFormData({ ...formData, available: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите доступность" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Доступен для проектов</SelectItem>
                <SelectItem value="false">Занят</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isRemote">Готовность работать удаленно</Label>
            <Select
              value={formData.isRemote}
              onValueChange={(value) => setFormData({ ...formData, isRemote: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите формат" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Готов работать удалённо</SelectItem>
                <SelectItem value="false">Только офлайн</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstLink">Первая ссылка</Label>
            <Input
              id="firstLink"
              type="text"
              placeholder="Например: LinkedIn, GitHub, сайт"
              value={formData.firstLink}
              onChange={(e) =>
                setFormData({ ...formData, firstLink: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondLink">Вторая ссылка</Label>
            <Input
              id="secondLink"
              type="text"
              placeholder="Например: Email, Telegram, портфолио"
              value={formData.secondLink}
              onChange={(e) =>
                setFormData({ ...formData, secondLink: e.target.value })
              }
            />
          </div>
        </div>

<div className="fixed inset-x-0 bottom-0 bg-white border-t shadow-lg z-50">
  <div className="px-4 py-4">
    <div className="max-w-2xl mx-auto flex gap-3">
      <Button
        variant="outline"
        onClick={onBack}
        className="flex-1"
      >
        Отмена
      </Button>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex-1"
      >
        {isSubmitting ? 'Публикация...' : 'Опубликовать'}
      </Button>
    </div>
  </div>
</div>

      </form>
    </div>
  );
}
