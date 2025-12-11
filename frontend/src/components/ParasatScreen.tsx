import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Users,
  Briefcase,
  ChevronRight,
  Calendar,
  Star,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';
import { newsService, type NewsDto } from '../services/newsService';

import type { Screen } from '../App';

import baitasovImg from '../assets/parasat-baitasov.png';
import jakishevImg from '../assets/parasat-jakishev.png';

// Локальные стили страницы
import '../styles/parasat.css';

interface ParasatScreenProps {
  navigateTo: (screen: Screen) => void;
  openNews: (id: string) => void;
}

export default function ParasatScreen({ navigateTo, openNews }: ParasatScreenProps) {
  const [news, setNews] = useState<NewsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedNews = await newsService.getRecent(10);
        setNews(fetchedNews);
      } catch (err: any) {
        console.error('Error fetching news:', err);
        setError('Не удалось загрузить новости');
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const achievements = [
    {
      icon: Users,
      value: '1 200+',
      label: 'Активных пользователей',
      color: 'from-[#0967D6] to-[#005CFA]',
    },
    {
      icon: Briefcase,
      value: '150+',
      label: 'Проектов на платформе',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: TrendingUp,
      value: '$2.5M',
      label: 'Привлечено инвестиций',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: Award,
      value: '45',
      label: 'Успешных сделок',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const tasks = [
    'Создание сильнейшего сообщества, объединяющего успешных и амбициозных предпринимателей по всему Казахстану.',
    'Поддержание проектов, которые помогают участникам достигать новых высот в бизнесе, а также те, что улучшают жизнь всего общества, помогают развитию культуры страны, спорта и науки.',
    'Создание уникальных программ для личностного роста участников. Образовательные программы и мероприятия с участием опытных лидеров для обмена знаниями.',
    'Осуществление поддержки руководителей и топ-менеджеров через менторство и ресурсную помощь.',
    'Формирование среды для обмена контактами и уникальными ресурсами для расширения горизонтов, взаимодействия с ключевыми игроками рынка и эффективного развития собственного бизнеса.',
  ];

  const values = [
    {
      letter: 'P',
      title: 'Productivity — продуктивность',
      text: 'Сфокусированность на развитии участников не только в бизнесе, но и в личном и профессиональном плане.',
    },
    {
      letter: 'A',
      title: 'Aspiration — стремление',
      text: 'Сознательное стремление к созданию устойчивой и этичной среды в бизнесе и обществе.',
    },
    {
      letter: 'R',
      title: 'Responsibility — ответственность',
      text: 'Обязательство по формированию бизнес-среды, способствующей прогрессу и росту каждого участника Клуба.',
    },
    {
      letter: 'A',
      title: 'Awareness — осознанность / осведомлённость',
      text: 'Стремление к свободному обмену идеями, опытом и знаниями между членами Клуба.',
    },
    {
      letter: 'S',
      title: 'Support — поддержка',
      text: 'Постоянная готовность предоставлять менторскую и ресурсную поддержку всем членам Клуба.',
    },
    {
      letter: 'A',
      title: 'Achievement — достижение',
      text: 'Достижение коммерческого успеха компаний участников и высокого экономического роста страны в целом.',
    },
    {
      letter: 'T',
      title: 'Trust — доверие',
      text: 'Установление доверительных отношений между членами сообщества для совместного процветания.',
    },
  ];

  return (
    <div className="parasat-page">
      {/* Верхний блок с логотипом и миссией */}
      <div className="parasat-hero">
        <div className="parasat-hero-inner">
          <header className="parasat-header">
            <div className="parasat-logo-block">
              <div className="parasat-logo-wrapper">
                <img src={logo} alt="Parasat" className="parasat-logo-img" />
              </div>
              <div className="parasat-logo-text">
                <p className="parasat-logo-subtitle">
                  PARASAT BUSINESS CLUB
                </p>
                <p className="parasat-logo-caption">
                  Сообщество бизнес-лидеров Казахстана
                </p>
              </div>
            </div>

            <button
              className="parasat-cta-btn"
              onClick={() => navigateTo('register')}
            >
              <span>Вступить в клуб</span>
              <span className="parasat-cta-circle">
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </header>

          {/* Миссия */}
          <section className="parasat-mission">
            <h1 className="parasat-mission-title">
              МИССИЯ: Формирование новой бизнес-элиты Казахстана
            </h1>
            <p className="parasat-mission-text">
              Сообщество успешных бизнесменов, которые стремятся к развитию и росту.
              Мы объединяем людей, которые хотят достигать своих целей и реализовывать
              свой потенциал.
            </p>
          </section>

          {/* Основатели */}
          <section className="parasat-founders">
            <h2 className="parasat-section-title text-center">
              ОСНОВАТЕЛИ
            </h2>

            <div className="parasat-founders-grid">
              {/* Байтасов */}
              <div className="parasat-founder-card">
                <div className="parasat-founder-image-wrap">
                  <img
                    src={baitasovImg}
                    alt="Арманжан Байтасов"
                    className="parasat-founder-image"
                  />
                </div>
                <div className="parasat-founder-content">
                  <p className="parasat-founder-name-top">Арманжан</p>
                  <p className="parasat-founder-name-main">Байтасов</p>
                  <p className="parasat-founder-description">
                    Известный казахстанский медиа-менеджер, профессиональный журналист,
                    владелец Tan Media Group.
                  </p>
                  <p className="parasat-founder-instagram">
                    Instagram: <span>@armanzhan</span>
                  </p>
                </div>
              </div>

              {/* Джакишев */}
              <div className="parasat-founder-card parasat-founder-card--right">
                <div className="parasat-founder-image-wrap">
                  <img
                    src={jakishevImg}
                    alt="Мухтар Джакишев"
                    className="parasat-founder-image"
                  />
                </div>
                <div className="parasat-founder-content">
                  <p className="parasat-founder-name-top">Мухтар</p>
                  <p className="parasat-founder-name-main">Джакишев</p>
                  <p className="parasat-founder-description">
                    Казахстанский бизнесмен и бывший глава Казатомпром.
                  </p>
                  <p className="parasat-founder-instagram">
                    Instagram: <span>@dzhakishevmukhtar</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Задачи */}
          <section className="parasat-section">
            <h2 className="parasat-section-title">ЗАДАЧИ</h2>
            <div className="parasat-tasks-list">
              {tasks.map((task, idx) => (
                <div key={idx} className="parasat-task-item">
                  <div className="parasat-task-bullet">
                    <ChevronRight className="w-3 h-3 text-white" />
                  </div>
                  <p>{task}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ценности */}
          <section className="parasat-section">
            <h2 className="parasat-section-title">ЦЕННОСТИ PARASAT</h2>
            <div className="parasat-values-grid">
              {values.map((value, idx) => (
                <div key={idx} className="parasat-value-card">
                  <div className="parasat-value-letter">
                    {value.letter}
                  </div>
                  <div>
                    <p className="parasat-value-title">{value.title}</p>
                    <p className="parasat-value-text">{value.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Резиденты клуба */}
          <section className="parasat-section">
            <h2 className="parasat-section-title">РЕЗИДЕНТЫ КЛУБА</h2>
            <div className="parasat-residents-card">
              <p>
                Администрацией клуба рассматриваются все заявки, поступающие от
                потенциальных резидентов. Заявка должна включать две рекомендации от
                действующих членов клуба. После обработки заявки администрацией будет
                выслана ссылка на анкету и приглашение на собеседование.
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="parasat-bottom">
        <div className="parasat-bottom-inner">
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <h2 className="text-gray-900 font-semibold">Ключевые показатели</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 space-y-2"
                  >
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${achievement.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xl md:text-2xl text-gray-900 font-semibold">
                      {achievement.value}
                    </p>
                    <p className="text-xs text-gray-600">{achievement.label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Новости */}
          <section>
            <div className="flex items-center justify-between mb-4">
              {/* <h2 className="text-gray-900 font-semibold">Последние новости</h2> */}
              {/*<Badge variant="secondary">Все актуально</Badge>*/}
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Загрузка новостей...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                {error}
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Новостей пока нет
              </div>
            ) : (
              <div className="space-y-3">
                {news.map((item) => {
                  const displayDate =
                    item.formattedDate ||
                    (item.date
                      ? new Date(item.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '');

                  return (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                      onClick={() => openNews(item.id)}
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  item.category === 'Достижение'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className={
                                  item.category === 'Достижение'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : ''
                                }
                              >
                                {item.badge}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {displayDate}
                              </div>
                            </div>
                            <h3 className="text-gray-900 font-medium mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* О клубе / платформе */}
          <section className="parasat-about-card">
  <h3>О Parasat Business Club</h3>
  <p>
    Мы создаём экосистему для развития предпринимательства в Казахстане и
    странах СНГ. Наша платформа помогает стартапам находить инвесторов,
    разработчиков и менторов, а инвесторам — перспективные проекты.
  </p>
  <div className="parasat-about-list">
    <div className="parasat-about-item">
      <div className="parasat-about-dot" />
      <span>Прозрачные условия — 2,5% от сделки</span>
    </div>
    <div className="parasat-about-item">
      <div className="parasat-about-dot" />
      <span>Проверенные участники платформы</span>
    </div>
    <div className="parasat-about-item">
      <div className="parasat-about-dot" />
      <span>Поддержка на всех этапах сделки</span>
    </div>
  </div>
</section>

        </div>
      </div>
    </div>
  );
}
