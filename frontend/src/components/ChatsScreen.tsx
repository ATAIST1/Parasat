import { MessageCircle, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface ChatsScreenProps {
  navigateTo: (screen: any) => void;
}

const mockChats = [
  {
    id: '1',
    name: 'PayFlow Team',
    lastMessage: 'Спасибо за интерес! Готовы обсудить детали',
    time: '2ч',
    unread: 2,
  },
  {
    id: '2',
    name: 'Александр Иванов',
    lastMessage: 'Пришлите финмодель, пожалуйста',
    time: '5ч',
    unread: 0,
  },
  {
    id: '3',
    name: 'EduKZ',
    lastMessage: 'Готовы к 15-минутному коллу?',
    time: 'вчера',
    unread: 1,
  },
];

export default function ChatsScreen({ navigateTo }: ChatsScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-900 rounded-lg p-1.5">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-gray-900">Чаты</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input placeholder="Поиск по диалогам" className="pl-10" />
        </div>
      </div>

      {mockChats.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {mockChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => navigateTo('chat')}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors bg-white"
            >
              <Avatar className="w-12 h-12 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {chat.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">
          <MessageCircle className="w-16 h-16 text-gray-300" />
          <div className="space-y-2">
            <h3 className="text-gray-900">Начните диалог</h3>
            <p className="text-gray-600 text-sm max-w-xs">
              Отправьте интерес к проекту или мандату, чтобы перейти к обсуждению условий.
            </p>
          </div>
          <Button onClick={() => navigateTo('feed')}>Посмотреть проекты</Button>
        </div>
      )}
    </div>
  );
}
