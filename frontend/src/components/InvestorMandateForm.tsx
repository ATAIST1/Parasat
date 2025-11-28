import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner@2.0.3';

interface InvestorMandateFormProps {
  onBack: () => void;
  onSubmit: () => void;
}

const stages = ['Идея', 'MVP', 'PMF', 'Рост', 'Скалирование'];
const industries = ['Fintech', 'AI/ML', 'EdTech', 'HealthTech', 'AgriTech', 'E-commerce'];
const geographies = ['Казахстан', 'Центральная Азия', 'СНГ', 'Глобально'];

export default function InvestorMandateForm({ onBack, onSubmit }: InvestorMandateFormProps) {
  const [formData, setFormData] = useState<any>({
    ticketMin: '',
    ticketMax: '',
    stages: [],
    industries: [],
    geographies: [],
    participationType: '',
    availability: 'public',
  });

  const toggleItem = (field: string, value: string) => {
    const current = formData[field] || [];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter((item: string) => item !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const handleSubmit = () => {
    toast('Мандат опубликован');
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-gray-900">Создать мандат</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <Label>Диапазон тикета</Label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Минимум"
              value={formData.ticketMin}
              onChange={(e) => setFormData({ ...formData, ticketMin: e.target.value })}
            />
            <Input
              placeholder="Максимум"
              value={formData.ticketMax}
              onChange={(e) => setFormData({ ...formData, ticketMax: e.target.value })}
            />
          </div>
          <p className="text-xs text-gray-500">
            Поддерживаем KZT и USD. Пример: 25 000 000 KZT или 50 000 USD.
          </p>
        </div>

        <div className="space-y-3">
          <Label>Стадии интереса</Label>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <Badge
                key={stage}
                variant={formData.stages?.includes(stage) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleItem('stages', stage)}
              >
                {stage}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Отрасли интереса</Label>
          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <Badge
                key={industry}
                variant={formData.industries?.includes(industry) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleItem('industries', industry)}
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>География</Label>
          <div className="flex flex-wrap gap-2">
            {geographies.map((geo) => (
              <Badge
                key={geo}
                variant={formData.geographies?.includes(geo) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleItem('geographies', geo)}
              >
                {geo}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Тип участия</Label>
          <Select
            value={formData.participationType}
            onValueChange={(value) => setFormData({ ...formData, participationType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Лид</SelectItem>
              <SelectItem value="co-investor">Со-инвестор</SelectItem>
              <SelectItem value="angel">Ангел</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Доступность</Label>
          <RadioGroup
            value={formData.availability}
            onValueChange={(value) => setFormData({ ...formData, availability: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="cursor-pointer">Публичный</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="request" id="request" />
              <Label htmlFor="request" className="cursor-pointer">По запросу</Label>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={handleSubmit} className="w-full" size="lg">
          Опубликовать мандат
        </Button>
      </div>
    </div>
  );
}
