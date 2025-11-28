import { ArrowLeft, Send, Paperclip, Video, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { Badge } from './ui/badge';

interface ChatScreenProps {
  onBack: () => void;
}

const mockMessages = [
  {
    id: '1',
    type: 'system',
    content: 'Вы отправили интерес к проекту PayFlow.',
    timestamp: '10:30',
  },
  {
    id: '2',
    type: 'system',
    content: 'Создан приватный канал. Соблюдайте этикет.',
    timestamp: '10:30',
  },
  {
    id: '3',
    type: 'received',
    content: 'Спасибо за интерес! Готовы обсудить детали проекта.',
    timestamp: '10:35',
    sender: 'PayFlow Team',
  },
  {
    id: '4',
    type: 'sent',
    content: 'Здравствуйте! Можете рассказать подробнее про юнит-экономику?',
    timestamp: '10:40',
  },
  {
    id: '5',
    type: 'received',
    content: 'Конечно! Наш средний чек — 15,000 ₸/мес с клиента. CAC составляет около 8,000 ₸, LTV — 180,000 ₸. Payback period — 6 месяцев.',
    timestamp: '10:42',
    sender: 'PayFlow Team',
  },
];

const quickTemplates = [
  'Готовы к 15-минутному коллу?',
  'Пришлите, пожалуйста, питч-дек.',
  'Расскажите про юнит-экономику.',
];

export default function ChatScreen({ onBack }: ChatScreenProps) {
  const [message, setMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(true);

  const handleSend = () => {
    if (message.trim()) {
      // В реальном приложении - отправка сообщения
      setMessage('');
      setShowTemplates(false);
    }
  };

  const handleTemplateClick = (template: string) => {
    setMessage(template);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                P
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-gray-900 truncate">PayFlow Team</h2>
              <p className="text-xs text-gray-500">Онлайн</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockMessages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full max-w-xs text-center">
                  {msg.content}
                </div>
              </div>
            );
          }

          if (msg.type === 'received') {
            return (
              <div key={msg.id} className="flex gap-2 items-start">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                    P
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 max-w-xs">
                    <p className="text-gray-900 text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-1">{msg.timestamp}</p>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex gap-2 items-start justify-end">
              <div className="flex-1 min-w-0 flex flex-col items-end">
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-3 max-w-xs">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 mr-1">{msg.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>

      {showTemplates && (
        <div className="px-4 py-2 bg-white border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Быстрые шаблоны:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickTemplates.map((template, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleTemplateClick(template)}
              >
                {template}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2 items-end">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <Input
              placeholder="Напишите сообщение…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="resize-none"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
