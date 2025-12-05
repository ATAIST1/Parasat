import { Calendar, ChevronLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface NewsDetailScreenProps {
  newsId: number;
  onBack: () => void;
  onOpenNews: (id: number) => void;
}

const newsData = [
  {
    id: 1,
    title: 'Запуск платформы Parasat Invest',
    date: '15 октября 2024',
    badge: 'Новое',
    badgeVariant: 'secondary' as const,
    category: 'Новость',
    fullText: `
      Дорогие друзья и участники сообщества!

      Мы рады объявить о долгожданном запуске инвестиционной платформы Parasat Invest — первого в СНГ закрытого клуба для стартаперов, инвесторов и разработчиков.

      Теперь вы можете:
      • Размещать свои проекты и привлекать инвестиции от проверенных бизнес-ангелов
      • Инвестировать в перспективные стартапы на ранних стадиях
      • Находить сооснователей и ключевых специалистов в команду
      • Получать менторскую поддержку от успешных предпринимателей СНГ

      За первый день после запуска к платформе подключились более 300 активных пользователей. Это лучшее подтверждение того, что мы движемся в правильном направлении.

      Спасибо всем, кто был с нами с самого начала! Впереди — ещё больше сделок, роста и успеха!
    `.trim(),
  },
  {
    id: 2,
    title: 'Первая успешная сделка на $500K',
    date: '8 ноября 2024',
    badge: 'Сделка',
    badgeVariant: 'default' as const,
    category: 'Достижение',
    fullText: `
      У нас отличные новости!

      Всего через три недели после запуска платформы состоялась первая инвестиционная сделка на $500,000.

      FinTech-стартап из Казахстана, разрабатывающий решение для микрокредитования малого бизнеса, успешно привлек раунд от двух бизнес-ангелов из нашего сообщества.

      Сделка прошла полностью через Parasat Invest:
      • Презентация проекта в закрытом разделе
      • Due Diligence при поддержке наших экспертов
      • Подписание SAFE через платформу

      Это только начало. В ближайшие месяцы мы планируем закрыть ещё минимум 10 сделок на общую сумму более $3M.

      Если у вас есть проект или вы ищете инвестиции — сейчас лучшее время войти в Parasat!
    `.trim(),
  },
  {
    id: 3,
    title: '1000+ пользователей за первый месяц',
    date: '20 ноября 2024',
    badge: 'Рост',
    badgeVariant: 'default' as const,
    category: 'Достижение',
    fullText: `
      Мы преодолели важную отметку — более 1000 активных пользователей за первый месяц работы платформы!

      Среди участников:
      • 650+ основателей стартапов
      • 250+ частных инвесторов и бизнес-ангелов
      • 100+ разработчиков и технических специалистов

      Это результат, который показывает реальную потребность рынка в закрытом профессиональном сообществе для основателей и инвесторов.

      Спасибо каждому из вас за доверие и активность! Вместе мы строим сильную предпринимательскую экосистему СНГ.
    `.trim(),
  },
  {
    id: 4,
    title: 'Партнерство с ведущими акселераторами',
    date: '2 декабря 2024',
    badge: 'Партнерство',
    badgeVariant: 'secondary' as const,
    category: 'Новость',
    fullText: `
      Рады сообщить о стратегическом партнёрстве с тремя ведущими акселераторами СНГ:

      • Astana Hub (Казахстан)
      • IT Park Uzbekistan
      • Technopark St. Petersburg (Россия)

      Теперь выпускники и резиденты этих акселераторов получают:
      • Приоритетный доступ к инвесторам Parasat
      • Бесплатное размещение проектов на платформе
      • Юридическую и менторскую поддержку на всех этапах

      Это партнёрство открывает новые возможности как для стартапов, так и для инвесторов нашего сообщества.

      Ждём ещё больше сильных проектов и успешных сделок в 2025 году!
    `.trim(),
  },
];

// как на ParasatScreen: для "Достижение" — зелёный бейдж
function getBadgeProps(category: string) {
  if (category === 'Достижение') {
    return {
      variant: 'default' as const,
      className: 'bg-green-100 text-green-700 hover:bg-green-200',
    };
  }

  return {
    variant: 'secondary' as const,
    className: '',
  };
}

export default function NewsDetailScreen({
  newsId,
  onBack,
  onOpenNews,
}: NewsDetailScreenProps) {
  const item = newsData.find((n) => n.id === newsId);

  // "Новость не найдена"
  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 pt-6 pb-6 shadow-sm">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад к новостям</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl p-2 shadow">
              <img
                src={logo}
                alt="Parasat Invest"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-xs text-gray-300 uppercase tracking-wide">
                Parasat Business Club
              </p>
              <h1 className="text-white text-lg font-semibold mt-0.5">
                Новость не найдена
              </h1>
            </div>
          </div>
        </header>

        {/* убрал -mt-4, добавил pt-4 и больше pb */}
        <main className="flex-1 px-4 pt-4 pb-16 flex items-center justify-center">
          <Card className="max-w-md w-full rounded-2xl shadow-md border border-gray-100 p-6 text-center space-y-4">
            <p className="text-gray-700 text-base">
              К сожалению, новость не найдена или была удалена.
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Вернуться к новостям</span>
            </button>
          </Card>
        </main>
      </div>
    );
  }

  const paragraphs = item.fullText
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  const otherNews = newsData.filter((n) => n.id !== item.id);
  const badgeProps = getBadgeProps(item.category);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Хедер в стиле Parasat */}
      <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 pt-6 pb-6 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Назад к новостям</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl p-2 shadow">
            <img
              src={logo}
              alt="Parasat Invest"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-xs text-gray-300 uppercase tracking-wide">
              Parasat Business Club
            </p>
            <h1 className="text-white text-lg font-semibold mt-0.5">
              {item.category}
            </h1>
          </div>
        </div>
      </header>

      {/* Контент */}
      {/* убрал -mt-4, добавил pt-4 и больше pb */}
      <main className="flex-1 px-4 pt-4 pb-16 space-y-6">
        <Card className="rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Метаданные */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Badge
                  variant={badgeProps.variant}
                  className={badgeProps.className}
                >
                  {item.badge}
                </Badge>
                <span className="text-xs text-gray-500">{item.category}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{item.date}</span>
              </div>
            </div>

            {/* Заголовок */}
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug mb-6">
              {item.title}
            </h2>

            {/* Текст новости */}
            <div className="space-y-4 text-[16px] sm:text-[18px] leading-relaxed text-gray-800">
              {paragraphs.map((text, i) => {
                const isBullet = text.startsWith('•');

                if (isBullet) {
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-[16px] sm:text-[18px] text-gray-800"
                    >
                      <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slate-900" />
                      <span>{text.replace(/^•\s*/, '')}</span>
                    </div>
                  );
                }

                return (
                  <p key={i} className="text-gray-800">
                    {text}
                  </p>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Другие новости — кликабельные */}
        {otherNews.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 tracking-wide uppercase">
              Другие новости Parasat
            </h3>
            <div className="space-y-2">
              {otherNews.map((news) => {
                const bp = getBadgeProps(news.category);

                return (
                  <Card
                    key={news.id}
                    className="border border-gray-100 bg-white/80 shadow-sm cursor-pointer hover:shadow-md hover:bg-white transition-all"
                    onClick={() => onOpenNews(news.id)}
                  >
                    <div className="px-4 py-3 flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {news.date}
                        </span>
                        {/* Бейдж как на главной странице новостей — без text-[10px] и прочего */}
                        <Badge
                          variant={bp.variant}
                          className={bp.className}
                        >
                          {news.badge}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {news.title}
                      </p>
                      <p className="text-xs text-gray-600">{news.category}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
