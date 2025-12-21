import React from 'react';
import {
  Phone,
  MessageCircle,
  Instagram,
  MapPin,
  Youtube,
  ChevronLeft,
  Globe,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  CalendarDays,
  ExternalLink,
  Building2,
  Quote,
} from 'lucide-react';
import { Button } from './ui/button';
import type { Screen } from '../App';

import dubaiImg from '../assets/about/dubai.jpg';
import londonImg from '../assets/about/london.jpg';
import summitImg from '../assets/about/summit.jpg';
import g1 from '../assets/about/gallery-1.jpg';
import g2 from '../assets/about/gallery-2.jpg';
import g3 from '../assets/about/gallery-3.jpg';
import g4 from '../assets/about/gallery-4.jpg';
import g5 from '../assets/about/dubai.jpg';
import g6 from '../assets/about/london.jpg';
import g7 from '../assets/about/summit.jpg';
import g8 from '../assets/about/hero.jpg';

const gallery = [g1, g2, g3, g4, g5, g6, g7, g8];

interface AboutUsProps {
  navigateTo: (screen: Screen) => void;
}

const forbesLinks = [
  {
    title: 'Forbes: Parasat Business Club открыл филиал в Дубае',
    url: 'https://forbes.kz/articles/parasat-business-club-otkryl-filial-v-dubae-90e8a7',
    meta: 'Апрель 2025 • Международный филиал (Dubai)',
  },
  {
    title: 'Forbes: Филиал в Лондоне — выход на международный уровень',
    url: 'https://forbes.kz/articles/filial-v-londone-biznes-klub-parasat-vyhodit-na-mezhdunarodnyy-uroven-2ebd9e',
    meta: 'Январь 2025 • Открытие в London',
  },
  {
    title: 'Forbes: Parasat 2025 — новая Конституция и смена председателя',
    url: 'https://forbes.kz/articles/parasat-2025-smena-predsedatelya-i-novaya-konstitutsiya-c19e8a',
    meta: 'Декабрь 2025 • Ежегодный слёт',
  },
  {
    title: 'Тег Forbes: Parasat Business Club (все материалы)',
    url: 'https://forbes.kz/tag/parasat-business-club',
    meta: 'Подборка публикаций',
  },
];

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export default function AboutUs({ navigateTo }: AboutUsProps) {
  const handlePhoneClick = () => (window.location.href = 'tel:+77088660423');
  const handleWhatsAppClick = () =>
    (window.location.href = 'https://wa.me/77088660423');
  const handleInstagramClick = () =>
    window.open('https://www.instagram.com/parasat_business_club/', '_blank');
  const handleYouTubeClick = () =>
    window.open(
      'https://youtube.com/@parasatbusinessclub2024?si=Be6OMSO5Gqav4HUK',
      '_blank'
    );
  const openLink = (url: string) => window.open(url, '_blank');

  return (
    <div className="min-h-screen bg-background">
 

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12 space-y-8 md:space-y-10">
        {/* Title / Intro */}
        <section className="space-y-4">

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Parasat Business Club
              </h2>
              <p className="mt-2 text-white/80 max-w-2xl leading-relaxed">
                Сообщество предпринимателей, инвесторов и управленцев. Здесь
                ценят вклад, культуру партнёрства и стратегическое мышление —
                и строят долгую игру.
              </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                onClick={handleWhatsAppClick}
                className="w-full sm:w-auto rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  openLink('https://forbes.kz/tag/parasat-business-club')
                }
                className="w-full sm:w-auto rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Forbes
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 md:p-6">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-white mt-0.5" />
              <div className="text-white/85 leading-relaxed">
                <span className="font-semibold text-white">Сообщество, а не формат.</span>{' '}
                Ключевая идея Parasat — личный вклад, ответственность и уважение
                как основа партнёрства.
              </div>
            </div>
          </div>
        </section>

        {/* Facts (clean, consistent spacing) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              icon: Users,
              title: 'Сообщество',
              text: 'Предприниматели • инвесторы • управленцы',
            },
            {
              icon: Globe,
              title: 'География',
              text: 'Казахстан • Dubai • London',
            },
            {
              icon: CalendarDays,
              title: 'Формат',
              text: 'Форумы • стратег-сессии • встречи',
            },
            {
              icon: Building2,
              title: 'Фокус',
              text: 'Рост • связи • масштабирование',
            },
          ].map((x, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-card-elevated p-4 md:p-5"
            >
              <x.icon className="w-5 h-5 text-white" />
              <div className="mt-2 text-white font-semibold">{x.title}</div>
              <div className="text-white/70 text-sm mt-1 leading-relaxed">
                {x.text}
              </div>
            </div>
          ))}
        </section>

        {/* Mission / Goal */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="card-blue rounded-2xl p-6 md:p-8 space-y-3">
            <h3 className="text-xl font-semibold text-white">Миссия</h3>
            <p className="text-white/85 leading-relaxed">
              Формирование новой бизнес-элиты Казахстана через развитие
              предпринимательского мышления, стратегических связей и
              международного сотрудничества.
            </p>
          </div>

          <div className="card-blue rounded-2xl p-6 md:p-8 space-y-3">
            <h3 className="text-xl font-semibold text-white">Цель</h3>
            <p className="text-white/85 leading-relaxed">
              Поддержка бизнес-лидеров, способных создавать устойчивые компании и
              масштабируемые проекты — в Казахстане и за его пределами.
            </p>
          </div>
        </section>

        {/* Dubai / London (media cards, no text on image) */}
        <section className="space-y-4">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <h3 className="text-2xl font-bold text-white">
              Международная сеть: Dubai & London
            </h3>
            <div className="text-white/70 text-sm">
              Подтверждено публикациями Forbes
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {[ 
              {
                img: dubaiImg,
                tag: 'Dubai Chapter',
                title: 'Филиал в Дубае',
                text: 'Официальное открытие международного филиала Parasat в Дубае.',
                link: forbesLinks[0].url,
              },
              {
                img: londonImg,
                tag: 'London Chapter',
                title: 'Филиал в Лондоне',
                text: 'Выход на международный уровень: новый чаптер в Лондоне.',
                link: forbesLinks[1].url,
              },
            ].map((x, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-white/10 bg-card-elevated"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
                  <div className="relative h-44 sm:h-full min-h-[160px]">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${x.img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: '50% 50%',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-white text-xs">
                      <Globe className="w-4 h-4" /> {x.tag}
                    </div>

                    <div className="text-white font-semibold text-lg">
                      {x.title}
                    </div>

                    <p className="text-white/80 text-sm leading-relaxed">
                      {x.text}
                    </p>

                    <Button
                      variant="outline"
                      onClick={() => openLink(x.link)}
                      className="rounded-2xl border-white/15 bg-white/5 hover:bg-white/10 text-white"
                    >
                      Читать Forbes <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* GALLERY */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Галерея</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((src, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-card-elevated"
              >
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-40 md:h-44 object-cover hover:scale-[1.03] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
              </div>
            ))}
          </div>
          </section>
        {/* What we do */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-white">Что делает клуб</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                icon: Users,
                title: 'Сильное сообщество',
                text: 'Объединяем предпринимателей и инвесторов для партнёрств и совместного роста.',
              },
              {
                icon: Briefcase,
                title: 'Деловые события',
                text: 'Форумы, бизнес-ужины, круглые столы, стратегические сессии с лидерами рынка.',
              },
              {
                icon: TrendingUp,
                title: 'Рост и масштабирование',
                text: 'Помогаем находить возможности, усиливать управление и выходить на новые рынки.',
              },
              {
                icon: Globe,
                title: 'Международные связи',
                text: 'Развиваем международную повестку и сеть чаптеров, включая Dubai и London.',
              },
            ].map((x, i) => (
              <div key={i} className="card-blue rounded-2xl p-6 md:p-7 space-y-3">
                <x.icon className="w-6 h-6 text-white" />
                <div className="text-white font-semibold text-lg">{x.title}</div>
                <div className="text-white/80 text-sm leading-relaxed">
                  {x.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Press */}
        <section className="space-y-4">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <h3 className="text-2xl font-bold text-white">Пресса и признание</h3>
            <div className="text-white/70 text-sm">Материалы Forbes про Parasat</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Featured */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-card-elevated">
              <div className="relative h-44">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${summitImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 50%',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-white text-xs">
                    <Award className="w-4 h-4" /> Forbes coverage
                  </div>
                  <div className="mt-2 text-white font-semibold text-lg">
                    Forbes: Parasat 2025 — итоги, Конституция, преемственность
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <p className="text-white/80 text-sm leading-relaxed">
                  Forbes освещает ключевые события клуба и стратегические изменения,
                  включая ежегодный слёт.
                </p>
                <Button
                  onClick={() => openLink(forbesLinks[2].url)}
                  className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Читать статью <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="card-blue rounded-2xl p-6 md:p-7 space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Award className="w-5 h-5" />
                Подборка публикаций
              </div>

              <div className="space-y-3">
                {forbesLinks.map((x, i) => (
                  <button
                    key={i}
                    onClick={() => openLink(x.url)}
                    className="w-full text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-white font-semibold leading-snug">
                          {x.title}
                        </div>
                        <div className="text-white/70 text-sm mt-1">{x.meta}</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-white/70 mt-1 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Location */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="card-blue rounded-2xl p-6 md:p-8 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <MapPin className="w-5 h-5" />
              Местоположение
            </div>
            <div className="text-white/85">
              проспект Назарбаева, 240Г
              <div className="text-white/70 text-sm mt-1">9 этаж, Almaty, Kazakhstan</div>
            </div>
          </div>

          <div className="card-blue rounded-2xl p-6 md:p-8 space-y-4">
            <div className="text-white font-semibold">Контакты</div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handlePhoneClick}
                className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4 text-left"
              >
                <Phone className="w-5 h-5 text-white" />
                <div className="mt-2 text-white font-semibold">Телефон</div>
                <div className="text-white/70 text-sm mt-1">+7 708 866 04 23</div>
              </button>

              <button
                onClick={handleWhatsAppClick}
                className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4 text-left"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <div className="mt-2 text-white font-semibold">WhatsApp</div>
                <div className="text-white/70 text-sm mt-1">+7 708 866 04 23</div>
              </button>

              <button
                onClick={handleInstagramClick}
                className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4 text-left"
              >
                <Instagram className="w-5 h-5 text-white" />
                <div className="mt-2 text-white font-semibold">Instagram</div>
                <div className="text-white/70 text-sm mt-1">parasat_business_club</div>
              </button>
            </div>
          </div>
        </section>

        {/* Podcast */}
        <section className="rounded-2xl border border-white/10 bg-card-elevated p-6 md:p-8">
          <button
            onClick={handleYouTubeClick}
            className="w-full text-left hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center gap-4">
              <Youtube className="w-7 h-7 text-white" />
              <div>
                <div className="text-white font-semibold text-lg">
                  Подкаст Parasat Business Club
                </div>
                <div className="text-white/70 text-sm mt-1">
                  YouTube-канал: интервью, аналитика, бизнес-мышление
                </div>
              </div>
            </div>
          </button>
        </section>

        {/* CTA */}
        <section className="pb-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-7">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-white font-semibold text-lg">
                  Хочешь вступить или узнать условия?
                </div>
                <div className="text-white/70 text-sm mt-1">
                  Напиши в WhatsApp — команда клуба быстро сориентирует.
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full md:w-auto rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Написать
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigateTo('parasat')}
                  className="w-full md:w-auto rounded-2xl border-white/15 bg-white/5 hover:bg-white/10 text-white"
                >
                  Вернуться
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
