import { ArrowLeft, Calculator, TrendingUp } from 'lucide-react';
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

  const parse = (val: string) => parseFloat(val.replace(/\s/g, '')) || 0;

  const calculateResults = () => {
    const investment = parse(investmentAmount);
    const equity = parse(equityPercent);
    const futureVal = parse(futureValuation);
    const period = parse(investmentPeriod) || 1;

    if (investment <= 0 || equity <= 0 || futureVal <= 0 || equity > 100) {
      return null;
    }

    const equityValue = (futureVal * equity) / 100;
    const profit = equityValue - investment;
    const platformFee = investment * 0.025;
    const netProfit = profit - platformFee;

    const roi = (profit / investment) * 100;
    const netRoi = (netProfit / investment) * 100;
    const multiple = equityValue / investment;

    const cagr = (Math.pow(equityValue / investment, 1 / period) - 1) * 100;

    return {
      equityValue,
      profit,
      netProfit,
      platformFee,
      roi,
      netRoi,
      multiple,
      cagr,
    };
  };

  const results = calculateResults();

  const formatNumber = (num: number) => {
    return num.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
  };

  const formatPercent = (num: number) => {
    return num.toFixed(1).replace('.', ',') + '%';
  };

  const handleEquityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      setEquityPercent(value);
    }
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
                type="text"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="10 000 000"
                className="text-base text-gray-900 placeholder:text-gray-400"

              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Доля в компании (%)</Label>
              <Input
                type="text"
                value={equityPercent}
                onChange={handleEquityChange}
                placeholder="10"
                className="text-base text-gray-900 placeholder:text-gray-400"

              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Текущая оценка (₸)</Label>
              <Input
                type="text"
                value={currentValuation}
                onChange={(e) => setCurrentValuation(e.target.value)}
                placeholder="100 000 000"
                className="text-base text-gray-900 placeholder:text-gray-400"

              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Прогноз оценки при выходе (₸)</Label>
              <Input
                type="text"
                value={futureValuation}
                onChange={(e) => setFutureValuation(e.target.value)}
                placeholder="500 000 000"
                className="text-base text-gray-900 placeholder:text-gray-400"

              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Горизонт инвестиций (лет)</Label>
              <Input
                type="text"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                placeholder="5"
                className="text-base text-gray-900 placeholder:text-gray-400"

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
                  <p className="text-gray-900">{formatPercent(results.roi)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-gray-500">Чистый ROI</p>
                  <p className="text-green-700">{formatPercent(results.netRoi)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-gray-500">Множитель</p>
                  <p className="text-gray-900">{results.multiple.toFixed(1)}x</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-3 space-y-1">
                <p className="text-xs text-gray-600">Годовая доходность (CAGR)</p>
                <p className="text-purple-700">{formatPercent(results.cagr)}</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <p className="text-sm text-gray-700">
                Справка: Расчет учитывает комиссию платформы 2,5% от суммы инвестиций. 
                Фактическая доходность зависит от успеха компании и условий выхода.
              </p>
            </div>
          </div>
        )}

        {!results && (investmentAmount || equityPercent || futureValuation || investmentPeriod) && (
          <div className="bg-white rounded-2xl p-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                Заполните все обязательные поля (сумма, доля, прогноз выхода) для расчета
              </p>
            </div>
          </div>
        )}

<div className="bg-white rounded-2xl p-6 space-y-4">
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

  <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-200">
    <p className="space-y-1 text-xl sm:text-sm font-mono text-gray-900">
      Формулы расчёта
    </p>

    <div className="space-y-1 text-xs sm:text-sm font-mono text-gray-700">
      <p>
        1. <span className="font-semibold">Стоимость доли при выходе</span> = Прогноз оценки × Доля (%) / 100
      </p>
      <p>
        2. <span className="font-semibold">Прибыль (gross)</span> = Стоимость доли − Сумма инвестиций
      </p>
      <p>
        3. <span className="font-semibold">Комиссия платформы</span> = Сумма инвестиций × 2,5%
      </p>
      <p>
        4. <span className="font-semibold">Чистая прибыль</span> = Прибыль − Комиссия платформы
      </p>
      <p>
        5. <span className="font-semibold">ROI</span> = (Прибыль / Инвестиции) × 100%
      </p>
      <p>
        6. <span className="font-semibold">Чистый ROI</span> = (Чистая прибыль / Инвестиции) × 100%
      </p>
      <p>
        7. <span className="font-semibold">Множитель (MOIC)</span> = Стоимость доли / Инвестиции
      </p>
      <p>
        8. <span className="font-semibold">CAGR</span> = (Множитель<sup>1 / лет</sup> − 1) × 100%
      </p>
      <p>
        9. <span className="font-semibold">Pre-money оценка</span> = (Инвестиции / Доля%) × 100 − Инвестиции
      </p>
    </div>

    <p className="mt-2 text-[11px] sm:text-xs text-gray-500">
      Эти формулы используются калькулятором выше для расчёта всех показателей.
    </p>
  </div>
</div>
      </div>
    </div>
  );
}