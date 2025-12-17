import { useState } from 'react';
import { TrendingUp, Users, DollarSign, Calculator, ArrowLeft } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface UnitEconomicsProps {
  onBack: () => void;
}

export default function UnitEconomics({ onBack }: UnitEconomicsProps) {
  const [users, setUsers] = useState(1000);
  const [conversionToInvestor, setConversionToInvestor] = useState(10);
  const [dealsPerInvestor, setDealsPerInvestor] = useState(0.3);
  const [avgDealSize, setAvgDealSize] = useState(150000);
  const [commission, setCommission] = useState(2.5);

  // Расчеты
  const activeInvestors = Math.floor(users * (conversionToInvestor / 100));
  const totalDeals = Math.floor(activeInvestors * dealsPerInvestor);
  const totalVolume = totalDeals * avgDealSize;
  const revenue = totalVolume * (commission / 100);
  const revenuePerPartner = revenue / 2;

  // Затраты
  const developmentCost = 15000;
  const marketingCost = 15000;
  const legalCost = 3000;
  const totalInvestment = developmentCost + marketingCost + legalCost;
  const investmentPerPartner = totalInvestment / 2;

  // ROI
  const roi = ((revenuePerPartner - investmentPerPartner) / investmentPerPartner) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
          <span className="text-sm">Назад</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white">Юнит-экономика</h1>
            <p className="text-sm text-gray-300">Интерактивный калькулятор бизнеса</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        <Card className="bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900">Ключевые метрики</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Общая выручка</p>
              <p className="text-2xl text-blue-600">${(revenue / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-500 mt-1">год 1</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Твоя доля (50%)</p>
              <p className="text-2xl text-purple-600">${(revenuePerPartner / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-500 mt-1">год 1</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">ROI</p>
              <p className="text-2xl text-green-600">{roi.toFixed(0)}%</p>
              <p className="text-xs text-gray-500 mt-1">за 12 месяцев</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Сделок</p>
              <p className="text-2xl text-orange-600">{totalDeals}</p>
              <p className="text-xs text-gray-500 mt-1">год 1</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="text-gray-900">Настройки модели</h2>
            <Badge variant="secondary" className="ml-auto">Интерактивно</Badge>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="users">Количество пользователей</Label>
              <Input
                id="users"
                type="number"
                value={users}
                onChange={(e) => setUsers(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Прогноз на первый год</p>
            </div>

            <div>
              <Label htmlFor="conversion">Конверсия в активных инвесторов (%)</Label>
              <Input
                id="conversion"
                type="number"
                value={conversionToInvestor}
                onChange={(e) => setConversionToInvestor(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Активных инвесторов: {activeInvestors}
              </p>
            </div>

            <div>
              <Label htmlFor="deals">Сделок на инвестора в год</Label>
              <Input
                id="deals"
                type="number"
                step="0.1"
                value={dealsPerInvestor}
                onChange={(e) => setDealsPerInvestor(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Консервативная оценка: 30% делают 1 сделку
              </p>
            </div>

            <div>
              <Label htmlFor="dealsize">Средний размер сделки ($)</Label>
              <Input
                id="dealsize"
                type="number"
                value={avgDealSize}
                onChange={(e) => setAvgDealSize(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Типичная инвестиция в ранний стартап
              </p>
            </div>

            <div>
              <Label htmlFor="commission">Комиссия платформы (%)</Label>
              <Input
                id="commission"
                type="number"
                step="0.1"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Наша комиссионная модель</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 p-6">
          <h3 className="text-gray-900 mb-4">Детальный расчет</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Пользователей</span>
              <span className="text-gray-900">{users.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">× Конверсия в инвесторов ({conversionToInvestor}%)</span>
              <span className="text-gray-900">{activeInvestors}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">× Сделок на инвестора ({dealsPerInvestor})</span>
              <span className="text-gray-900">{totalDeals} сделок</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">× Средний чек (${avgDealSize.toLocaleString()})</span>
              <span className="text-gray-900">${(totalVolume / 1000000).toFixed(2)}M</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">× Комиссия ({commission}%)</span>
              <span className="text-blue-600">${revenue.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between pt-3 border-t-2 border-blue-200">
              <span className="font-medium text-gray-900">Годовая выручка</span>
              <span className="font-medium text-blue-600">${revenue.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between bg-blue-100 -mx-6 px-6 py-3 rounded-b-xl">
              <span className="font-medium text-gray-900">Твоя доля (50%)</span>
              <span className="text-xl text-blue-600">${revenuePerPartner.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-6">
          <h3 className="text-gray-900 mb-4">Инвестиции и ROI</h3>
          
          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Разработка MVP → Production</span>
              <span className="text-gray-900">${developmentCost.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Маркетинг и реклама</span>
              <span className="text-gray-900">${marketingCost.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Юридические услуги</span>
              <span className="text-gray-900">${legalCost.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between pt-3 border-t-2 border-orange-200">
              <span className="font-medium text-gray-900">Всего инвестиций</span>
              <span className="font-medium text-orange-600">${totalInvestment.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between bg-orange-100 -mx-6 px-6 py-3">
              <span className="font-medium text-gray-900">Твоя доля (50%)</span>
              <span className="text-xl text-orange-600">${investmentPerPartner.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Доход (год 1)</span>
              <span className="text-green-600">${revenuePerPartner.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Инвестиция</span>
              <span className="text-orange-600">-${investmentPerPartner.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">Чистая прибыль</span>
              <span className="text-green-600">${(revenuePerPartner - investmentPerPartner).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 bg-green-100 -mx-4 px-4 py-3 rounded-b-xl">
              <span className="font-medium text-gray-900">ROI за год</span>
              <span className="text-2xl text-green-600">{roi.toFixed(0)}%</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 p-6">
          <h3 className="text-gray-900 mb-4">Сценарии развития</h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-900">😰 Пессимистичный</h4>
                <Badge variant="outline">50% от плана</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Пользователей</span>
                  <span className="text-gray-900">{Math.floor(users * 0.5)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Твой доход</span>
                  <span className="text-gray-900">${(revenuePerPartner * 0.5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">ROI</span>
                  <span className={`${(roi * 0.5) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(roi * 0.5).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-900">😊 Реалистичный</h4>
                <Badge className="bg-blue-600">Базовый план</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Пользователей</span>
                  <span className="text-gray-900">{users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Твой доход</span>
                  <span className="text-gray-900">${revenuePerPartner.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200">
                  <span className="text-gray-600">ROI</span>
                  <span className="text-green-600">{roi.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-900">🚀 Оптимистичный</h4>
                <Badge variant="outline" className="bg-green-100 text-green-700">5x рост</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Пользователей</span>
                  <span className="text-gray-900">{Math.floor(users * 5)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Твой доход</span>
                  <span className="text-gray-900">${(revenuePerPartner * 5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">ROI</span>
                  <span className="text-green-600">{(roi * 5).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h3 className="text-white mb-4">💡 Ключевые выводы</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">1</span>
              </div>
              <p className="text-blue-100">
                <span className="text-white font-medium">Низкий риск:</span> Даже при 50% от плана ROI положительный
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">2</span>
              </div>
              <p className="text-blue-100">
                <span className="text-white font-medium">Масштабируемость:</span> Каждый новый пользователь = $0 затрат
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">3</span>
              </div>
              <p className="text-blue-100">
                <span className="text-white font-medium">Потенциал x10:</span> При росте в 10 раз твой доход = ${(revenuePerPartner * 10 / 1000).toFixed(0)}K/год
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
