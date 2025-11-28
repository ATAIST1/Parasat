import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

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
  });

  const [techStack, setTechStack] = useState<string[]>([]);
  const [currentTech, setCurrentTech] = useState('');

  const handleAddTech = () => {
    if (currentTech.trim() && !techStack.includes(currentTech.trim())) {
      setTechStack([...techStack, currentTech.trim()]);
      setCurrentTech('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.location || !formData.description) {
      toast('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (techStack.length === 0) {
      toast('Добавьте хотя бы одну технологию в стек');
      return;
    }

    toast('Профиль разработчика создан');
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
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
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-Stack разработка">Full-Stack разработка</SelectItem>
                <SelectItem value="Frontend разработка">Frontend разработка</SelectItem>
                <SelectItem value="Backend разработка">Backend разработка</SelectItem>
                <SelectItem value="Мобильная разработка">Мобильная разработка</SelectItem>
                <SelectItem value="AI/ML разработка">AI/ML разработка</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="UI/UX дизайн">UI/UX дизайн</SelectItem>
                <SelectItem value="QA/Тестирование">QA/Тестирование</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Локация *</Label>
            <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите город" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Алматы">Алматы</SelectItem>
                <SelectItem value="Астана">Астана</SelectItem>
                <SelectItem value="Шымкент">Шымкент</SelectItem>
                <SelectItem value="Караганда">Караганда</SelectItem>
                <SelectItem value="Актобе">Актобе</SelectItem>
                <SelectItem value="Удаленно">Удаленно</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание *</Label>
            <Textarea
              id="description"
              placeholder="Опишите ваш опыт, специализацию и подход к работе..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-5">
          <h3 className="text-gray-900">Технологический стек</h3>
          
          <div className="space-y-2">
            <Label htmlFor="tech">Добавить технологию</Label>
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
            <Select value={formData.experience} onValueChange={(value) => setFormData({ ...formData, experience: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите опыт" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2 года">1-2 года</SelectItem>
                <SelectItem value="3-4 года">3-4 года</SelectItem>
                <SelectItem value="5+ лет">5+ лет</SelectItem>
                <SelectItem value="10+ лет">10+ лет</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">Ставка (₸/месяц)</Label>
            <Input
              id="rate"
              type="text"
              placeholder="Например: 800,000"
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="available">Доступность</Label>
            <Select value={formData.available} onValueChange={(value) => setFormData({ ...formData, available: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите доступность" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Доступен для проектов</SelectItem>
                <SelectItem value="false">Занят</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-4">
          <Button type="submit" className="w-full" size="lg">
            Опубликовать профиль
          </Button>
        </div>
      </form>
    </div>
  );
}
