import { Button } from './ui/button';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onContinueAsGuest: () => void;
}

export default function WelcomeScreen({ onLogin, onRegister, onContinueAsGuest }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="w-48 h-48 mx-auto bg-slate-900 rounded-3xl p-6 shadow-2xl">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-gray-900">
              Найдите команду. Найдите инвестиции. Воплотите идею.
            </h1>
            <p className="text-gray-600">
              Экосистема для стартапов, инвесторов и разработчиков СНГ.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            onClick={onLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            Войти
          </Button>
          
          <Button
            onClick={onRegister}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Создать аккаунт
          </Button>
          
          <button
            onClick={onContinueAsGuest}
            className="w-full text-gray-600 hover:text-gray-900 transition-colors py-2"
          >
            Продолжить без регистрации
          </button>
        </div>
      </div>
    </div>
  );
}
