import { ArrowLeft } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { investorService } from '../services/investorService';
import type { CreateInvestorProfileDto } from '../types/investor';

interface InvestorsFormProps {
  onBack: () => void;
  onSubmit: () => void;
}

const industryOptions = [
  'Fintech',
  'AI/ML',
  'B2B SaaS',
  'Marketplace',
  'HealthTech',
  'EdTech',
  'E-commerce',
  'Consumer',
];

const modelOptions = ['B2B', 'B2C', 'B2B2C', 'SaaS', 'Marketplace', 'VC', 'Angel'];

const currencyOptions = [
  { value: 'KZT', label: '₸ Казахстанский тенге' },
  { value: 'USD', label: '$ Доллар США' },
  { value: 'EUR', label: '€ Евро' },
  { value: 'GBP', label: '£ Фунт стерлингов' },
  { value: 'RUB', label: '₽ Российский рубль' },
  { value: 'CNY', label: '¥ Китайский юань' },
  { value: 'JPY', label: '¥ Японская иена' },
  { value: 'CHF', label: '₣ Швейцарский франк' },
  { value: 'AUD', label: '$ Австралийский доллар' },
  { value: 'CAD', label: '$ Канадский доллар' },
];

const rangesForSoft = (symbol: string) => [
  `${symbol}100 - ${symbol}500`,
  `${symbol}500 - ${symbol}1K`,
  `${symbol}1K - ${symbol}5K`,
  `${symbol}5K - ${symbol}25K`,
  `${symbol}25K - ${symbol}50K`,
  `${symbol}50K - ${symbol}100K`,
  `${symbol}100K+`,
];

const rangesForHard = (symbol: string) => [
  `${symbol}10K - ${symbol}100K`,
  `${symbol}100K - ${symbol}500K`,
  `${symbol}500K - ${symbol}1M`,
  `${symbol}1M - ${symbol}5M`,
  `${symbol}5M - ${symbol}10M`,
  `${symbol}10M - ${symbol}20M`,
  `${symbol}20M - ${symbol}50M`,
  `${symbol}50M - ${symbol}100M`,
  `${symbol}100M+`,
];

const currencyToSymbol: Record<string, string> = {
  KZT: '₸',
  RUB: '₽',
  CNY: '¥',
  JPY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CHF: '₣',
  AUD: '$',
  CAD: '$',
};

export default function InvestorsForm({ onBack, onSubmit }: InvestorsFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    about: '',
    description: '',
    city: '',
    currency: 'KZT',
    investmentRange: '',
    dealCount: '',
  });

  const [industries, setIndustries] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const investmentRanges = useMemo(() => {
    const symbol = currencyToSymbol[formData.currency] ?? '';
    const hardCurrencies = ['KZT', 'RUB', 'CNY', 'JPY'];
    if (hardCurrencies.includes(formData.currency)) {
      return rangesForHard(symbol);
    }
    return rangesForSoft(symbol);
  }, [formData.currency]);

  const toggleTag = (value: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((x) => x !== value));
    } else {
      setter([...current, value]);
    }
  };

  const parseIntSafe = (value: string): number => {
    const cleaned = value.replace(/[^\d]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.about ||
      !formData.description ||
      !formData.city ||
      !formData.currency ||
      !formData.investmentRange
    ) {
      toast('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (industries.length === 0) {
      toast('Выберите хотя бы одну индустрию');
      return;
    }

    if (models.length === 0) {
      toast('Выберите хотя бы одну модель');
      return;
    }

    const dealCountNum = parseIntSafe(formData.dealCount);

    const payload: CreateInvestorProfileDto = {
      fullName: formData.fullName,
      about: formData.about,
      description: formData.description,
      city: formData.city,
      industries,
      models,
      currency: formData.currency,
      investmentRange: formData.investmentRange,
      dealCount: dealCountNum,
    };

    try {
      setIsSubmitting(true);
      await investorService.create(payload);
      toast.success('Профиль инвестора создан');
      onSubmit();
    } catch (error: any) {
      console.error('Create investor profile error:', error?.response?.data || error);

      const errors = error?.response?.data?.errors as Record<string, string[]> | undefined;
      if (errors) {
        const msg = Object.entries(errors)
          .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
          .join('\n');
        toast.error(msg);
      } else {
        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.title ||
          'Не удалось создать профиль инвестора';
        toast.error(backendMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-gray-900 font-medium">Профиль инвестора</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 pb-32 space-y-6">
        {/* Основная информация */}
        <div className="bg-white rounded-2xl p-6 space-y-5 text-gray-900">
          <h3 className="text-lg font-medium text-gray-900">Основная информация</h3>

          <div className="space-y-2 text-gray-900">
            <Label htmlFor="fullName">ФИО инвестора *</Label>
            <Input
              id="fullName"
              placeholder="Например: Кайрат Сатыбалды"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="space-y-2 text-gray-900">
            <Label htmlFor="city">Город *</Label>
            <Input
              id="city"
              placeholder="Алматы"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div className="space-y-2 text-gray-900">
            <Label htmlFor="about">Кратко о себе / опыт *</Label>
            <Textarea
              id="about"
              placeholder="Серийный инвестор, основатель Parasat Business Club..."
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание стратегий инвестирования *</Label>
            <Textarea
              id="description"
              placeholder="Инвестирую в ранние стадии технологических стартапов СНГ. Портфолио: 15+ компаний..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>
        </div>

        {/* Индустрии */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Индустрии *</h3>
          <p className="text-sm text-gray-600">Выберите несколько направлений, в которые инвестор вкладывается.</p>

          <div className="flex flex-wrap gap-2">
            {industryOptions.map((item) => {
              const active = industries.includes(item);
              return (
                <Badge
                  key={item}
                  variant={active ? 'default' : 'secondary'}
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                    active ? '' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                  onClick={() => toggleTag(item, industries, setIndustries)}
                >
                  {item}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Модели */}
        <div className="bg-white rounded-2xl p-6 space-y-4 text-gray-900">
          <h3 className="text-lg font-medium text-gray-900">Модель стартапов *</h3>
          <p className="text-sm text-gray-600">Форматы бизнес-моделей, в которые инвестор заходит.</p>

          <div className="flex flex-wrap gap-2 text-blue-900">
            {modelOptions.map((item) => {
              const active = models.includes(item);
              return (
                <Badge
                  key={item}
                  variant={active ? 'default' : 'secondary'}
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                    active ? '' : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                  onClick={() => toggleTag(item, models, setModels)}
                >
                  {item}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Инвестиционные параметры */}
        <div className="bg-white rounded-2xl p-6 space-y-5 text-gray-900">
          <h3 className="text-lg font-medium text-gray-900">Инвестиционные параметры</h3>

          <div className="space-y-2">
            <Label>Валюта *</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => {
                setFormData({ ...formData, currency: value, investmentRange: '' });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Диапазон инвестиций *</Label>
            <Select
              value={formData.investmentRange}
              onValueChange={(value) => setFormData({ ...formData, investmentRange: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите диапазон" />
              </SelectTrigger>
              <SelectContent>
                {investmentRanges.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dealCount">Количество сделок *</Label>
            <Input
              id="dealCount"
              placeholder="Например: 15"
              value={formData.dealCount}
              onChange={(e) => setFormData({ ...formData, dealCount: e.target.value })}
            />
          </div>
        </div>

        {/* Кнопка */}
        <div className="bg-white border-t border-gray-200 p-5 shadow-2xl">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500" />

            <Button
              type="submit"
              className="relative w-full h-14 text-base font-medium bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg transition-all duration-300"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохраняем...' : 'Создать профиль инвестора'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
