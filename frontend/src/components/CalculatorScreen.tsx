import { ArrowLeft, Calculator, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface CalculatorScreenProps {
  navigateTo: (screen: any) => void;
}

export default function CalculatorScreen({ navigateTo }: CalculatorScreenProps) {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [equityPercent, setEquityPercent] = useState('');
  const [currentValuation, setCurrentValuation] = useState('');
  const [futureValuation, setFutureValuation] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('');

  const calculateResults = () => {
    const investment = parseFloat(investmentAmount) || 0;
    const equity = parseFloat(equityPercent) || 0;
    const currentVal = parseFloat(currentValuation) || 0;
    const futureVal = parseFloat(futureValuation) || 0;
    const period = parseFloat(investmentPeriod) || 1;

    if (investment === 0 || equity === 0 || futureVal === 0) {
      return null;
    }

    // Расчеты
    const equityValue = (futureVal * equity) / 100;
    const profit = equityValue - investment;
    const roi = ((profit / investment) * 100);
    const annualizedReturn = (Math.pow(futureVal / investment, 1 / period) - 1) * 100;
    const platformFee = investment * 0.025; // 2.5% комиссия
    const netProfit = profit - platformFee;
    const netRoi = ((netProfit / investment) * 100);
    const multiple = equityValue / investment;

    return {
      equityValue,
      profit,
      roi,
      annualizedReturn,
      platformFee,
      netProfit,
      netRoi,
      multiple,
    };
  };

  const results = calculateResults();

  const formatNumber = (num: number) => {
    return num.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
  };

  const formatPercent = (num: number) => {
    return num.toLocaleString('ru-RU', { maximumFractionDigits: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('profile')}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="w-10 h-10 bg-slate-900 rounded-lg p-1.5">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-gray-900">Калькулятор ROI</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">Рассчитайте доходность</h2>
              <p className="text-sm text-gray-600">Прогноз ROI инвестиций</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Инструмент поможет оценить потенциальную доходность ваших инвестиций с учетом комиссии платформы
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">Параметры инвестиции</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Сумма инвестиций (₸)</Label>
              <Input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="10 000 000"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Доля в компании (%)</Label>
              <Input
                type="number"
                value={equityPercent}
                onChange={(e) => setEquityPercent(e.target.value)}
                placeholder="10"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Текущая оценка (₸)</Label>
              <Input
                type="number"
                value={currentValuation}
                onChange={(e) => setCurrentValuation(e.target.value)}
                placeholder="100 000 000"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Прогноз оценки при выходе (₸)</Label>
              <Input
                type="number"
                value={futureValuation}
                onChange={(e) => setFutureValuation(e.target.value)}
                placeholder="500 000 000"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Горизонт инвестиций (лет)</Label>
              <Input
                type="number"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                placeholder="5"
                className="text-base"
              />
            </div>
          </div>
        </div>

        {results && (
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Результаты расчета
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 space-y-2">
                <p className="text-sm text-gray-600">Стоимость вашей доли при выходе</p>
                <p className="text-2xl text-gray-900">{formatNumber(results.equityValue)} ₸</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-gray-500">Прибыль</p>
                  <p className="text-gray-900">{formatNumber(results.profit)} ₸</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-gray-500">Комиссия (2,5%)</p>
                  <p className="text-gray-900">{formatNumber(results.platformFee)} ₸</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 space-y-2 border border-green-200">
                <p className="text-sm text-gray-600">Чистая прибыль</p>
                <p className="text-2xl text-green-700">{formatNumber(results.netProfit)} ₸</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-gray-500">ROI</p>
                  <p className="text-gray-900">{formatPercent(results.roi)}%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-gray-500">Чистый ROI</p>
                  <p className="text-green-700">{formatPercent(results.netRoi)}%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-gray-500">Множитель</p>
                  <p className="text-gray-900">{formatPercent(results.multiple)}x</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-3 space-y-1">
                <p className="text-xs text-gray-600">Годовая доходность (IRR)</p>
                <p className="text-purple-700">{formatPercent(results.annualizedReturn)}%</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <p className="text-sm text-gray-700">
                💡 <span className="font-medium">Справка:</span> Расчет учитывает комиссию платформы 2,5% от суммы инвестиций. 
                Фактическая доходность зависит от успеха компании и условий выхода.
              </p>
            </div>
          </div>
        )}

        {!results && investmentAmount && (
          <div className="bg-white rounded-2xl p-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                Заполните все поля для расчета прогнозной доходности
              </p>
            </div>
          </div>
        )}

        {!investmentAmount && (
          <div className="bg-white rounded-2xl p-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Как пользоваться:</span>
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Укажите сумму, которую планируете инвестировать</li>
                <li>Введите долю в компании, которую получите</li>
                <li>Укажите текущую и прогнозную оценку компании</li>
                <li>Выберите горизонт инвестиций в годах</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
