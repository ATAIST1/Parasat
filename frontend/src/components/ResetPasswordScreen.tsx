import { useState, useMemo } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { authService } from '../services/authService';
import { toast } from 'sonner';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // достаём email и token из URL
  const { email, token } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      email: params.get('email') ?? '',
      token: params.get('token') ?? '',
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !token) {
      toast.error('Неверная или устаревшая ссылка для восстановления пароля');
      return;
    }

    if (!newPassword || !confirmPassword) {
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
      await authService.resetPassword({ email, token, newPassword });
      toast.success('Пароль успешно изменён');
      // после успеха отправляем на экран логина
      window.location.href = '/';
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        'Ошибка восстановления пароля';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Новый пароль
              </h1>
              <p className="text-xs text-gray-500">
                Устанавливаем новый пароль для аккаунта{' '}
                <span className="font-semibold text-gray-800">{email}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
  <div className="flex items-center justify-between">
    <Label htmlFor="new">Новый пароль</Label>

    <button
      type="button"
      onClick={() => setShowNew(v => !v)}
      className="text-gray-400 hover:text-gray-600 pr-2"  // ← отступ справа
    >
      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>

  <Input
    id="new"
    type={showNew ? 'text' : 'password'}
    value={newPassword}
    onChange={e => setNewPassword(e.target.value)}
    required
  />
</div>

            {/* <div className="space-y-2">
              <Label htmlFor="new">Новый пароль</Label>
              <div className="relative">
                <Input
                  id="new"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(v => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div> */}
            <div className="space-y-2">
  <div className="flex items-center justify-between">
    <Label htmlFor="confirm">Повторите новый пароль</Label>

    <button
      type="button"
      onClick={() => setShowConfirm(v => !v)}
      className="text-gray-400 hover:text-gray-600 pr-2"  // ← отступ справа
    >
      {showConfirm ? (
        <EyeOff className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </button>
  </div>

  <Input
    id="confirm"
    type={showConfirm ? 'text' : 'password'}
    value={confirmPassword}
    onChange={e => setConfirmPassword(e.target.value)}
    required
  />
</div>


            {/* <div className="space-y-2">
              <Label htmlFor="confirm">Повторите новый пароль</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div> */}

            <p className="text-xs text-gray-500 leading-relaxed">
              Пароль должен содержать минимум{' '}
              <span className="font-semibold">8 символов</span>, хотя бы одну{' '}
              <span className="font-semibold">заглавную букву</span> и один{' '}
              <span className="font-semibold">специальный символ</span>.
            </p>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? 'Сохраняем...' : 'Сменить пароль'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
