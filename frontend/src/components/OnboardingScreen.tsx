import { useState } from 'react';
import { UserRole } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface OnboardingScreenProps {
  role: UserRole;
  onComplete: (data: any) => void;
}

const stages = ['Идея', 'MVP', 'PMF', 'Рост', 'Скалирование'];
const industries = [
  'Fintech', 'AI/ML', 'Marketplace', 'SaaS', 'EdTech', 'HealthTech',
  'E-commerce', 'Logistics', 'PropTech', 'GameDev', 'Cybersecurity',
  'AgriTech', 'Energy', 'GovTech', 'Travel', 'Media', 'HRTech'
];

export default function OnboardingScreen({ role, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    projectName: '',
    stage: '',
    investment: '',
    industries: [],
    pitch: '',
    ticketRange: '',
    interestedStages: [],
    geography: '',
  });

  const totalSteps = role === 'startup' ? 5 : 4;

  const addIndustry = (industry: string) => {
    if (!formData.industries.includes(industry)) {
      setFormData({ ...formData, industries: [...formData.industries, industry] });
    }
  };

  const removeIndustry = (industry: string) => {
    setFormData({
      ...formData,
      industries: formData.industries.filter((i: string) => i !== industry),
    });
  };

  const toggleStage = (stage: string) => {
    const stages = formData.interestedStages || [];
    if (stages.includes(stage)) {
      setFormData({
        ...formData,
        interestedStages: stages.filter((s: string) => s !== stage),
      });
    } else {
      setFormData({
        ...formData,
        interestedStages: [...stages, stage],
      });
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const renderStartupStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="projectName">Название проекта</Label>
            <Input
              id="projectName"
              placeholder="Project Name"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label>Стадия</Label>
            <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите стадию" />
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
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label htmlFor="investment">Ищу инвестиций</Label>
            <Input
              id="investment"
              placeholder="Сумма в KZT/USD"
              value={formData.investment}
              onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <Label>Отрасль</Label>
            <Select onValueChange={addIndustry}>
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
                  <button onClick={() => removeIndustry(industry)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <Label htmlFor="pitch">Короткий питч (140 символов)</Label>
            <Input
              id="pitch"
              placeholder="Мы решаем {проблема} для {аудитория} через {решение}."
              value={formData.pitch}
              onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
              maxLength={140}
            />
            <p className="text-xs text-gray-500">{formData.pitch.length}/140</p>
          </div>
        );
    }
  };

  const renderInvestorStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="ticketRange">Тикет на сделку</Label>
            <Input
              id="ticketRange"
              placeholder="минимум–максимум, KZT/USD"
              value={formData.ticketRange}
              onChange={(e) => setFormData({ ...formData, ticketRange: e.target.value })}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label>Стадии интереса</Label>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => (
                <Badge
                  key={stage}
                  variant={formData.interestedStages?.includes(stage) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleStage(stage)}
                >
                  {stage}
                </Badge>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label>Отрасли интереса</Label>
            <Select onValueChange={addIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите отрасли" />
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
                  <button onClick={() => removeIndustry(industry)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <Label>География</Label>
            <Select value={formData.geography} onValueChange={(value) => setFormData({ ...formData, geography: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите географию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kz">Казахстан</SelectItem>
                <SelectItem value="ca">Центральная Азия</SelectItem>
                <SelectItem value="cis">СНГ</SelectItem>
                <SelectItem value="global">Глобально</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto space-y-8 pt-8">
        <div>
          <div className="flex gap-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">Шаг {step} из {totalSteps}</p>
        </div>

        <div>
          {role === 'startup' ? renderStartupStep() : renderInvestorStep()}
        </div>

        <Button
          onClick={handleNext}
          className="w-full"
          size="lg"
        >
          {step < totalSteps ? 'Продолжить' : 'Сохранить и продолжить'}
        </Button>
      </div>
    </div>
  );
}
