import { useState, useEffect, type FormEvent } from 'react';
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

// основатели
import baitasovImg from '../assets/parasat-baitasov.png';
import jakishevImg from '../assets/parasat-jakishev.png';

// члены клуба
import memberSatpaev from '../assets/parasat-member-satpaev.png';
import memberIndira from '../assets/parasat-member-indira.png';
import memberZhumman from '../assets/parasat-member-zhuman.png';
import memberZhazira from '../assets/parasat-member-zhazira.png';
import memberKurmashev from '../assets/parasat-member-kurmashev.png';
import memberMirat from '../assets/parasat-member-mirat.png';
import memberMore from '../assets/parasat-member-more.png';

// карта филиалов
import branchesMap from '../assets/parasat-branches-map.png';

import '../styles/parasat.css';

const MISSION_LINES = [
  'МИССИЯ: Формирование новой бизнес-элиты Казахстана',
  'ЦЕЛЬ: Концентрация и развитие бизнес-лидеров по всей республике',
  'PARASAT: Объединяет успешных людей',
];

const JOIN_STEPS = [
  'Претендент должен принимать и понимать главные ценности клуба.',
  'Соблюдать устав клуба.',
  'Платить членские взносы.',
  'Принимать активное участие в делах клуба.',
  'Участвовать в форумах внутри клуба.',
  'Поддерживать связь с членами клуба.',
  'Состоять в чатах клуба для получения информации о мероприятиях и активностях клуба.',
];

const ACHIEVEMENTS = [
  { icon: Users, value: '1 200+', label: 'Активных пользователей', color: 'from-[#0967D6] to-[#005CFA]' },
  { icon: Briefcase, value: '150+', label: 'Проектов на платформе', color: 'from-purple-500 to-purple-600' },
  { icon: TrendingUp, value: '$2.5M', label: 'Привлечено инвестиций', color: 'from-emerald-500 to-emerald-600' },
  { icon: Award, value: '45', label: 'Успешных сделок', color: 'from-orange-500 to-orange-600' },
];

const TASKS = [
  'Создание сильнейшего сообщества, объединяющего успешных и амбициозных предпринимателей по всему Казахстану.',
  'Поддержание проектов, которые помогают участникам достигать новых высот в бизнесе, а также те, что улучшают жизнь всего общества, помогают развитию культуры страны, спорта и науки.',
  'Создание уникальных программ для личностного роста участников. Образовательные программы и мероприятия с участием опытных лидеров для обмена знаниями.',
  'Осуществление поддержки руководителей и топ-менеджеров через менторство и ресурсную помощь.',
  'Формирование среды для обмена контактами и уникальными ресурсами для расширения горизонтов, взаимодействия с ключевыми игроками рынка и эффективного развития собственного бизнеса.',
];

const VALUES = [
  { letter: 'P', title: 'Productivity — продуктивность', text: 'Сфокусированность на развитии участников не только в бизнесе, но и в личном и профессиональном плане.' },
  { letter: 'A', title: 'Aspiration — стремление', text: 'Сознательное стремление к созданию устойчивой и этичной среды в бизнесе и обществе.' },
  { letter: 'R', title: 'Responsibility — ответственность', text: 'Обязательство по формированию бизнес-среды, способствующей прогрессу и росту каждого участника Клуба.' },
  { letter: 'A', title: 'Awareness — осознанность / осведомлённость', text: 'Стремление к свободному обмену идеями, опытом и знаниями между членами Клуба.' },
  { letter: 'S', title: 'Support — поддержка', text: 'Постоянная готовность предоставлять менторскую и ресурсную поддержку всем членам Клуба.' },
  { letter: 'A', title: 'Achievement — достижение', text: 'Достижение коммерческого успеха компаний участников и высокого экономического роста страны в целом.' },
  { letter: 'T', title: 'Trust — доверие', text: 'Установление доверительных отношений между членами сообщества для совместного процветания.' },
];

interface ParasatScreenProps {
  navigateTo: (screen: Screen) => void;
  openNews: (id: string) => void;
}

export default function ParasatScreen({ navigateTo, openNews }: ParasatScreenProps) {
  const [news, setNews] = useState<NewsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [typedText, setTypedText] = useState('');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const handleJoinSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsJoinModalOpen(false);
  };

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

  return (
    <div className="parasat-page">
      {isJoinModalOpen && (
        <div className="parasat-modal-backdrop" onClick={() => setIsJoinModalOpen(false)}>
          <div className="parasat-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="parasat-modal-close" onClick={() => setIsJoinModalOpen(false)}>
              ✕
            </button>

            <div className="parasat-modal-header">
              <div className="parasat-modal-avatar" />
              <h2>ФОРМА ЗАЯВКИ ДЛЯ РЕЗИДЕНТОВ КЛУБА</h2>
              <p>Заполните форму и мы с вами свяжемся в ближайшее время</p>
            </div>

            <div className="parasat-modal-price">
              <div className="parasat-modal-price-caption">Стоимость годового членства в клубе:</div>
              <div className="parasat-modal-price-value">3 000 000 тенге</div>
            </div>

            <form className="parasat-modal-form" onSubmit={handleJoinSubmit}>
              <div className="parasat-modal-grid">
                <div className="parasat-modal-field">
                  <label>Ваше имя *</label>
                  <input type="text" placeholder="Введите ваше имя" required />
                </div>
                <div className="parasat-modal-field">
                  <label>Ваша фамилия *</label>
                  <input type="text" placeholder="Введите вашу фамилию" required />
                </div>
              </div>

              <div className="parasat-modal-field">
                <label>Ваш email *</label>
                <input type="email" placeholder="example@email.com" required />
              </div>

              <div className="parasat-modal-field">
                <label>Ваш номер телефона *</label>
                <input type="tel" placeholder="+7 777 777 77 77" required />
              </div>

              <div className="parasat-modal-grid">
                <div className="parasat-modal-field">
                  <label>Отрасль компании, в которой вы работаете</label>
                  <input type="text" placeholder="IT, Финансы, Медицина..." />
                </div>
                <div className="parasat-modal-field">
                  <label>Ваша должность</label>
                  <input type="text" placeholder="Ваша должность" />
                </div>
              </div>

              <div className="parasat-modal-field">
                <label>Почему вы хотите стать резидентом клуба</label>
                <textarea placeholder="Расскажите о ваших целях и мотивации..." rows={4} required />
              </div>

              <button type="submit" className="parasat-modal-submit">
                ОТПРАВИТЬ
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="parasat-hero">
        <div className="parasat-hero-inner">
          <header className="parasat-header">
            <div className="parasat-logo-block">
              <div className="parasat-logo-wrapper">
                <img src={logo} alt="Parasat" className="parasat-logo-img" />
              </div>
              <div className="parasat-logo-text">
                <p className="parasat-logo-subtitle">PARASAT BUSINESS CLUB</p>
                <p className="parasat-logo-caption">Сообщество бизнес-лидеров Казахстана</p>
              </div>
            </div>

            <button className="parasat-cta-btn" onClick={() => setIsJoinModalOpen(true)}>
              <span>Вступить в клуб</span>
              <span className="parasat-cta-circle">
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </header>

          <div className="space-y-4 mb-12 parasat-mission">
            <div className="parasat-typing-wrapper">
              <h1 className="parasat-typing-text">
                {typedText}
                <span className="parasat-typing-cursor" />
              </h1>
            </div>
            <p className="parasat-mission-text">
              Сообщество успешных бизнесменов, которые стремятся к развитию и росту. Мы объединяем людей,
              которые хотят достигать своих целей и реализовывать свой потенциал.
            </p>
          </div>

          <section className="parasat-founders">
            <h2 className="parasat-section-title text-center">ОСНОВАТЕЛИ</h2>

            <div className="parasat-founders-grid">
              <div className="parasat-founder-card">
                <div className="parasat-founder-image-wrap">
                  <img src={baitasovImg} alt="Арманжан Байтасов" className="parasat-founder-image" />
                </div>
                <div className="parasat-founder-content">
                  <p className="parasat-founder-name-top">Арманжан</p>
                  <p className="parasat-founder-name-main">Байтасов</p>
                  <p className="parasat-founder-description">
                    Известный казахстанский медиа-менеджер, профессиональный журналист, владелец Tan Media Group.
                  </p>
                  <p className="parasat-founder-instagram">
                    Instagram: <span>@armanzhan</span>
                  </p>
                </div>
              </div>

<div className="parasat-founder-card parasat-founder-card--right">
  <div className="parasat-founder-image-wrap">
    <img src={jakishevImg} alt="Мухтар Джакишев" className="parasat-founder-image" />
  </div>

  <div className="parasat-founder-content text-left items-start">
    <p className="parasat-founder-name-top text-left">Мухтар</p>
    <p className="parasat-founder-name-main text-left">Джакишев</p>
    <p className="parasat-founder-description text-left">
      Казахстанский бизнесмен и бывший глава Казатомпром.
    </p>
    <p className="parasat-founder-instagram text-left">
      Instagram: <span>@dzhakishevmukhtar</span>
    </p>
  </div>
</div>

            </div>
          </section>

          <section className="parasat-section">
            <h2 className="parasat-section-title">ЗАДАЧИ</h2>
            <div className="parasat-tasks-list">
              {TASKS.map((task, idx) => (
                <div key={idx} className="parasat-task-item">
                  <div className="parasat-task-bullet">
                    <ChevronRight className="w-3 h-3 text-white" />
                  </div>
                  <p>{task}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="parasat-section">
            <h2 className="parasat-section-title">ЦЕННОСТИ PARASAT</h2>
            <div className="parasat-values-grid">
              {VALUES.map((value, idx) => (
                <div key={idx} className="parasat-value-card">
                  <div className="parasat-value-letter">{value.letter}</div>
                  <div>
                    <p className="parasat-value-title">{value.title}</p>
                    <p className="parasat-value-text">{value.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="parasat-section">
            <h2 className="parasat-section-title">РЕЗИДЕНТЫ КЛУБА</h2>
            <div className="parasat-residents-card">
              <p>
                Администрацией клуба рассматриваются все заявки, поступающие от потенциальных резидентов. Заявка должна
                включать две рекомендации от действующих членов клуба. После обработки заявки администрацией будет выслана
                ссылка на анкету и приглашение на собеседование.
              </p>
            </div>
          </section>

          <section className="parasat-section">
            <h2 className="parasat-section-title">ЧЛЕНЫ БИЗНЕС-КЛУБА PARASAT</h2>

            <div className="parasat-members-grid">
              <div className="parasat-member-card">
                <img src={memberSatpaev} alt="Досым Сатпаев" />
                <p className="parasat-member-name">Досым Сатпаев</p>
              </div>
              <div className="parasat-member-card">
                <img src={memberIndira} alt="Адиль Индира" />
                <p className="parasat-member-name">Адиль Индира</p>
              </div>
              <div className="parasat-member-card">
                <img src={memberZhumman} alt="Марат Жуман" />
                <p className="parasat-member-name">Марат Жуман</p>
              </div>
              <div className="parasat-member-card">
                <img src={memberZhazira} alt="Жумагулова Жазира" />
                <p className="parasat-member-name">Жумагулова Жазира</p>
              </div>
              <div className="parasat-member-card">
                <img src={memberKurmashev} alt="Эрнар Курмашев" />
                <p className="parasat-member-name">Эрнар Курмашев</p>
              </div>
              <div className="parasat-member-card">
                <img src={memberMirat} alt="Мират Ахметсадыков" />
                <p className="parasat-member-name">Мират Ахметсадыков</p>
              </div>

              <button
                type="button"
                className="parasat-member-card parasat-member-more"
                onClick={() => window.open('https://parasat.club/members-parasat/', '_blank')}
              >
                <img src={memberMore} alt="Ещё" />
                <p className="parasat-member-name">Ещё</p>
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="parasat-bottom">
        <div className="parasat-bottom-inner">
          <section className="parasat-metrics-card">
            <div className="parasat-metrics-header">
              <Star className="w-5 h-5 parasat-metrics-star" />
              <h2>Ключевые показатели</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ACHIEVEMENTS.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="parasat-metric-item">
                    <div className={`parasat-metric-icon bg-gradient-to-br ${achievement.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="parasat-metric-value">{achievement.value}</p>
                    <p className="parasat-metric-label">{achievement.label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="parasat-join-section">
            <h2>КАК ВСТУПИТЬ В КЛУБ</h2>
            <div className="parasat-steps-ladder">
              {JOIN_STEPS.map((step, index) => (
                <div key={index} className="parasat-step-row">
                  <div className="parasat-step-circle">{index + 1}</div>
                  <div className="parasat-step-pill">
                    <p>{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="parasat-branches-section">
            <h2 className="parasat-branches-title">Филиалы клуба</h2>

            <div className="parasat-branches-map-wrapper">
              <img src={branchesMap} alt="Карта филиалов Parasat" className="parasat-branches-map" />

              <div className="parasat-branch-point parasat-branch-uralsk">
                <div className="parasat-branch-pulse" />
                <div className="parasat-branch-pin"><div className="parasat-branch-pin-inner" /></div>
                <div className="parasat-branch-label">Уральск</div>
              </div>

              <div className="parasat-branch-point parasat-branch-astana">
                <div className="parasat-branch-pulse" />
                <div className="parasat-branch-pin"><div className="parasat-branch-pin-inner" /></div>
                <div className="parasat-branch-label">Астана</div>
              </div>

              <div className="parasat-branch-point parasat-branch-karaganda">
                <div className="parasat-branch-pulse" />
                <div className="parasat-branch-pin"><div className="parasat-branch-pin-inner" /></div>
                <div className="parasat-branch-label">Караганда</div>
              </div>

              <div className="parasat-branch-point parasat-branch-shymkent">
                <div className="parasat-branch-pulse" />
                <div className="parasat-branch-pin"><div className="parasat-branch-pin-inner" /></div>
                <div className="parasat-branch-label parasat-branch-label--up">Шымкент</div>
              </div>

              <div className="parasat-branch-point parasat-branch-almaty">
                <div className="parasat-branch-pulse" />
                <div className="parasat-branch-pin"><div className="parasat-branch-pin-inner" /></div>
                <div className="parasat-branch-label">Алматы</div>
              </div>
            </div>
          </section>

          <section className="parasat-news-section">
            <div className="parasat-news-header">
              <h2>Последние новости</h2>
              <Badge variant="secondary" className="parasat-news-badge">Все актуально</Badge>
            </div>

            {isLoading ? (
              <div className="parasat-news-empty">Загрузка новостей...</div>
            ) : error ? (
              <div className="parasat-news-error">{error}</div>
            ) : news.length === 0 ? (
              <div className="parasat-news-empty">Новостей пока нет</div>
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
                    <Card key={item.id} className="parasat-news-card" onClick={() => openNews(item.id)}>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={item.category === 'Достижение' ? 'default' : 'secondary'}
                                className={item.category === 'Достижение' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                              >
                                {item.badge}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {displayDate}
                              </div>
                            </div>
                            <h3 className="parasat-news-title">{item.title}</h3>
                            <p className="parasat-news-text line-clamp-2">{item.description}</p>
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

          {/*<section className="parasat-about-card">
            <h3>О Parasat Business Club</h3>
            <p>
              Мы создаём экосистему для развития предпринимательства в Казахстане и странах СНГ. Наша платформа помогает стартапам
              находить инвесторов, разработчиков и менторов, а инвесторам — перспективные проекты.
            </p>
            <div className="parasat-about-list">
              <div className="parasat-about-item"><div className="parasat-about-dot" /><span>Прозрачные условия — 2,5% от сделки</span></div>
              <div className="parasat-about-item"><div className="parasat-about-dot" /><span>Проверенные участники платформы</span></div>
              <div className="parasat-about-item"><div className="parasat-about-dot" /><span>Поддержка на всех этапах сделки</span></div>
            </div>
          </section>*/}
        </div>
      </div>
    </div>
  );
}
