import { ArrowLeft, Bell, Lock, Globe, Clock } from 'lucide-react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [digestEnabled, setDigestEnabled] = useState(false);
  const [privacy, setPrivacy] = useState('all');
  const [language, setLanguage] = useState('ru');

  const handleSave = () => {
    toast('Изменения сохранены');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-gray-900">Настройки</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-gray-900">Уведомления</h2>
          </div>
          
          <div className="space-y-4 pl-8">
            <div className="flex items-center justify-between">
              <Label htmlFor="push" className="cursor-pointer">Push-уведомления</Label>
              <Switch
                id="push"
                checked={pushEnabled}
                onCheckedChange={setPushEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="cursor-pointer">Email-уведомления</Label>
              <Switch
                id="email"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="digest" className="cursor-pointer">Ежедневный дайджест</Label>
              <Switch
                id="digest"
                checked={digestEnabled}
                onCheckedChange={setDigestEnabled}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-600" />
            <h2 className="text-gray-900">Приватность</h2>
          </div>
          
          <div className="pl-8 space-y-3">
            <Label>Кто видит профиль</Label>
            <RadioGroup value={privacy} onValueChange={setPrivacy}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">Все</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="registered" id="registered" />
                <Label htmlFor="registered" className="cursor-pointer">Только зарегистрированные</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="request" id="request" />
                <Label htmlFor="request" className="cursor-pointer">По запросу</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-600" />
            <h2 className="text-gray-900">Язык</h2>
          </div>
          
          <div className="pl-8">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="kk">Қазақша</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-gray-900">Часовой пояс</h2>
          </div>
          
          <div className="pl-8">
            <Select defaultValue="almaty">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="almaty">Asia/Almaty (GMT+6)</SelectItem>
                <SelectItem value="astana">Asia/Almaty (GMT+6)</SelectItem>
                <SelectItem value="moscow">Europe/Moscow (GMT+3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-gray-900">Безопасность</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <p className="text-gray-900">Изменить пароль</p>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <p className="text-gray-900">Двухфакторная аутентификация (2FA)</p>
              <p className="text-xs text-gray-500 mt-1">Не настроено</p>
            </button>
          </div>
        </div>

        <Separator />

        <div className="pt-4">
          <button className="w-full text-red-600 hover:text-red-700 text-left p-3">
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>
  );
}
