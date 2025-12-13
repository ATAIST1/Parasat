import * as React from "react";
import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { newsService, type NewsDto, getNewsImageUrl } from '../services/newsService';

interface NewsDetailScreenProps {
  newsId: string;
  onBack: () => void;
  onOpenNews: (id: string) => void;
}


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
  const [item, setItem] = useState<NewsDto | null>(null);
  const [otherNews, setOtherNews] = useState<NewsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
  const fetchNews = async () => {
    if (!newsId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // 1. Получаем новость
      const currentNews = await newsService.getById(newsId);
      if (!currentNews) {
        throw new Error('News not found');
      }
      setItem(currentNews);
      
      // 2. Получаем URL изображения через newsService.getImageUrl()
      if (currentNews.imageKey) {
        try {
          const url = await newsService.getImageUrl(newsId);
          setImageUrl(url);
        } catch (imgError: any) {
          console.warn('Could not load image:', imgError);
          setImageUrl(null);
        }
      } else {
        console.log('No imageKey for news:', currentNews.id);
        setImageUrl(null);
      }

      // 3. Получаем другие новости
      const allNews = await newsService.getRecent(10);
      const filtered = allNews.filter(n => n.id !== newsId);
      setOtherNews(filtered);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError('Не удалось загрузить новость');
      setItem(null);
      setImageUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  fetchNews();
}, [newsId]);

  if (isLoading) {
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
            <div className="w-10 h-10 bg-gray-200 rounded-xl p-2 shadow">
            </div>
            <div>
              <p className="text-xs text-gray-300 uppercase tracking-wide">
                Parasat Business Club
              </p>
              <h1 className="text-white text-lg font-semibold mt-0.5">
                Загрузка...
              </h1>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 pt-4 pb-16 flex items-center justify-center">
          <Card className="max-w-md w-full rounded-2xl shadow-md border border-gray-100 p-6 text-center">
            <p className="text-gray-700 text-base">Загрузка новости...</p>
          </Card>
        </main>
      </div>
    );
  }

  // "Новость не найдена"
  if (!item || error) {
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
            <div className="w-10 h-10 bg-gray-200 rounded-xl p-2 shadow">
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

  // Парсим контент для булет поинтов
  const parseContent = (content: string) => {
    const lines = content.split('\n').map((p) => p.trim()).filter(Boolean);
    const elements: Array<{ type: 'text' | 'bullet'; content: string }> = [];

    lines.forEach((line) => {
      if (line.includes('•')) {

        const trimmedLine = line.trim();
        const startsWithBullet = trimmedLine.startsWith('•');
        
        const parts = trimmedLine.split(/\s*•\s+/);
        
        parts.forEach((part, index) => {
          const trimmed = part.trim();
          if (!trimmed) return;

          if (index === 0) {
            if (startsWithBullet) {
              elements.push({ type: 'bullet', content: trimmed });
            } else {
              elements.push({ type: 'text', content: trimmed });
            }
          } else {
            elements.push({ type: 'bullet', content: trimmed });
          }
        });
      } else {
        elements.push({ type: 'text', content: line });
      }
    });

    return elements;
  };

  const contentElements = parseContent(item.content);
  const badgeProps = getBadgeProps(item.category);
  
  const displayDate = item.formattedDate || 
    (item.date ? new Date(item.date).toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }) : '');

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
          <div className="w-10 h-10 bg-gray-200 rounded-xl p-2 shadow">
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
          {imageUrl && (
            <div className="px-6 pt-6"> {/* Добавляем горизонтальные отступы */}
      <img 
        src={imageUrl} 
        alt={item?.title || "News"} 
        className="w-1/2 h-64 md:h-72 object-cover rounded-xl shadow-md mx-auto"
      />
    </div>
          )}
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
                <span>{displayDate}</span>
              </div>
            </div>

            {/* Заголовок */}
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug mb-6">
              {item.title}
            </h2>

            {/* Текст новости */}
            <div className="space-y-4 text-[16px] sm:text-[18px] leading-relaxed text-gray-800">
              {contentElements.map((element, i) => {
                if (element.type === 'bullet') {
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-[16px] sm:text-[18px] text-gray-800"
                    >
                      <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-slate-900 flex-shrink-0" />
                      <span>{element.content}</span>
                    </div>
                  );
                }

                return (
                  <p key={i} className="text-gray-800">
                    {element.content}
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
                const newsDate = news.formattedDate || 
                  (news.date ? new Date(news.date).toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  }) : '');

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
                          {newsDate}
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
