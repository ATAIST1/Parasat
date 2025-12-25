import { Button } from './ui/button';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onContinueAsGuest: () => void;
}

export default function WelcomeScreen({ onLogin, onRegister, onContinueAsGuest }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Логотип и заголовок */}
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
              <img src={logo} alt="Parasat Invest" className="w-48 h-48 object-contain filter drop-shadow-lg" />
          </div>
          {/* 
                      <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 shadow-2xl flex items-center justify-center">
              <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain filter drop-shadow-lg" />
            </div>
           */}


          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white">
              Найдите команду.<br />Найдите инвестиции.<br />Воплотите идею.
            </h1>
            <p className="text-lg text-gray-300">
              Экосистема для стартапов, инвесторов и разработчиков СНГ.
            </p>
          </div>
        </div>

        {/* Кнопки */}
        <div className="space-y-3 pt-6">
          <Button
            onClick={onLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-6 text-lg rounded-xl flex items-center justify-center gap-2 transition-all"
            size="lg"
          >
            Войти
            <ArrowRight className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={() => onRegister()}
            className="w-full bg-blue-700/40 hover:bg-blue-700/60 text-white font-semibold py-6 text-lg rounded-xl border border-blue-400/30 transition-all"
            size="lg"
          >
            Создать аккаунт
          </Button>
          
          <button
            onClick={onContinueAsGuest}
            className="w-full text-blue-200 hover:text-white transition-colors py-4 font-medium"
          >
            Продолжить без регистрации
          </button>
        </div>

        {/* Нижний текст */}
        <div className="text-center text-sm text-gray-400 pt-4 border-t border-blue-500/20">
          <p>Присоединяйтесь к сообществу инноваторов</p>
        </div>
      </div>
    </div>
  );
}
