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

// члены клуба
import memberSatpaev from '../assets/parasat-member-satpaev.png';
import memberIndira from '../assets/parasat-member-indira.png';
import memberZhumman from '../assets/parasat-member-zhuman.png';
import memberZhazira from '../assets/parasat-member-zhazira.png';
import memberKurmashev from '../assets/parasat-member-kurmashev.png';
import memberMirat from '../assets/parasat-member-mirat.png';

// карта филиалов
import branchesMap from '../assets/parasat-branches-map.png';

// Локальные стили страницы
import '../styles/parasat.css';

const MISSION_LINES = [
  'МИССИЯ: Формирование новой бизнес-элиты Казахстана',
  'ЦЕЛЬ: Концентрация и развитие бизнес-лидеров по всей республике',
  'PARASAT: Объединяет успешных людей',
];

interface ParasatScreenProps {
  navigateTo: (screen: Screen) => void;
  openNews: (id: string) => void;
}

export default function ParasatScreen({ navigateTo, openNews }: ParasatScreenProps) {
  const [news, setNews] = useState<NewsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // текст текущей фразы (анимация печати)
  const [typedText, setTypedText] = useState('');

  // анимация печати трёх фраз
  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let timeoutId: number;

    const typeNext = () => {
      const phrase = MISSION_LINES[phraseIndex];

      if (charIndex <= phrase.length) {
        setTypedText(phrase.slice(0, charIndex));
        charIndex += 1;
        timeoutId = window.setTimeout(typeNext, 40);
      } else {
        timeoutId = window.setTimeout(() => {
          charIndex = 0;
          phraseIndex = (phraseIndex + 1) % MISSION_LINES.length;
          typeNext();
        }, 1500);
      }
    };

    typeNext();
    return () => window.clearTimeout(timeoutId);
  }, []);

  // загрузка новостей
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

  const joinSteps = [
    'Претендент должен принимать и понимать главные ценности клуба.',
    'Соблюдать устав клуба.',
    'Платить членские взносы.',
    'Принимать активное участие в делах клуба.',
    'Участвовать в форумах внутри клуба.',
    'Поддерживать связь с членами клуба.',
    'Состоять в чатах клуба для получения информации о мероприятиях и активностях клуба.',
  ];

  const members = [
    { name: 'Досым Сатпаев', image: memberSatpaev },
    { name: 'Адиль Индира', image: memberIndira },
    { name: 'Марат Жуман', image: memberZhumman },
    { name: 'Жумагулова Жазира', image: memberZhazira },
    { name: 'Эрнар Курмашев', image: memberKurmashev },
    { name: 'Мират Ахметсадыков', image: memberMirat },
  ];

  return (
    <div className="parasat-page">
      {/* ВЕРХНЯЯ ЧАСТЬ */}
      <div className="parasat-hero">
        <div className="parasat-hero-inner">
          {/* Хедер */}
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

          {/* Миссия с анимацией печати */}
          <div className="space-y-4 mb-12">
            <div className="parasat-typing-wrapper">
              <h1 className="parasat-typing-text">
                {typedText}
                <span className="parasat-typing-cursor" />
              </h1>
            </div>
            <p className="parasat-mission-text">
              Сообщество успешных бизнесменов, которые стремятся к развитию и
              росту. Мы объединяем людей, которые хотят достигать своих целей и
              реализовывать свой потенциал.
            </p>
          </div>

          {/* Основатели */}
          <section className="parasat-founders">
            <h2 className="parasat-section-title text-center">
              ОСНОВАТЕЛИ
            </h2>

            <div className="parasat-founders-grid">
              {/* Байтасов слева */}
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
                    Известный казахстанский медиа-менеджер, профессиональный
                    журналист, владелец Tan Media Group.
                  </p>
                  <p className="parasat-founder-instagram">
                    Instagram: <span>@armanzhan</span>
                  </p>
                </div>
              </div>

              {/* Джакишев справа */}
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

          {/* Резиденты клуба (текст) */}
          <section className="parasat-section">
            <h2 className="parasat-section-title">РЕЗИДЕНТЫ КЛУБА</h2>
            <div className="parasat-residents-card">
              Администрацией клуба рассматриваются все заявки, поступающие от
              потенциальных резидентов. Заявка должна включать две рекомендации
              от действующих членов клуба. После обработки заявки администрацией
              будет выслана ссылка на анкету и приглашение на собеседование.
            </div>
          </section>

          {/* Члены бизнес-клуба */}
          <section className="parasat-section">
            <h2 className="parasat-section-title">
              ЧЛЕНЫ БИЗНЕС-КЛУБА PARASAT
            </h2>
            <div className="parasat-members-row">
              {members.map((member) => (
                <div key={member.name} className="parasat-member-card">
                  <div className="parasat-member-avatar-wrap">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="parasat-member-avatar"
                    />
                  </div>
                  <p className="parasat-member-name">{member.name}</p>
                  <p className="parasat-member-role">Член бизнес-клуба</p>
                </div>
              ))}
            </div>
          </section>

          {/* Как вступить в клуб – лестница */}
          <section className="parasat-join-section">
            <h2 className="parasat-section-title text-center">
              КАК ВСТУПИТЬ В КЛУБ
            </h2>
            <div className="parasat-join-timeline">
              {joinSteps.map((step, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div key={index} className="parasat-join-row">
                    {/* левая карточка */}
                    <div className="parasat-join-side">
                      {isLeft && (
                        <div className="parasat-join-card">
                          {step}
                        </div>
                      )}
                    </div>

                    {/* центр */}
                    <div className="parasat-join-center">
                      <div className="parasat-join-dot">
                        <span>{index + 1}</span>
                      </div>
                    </div>

                    {/* правая карточка */}
                    <div className="parasat-join-side">
                      {!isLeft && (
                        <div className="parasat-join-card">
                          {step}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Филиалы клуба */}
          <section className="parasat-section">
            <h2 className="parasat-section-title text-center">
              Филиалы клуба
            </h2>
            <div className="parasat-branches-card">
              <img
                src={branchesMap}
                alt="Филиалы клуба"
                className="parasat-branches-map"
              />
            </div>
          </section>
        </div>
      </div>

      {/* НИЖНЯЯ ЧАСТЬ: показатели, новости, О клубе */}
      <div className="parasat-bottom">
        <div className="parasat-bottom-inner">
          {/* Ключевые показатели */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <h2 className="text-gray-900 font-semibold">
                Ключевые показатели
              </h2>
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
                    <p className="text-xs text-gray-600">
                      {achievement.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Новости */}
          <section>
            {/* если надо заголовок — раскомментируй */}
            {/* <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-100 font-semibold">
                Последние новости
              </h2>
              <Badge variant="secondary">Все актуально</Badge>
            </div> */}

            {isLoading ? (
              <div className="text-center py-8 text-gray-300">
                Загрузка новостей...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-300">{error}</div>
            ) : news.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
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
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-white/95"
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

          {/* О клубе */}
          <section className="parasat-about-card">
            <h3>О Parasat Business Club</h3>
            <p>
              Мы создаём экосистему для развития предпринимательства в
              Казахстане и странах СНГ. Наша платформа помогает стартапам
              находить инвесторов, разработчиков и менторов, а инвесторам —
              перспективные проекты.
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
