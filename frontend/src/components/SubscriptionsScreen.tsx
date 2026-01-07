import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, Shield, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { subscriptionService, SubscriptionStatusDto } from '../services/subscriptionService';

type PlanMonths = 1 | 3 | 6 | 12;

interface SubscriptionsScreenProps {
  onBack: () => void;
  userRole?: string | null;
}

const PRICE_PER_MONTH = 30000;

const DISCOUNTS: Record<PlanMonths, number> = {
  1: 0,     // без скидки
  3: 0.05,   // -5%
  6: 0.1,   // -10%
  12: 0.15,  // -15%
};

const PLAN_GRADIENTS: Record<PlanMonths, string> = {
  1:  'from-blue-500/10 to-blue-600/20',
  3:  'from-indigo-500/10 to-indigo-600/20',
  6:  'from-sky-500/10 to-sky-600/20',
  12: 'from-violet-500/10 to-violet-600/20',
};


export default function SubscriptionsScreen({ onBack, userRole }: SubscriptionsScreenProps) {
  const [status, setStatus] = useState<SubscriptionStatusDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [buyingMonths, setBuyingMonths] = useState<number | null>(null);

  const plans = useMemo(
    () =>
      ([1, 3, 6, 12] as PlanMonths[]).map((m) => ({
        months: m,
        total: Math.round(m * PRICE_PER_MONTH * (1 - DISCOUNTS[m])),
        discountPercent: DISCOUNTS[m] * 100,
        label: `${m} ${m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев'}`,
      })),
    []
  );

  const load = async () => {
    try {
      setLoading(true);
      const s = await subscriptionService.getStatus();
      setStatus(s);
    } catch (e: any) {
      toast.error(e?.message || 'Не удалось загрузить статус подписки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const canBuy = userRole === 'startup' || userRole === 'business' || userRole === 'buisnes'; // на всякий (если роль криво написана)
  const active = !!status?.isActive;

  const onBuy = async (months: PlanMonths) => {
    try {
      setBuyingMonths(months);
      const s = await subscriptionService.createOrExtend(months);
      setStatus(s);
      toast.success('Подписка активирована/продлена');
    } catch (e: any) {
      toast.error(e?.message || 'Не удалось оформить подписку');
    } finally {
      setBuyingMonths(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    // локаль можешь сменить, но норм и так
    return d.toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">Подписка на контакты инвесторов</h1>
            <p className="text-sm text-gray-500">Для стартапов и бизнесов</p>
          </div>
          <Badge variant={active ? 'secondary' : 'outline'}>
            {active ? 'Активна' : 'Не активна'}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900">Что даёт подписка</h2>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Открывает контакты инвесторов в профилях / карточках</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Одна подписка — доступ со всех твоих проектов</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Продление добавляет месяцы к текущему сроку</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-gray-900">
                  30 000 ₸ / месяц
                </Badge>

                <Badge variant="outline" className="text-gray-900">
                  1 / 3 / 6 / 12 месяцев
                </Badge>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                {loading ? (
                  <span className="text-gray-500">Загрузка статуса...</span>
                ) : active && status?.expiresAt ? (
                  <span>
                    Активна до: <b>{formatDate(status.expiresAt)}</b>
                  </span>
                ) : (
                  <span className="text-gray-500">Подписка не активна</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-900">Выберите срок</h2>
          </div>

          {!canBuy && (
            <div className="mt-3 text-sm text-gray-600">
              Подписка нужна только стартапам/бизнесам. Для твоей роли оформление отключено.
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3">
            {plans.map((p) => (
                <div
                    key={p.months}
                    className={`
    rounded-2xl border p-6
    bg-gradient-to-br ${PLAN_GRADIENTS[p.months]}
    shadow-sm hover:shadow-md
    transition-all
    flex items-center justify-between gap-4
  `}
                >
                <div className="min-w-0">
                  <div className="min-w-0">
                    <div className="text-xl font-semibold text-gray-900">{p.label}</div>

                    <div className="mt-1 text-sm text-gray-500">
                      {p.discountPercent > 0 && (
                          <div
                              className="text-xs text-gray-400"
                              style={{ textDecoration: 'line-through' }}
                          >
                            {(PRICE_PER_MONTH * p.months).toLocaleString('ru-RU')} ₸
                          </div>
                      )}

                      <div className="text-base">
                        <b className="text-gray-900">{p.total.toLocaleString('ru-RU')} ₸</b>
                        <span className="text-gray-500"> / {p.months} мес</span>
                      </div>

                      {p.discountPercent > 0 && (
                          <div className="mt-1 text-xs text-green-600">Скидка −{p.discountPercent}%</div>
                      )}
                    </div>
                  </div>
                </div>

                  <Button
                      disabled={!canBuy || buyingMonths !== null}
                      onClick={() => onBuy(p.months)}
                      className="shrink-0 h-11 px-5 rounded-xl"
                  >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {buyingMonths === p.months ? 'Оформляем...' : active ? 'Продлить' : 'Купить'}
                </Button>
              </div>
            ))}
          </div>

          {/*<div className="mt-4 text-xs text-gray-500">*/}
          {/*  Сейчас это “включатель доступа” через API (без реальной оплаты). Когда подключишь оплату — просто*/}
          {/*  заменишь `createOrExtend` на оплату → подтверждение → этот же POST.*/}
          {/*</div>*/}
        </div>

        <div className="pb-16" />
      </div>
    </div>
  );
}
