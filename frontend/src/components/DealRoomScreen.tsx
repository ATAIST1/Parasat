import { useState } from 'react';
import { ArrowLeft, Shield, FileText, DollarSign, CheckCircle2, Clock, Lock, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface DealRoomScreenProps {
  onBack: () => void;
}

export default function DealRoomScreen({ onBack }: DealRoomScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'process' | 'protection'>('overview');

  const dealExample = {
    startup: 'TechFlow AI',
    investor: 'Venture Capital Fund',
    amount: 150000,
    stage: 'Due Diligence',
    progress: 60,
    commission: 3750,
  };

  const steps = [
    {
      title: 'Знакомство на платформе',
      status: 'completed',
      description: 'Инвестор нашел проект, начал общение в чате',
      icon: Users,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Подписание NDA',
      status: 'completed',
      description: 'Обмен конфиденциальной информацией через платформу',
      icon: Lock,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Letter of Intent (LOI)',
      status: 'completed',
      description: 'Инвестор подтвердил намерения инвестировать $150K',
      icon: FileText,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Due Diligence',
      status: 'active',
      description: 'Проверка финансовых документов, юридическая проверка',
      icon: Shield,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Подписание договора',
      status: 'pending',
      description: 'SAFE/Convertible Note через Deal Room',
      icon: FileText,
      color: 'text-gray-400 bg-gray-100'
    },
    {
      title: 'Escrow перевод',
      status: 'pending',
      description: 'Инвестор переводит $150K на защищенный счет',
      icon: DollarSign,
      color: 'text-gray-400 bg-gray-100'
    },
    {
      title: 'Закрытие сделки',
      status: 'pending',
      description: 'Комиссия 2.5% списывается, стартап получает деньги',
      icon: CheckCircle2,
      color: 'text-gray-400 bg-gray-100'
    }
  ];

  const protectionMechanisms = [
    {
      title: 'Юридическая защита',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      items: [
        {
          name: 'Terms of Service',
          description: 'Обязательство платить комиссию даже при сделке вне платформы',
          status: 'Подписано при регистрации'
        },
        {
          name: 'Penalty за обход',
          description: 'Штраф 10% вместо 2.5% при доказанном обходе',
          status: 'Прописано в договоре'
        },
        {
          name: 'Право аудита',
          description: 'Платформа может запросить документы о сделке',
          status: '24 месяца с момента знакомства'
        }
      ]
    },
    {
      title: 'Технологические барьеры',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      items: [
        {
          name: 'Скрытие контактов',
          description: 'Email и телефон недоступны до serious interest',
          status: 'Активно'
        },
        {
          name: 'Блокировка в чате',
          description: 'Автоматическая цензура номеров телефонов и email',
          status: 'AI мониторинг'
        },
        {
          name: 'Детекция обхода',
          description: 'Мониторинг резкого прекращения общения на платформе',
          status: 'ML алгоритмы'
        }
      ]
    },
    {
      title: 'Ценность платформы',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      items: [
        {
          name: 'Deal Room',
          description: 'Готовые юридические шаблоны (SAFE, Term Sheet, NDA)',
          status: 'Экономия $2K-5K на юристах'
        },
        {
          name: 'Escrow-счет',
          description: 'Защита денег до выполнения условий сделки',
          status: 'Безопасность обеих сторон'
        },
        {
          name: 'Репутация',
          description: 'Verified бейджи, рейтинги, доступ к эксклюзивным проектам',
          status: 'Network effects'
        }
      ]
    }
  ];

  const bypassScenario = {
    attempt: 'Инвестор и стартап пытаются закрыть сделку напрямую',
    detection: [
      '✓ Система заметила резкое прекращение общения в чате',
      '✓ AI нашел обмен контактами (WhatsApp упоминание)',
      '✓ LinkedIn парсер обнаружил: стороны стали connections',
      '✓ Crunchbase показал: стартап анонсировал раунд $150K'
    ],
    action: [
      '📧 Автоматическое письмо обеим сторонам',
      '⚖️ Напоминание о ToS и обязательстве',
      '💰 Invoice на комиссию $3,750 (2.5%)',
      '⏰ 14 дней на оплату или штраф 10% = $15,000',
      '🚫 При игноре: блокировка + blacklist + возможность суда'
    ],
    outcome: '85% платят после напоминания, 10% оспаривают (редко выигрывают), 5% игнорируют (баним)'
  };

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
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white">Deal Room</h1>
            <p className="text-sm text-gray-300">Защита комиссии и безопасные сделки</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? '' : 'bg-white/10 text-white border-white/20'}
          >
            Обзор
          </Button>
          <Button
            variant={activeTab === 'process' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('process')}
            className={activeTab === 'process' ? '' : 'bg-white/10 text-white border-white/20'}
          >
            Процесс
          </Button>
          <Button
            variant={activeTab === 'protection' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('protection')}
            className={activeTab === 'protection' ? '' : 'bg-white/10 text-white border-white/20'}
          >
            Защита
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {activeTab === 'overview' && (
          <>
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 p-6">
              <h3 className="text-gray-900 mb-3">🎯 Проблема: Обход платформы</h3>
              <p className="text-sm text-gray-700 mb-4">
                <strong>Риск:</strong> Инвестор и стартап познакомились на платформе, 
                но закрыли сделку напрямую без уплаты комиссии 2.5%
              </p>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-3">Это стандартная проблема всех маркетплейсов:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span>🏠</span>
                    <p className="text-gray-700">Airbnb → гости бронируют напрямую</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>💼</span>
                    <p className="text-gray-700">Upwork → клиенты нанимают мимо платформы</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>💰</span>
                    <p className="text-gray-700">Инвестплатформы → сделки вне escrow</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-6">
              <h3 className="text-gray-900 mb-4">🛡️ Наше решение: 3 уровня защиты</h3>
              
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">1</div>
                    <h4 className="text-gray-900">Юридическая защита</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    ToS с обязательством, penalty 10% за обход, право аудита 24 месяца
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">2</div>
                    <h4 className="text-gray-900">Технологические барьеры</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Скрытие контактов, блокировка в чате, AI детекция обхода
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">3</div>
                    <h4 className="text-gray-900">Ценность платформы</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Deal Room, escrow, готовые документы - дешевле чем юристы
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="text-gray-900">Пример: Попытка обхода</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-900 mb-2">😈 Попытка:</p>
                  <p className="text-sm text-gray-600 bg-white rounded-lg p-3">
                    {bypassScenario.attempt}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-900 mb-2">🔍 Детекция:</p>
                  <div className="bg-white rounded-lg p-3 space-y-1">
                    {bypassScenario.detection.map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-600">{item}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-900 mb-2">⚡ Действия:</p>
                  <div className="bg-white rounded-lg p-3 space-y-1">
                    {bypassScenario.action.map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-600">{item}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-100 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <strong>📊 Результат:</strong> {bypassScenario.outcome}
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'process' && (
          <>
            <Card className="bg-white p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">Пример сделки</h3>
                  <p className="text-sm text-gray-600">{dealExample.startup} × {dealExample.investor}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700">{dealExample.stage}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Сумма инвестиций</p>
                  <p className="text-xl text-gray-900">${dealExample.amount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Комиссия (2.5%)</p>
                  <p className="text-xl text-green-600">${dealExample.commission.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Прогресс сделки</span>
                  <span className="text-gray-900">{dealExample.progress}%</span>
                </div>
                <Progress value={dealExample.progress} className="h-2" />
              </div>
            </Card>

            <div className="space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className={`p-4 ${step.status === 'active' ? 'border-2 border-blue-500' : ''}`}>
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${step.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-gray-900">{step.title}</h4>
                          {step.status === 'completed' && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                          {step.status === 'active' && (
                            <Clock className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
              <h3 className="text-white mb-3">💡 Почему Deal Room выгоден?</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Готовые шаблоны SAFE, Term Sheet - экономия $2K-5K на юристах</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Escrow-счет защищает деньги обеих сторон</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Электронные подписи через DocuSign</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Персональный менеджер для сделок $500K+</p>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'protection' && (
          <>
            {protectionMechanisms.map((mechanism, index) => {
              const Icon = mechanism.icon;
              return (
                <Card key={index} className="bg-white p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${mechanism.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-gray-900">{mechanism.title}</h3>
                  </div>

                  <div className="space-y-3">
                    {mechanism.items.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-gray-900">{item.name}</h4>
                          <Badge variant="secondary" className="text-xs">{item.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 p-6">
              <h3 className="text-gray-900 mb-4">📊 Эффективность защиты</h3>
              
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Честно платят комиссию</span>
                    <span className="text-xl text-green-600">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Пытаются обойти, но платят после напоминания</span>
                    <span className="text-xl text-blue-600">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>

                <div className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Игнорируют (баним + blacklist)</span>
                    <span className="text-xl text-red-600">5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Итого:</strong> ~95% комиссий собираются успешно. 
                  Это выше среднего по индустрии (80-85%)
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h3 className="text-white mb-4">🎯 Золотое правило</h3>
              <p className="text-blue-100 text-sm mb-4">
                Сделать обход платформы <strong className="text-white">ДОРОЖЕ и СЛОЖНЕЕ</strong>, 
                чем просто заплатить 2.5%
              </p>
              
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-100 mb-1">Обход платформы:</p>
                    <p className="text-white">Риск штрафа 10%</p>
                    <p className="text-white">Нет юр. защиты</p>
                    <p className="text-white">Потеря репутации</p>
                    <p className="text-white">Блокировка</p>
                  </div>
                  <div>
                    <p className="text-blue-100 mb-1">Через платформу:</p>
                    <p className="text-white">Комиссия 2.5%</p>
                    <p className="text-white">Deal Room</p>
                    <p className="text-white">Escrow защита</p>
                    <p className="text-white">Репутация растет</p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
