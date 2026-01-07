import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
// using native input checkbox here to avoid duplicate rendering
import { UserRole } from '../App';
// @ts-ignore: virtual figma asset path used by bundler
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';
import { authService } from '../services/authService';
import { toast } from 'sonner';

interface AuthScreenProps {
  onLogin: (email: string, role: UserRole, userId: string) => void;
  onRegister: (email: string, role: UserRole, userId: string) => void;
  onBack: () => void;
  mode?: 'login' | 'register';
}


export default function AuthScreen({ onLogin, onRegister, onBack, mode = 'login' }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(mode !== 'register');
useEffect(() => {
  setIsLogin(mode !== 'register');
  setIsForgotPasswordMode(false);
}, [mode]);

  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);

  const [name, setName] = useState('');        // для регистрации
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      // === РЕЖИМ "ЗАБЫЛИ ПАРОЛЬ" ===
      // if (isForgotPasswordMode) {
      //   if (!email) {
      //     toast.error('Введите email');
      //     return;
      //   }

      //   await authService.forgotPassword({ email });

      //   toast.success(
      //     'Если такой email существует, мы отправили письмо для восстановления пароля'
      //   );

      //   // возвращаемся к обычному логину
      //   setIsForgotPasswordMode(false);
      //   setIsLogin(true);
      //   return;
      // }


      if (isForgotPasswordMode) {
        if (!email) {
          toast.error('Введите email');
          return;
        }

        await authService.forgotPassword({ email });

        toast.success(
          'Мы отправили Вам письмо для восстановления пароля. Пожалуйста, проверьте свою почту.'
        );

        setIsForgotPasswordMode(false);
        setIsLogin(true);
        return;
      }


      // === ВХОД ===
      if (isLogin) {
        const data = await authService.login({ email, password });
        const userId = data.id ?? localStorage.getItem('userId') ?? '';

        toast.success('Успешный вход');

        onLogin(email, (data.role ?? null) as UserRole, userId);
      } else {
        // === РЕГИСТРАЦИЯ ===
        if (!acceptTerms) {
          toast.error('Нужно принять условия');
          return;
        }

        if (!name.trim()) {
          toast.error('Введите имя');
          return;
        }

        // проверки пароля
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

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');

        await authService.register({ name, email, password });

        const loginData = await authService.login({ email, password });
        const userId = loginData.id ?? localStorage.getItem('userId') ?? '';

        toast.success('Аккаунт создан, вы вошли в систему');

        onRegister(email, (loginData.role ?? null) as UserRole, userId);
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
      if (!isLogin && !isForgotPasswordMode && code === 'EMAIL_EXISTS') {
        toast.error('Пользователь с таким email уже зарегистрирован');
        return;
      }

      // ----- ЛОГИН -----
      if (isLogin && !isForgotPasswordMode && code === 'EMAIL_NOT_FOUND') {
        toast.error('Пользователь с таким email не найден');
        return;
      }

      if (isLogin && !isForgotPasswordMode && code === 'USER_BANNED') {
        toast.error(message || 'Пользователь заблокирован');
        return;
      }

      if (isLogin && !isForgotPasswordMode && code === 'INVALID_CREDENTIALS') {
        toast.error('Неверный пароль');
        return;
      }

      // для forgot-password бэк всегда 200, так что сюда почти не попадём
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
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-slate-900 rounded-2xl p-4">
              <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-gray-900 mb-2">
              {isForgotPasswordMode
                ? 'Восстановление пароля'
                : isLogin
                  ? 'Войти'
                  : 'Создать аккаунт'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">
            {/* Имя только при регистрации */}
            {!isLogin && !isForgotPasswordMode && (
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

            <div className="space-y-2 text-gray-900">
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

            {/* Пароль не нужен в режиме "забыли пароль" */}
            {!isForgotPasswordMode && (
              <div className="space-y-2 text-gray-900">
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
            )}

            {/* Чекбокс условий — только при регистрации */}
            {!isLogin && !isForgotPasswordMode && (
              <div className="flex items-start space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 rounded border text-blue-600"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-black leading-tight text-gray-900"
                >
                  Принимаю Условия и Политику конфиденциальности
                </label>
              </div>
            )}

            {/* Ссылка "Забыли пароль?" — только в обычном логине */}
            {isLogin && !isForgotPasswordMode && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-900"
                  onClick={() => {
                    setIsForgotPasswordMode(true);
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
                ? isForgotPasswordMode
                  ? 'Отправляем...'
                  : isLogin
                    ? 'Входим...'
                    : 'Регистрируем...'
                : isForgotPasswordMode
                  ? 'Отправить ссылку для сброса'
                  : isLogin
                    ? 'Войти'
                    : 'Зарегистрироваться'}
            </Button>
          </form>

          <div className="text-center">
            {isForgotPasswordMode ? (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordMode(false);
                  setIsLogin(true);
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Назад к входу
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {isLogin ? 'Создать новый аккаунт' : 'У меня уже есть аккаунт'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
