import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

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

  // ⚠️ у тебя в приложении есть нижний таббар. Поднимем нашу панель выше него.
  // Если у тебя таббар другой высоты — поменяй на 64/72/80.
  const APP_BOTTOM_NAV_PX = 72;

  const inputCls =
    'bg-white/5 text-white placeholder:text-[var(--color_c)] border-white/15 rounded-2xl h-12 px-4 ' +
    'focus-visible:ring-0 focus-visible:border-[var(--color_b)]';

  const textareaCls =
    'bg-white/5 text-white placeholder:text-[var(--color_c)] border-white/15 rounded-2xl px-4 py-3 ' +
    'focus-visible:ring-0 focus-visible:border-[var(--color_b)] min-h-[220px] resize-y';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      toast('Заполните обязательные поля (*)');
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 400));

      toast.success('Заявка отправлена');
      onSubmit?.();
      onBack();
    } catch {
      toast.error('Не удалось отправить заявку');
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
        onSubmit={handleSubmit}
        className="p-4"
        // ✅ реальный запас снизу: высота нашей панели + таббар + воздух
        style={{ paddingBottom: `calc(${APP_BOTTOM_NAV_PX}px + 220px)` }}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          {/* CARD */}
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
            {/* ✅ 2 колонки начиная уже с 520px (а на телефоне 1 колонка) */}
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

              {/* ✅ всегда во всю ширину грида */}
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

              {/* ✅ ВОТ ТВОЁ “ПРОСТРАНСТВО” после поля: доп. воздух внутри контента */}
              <div className="min-[520px]:col-span-2 h-10" />
            </div>
          </div>
        </div>
      </form>

      {/* Bottom bar */}
      <div
        className="fixed left-0 right-0 p-4 border-t"
        style={{
          // ✅ поднимаем выше таббара приложения
          bottom: `${APP_BOTTOM_NAV_PX}px`,
          backgroundColor: 'rgba(8,26,95,0.92)',
          borderColor: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-2xl mx-auto space-y-3">
          <Button
            type="submit"
            className="w-full h-14 rounded-2xl text-white font-semibold shadow-lg"
            style={{ backgroundColor: 'var(--color_g)' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Отправляем...' : 'ОТПРАВИТЬ'}
          </Button>

          <button
            type="button"
            className="w-full text-sm"
            style={{ color: 'var(--color_d)' }}
            onClick={() => toast('Тут потом будет логика входа/проверки членства')}
          >
            Если вы уже являетесь членом клуба — войти
          </button>
        </div>
      </div>
    </div>
  );
}
