import React, { useState, useEffect } from 'react';
import { Edit, Mail, Phone, MapPin, Calendar, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { userService, UserDto } from '../services/userService';

interface ProfileProps {
  navigateTo: (screen: any) => void;
  user?: any | null;
}

export default function Profile({ navigateTo, user: appUser }: ProfileProps) {
  const [userData, setUserData] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await userService.getCurrentUser();
      setUserData(response.data);
    } catch (error) {
      console.error('Error loading user:', error);
      // Fallback placeholder data
      setUserData({
        id: '1',
        name: 'Аян Байтасов',
        email: 'ayan@example.com',
        role: 'investor',
        phone: '+7 708 866 04 23',
        location: 'Almaty, Kazakhstan',
        about: 'Предприниматель и инвестор. Фокус на развитии предпринимательского сообщества и поддержке амбициозных стартапов в СНГ.',
      });
    } finally {
      setLoading(false);
    }
  };

  const user = userData || {
    name: 'Аян Байтасов',
    title: 'Основатель, Parasat Business Club',
    location: 'Almaty, Kazakhstan',
    joined: '2023-06-12',
    email: 'ayan@example.com',
    phone: '+7 708 866 04 23',
    about:
      'Предприниматель и инвестор. Фокус на развитии предпринимательского сообщества и поддержке амбициозных стартапов в СНГ.',
    links: {
      instagram: 'https://www.instagram.com/parasat_business_club/',
      youtube: 'https://youtube.com/@parasatbusinessclub2024',
    },
  };

  const u = user as any;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="card-blue rounded-2xl p-6 flex gap-6 items-center">
            <div className="w-28 h-28 rounded-full bg-[#0b255f] flex items-center justify-center">
            <Avatar>
              <AvatarFallback className="text-white">{(u.name || '').split(' ').map((n: string) => n?.[0] || '').join('')}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-card-foreground">{user.name}</h2>
                <div className="text-sm muted-text mt-1">{(user as any).title || (user as any).role || 'Пользователь'}</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateTo('profile-edit')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-4 py-2 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Edit className="w-4 h-4" />
                  Редактировать
                </button>
              </div>
            </div>

                <p className="mt-4 text-card-foreground leading-relaxed">{u.about}</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="text-sm muted-text">Email</div>
                  <div className="text-card-foreground">{u.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="text-sm muted-text">Телефон</div>
                  <div className="text-card-foreground">{u.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="text-sm muted-text">Локация</div>
                  <div className="text-card-foreground">{u.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="text-sm muted-text">На платформе</div>
                  <div className="text-card-foreground">{new Date(u.joined).toLocaleDateString('ru-RU')}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={u.links?.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#07225a] text-white hover:bg-[#0b3a8f] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 11.37A4 4 0 1 1 12.63 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Instagram
              </a>

              <a href={u.links?.youtube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#07225a] text-white hover:bg-[#0b3a8f] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 10.5s-.2-1.4-.8-2a2.8 2.8 0 0 0-2-1C16.8 7.5 12 7.5 12 7.5s-4.8 0-6.9.1a2.8 2.8 0 0 0-2 1c-.6.6-.8 2-.8 2S2 12 2 13.5v1A2 2 0 0 0 4 17.5c1.4.3 6 .3 8 .3s6.6 0 8-.3a2 2 0 0 0 2-2.5v-1c0-1.5-.9-3-1-3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Подкаст
              </a>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <h3 className="text-lg font-semibold text-primary mb-4">Деятельность</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-blue-compact rounded-2xl p-4">
              <div className="text-sm muted-text">Инвестиции</div>
              <div className="text-card-foreground font-semibold mt-2">Активно инвестирую в ранние стадии</div>
            </div>

            <div className="card-blue-compact rounded-2xl p-4">
              <div className="text-sm muted-text">Менторство</div>
              <div className="text-card-foreground font-semibold mt-2">Проводит менторские сессии и программы</div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-semibold text-primary mb-4">Ключевые показатели</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-blue-compact rounded-2xl p-4 text-center">
              <div className="text-card-foreground text-2xl font-bold">150+</div>
              <div className="text-sm muted-text mt-1">Проектов</div>
            </div>
            <div className="card-blue-compact rounded-2xl p-4 text-center">
              <div className="text-card-foreground text-2xl font-bold">1.2K</div>
              <div className="text-sm muted-text mt-1">Пользователей</div>
            </div>
            <div className="card-blue-compact rounded-2xl p-4 text-center">
              <div className="text-card-foreground text-2xl font-bold">45</div>
              <div className="text-sm muted-text mt-1">Успешных сделок</div>
            </div>
          </div>
        </section>

        <section className="mt-8 pb-8">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-primary-soft" onClick={() => navigateTo('favorites')}>
            Показать избранное
          </Button>
        </section>
      </div>
    </div>
  );
}
