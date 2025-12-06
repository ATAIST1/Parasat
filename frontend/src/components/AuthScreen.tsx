import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { UserRole } from '../App';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';
import { authService } from '../services/authService';
import { toast } from 'sonner';

interface AuthScreenProps {
  onLogin: (email: string, role: UserRole) => void;
  onRegister: (email: string) => void;
  onBack: () => void;
}

export default function AuthScreen({ onLogin, onRegister, onBack }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');        // ← для регистрации
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      if (isLogin) {
        // --- ВХОД ---
        const res = await authService.login({ email, password });

        const { accessToken, refreshToken } = res.data;

        // сохраняем токены
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // axios интерцептор сам подставит Authorization
        // Можно на всякий:
        // api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        toast.success('Успешный вход');

        onLogin(email, 'startup');
      } else {
        if (!acceptTerms) {
          toast.error('Нужно принять условия');
          return;
        }

        if (!name.trim()) {
          toast.error('Введите имя');
          return;
        }




//для проверки пароля на наличие спец символов
        if (password.length < 8) {
  toast.error('Пароль должен содержать минимум 8 символов');
  return;
}

if (!/[A-Z]/.test(password)) {
  toast.error('Пароль должен содержать хотя бы одну заглавную букву');
  return;
}

if (!/[!@#$%^&*()_\-+\[\]{};':",.<>?/]/.test(password)) {
  toast.error('Пароль должен содержать хотя бы один специальный символ');
  return;
}





        await authService.register({ name, email, password });

        // ВАЖНО: у тебя на бэке EmailConfirmed = false
        // и вход разрешён только после подтверждения по email.
        toast.success('Мы отправили письмо для подтверждения email. Проверьте почту.');

        onRegister(email);
        setIsLogin(true); // переключим на экран входа
      }

    } catch (err: any) {
      console.error(err);

      const res = err?.response;
      const data = res?.data;

      let message = '';
      let code: string | undefined;

      if (typeof data === 'string') {
        message = data;
      } else if (data && typeof data === 'object') {
        message = data.message || '';
        code = data.code;
      }

      // ----- РЕГИСТРАЦИЯ -----
      if (!isLogin && code === 'EMAIL_EXISTS') {
        toast.error('Пользователь с таким email уже зарегистрирован');
        return;
      }

      // ----- ЛОГИН -----
      if (isLogin && code === 'EMAIL_NOT_FOUND') {
        toast.error('Пользователь с таким email не найден');
        return;
      }

      if (isLogin && code === 'EMAIL_NOT_CONFIRMED') {
        toast.error('Email не подтверждён. Проверьте почту и перейдите по ссылке.');
        return;
      }

      if (isLogin && code === 'INVALID_CREDENTIALS') {
        toast.error('Неверный пароль');
        return;
      }

  // Фоллбек, если что-то ещё
  toast.error(message || 'Ошибка авторизации');
} finally {
  setLoading(false);
}

  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-slate-900 rounded-2xl p-4">
              <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-gray-900 mb-2">
              {isLogin ? 'Войти' : 'Создать аккаунт'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Как к вам обращаться"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-tight"
                >
                  Принимаю Условия и Политику конфиденциальности
                </label>
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700"
                  // позже сюда прикрутим "забыл пароль"
                  onClick={() => {
                    // TODO
                  }}
                >
                  Забыли пароль?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {loading
                ? (isLogin ? 'Входим...' : 'Регистрируем...')
                : (isLogin ? 'Войти' : 'Зарегистрироваться')}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {isLogin ? 'Создать новый аккаунт' : 'У меня уже есть аккаунт'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
