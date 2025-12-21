import { MessageCircle, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useEffect, useState, useRef } from 'react';
import { getMyConversations, ConversationListItemDto } from '../services/chatService';
import { HubConnectionBuilder } from '@microsoft/signalr';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';


interface ChatsScreenProps {
  navigateTo: (screen: any) => void;
  openChat: (conversationId: string, title: string) => void;
}


export default function ChatsScreen({ navigateTo, openChat  }: ChatsScreenProps) {
  const [chats, setChats] = useState<ConversationListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const connectionRef = useRef<any>(null);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await getMyConversations();
      // Sort by latest update (descending), fallback to createdAtUtc if updatedAtUtc missing
      const sorted = data.sort((a, b) => {
        const timeB = new Date(b.updatedAtUtc || b.createdAtUtc).getTime();
        const timeA = new Date(a.updatedAtUtc || a.createdAtUtc).getTime();
        return timeB - timeA;
      });
      setChats(sorted);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Set up SignalR connection for real-time updates
  useEffect(() => {
    const connection = new HubConnectionBuilder()
        .withUrl('http://localhost:5073/hubs/chat', {
          accessTokenFactory: () => localStorage.getItem('accessToken') || ''
        })
        .withAutomaticReconnect()
        .build();

    connectionRef.current = connection;

    connection.start()
      .then(() => console.log('ChatsScreen SignalR connected'))
      .catch(err => console.error('ChatsScreen SignalR connection error:', err));

    // When a conversation is updated (new message), reload the conversation list
    connection.on('ConversationUpdated', (conversationId: string) => {
      console.log('ConversationUpdated:', conversationId);
      loadConversations();
    });

    // Also listen for received messages to update unread counts in real-time
    connection.on('ReceiveMessage', () => {
      console.log('Message received, updating chat list');
      loadConversations();
    });

    return () => {
      connection.stop().catch(() => {});
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        {/* <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-900 rounded-lg p-1.5">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-gray-900">Чаты</h1>
        </div> */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900" />
          <Input placeholder="Поиск по диалогам" className="pl-10 text-gray-900" />
        </div>
      </div>

      {isLoading ? (
          <div className="p-4 text-sm text-gray-500">Загрузка…</div>
      ) : chats.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {chats.map((c) => (
              <button
                  key={c.conversationId}
                  onClick={() => openChat(c.conversationId, 'Чат')}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors bg-white"
              >
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {String(c.itemType)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className={`truncate ${c.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-900'}`}>
                      Диалог #{c.conversationId.slice(-6)}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {c.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {c.unreadCount > 99 ? '99+' : c.unreadCount}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(c.updatedAtUtc).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    Нажмите, чтобы открыть
                  </p>
                </div>
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
