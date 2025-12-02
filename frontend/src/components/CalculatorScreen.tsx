import { ArrowLeft, Calculator, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState, useEffect } from 'react';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface CalculatorScreenProps {
  navigateTo: (screen: any) => void;
}

export default function CalculatorScreen({ navigateTo }: CalculatorScreenProps) {
  const [investmentAmount, setInvestmentAmount] = useState('10000000');
  const [equityPercent, setEquityPercent] = useState('10');
  const [currentValuation, setCurrentValuation] = useState('100000000');
  const [futureValuation, setFutureValuation] = useState('500000000');
  const [investmentPeriod, setInvestmentPeriod] = useState('5');

  const calculateResults = () => {
    const investment = parseFloat(investmentAmount.replace(/\s/g, '')) || 0;
    const equity = parseFloat(equityPercent) || 0;
    const futureVal = parseFloat(futureValuation.replace(/\s/g, '')) || 0;
    const years = parseFloat(investmentPeriod) || 1;

    if (investment <= 0 || equity <= 0 || future <= 0 || years <= 0) {
      return null;
    }

    const equityValueAtExit = (futureVal * equity) / 100;
    const grossProfit = equityValueAtExit - investment;
    const platformFee = investment * 0.025;
    const netProfit = grossProfit - platformFee;

    const roi = (grossProfit / investment) * 100;
    const netRoi = (netProfit / investment) * 100;
    const multiple = equityValueAtExit / investment;

    const cagr = (Math.pow(equityValueAtExit / investment, 1 / years) - 1) * 100;

    const impliedPreMoney = (investment / equity) * 100 - investment;

    return {
      equityValueAtExit,
      grossProfit,
      netProfit,
      platformFee,
      roi,
      netRoi,
      multiple,
      cagr,
      impliedPreMoney: impliedPreMoney > 0 ? impliedPreMoney : 0,
    };
  };

  const results = calculateResults();

  const formatNumber = (num: number) => {
    return num.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
  };

  const formatPercent = (num: number) => {
    return num.toFixed(1).replace('.', ',') + '%';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
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
          <h1 className="text-lg font-semibold text-gray-900">Калькулятор ROI</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Рассчитайте доходность</h2>
              <p className="text-sm text-gray-600">Прогноз ROI инвестиций</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Инструмент поможет оценить потенциальную доходность с учётом комиссии платформы 2,5%
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium">Параметры инвестиции</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Сумма инвестиций (₸)</Label>
              <Input
                type="text"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="10 000 000"
              />
            </div>

            <div className="space-y-2">
              <Label>Доля в компании (%)</Label>
              <Input
                type="text"
                value={equityPercent}
                onChange={(e) => setEquityPercent(e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label>Текущая оценка (₸) — опционально</Label>
              <Input
                type="text"
                value={currentValuation}
                onChange={(e) => setCurrentValuation(e.target.value)}
                placeholder="100 000 000"
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Прогноз оценки при выходе (₸)</Label>
              <Input
                type="text"
                value={futureValuation}
                onChange={(e) => setFutureValuation(e.target.value)}
                placeholder="500 000 000"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Горизонт инвестиций (лет)</Label>
              <Input
                type="text"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                placeholder="5"
              />
            </div>
          </div>
        </div>

        {results ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Результаты расчёта
              </Badge>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Стоимость вашей доли при выходе</p>
              <p className="text-4xl font-bold text-indigo-700">
                {formatNumber(results.equityValueAtExit)} ₸
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Множитель: <span className="font-bold text-indigo-600">{results.multiple.toFixed(2)}x</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-gray-600">Чистая прибыль</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatNumber(results.netProfit)} ₸
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Комиссия платформы (2,5%)</p>
                <p className="text-xl font-medium text-gray-800">
                  {formatNumber(results.platformFee)} ₸
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Годовая доходность (CAGR)</p>
                <p className="text-2xl font-bold text-purple-700">
                  {formatPercent(results.cagr)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">ROI</p>
                <p className="text-lg font-semibold">{formatPercent(results.roi)}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Чистый ROI</p>
                <p className="text-lg font-semibold text-green-700">{formatPercent(results.netRoi)}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Множитель</p>
                <p className="text-lg font-semibold text-blue-700">{results.multiple.toFixed(1)}x</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Pre-money (подразумеваемая)</p>
                <p className="text-lg font-semibold text-amber-700">
                  {formatNumber(results.impliedPreMoney)} ₸
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700">
              <p className="font-medium mb-1">Справка:</p>
              <p>
                Расчёт основан на доле {equityPercent}% при выходе компании по оценке {formatNumber(parseFloat(futureValuation))} ₸. 
                Комиссия платформы — 2,5% от суммы инвестиций. Фактические результаты зависят от условий выхода.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-500">
              Заполните сумму инвестиций, долю и прогноз оценки при выходе, чтобы увидеть результат
            </p>
          </div>
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