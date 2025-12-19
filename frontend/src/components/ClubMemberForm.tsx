import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

import { clubMembershipService } from '../services/clubMembershipService';
import type { CreateClubMembershipApplicationDto } from '../types/clubMembership';

interface ClubMemberFormProps {
  onBack: () => void;
  onSubmit?: () => void;
}

export default function ClubMemberForm({ onBack, onSubmit }: ClubMemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    industry: '',
    position: '',
    motivation: '',
  });

  const [myStatus, setMyStatus] = useState<'none' | 'Pending' | 'Approved' | 'Rejected'>('none');
  const [isChecking, setIsChecking] = useState(true);

  const APP_BOTTOM_NAV_PX = 72;

  const inputCls =
    'bg-white/5 text-white placeholder:text-[var(--color_c)] border-white/15 rounded-2xl h-12 px-4 ' +
    'focus-visible:ring-0 focus-visible:border-[var(--color_b)]';

  const textareaCls =
    'bg-white/5 text-white placeholder:text-[var(--color_c)] border-white/15 rounded-2xl px-4 py-3 ' +
    'focus-visible:ring-0 focus-visible:border-[var(--color_b)] min-h-[220px] resize-y';

  // ✅ подтянуть статус заявки, если уже есть
  useEffect(() => {
    const load = async () => {
      try {
        const me = await clubMembershipService.getMy();
        setMyStatus(me.status);
      } catch (e: any) {
        // 404 = заявки нет
        if (e?.response?.status !== 404) {
          console.error('club getMy error:', e?.response?.data || e);
        }
        setMyStatus('none');
      } finally {
        setIsChecking(false);
      }
    };
    load();
  }, []);

  const submitToBackend = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      toast('Заполните обязательные поля (*)');
      return;
    }

    if (myStatus === 'Pending') {
      toast('Ваша заявка уже в обработке');
      return;
    }
    if (myStatus === 'Approved') {
      toast('Вы уже являетесь членом клуба');
      return;
    }

    const payload: CreateClubMembershipApplicationDto = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      industry: form.industry?.trim() || null,
      position: form.position?.trim() || null,
      motivation: form.motivation?.trim() || null,
    };

    try {
      setIsSubmitting(true);
      await clubMembershipService.create(payload);

      setMyStatus('Pending');
      toast.success('Ваша заявка в обработке, ожидайте');
      onSubmit?.();

      // ✅ вернуться обратно на ParasatScreen (твой экран, откуда ты открыл форму)
      onBack();
    } catch (error: any) {
      console.error('club create error:', error?.response?.data || error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        'Не удалось отправить заявку';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color_a)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-4 border-b"
        style={{
          backgroundColor: 'var(--color_a)',
          borderColor: 'rgba(255,255,255,0.10)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg transition"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="leading-tight">
            <div className="text-white font-medium">Parasat Business Club</div>
            <div className="text-xs" style={{ color: 'var(--color_d)' }}>
              Заявка на резидентство
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <form
        // ⚠️ form оставляем для семантики, но submit делаем кнопкой снизу вручную
        onSubmit={(e) => {
          e.preventDefault();
          void submitToBackend();
        }}
        className="p-4"
        // ✅ запас снизу: таббар + наша панель + воздух
        style={{ paddingBottom: `calc(${APP_BOTTOM_NAV_PX}px + 220px)` }}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <div
            className="rounded-[28px] p-6 border shadow-2xl space-y-6"
            style={{
              borderColor: 'rgba(255,255,255,0.12)',
              backgroundColor: 'rgba(255,255,255,0.035)',
            }}
          >
            {/* Title */}
            <div className="text-center space-y-2">
              <div
                className="mx-auto w-14 h-14 rounded-full border"
                style={{ borderColor: 'rgba(255,255,255,0.18)' }}
              />

              <h1 className="text-white font-semibold tracking-wide">
                ФОРМА ЗАЯВКИ ДЛЯ РЕЗИДЕНТОВ КЛУБА
              </h1>

              <p className="text-sm" style={{ color: 'var(--color_d)' }}>
                Заполните форму и мы свяжемся с вами в ближайшее время
              </p>

              {/* Мини-статус */}
              {!isChecking && myStatus !== 'none' && (
                <div className="text-sm" style={{ color: 'var(--color_d)' }}>
                  {myStatus === 'Pending' && 'Статус: заявка в обработке'}
                  {myStatus === 'Approved' && 'Статус: вы резидент клуба'}
                  {myStatus === 'Rejected' && 'Статус: заявка отклонена'}
                </div>
              )}
            </div>

            {/* Price */}
            <div
              className="rounded-2xl border px-5 py-4 text-center"
              style={{ borderColor: 'rgba(255,255,255,0.18)' }}
            >
              <div className="text-sm" style={{ color: 'var(--color_d)' }}>
                Стоимость годового членства в клубе
              </div>
              <div className="mt-1 text-lg font-semibold text-white">3 000 000 тенге</div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 min-[520px]:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Ваше имя *</Label>
                <Input
                  className={inputCls}
                  placeholder="Введите ваше имя"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Ваша фамилия *</Label>
                <Input
                  className={inputCls}
                  placeholder="Введите вашу фамилию"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>

              <div className="space-y-2 min-[520px]:col-span-2">
                <Label className="text-white">Email *</Label>
                <Input
                  className={inputCls}
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-2 min-[520px]:col-span-2">
                <Label className="text-white">Номер телефона *</Label>
                <Input
                  className={inputCls}
                  placeholder="+7 777 777 77 77"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Отрасль</Label>
                <Input
                  className={inputCls}
                  placeholder="IT, Финансы, Медицина..."
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Должность</Label>
                <Input
                  className={inputCls}
                  placeholder="Ваша должность"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                />
              </div>

              <div className="space-y-2 min-[520px]:col-span-2">
                <Label className="text-white">Почему вы хотите стать резидентом клуба</Label>
                <Textarea
                  className={textareaCls}
                  placeholder="Расскажите о ваших целях, мотивации и чем вы можете быть полезны клубу..."
                  value={form.motivation}
                  onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                  rows={9}
                />
              </div>

              {/* дополнительный воздух внутри, чтобы поле не упиралось в низ */}
              <div className="min-[520px]:col-span-2 h-10" />
            </div>
          </div>
        </div>
      </form>

      {/* Bottom bar */}
      <div
        className="fixed left-0 right-0 p-4 border-t"
        style={{
          bottom: `${APP_BOTTOM_NAV_PX}px`,
          backgroundColor: 'rgba(8,26,95,0.92)',
          borderColor: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-2xl mx-auto space-y-3">
          {/* ⚠️ ВАЖНО: кнопка вне формы, поэтому type=button и вручную submit */}
          <Button
            type="button"
            className="w-full h-14 rounded-2xl text-white font-semibold shadow-lg"
            style={{ backgroundColor: 'var(--color_g)' }}
            disabled={
              isSubmitting ||
              isChecking ||
              myStatus === 'Pending' ||
              myStatus === 'Approved'
            }
            onClick={() => void submitToBackend()}
          >
            {isChecking
              ? 'Проверяем...'
              : myStatus === 'Approved'
                ? 'ВЫ УЖЕ В КЛУБЕ'
                : myStatus === 'Pending'
                  ? 'ЗАЯВКА В ОБРАБОТКЕ'
                  : isSubmitting
                    ? 'Отправляем...'
                    : 'ОТПРАВИТЬ'}
          </Button>

          <button
            type="button"
            className="w-full text-sm"
            style={{ color: 'var(--color_d)' }}
            onClick={async () => {
              try {
                const me = await clubMembershipService.getMy();
                if (me.status === 'Approved') {
                  toast.success('Вы уже член клуба ✅');
                  return;
                }
                if (me.status === 'Pending') {
                  toast('Заявка ещё на рассмотрении');
                  return;
                }
                if (me.status === 'Rejected') {
                  toast('Заявка была отклонена');
                  return;
                }
              } catch (e: any) {
                if (e?.response?.status === 404) {
                  toast('Заявки ещё нет — заполните форму и отправьте');
                  return;
                }
                toast('Ошибка проверки статуса');
              }
            }}
          >
            Если вы уже являетесь членом клуба — войти
          </button>
        </div>
      </div>
    </div>
  );
}
