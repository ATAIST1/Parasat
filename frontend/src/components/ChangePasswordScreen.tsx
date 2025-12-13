import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { authService } from '../services/authService';
import { toast } from 'sonner';

interface ChangePasswordScreenProps {
  onBack: () => void;
}

export default function ChangePasswordScreen({ onBack }: ChangePasswordScreenProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Пароль должен быть не менее 8 символов');
      return;
    }
    if (!/[A-ZА-Я]/.test(newPassword)) {
      toast.error('Пароль должен содержать хотя бы одну заглавную букву');
      return;
    }
    if (!/[!@#$%^&*()_\-+=\[\]{};':",.<>?/]/.test(newPassword)) {
      toast.error('Пароль должен содержать хотя бы один специальный символ');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success('Пароль успешно изменён');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onBack();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Ошибка смены пароля';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-gray-900">Смена пароля</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md px-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="current">Текущий пароль</Label>
          <Input id="current" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required autoFocus />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new">Новый пароль</Label>
          <Input id="new" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Повторите новый пароль</Label>
          <Input id="confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
          {loading ? 'Сохраняем...' : 'Сменить пароль'}
        </Button>
      </form>
    </div>
  );
}

