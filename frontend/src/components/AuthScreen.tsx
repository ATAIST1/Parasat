import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { UserRole } from '../App';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface AuthScreenProps {
  onLogin: (email: string, role: UserRole) => void;
  onRegister: (email: string) => void;
  onBack: () => void;
}

export default function AuthScreen({ onLogin, onRegister, onBack }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Mock login - в реальности проверяем credentials
      onLogin(email, 'startup');
    } else {
      if (acceptTerms) {
        onRegister(email);
      }
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
                >
                  Забыли пароль?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </form>

          <div className="text-center">
            <button
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
