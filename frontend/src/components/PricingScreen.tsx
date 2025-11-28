import { ArrowLeft, TrendingUp, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface PricingScreenProps {
  onBack: () => void;
}

const examples = [
  {
    investment: '10,000,000',
    currency: '₸',
    fee: '250,000',
    description: 'Seed раунд',
  },
  {
    investment: '50,000,000',
    currency: '₸',
    fee: '1,250,000',
    description: 'Series A',
  },
  {
    investment: '100,000',
    currency: '$',
    fee: '2,500',
    description: 'Международный раунд',
  },
];

const benefits = [
  'Доступ к базе проверенных инвесторов',
  'Безлимитный поиск и сообщения',
  'Публикация неограниченного количества проектов',
  'Приоритет в выдаче',
  'Аналитика интереса и откликов',
  'Помощь в подготовке документов',
  'Защита сделки и юридическая поддержка',
];

export default function PricingScreen({ onBack }: PricingScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-gray-900">Модель оплаты</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 mb-4 flex items-center justify-center">
          <div className="w-32 h-32">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white">Комиссия за успех</h2>
              <p className="text-blue-100 text-sm">Платите только за результат</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl">2,5</span>
              <span className="text-3xl">%</span>
            </div>
            <p className="mt-2 text-blue-100">от привлеченных инвестиций</p>
          </div>

          <div className="space-y-2 text-sm text-blue-50">
            <p>✓ Регистрация — бесплатно</p>
            <p>✓ Размещение проектов — бесплатно</p>
            <p>✓ Комиссия взимается только при успешном привлечении инвестиций</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">Примеры расчета</h3>
          </div>

          <div className="space-y-3">
            {examples.map((example, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{example.description}</p>
                    <p className="text-gray-900 mt-1">
                      Инвестиции: <strong>{example.investment} {example.currency}</strong>
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Комиссия платформы (2,5%)</span>
                  <span className="text-gray-900">
                    {example.fee} {example.currency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h3 className="text-gray-900">Что входит в платформу</h3>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 space-y-3">
          <h3 className="text-gray-900">Как это работает?</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              <span>Разместите проект бесплатно на платформе</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              <span>Получайте отклики от заинтересованных инвесторов</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                3
              </span>
              <span>Проводите переговоры и заключайте сделки</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                4
              </span>
              <span>Платите комиссию 2,5% только после получения инвестиций</span>
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-3">
          <h3 className="text-gray-900">Часто задаваемые вопросы</h3>
          
          <div className="space-y-3">
            <details className="group">
              <summary className="cursor-pointer text-gray-700 hover:text-gray-900 list-none">
                <span>Когда нужно платить комиссию?</span>
              </summary>
              <p className="text-sm text-gray-600 mt-2 pl-4">
                Комиссия взимается только после успешного получения инвестиций. Если сделка не состоялась — платить не нужно.
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer text-gray-700 hover:text-gray-900 list-none">
                <span>Как подтверждается факт инвестиций?</span>
              </summary>
              <p className="text-sm text-gray-600 mt-2 pl-4">
                После заключения сделки вы предоставляете подтверждающие документы (договор инвестиций, банковские выписки). Наша команда проверяет документы и выставляет счет.
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer text-gray-700 hover:text-gray-900 list-none">
                <span>Какие способы оплаты доступны?</span>
              </summary>
              <p className="text-sm text-gray-600 mt-2 pl-4">
                Мы принимаем оплату через Kaspi, Halyk банк, банковский перевод и другие популярные платежные системы Казахстана.
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer text-gray-700 hover:text-gray-900 list-none">
                <span>Есть ли скрытые платежи?</span>
              </summary>
              <p className="text-sm text-gray-600 mt-2 pl-4">
                Нет, только комиссия 2,5% от привлеченных инвестиций. Никаких регистрационных взносов, абонентских плат или скрытых комиссий.
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer text-gray-700 hover:text-gray-900 list-none">
                <span>Можно ли договориться об индивидуальных условиях?</span>
              </summary>
              <p className="text-sm text-gray-600 mt-2 pl-4">
                Да, для крупных раундов (от $500K) и постоянных клиентов мы предлагаем индивидуальные условия. Свяжитесь с нами для обсуждения.
              </p>
            </details>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 text-center space-y-3">
          <h3 className="text-gray-900">Готовы начать?</h3>
          <p className="text-gray-600 text-sm">
            Создайте проект бесплатно и получите доступ к базе инвесторов
          </p>
          <Button onClick={onBack} size="lg" className="w-full">
            Начать бесплатно
          </Button>
        </div>
      </div>
    </div>
  );
}