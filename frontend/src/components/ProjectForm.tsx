import { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ProjectFormProps {
  onBack: () => void;
  onSubmit: () => void;
}

const industries = ['Fintech', 'AI/ML', 'Marketplace', 'SaaS', 'EdTech', 'HealthTech', 'E-commerce'];
const stages = ['Идея', 'MVP', 'PMF', 'Рост', 'Скалирование'];
const models = ['B2B', 'B2C', 'B2G', 'B2B2C', 'Marketplace', 'SaaS'];
const technologies = ['AI/ML', 'LLM', 'Computer Vision', 'IoT', 'Blockchain/Web3', 'AR/VR', 'Big Data'];

export default function ProjectForm({ onBack, onSubmit }: ProjectFormProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    slogan: '',
    pitch: '',
    description: '',
    industries: [],
    stage: '',
    model: '',
    technologies: [],
    location: '',
    investment: '',
    minCheck: '',
    valuation: '',
    dealStructure: '',
    mrr: '',
    users: '',
    growth: '',
  });

  const addTag = (field: string, value: string) => {
    if (!formData[field].includes(value)) {
      setFormData({ ...formData, [field]: [...formData[field], value] });
    }
  };

  const removeTag = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((item: string) => item !== value),
    });
  };

  const handleSubmit = (isDraft: boolean) => {
    if (isDraft) {
      toast('Черновик сохранён');
    } else {
      toast('Проект опубликован');
      onSubmit();
    }
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
              <Input
                id="name"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slogan">Слоган</Label>
              <Input
                id="slogan"
                placeholder="Одно предложение о ценности"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pitch">Короткий питч</Label>
              <Textarea
                id="pitch"
                placeholder="до 140 символов"
                value={formData.pitch}
                onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                maxLength={140}
                rows={3}
              />
              <p className="text-xs text-gray-500">{formData.pitch.length}/140</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Расскажите подробнее о проблеме и решении"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Отрасль</Label>
              <Select onValueChange={(value) => addTag('industries', value)}>
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
              <div className="flex flex-wrap gap-2">
                {formData.industries.map((industry: string) => (
                  <Badge key={industry} variant="secondary" className="gap-1">
                    {industry}
                    <button onClick={() => removeTag('industries', industry)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Стадия</Label>
                <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
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

              <div className="space-y-2">
                <Label>Модель</Label>
                <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
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

            <div className="space-y-2">
              <Label>Технологии</Label>
              <Select onValueChange={(value) => addTag('technologies', value)}>
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
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="gap-1">
                    {tech}
                    <button onClick={() => removeTag('technologies', tech)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Локация</Label>
              <Input
                id="location"
                placeholder="Город, Страна"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="investment" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="investment">Ищу сумму</Label>
              <Input
                id="investment"
                placeholder="KZT / USD"
                value={formData.investment}
                onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Поддерживаем KZT и USD. Пример: 25 000 000 KZT или 50 000 USD.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minCheck">Минимальный чек</Label>
              <Input
                id="minCheck"
                placeholder="KZT / USD"
                value={formData.minCheck}
                onChange={(e) => setFormData({ ...formData, minCheck: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valuation">Оценка (pre-money)</Label>
              <Input
                id="valuation"
                placeholder="Необязательно"
                value={formData.valuation}
                onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Структура сделки</Label>
              <Select
                value={formData.dealStructure}
                onValueChange={(value) => setFormData({ ...formData, dealStructure: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
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
                <Input
                  id="mrr"
                  placeholder="KZT"
                  value={formData.mrr}
                  onChange={(e) => setFormData({ ...formData, mrr: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="users">Пользователи</Label>
                <Input
                  id="users"
                  placeholder="DAU/MAU"
                  value={formData.users}
                  onChange={(e) => setFormData({ ...formData, users: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="growth">Рост MoM</Label>
              <Input
                id="growth"
                placeholder="%"
                value={formData.growth}
                onChange={(e) => setFormData({ ...formData, growth: e.target.value })}
              />
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

              <div className="space-y-2">
                <Label htmlFor="materials">Другие материалы</Label>
                <Input
                  id="materials"
                  placeholder="Добавить ссылку"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Подсказка:</strong> Добавьте цифры тракшна — это повышает интерес инвесторов.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-6 sticky bottom-0 bg-white pb-4">
          <Button variant="outline" onClick={() => handleSubmit(true)} className="flex-1">
            Сохранить черновик
          </Button>
          <Button onClick={() => handleSubmit(false)} className="flex-1">
            Опубликовать
          </Button>
        </div>
      </div>
    </div>
  );
}
