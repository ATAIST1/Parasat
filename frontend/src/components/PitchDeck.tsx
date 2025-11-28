import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign, Target, Rocket, Handshake, BarChart3, Shield, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Слайд 1: Титульный
    {
      title: 'Parasat Invest',
      subtitle: 'Инвестиционная платформа для СНГ',
      content: (
        <div className="space-y-8 text-center">
          <div className="w-24 h-24 bg-white rounded-3xl p-4 mx-auto shadow-lg">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-white mb-3">Parasat Invest</h1>
            <p className="text-xl text-blue-100 mb-8">Маркетплейс инвестиций для стартаперов и инвесторов СНГ</p>
            <Badge className="bg-white/20 text-white border-white/30 px-6 py-2 text-base">
              Партнерское предложение 50/50
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center pt-8">
            <div>
              <p className="text-3xl text-white mb-1">2.5%</p>
              <p className="text-sm text-blue-100">Комиссия</p>
            </div>
            <div>
              <p className="text-3xl text-white mb-1">СНГ</p>
              <p className="text-sm text-blue-100">Рынок</p>
            </div>
            <div>
              <p className="text-3xl text-white mb-1">MVP</p>
              <p className="text-sm text-blue-100">Готов</p>
            </div>
          </div>
        </div>
      ),
      bg: 'from-blue-600 to-purple-600'
    },

    // Слайд 2: Проблема
    {
      title: 'Проблема',
      subtitle: 'Три критические боли рынка',
      content: (
        <div className="space-y-4">
          <Card className="bg-red-50 border-red-200 p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">😓</span>
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Стартаперы не находят инвесторов</h3>
                <p className="text-sm text-gray-600">Нет единой площадки, приходится искать через знакомых и митинги (долго и неэффективно)</p>
              </div>
            </div>
          </Card>

          <Card className="bg-orange-50 border-orange-200 p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Инвесторы теряют время</h3>
                <p className="text-sm text-gray-600">Месяцы уходят на поиск качественных проектов, нет фильтров и аналитики</p>
              </div>
            </div>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200 p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🚫</span>
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Митинги не масштабируются</h3>
                <p className="text-sm text-gray-600">Parasat BC проводит офлайн-встречи, но охват ограничен 20-50 участниками</p>
              </div>
            </div>
          </Card>

          <div className="bg-gray-900 text-white rounded-2xl p-6 text-center">
            <p className="text-lg">💡 Результат: <span className="font-medium">90% стартапов не находят финансирование</span></p>
          </div>
        </div>
      ),
      bg: 'from-slate-900 to-slate-800'
    },

    // Слайд 3: Решение
    {
      title: 'Решение',
      subtitle: 'Мобильная платформа-маркетплейс',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-gray-900 mb-2">Лента проектов</h3>
              <p className="text-xs text-gray-600">4 категории: стартапы, инвесторы, разработчики, бизнесы</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <Zap className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-gray-900 mb-2">Умные фильтры</h3>
              <p className="text-xs text-gray-600">По отрасли, стадии, сумме инвестиций</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <BarChart3 className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-gray-900 mb-2">Калькулятор ROI</h3>
              <p className="text-xs text-gray-600">Инвесторы считают доходность в 2 клика</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <Shield className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="text-gray-900 mb-2">Система чатов</h3>
              <p className="text-xs text-gray-600">Безопасное общение и заключение сделок</p>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white mb-1">MVP уже работает!</h3>
                <p className="text-sm text-blue-100">Полный функционал от онбординга до сделок</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-xs text-blue-100 mb-1">Экраны</p>
                <p className="text-xl">15+</p>
              </div>
              <div>
                <p className="text-xs text-blue-100 mb-1">Функций</p>
                <p className="text-xl">25+</p>
              </div>
              <div>
                <p className="text-xs text-blue-100 mb-1">Готовность</p>
                <p className="text-xl">80%</p>
              </div>
            </div>
          </Card>
        </div>
      ),
      bg: 'from-slate-900 to-slate-800'
    },

    // Слайд 4: Бизнес-модель
    {
      title: 'Бизнес-модель',
      subtitle: 'Комиссия 2.5% с успешных сделок',
      content: (
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-6">
            <div className="text-center mb-6">
              <p className="text-5xl mb-2">2.5%</p>
              <p className="text-gray-600">Комиссия только с успешных инвестиций</p>
            </div>
            <div className="bg-white rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Сделка на $100,000</span>
                <span className="text-green-600">= $2,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Сделка на $500,000</span>
                <span className="text-green-600">= $12,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Сделка на $1,000,000</span>
                <span className="text-green-600">= $25,000</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-center">
                <p className="text-2xl mb-1">0₽</p>
                <p className="text-xs text-gray-600">Регистрация бесплатная</p>
              </div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-center">
                <p className="text-2xl mb-1">0₽</p>
                <p className="text-xs text-gray-600">Просмотр проектов</p>
              </div>
            </Card>
          </div>

          <Card className="bg-gray-900 text-white p-6">
            <h3 className="text-white mb-4">Почему это выгодно?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-gray-100">Нет барьера входа — быстрый рост базы</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-gray-100">Платят только довольные клиенты</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-gray-100">Масштабируется без затрат</p>
              </div>
            </div>
          </Card>
        </div>
      ),
      bg: 'from-slate-900 to-slate-800'
    },

    // Слайд 5: Юнит-экономика
    {
      title: 'Финансы',
      subtitle: 'Прогноз на 12 месяцев',
      content: (
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 p-6">
            <h3 className="text-gray-900 mb-4">Консервативный сценарий (год 1)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Пользователи</span>
                <span className="text-gray-900">1,000</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Активных инвесторов (10%)</span>
                <span className="text-gray-900">100</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Сделок (30%)</span>
                <span className="text-gray-900">30 сделок</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Средний чек</span>
                <span className="text-gray-900">$150,000</span>
              </div>
              <div className="flex justify-between items-center pt-2 bg-green-50 -mx-6 px-6 py-3 rounded-b-xl">
                <span className="font-medium text-gray-900">Годовая выручка</span>
                <span className="text-xl text-green-600">$112,500</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-6">
            <h3 className="text-gray-900 mb-4">Оптимистичный сценарий</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Пользователи</span>
                <span className="text-gray-900">5,000</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Сделок</span>
                <span className="text-gray-900">150 сделок</span>
              </div>
              <div className="flex justify-between items-center pt-2 bg-green-100 -mx-6 px-6 py-3 rounded-b-xl">
                <span className="font-medium text-gray-900">Годовая выручка</span>
                <span className="text-xl text-green-600">$562,500</span>
              </div>
            </div>
          </Card>

          <div className="bg-gray-900 text-white rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-300 mb-2">Твоя доля (50%)</p>
            <p className="text-3xl mb-1">$56K - $281K</p>
            <p className="text-xs text-gray-400">первый год</p>
          </div>
        </div>
      ),
      bg: 'from-slate-900 to-slate-800'
    },

    // Слайд 6: Почему мы?
    {
      title: 'Почему мы два?',
      subtitle: 'Идеальная команда основателей',
      content: (
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <div>
                <h3 className="text-gray-900">Ты даешь</h3>
                <p className="text-xs text-gray-600">Product & Tech</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">Готовый MVP (код, дизайн, UX)</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">Разработка и поддержка</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">Маркетинговая стратегия</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">Управление продуктом</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h3 className="text-gray-900">Партнер даёт</h3>
                <p className="text-xs text-gray-600">Capital & Network</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-purple-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">Инвестиции на доработку</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-purple-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">Бюджет на рекламу</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-purple-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">Доступ к Parasat BC</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-purple-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-700">База инвесторов и стартапов</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
            <Handshake className="w-12 h-12 mx-auto mb-3" />
            <p className="text-xl mb-2">Партнерство 50/50</p>
            <p className="text-sm text-blue-100">Равные д��ли, равные решения, общий успех</p>
          </Card>
        </div>
      ),
      bg: 'from-slate-900 to-slate-800'
    },

    // Слайд 7: Что нужно
    {
      title: 'Что нужно?',
      subtitle: 'Конкретный план на 3 месяца',
      content: (
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 p-6">
            <h3 className="text-gray-900 mb-4">Инвестиции (запрос)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <p className="text-sm text-gray-900">Доработка MVP → Production</p>
                  <p className="text-xs text-gray-500">Backend, база данных, безопасность</p>
                </div>
                <span className="text-gray-900">$10-15K</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <p className="text-sm text-gray-900">Маркетинг и реклама</p>
                  <p className="text-xs text-gray-500">Первые 1000 пользователей</p>
                </div>
                <span className="text-gray-900">$10-15K</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <p className="text-sm text-gray-900">Юридическое оформление</p>
                  <p className="text-xs text-gray-500">Регистрация, договоры</p>
                </div>
                <span className="text-gray-900">$2-3K</span>
              </div>
              <div className="flex justify-between items-center pt-2 bg-orange-100 -mx-6 px-6 py-3 rounded-b-xl">
                <span className="font-medium text-gray-900">Итого</span>
                <span className="text-xl text-orange-600">$22-33K</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6">
            <h3 className="text-gray-900 mb-4">Нефинансовая помощь</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">1</span>
                </div>
                <p className="text-sm text-gray-700">Доступ к базе контактов Parasat BC</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">2</span>
                </div>
                <p className="text-sm text-gray-700">Запуск на одном из митингов клуба</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">3</span>
                </div>
                <p className="text-sm text-gray-700">Рекомендации первым участникам</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-6">
            <h3 className="text-gray-900 mb-3">ROI прогноз</h3>
            <div className="bg-white rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Инвестиция</span>
                <span className="text-gray-900">$30,000</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Доход год 1 (50%)</span>
                <span className="text-green-600">$56,000+</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-medium text-gray-900">ROI</span>
                <span className="text-xl text-green-600">187%</span>
              </div>
            </div>
          </Card>
        </div>
      ),
      bg: 'from-slate-900 to-slate-800'
    },

    // Слайд 8: Next Steps
    {
      title: 'Следующие шаги',
      subtitle: 'Дорожная карта запуска',
      content: (
        <div className="space-y-4">
          <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white">1</div>
              <div>
                <h3 className="text-gray-900 mb-1">Неделя 1-2: Оформление</h3>
                <p className="text-sm text-gray-600">Подписание договора, регистрация компании, открытие счета</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white">2</div>
              <div>
                <h3 className="text-gray-900 mb-1">Неделя 3-8: Разработка</h3>
                <p className="text-sm text-gray-600">Backend, база данных, платежи, тестирование</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white">3</div>
              <div>
                <h3 className="text-gray-900 mb-1">Неделя 9-10: Мягкий запуск</h3>
                <p className="text-sm text-gray-600">Презентация на митинге Parasat BC, первые 100 пользователей</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white">4</div>
              <div>
                <h3 className="text-gray-900 mb-1">Неделя 11-12: Масштабирование</h3>
                <p className="text-sm text-gray-600">Реклама, PR, партнерства с акселераторами</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
            <Rocket className="w-12 h-12 mx-auto mb-3" />
            <p className="text-xl mb-2">Через 3 месяца — запуск!</p>
            <p className="text-sm text-blue-100">Первые сделки и доход</p>
          </Card>
        </div>
      ),
      bg: 'from-slate-900 to-slate-800'
    },

    // Слайд 9: Финальный призыв
    {
      title: 'Давай делать вместе!',
      subtitle: 'Win-Win партнерство',
      content: (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-6">
            <h3 className="text-gray-900 mb-4 text-center">Что ты получаешь?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900">50% растущего бизнеса</p>
                  <p className="text-xs text-gray-600">Долгосрочный актив с потенциалом x10</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900">Масштабирование Parasat BC</p>
                  <p className="text-xs text-gray-600">Твои митинги → digital платформа</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900">Пассивный доход</p>
                  <p className="text-xs text-gray-600">2.5% с каждой сделки автоматом</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900">Репутация tech-основателя</p>
                  <p className="text-xs text-gray-600">Не просто митинги, а инфраструктура рынка</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl p-3 mx-auto mb-4">
              <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-white mb-3">Parasat Invest</h2>
            <p className="text-blue-100 mb-6">Построим крупнейшую инвестплатформу СНГ вместе</p>
            <Badge className="bg-white text-blue-600 px-6 py-2">
              Партнерство 50/50
            </Badge>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center bg-blue-50 border-blue-200">
              <p className="text-2xl mb-1">📱</p>
              <p className="text-xs text-gray-600">MVP готов</p>
            </Card>
            <Card className="p-4 text-center bg-purple-50 border-purple-200">
              <p className="text-2xl mb-1">🚀</p>
              <p className="text-xs text-gray-600">3 мес. до запуска</p>
            </Card>
            <Card className="p-4 text-center bg-green-50 border-green-200">
              <p className="text-2xl mb-1">💰</p>
              <p className="text-xs text-gray-600">187% ROI</p>
            </Card>
          </div>
        </div>
      ),
      bg: 'from-slate-900 to-slate-800'
    },
  ];

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className={`flex-1 bg-gradient-to-br ${currentSlideData.bg} p-6 flex flex-col`}>
        <div className="mb-6">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Слайд {currentSlide + 1} из {slides.length}
          </Badge>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <h1 className="text-white mb-2">{currentSlideData.title}</h1>
            <p className="text-blue-100">{currentSlideData.subtitle}</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {currentSlideData.content}
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Назад
          </Button>

          <div className="flex gap-1">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            size="sm"
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="flex-1"
          >
            Далее
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
