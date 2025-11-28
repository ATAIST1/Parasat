import { useState } from 'react';
import { DollarSign, TrendingUp, Users, Crown, Zap, Star, Shield, Award, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface MonetizationModelsProps {
  onBack: () => void;
}

export default function MonetizationModels({ onBack }: MonetizationModelsProps) {
  const [selectedModel, setSelectedModel] = useState<number | null>(null);

  const models = [
    {
      id: 1,
      title: 'Комиссия с успешных сделок',
      subtitle: 'Success Fee Model',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      current: true,
      rate: '2.5% от суммы инвестиций',
      description: 'Платформа берет процент только когда сделка успешно закрывается',
      pros: [
        'Нет барьера входа - бесплатная регистрация',
        'Win-win - платят только довольные клиенты',
        'Мотивирует платформу помогать в закрытии сделок',
        'Прозрачная и понятная модель',
        'Масштабируется с ростом платформы'
      ],
      cons: [
        'Доход только от закрытых сделок',
        'Долгий цикл сделки (3-6 месяцев)',
        'Сложно контролировать оффлайн-сделки',
        'Зависимость от активности инвесторов'
      ],
      calculation: {
        scenario: 'Консервативный сценарий (год 1)',
        deals: 30,
        avgDeal: 150000,
        rate: 2.5,
        revenue: 112500
      },
      examples: [
        { deal: 50000, commission: 1250 },
        { deal: 150000, commission: 3750 },
        { deal: 500000, commission: 12500 },
        { deal: 1000000, commission: 25000 }
      ]
    },
    {
      id: 2,
      title: 'Подписочная модель',
      subtitle: 'Subscription Model',
      icon: Crown,
      color: 'from-purple-500 to-pink-600',
      current: false,
      rate: 'Ежемесячные планы',
      description: 'Пользователи платят фиксированную сумму в месяц за доступ к платформе',
      pros: [
        'Предсказуемый рекуррентный доход',
        'Легче планировать финансы',
        'Не зависит от количества сделок',
        'Быстрая окупаемость',
        'Проще считать LTV'
      ],
      cons: [
        'Барьер входа - нужно платить до результата',
        'Высокий churn rate в начале',
        'Нужно постоянно доказывать ценность',
        'Конкуренция с бесплатными альтернативами'
      ],
      tiers: [
        {
          name: 'Free',
          price: 0,
          features: ['Просмотр 10 проектов/мес', 'Базовые фильтры', 'Чат (3 диалога)'],
          users: 'Новички'
        },
        {
          name: 'Pro',
          price: 49,
          features: ['Безлимит проектов', 'Расширенные фильтры', 'Безлимит чатов', 'Аналитика', 'Приоритет в поиске'],
          users: 'Активные инвесторы'
        },
        {
          name: 'Business',
          price: 199,
          features: ['Всё из Pro', 'Персональный менеджер', 'Deal room', 'API доступ', 'Белый label'],
          users: 'Фонды, корпорации'
        }
      ],
      calculation: {
        scenario: 'Прогноз на 1000 пользователей',
        free: 700,
        pro: 250,
        business: 50,
        revenue: 22250
      }
    },
    {
      id: 3,
      title: 'Гибридная модель',
      subtitle: 'Hybrid: Subscription + Success Fee',
      icon: Zap,
      color: 'from-blue-500 to-cyan-600',
      current: false,
      rate: 'Подписка + сниженная комиссия',
      description: 'Комбинация подписки (меньше комиссия) или полная комиссия без подписки',
      pros: [
        'Два источника дохода',
        'Гибкость для разных сегментов',
        'Рекуррентный доход + upside от сделок',
        'Мотивирует оформлять подписку (меньше комиссия)',
        'Лучшая юнит-экономика'
      ],
      cons: [
        'Сложнее объяснить модель',
        'Больше вариантов = сложнее выбрать',
        'Риск запутать пользователей',
        'Сложнее в бухгалтерии'
      ],
      options: [
        {
          plan: 'Без подписки',
          subscription: 0,
          successFee: 2.5,
          description: 'Для разовых сделок'
        },
        {
          plan: 'Pro подписка',
          subscription: 49,
          successFee: 1.5,
          description: 'Активные инвесторы экономят на комиссии'
        },
        {
          plan: 'Business',
          subscription: 199,
          successFee: 1.0,
          description: 'Фонды с большими объемами'
        }
      ],
      calculation: {
        scenario: 'Гибридная модель (1000 users, 30 deals)',
        subscriptionRevenue: 22250,
        dealRevenue: 67500,
        totalRevenue: 89750
      }
    },
    {
      id: 4,
      title: 'Freemium + Credits',
      subtitle: 'Credit-based System',
      icon: Star,
      color: 'from-orange-500 to-red-600',
      current: false,
      rate: 'Кредиты на действия',
      description: 'Базовый доступ бесплатный, но за ключевые действия нужны кредиты',
      pros: [
        'Низкий барьер входа',
        'Платят активные пользователи',
        'Геймификация и вовлечение',
        'Гибкое ценообразование',
        'Легко A/B тестировать цены'
      ],
      cons: [
        'Может раздражать "платные стены"',
        'Сложно балансировать цены',
        'Риск потерять пользователей',
        'Нужна четкая value proposition'
      ],
      credits: [
        { action: 'Просмотр контактов стартапа', cost: 10, price: 1 },
        { action: 'Отправка сообщения инвестору', cost: 5, price: 0.5 },
        { action: 'Премиум размещение проекта (7 дней)', cost: 50, price: 5 },
        { action: 'Скачивание pitch deck', cost: 15, price: 1.5 },
        { action: 'Доступ к финансовым показателям', cost: 20, price: 2 }
      ],
      packages: [
        { credits: 100, price: 9, bonus: 0 },
        { credits: 500, price: 39, bonus: 50 },
        { credits: 1000, price: 69, bonus: 150 }
      ]
    },
    {
      id: 5,
      title: 'Платные листинги',
      subtitle: 'Featured Listings',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-600',
      current: false,
      rate: 'Плата за видимость',
      description: 'Стартапы платят за премиум размещение и дополнительную видимость',
      pros: [
        'Стартапы готовы платить за привлечение инвесторов',
        'Предсказуемый доход',
        'Не зависит от закрытия сделок',
        'Простая модель',
        'Быстрые деньги'
      ],
      cons: [
        'Может испортить UX (спам)',
        'Неравные условия для стартапов',
        'Риск потерять доверие',
        'Ограниченный потенциал роста'
      ],
      tiers: [
        {
          name: 'Базовое размещение',
          price: 0,
          features: ['Обычная карточка', 'Стандартная позиция', 'Базовая статистика']
        },
        {
          name: 'Featured (7 дней)',
          price: 99,
          features: ['Топ ленты', 'Значок "Featured"', 'Email инвесторам', 'Детальная аналитика', '3x видимость']
        },
        {
          name: 'Premium (30 дней)',
          price: 299,
          features: ['Всё из Featured', 'Топ-3 всегда', 'Персональная рассылка', 'Выделение цветом', '10x видимость']
        }
      ],
      calculation: {
        scenario: 'При 150 проектах на платформе',
        featured: 15,
        premium: 5,
        revenue: 2985
      }
    },
    {
      id: 6,
      title: 'Membership сообщество',
      subtitle: 'Exclusive Community Access',
      icon: Users,
      color: 'from-pink-500 to-rose-600',
      current: false,
      rate: 'Членство в закрытом клубе',
      description: 'Платный доступ к эксклюзивному сообществу с мероприятиями и нетворкингом',
      pros: [
        'Высокая лояльность членов',
        'Сильный network effect',
        'Оффлайн + онлайн value',
        'Премиум позиционирование',
        'Долгосрочные отношения'
      ],
      cons: [
        'Нужно много вкладывать в контент',
        'Сложно масштабировать',
        'Высокие операционные расходы',
        'Риск не оправдать ожидания'
      ],
      tiers: [
        {
          name: 'Access',
          price: 199,
          period: 'месяц',
          features: ['Доступ к платформе', 'Закрытое сообщество', 'Еженедельные вебинары', 'Нетворкинг-чаты']
        },
        {
          name: 'VIP',
          price: 999,
          period: 'месяц',
          features: ['Всё из Access', 'Квартальные meetup', 'Индивидуальные консультации', 'Приоритет в сделках', 'Закрытые deal flow']
        },
        {
          name: 'Elite (Parasat BC)',
          price: 2999,
          period: 'год',
          features: ['Всё из VIP', 'Доступ к митингам Parasat BC', 'Персональный менеджер', 'Co-investment возможности', 'Эксклюзивные проекты']
        }
      ]
    },
    {
      id: 7,
      title: 'Сервисы для стартапов',
      subtitle: 'Value-added Services',
      icon: Shield,
      color: 'from-teal-500 to-green-600',
      current: false,
      rate: 'Дополнительные платные услуги',
      description: 'Стартапы покупают услуги по подготовке к инвестициям',
      pros: [
        'Высокая маржа на услуги',
        'Помогаем стартапам стать лучше',
        'Повышаем качество платформы',
        'Разнообразные источники дохода',
        'Можно делать через партнеров'
      ],
      cons: [
        'Не масштабируется легко',
        'Нужны эксперты',
        'Операционная нагрузка',
        'Отвлекает от core продукта'
      ],
      services: [
        {
          service: 'Аудит pitch deck',
          price: 299,
          description: 'Профессиональный разбор презентации с рекомендациями'
        },
        {
          service: 'Подготовка финмодели',
          price: 499,
          description: 'Создание детальной финансовой модели для инвесторов'
        },
        {
          service: 'Юридический пакет',
          price: 799,
          description: 'Шаблоны договоров (SAFE, convertible note, term sheet)'
        },
        {
          service: 'Консультация с ментором (1 час)',
          price: 199,
          description: 'Сессия с опытным предпринимателем или инвестором'
        },
        {
          service: 'Due Diligence готовность',
          price: 999,
          description: 'Подготовка data room и документов для проверки'
        },
        {
          service: 'Pitch тренинг',
          price: 399,
          description: 'Тренировка питча с записью и фидбэком'
        }
      ]
    },
    {
      id: 8,
      title: 'B2B партнерства',
      subtitle: 'White Label & API Access',
      icon: Award,
      color: 'from-violet-500 to-purple-600',
      current: false,
      rate: 'Лицензирование платформы',
      description: 'Продажа доступа к платформе акселераторам, корпорациям, фондам',
      pros: [
        'Крупные контракты ($10K-$100K+)',
        'Долгосрочные отношения',
        'Масштабирование через партнеров',
        'Высокая маржа',
        'B2B churn ниже B2C'
      ],
      cons: [
        'Долгий цикл сделки',
        'Нужна кастомизация',
        'Высокие требования к поддержке',
        'Зависимость от крупных клиентов',
        'Отвлекает от B2C'
      ],
      clients: [
        {
          type: 'Акселераторы',
          package: 'White label платформа для портфеля',
          price: 15000,
          period: 'год'
        },
        {
          type: 'Венчурные фонды',
          package: 'Deal flow management система',
          price: 25000,
          period: 'год'
        },
        {
          type: 'Корпорации',
          package: 'Внутренний портал для корп. венчуринга',
          price: 50000,
          period: 'год'
        },
        {
          type: 'Государство',
          package: 'Платформа для гос. программ поддержки стартапов',
          price: 100000,
          period: 'год'
        }
      ]
    }
  ];

  const selectedModelData = selectedModel ? models.find(m => m.id === selectedModel) : null;

  if (selectedModelData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`bg-gradient-to-br ${selectedModelData.color} px-4 py-6`}>
          <button
            onClick={() => setSelectedModel(null)}
            className="flex items-center gap-2 text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Все модели</span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <selectedModelData.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white">{selectedModelData.title}</h1>
              <p className="text-sm text-white/80">{selectedModelData.subtitle}</p>
            </div>
          </div>

          {selectedModelData.current && (
            <Badge className="bg-white/20 text-white border-white/30">
              ✓ Текущая модель
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-4 -mt-4">
          <Card className="bg-white p-6">
            <h3 className="text-gray-900 mb-2">{selectedModelData.rate}</h3>
            <p className="text-sm text-gray-600">{selectedModelData.description}</p>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="text-gray-900">Преимущества</h3>
            </div>
            <div className="space-y-2">
              {selectedModelData.pros.map((pro, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <p className="text-sm text-gray-700">{pro}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-gray-900">Недостатки</h3>
            </div>
            <div className="space-y-2">
              {selectedModelData.cons.map((con, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <p className="text-sm text-gray-700">{con}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Специфичные данные для каждой модели */}
          {selectedModelData.id === 1 && selectedModelData.examples && (
            <Card className="bg-white p-6">
              <h3 className="text-gray-900 mb-4">Примеры комиссий</h3>
              <div className="space-y-3">
                {selectedModelData.examples.map((example, index) => (
                  <div key={index} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                    <span className="text-sm text-gray-600">Сделка ${example.deal.toLocaleString()}</span>
                    <span className="text-green-600">${example.commission.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {selectedModelData.id === 2 && selectedModelData.tiers && (
            <div className="space-y-3">
              {selectedModelData.tiers.map((tier, index) => (
                <Card key={index} className={`p-6 ${tier.price > 0 ? 'border-2 border-blue-500' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-gray-900">{tier.name}</h3>
                      <p className="text-xs text-gray-500">{tier.users}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl text-gray-900">${tier.price}</p>
                      <p className="text-xs text-gray-500">/месяц</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {selectedModelData.id === 3 && selectedModelData.options && (
            <div className="space-y-3">
              {selectedModelData.options.map((option, index) => (
                <Card key={index} className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <h3 className="text-gray-900 mb-3">{option.plan}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Подписка</p>
                      <p className="text-xl text-gray-900">${option.subscription}/мес</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Комиссия с сделки</p>
                      <p className="text-xl text-green-600">{option.successFee}%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </Card>
              ))}
            </div>
          )}

          {selectedModelData.id === 4 && (
            <>
              <Card className="bg-white p-6">
                <h3 className="text-gray-900 mb-4">Стоимость действий</h3>
                <div className="space-y-3">
                  {selectedModelData.credits?.map((credit, index) => (
                    <div key={index} className="flex justify-between items-start pb-3 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{credit.action}</p>
                        <p className="text-xs text-gray-500">{credit.cost} кредитов</p>
                      </div>
                      <span className="text-gray-600">${credit.price}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 p-6">
                <h3 className="text-gray-900 mb-4">Пакеты кредитов</h3>
                <div className="space-y-3">
                  {selectedModelData.packages?.map((pkg, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="text-gray-900">{pkg.credits} кредитов</p>
                        {pkg.bonus > 0 && (
                          <p className="text-xs text-green-600">+{pkg.bonus} бонус</p>
                        )}
                      </div>
                      <p className="text-xl text-gray-900">${pkg.price}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {selectedModelData.id === 5 && selectedModelData.tiers && (
            <div className="space-y-3">
              {selectedModelData.tiers.map((tier, index) => (
                <Card key={index} className={`p-6 ${tier.price > 0 ? 'border-2 border-orange-500' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-gray-900">{tier.name}</h3>
                    <div className="text-right">
                      <p className="text-2xl text-gray-900">${tier.price}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {selectedModelData.id === 6 && selectedModelData.tiers && (
            <div className="space-y-3">
              {selectedModelData.tiers.map((tier, index) => (
                <Card key={index} className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-gray-900">{tier.name}</h3>
                    <div className="text-right">
                      <p className="text-2xl text-gray-900">${tier.price}</p>
                      <p className="text-xs text-gray-500">/{tier.period}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {selectedModelData.id === 7 && selectedModelData.services && (
            <div className="space-y-3">
              {selectedModelData.services.map((service, index) => (
                <Card key={index} className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-gray-900">{service.service}</h3>
                    <span className="text-xl text-gray-900">${service.price}</span>
                  </div>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </Card>
              ))}
            </div>
          )}

          {selectedModelData.id === 8 && selectedModelData.clients && (
            <div className="space-y-3">
              {selectedModelData.clients.map((client, index) => (
                <Card key={index} className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-gray-900">{client.type}</h3>
                      <p className="text-sm text-gray-600 mt-1">{client.package}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl text-gray-900">${client.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">/{client.period}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {selectedModelData.calculation && (
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h3 className="text-white mb-4">💰 Финансовый прогноз</h3>
              <p className="text-sm text-blue-100 mb-4">{selectedModelData.calculation.scenario}</p>
              
              {selectedModelData.id === 1 && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Сделок в год:</span>
                    <span className="text-white">{selectedModelData.calculation.deals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Средний чек:</span>
                    <span className="text-white">${selectedModelData.calculation.avgDeal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Комиссия:</span>
                    <span className="text-white">{selectedModelData.calculation.rate}%</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/20">
                    <span className="text-white">Годовая выручка:</span>
                    <span className="text-2xl text-white">${selectedModelData.calculation.revenue?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {selectedModelData.id === 2 && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Free users (70%):</span>
                    <span className="text-white">{selectedModelData.calculation.free} × $0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Pro users (25%):</span>
                    <span className="text-white">{selectedModelData.calculation.pro} × $49</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Business users (5%):</span>
                    <span className="text-white">{selectedModelData.calculation.business} × $199</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/20">
                    <span className="text-white">MRR (Monthly):</span>
                    <span className="text-2xl text-white">${selectedModelData.calculation.revenue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">ARR (Annual):</span>
                    <span className="text-xl text-green-300">${((selectedModelData.calculation.revenue || 0) * 12).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {selectedModelData.id === 3 && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Подписки (месяц):</span>
                    <span className="text-white">${selectedModelData.calculation.subscriptionRevenue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Комиссии (год):</span>
                    <span className="text-white">${selectedModelData.calculation.dealRevenue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/20">
                    <span className="text-white">Всего (год):</span>
                    <span className="text-2xl text-white">${selectedModelData.calculation.totalRevenue?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {selectedModelData.id === 5 && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Featured листингов/мес:</span>
                    <span className="text-white">{selectedModelData.calculation.featured} × $99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Premium листингов/мес:</span>
                    <span className="text-white">{selectedModelData.calculation.premium} × $299</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/20">
                    <span className="text-white">MRR:</span>
                    <span className="text-2xl text-white">${selectedModelData.calculation.revenue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">ARR:</span>
                    <span className="text-xl text-green-300">${((selectedModelData.calculation.revenue || 0) * 12).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </Card>
          )}

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 p-6">
            <h3 className="text-gray-900 mb-3">💡 Рекомендация</h3>
            <p className="text-sm text-gray-700">
              {selectedModelData.id === 1 && "Отличная стартовая модель - нет барьера входа, растёт с платформой. Но подумай о добавлении подписки для активных пользователей через 6-12 месяцев."}
              {selectedModelData.id === 2 && "Предсказуемый доход, но высокий churn риск. Лучше использовать как дополнение к комиссии, а не замену."}
              {selectedModelData.id === 3 && "Лучшая модель для зрелой платформы! Два источника дохода, гибкость для разных сегментов. Идеально через 12-18 месяцев после запуска."}
              {selectedModelData.id === 4 && "Интересно для геймификации, но может раздражать. Тестируй осторожно на части аудитории."}
              {selectedModelData.id === 5 && "Быстрые деньги, но не масштабируется сильно. Хорошо как дополнительный источник дохода."}
              {selectedModelData.id === 6 && "Премиум модель для элитного сегмента. Идеально сочетается с Parasat BC! Можно запустить как VIP-тариф."}
              {selectedModelData.id === 7 && "Высокая маржа, но не масштабируется. Делай через партнёров (юристы, консультанты) за % от сделки."}
              {selectedModelData.id === 8 && "Огромный потенциал! Один контракт = годовая выручка. Но фокусируйся на B2C сначала, B2B - когда продукт выстрелит."}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Назад</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white">Модели монетизации</h1>
            <p className="text-sm text-gray-300">8 способов заработка</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 -mt-4">
        {models.map((model) => {
          const Icon = model.icon;
          return (
            <Card
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className="p-5 hover:shadow-lg transition-shadow cursor-pointer relative"
            >
              {model.current && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-green-100 text-green-700">Текущая</Badge>
                </div>
              )}
              
              <div className="flex gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${model.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{model.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{model.subtitle}</p>
                  <p className="text-sm text-gray-600">{model.description}</p>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{model.rate}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="p-4 pb-8">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h3 className="text-white mb-4">🎯 Рекомендуемая стратегия</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">1</span>
              </div>
              <div>
                <p className="text-white mb-1">Сейчас (0-12 мес):</p>
                <p className="text-blue-100">Комиссия 2.5% - фокус на росте пользователей без барьеров</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">2</span>
              </div>
              <div>
                <p className="text-white mb-1">Через год (12-24 мес):</p>
                <p className="text-blue-100">Добавить Featured листинги для стартапов + VIP membership для Parasat BC</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">3</span>
              </div>
              <div>
                <p className="text-white mb-1">Масштаб (24+ мес):</p>
                <p className="text-blue-100">Гибридная модель (подписка снижает комиссию) + B2B для акселераторов</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
