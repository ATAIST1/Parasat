// frontend/src/components/ChatScreen.tsx
import { ArrowLeft, Send, Paperclip, Video, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useEffect, useState, useRef } from 'react';
import { Badge } from './ui/badge';
import { HubConnectionBuilder } from '@microsoft/signalr';
import {
  ChatMessageDto,
  getConversationMessages,
  sendMessageToConversation,
} from '../services/chatService';

interface ChatScreenProps {
  onBack: () => void;
  conversationId: string;
  title: string;
  currentUserId: string;
}

const quickTemplates = [
  'Готовы к 15-минутному коллу?',
  'Пришлите, пожалуйста, питч-дек.',
  'Расскажите про юнит-экономику.',
];

export default function ChatScreen({ onBack, conversationId, title, currentUserId }: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const connectionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize SignalR connection
  useEffect(() => {
    const connection = new HubConnectionBuilder()
        .withUrl('http://localhost:5073/hubs/chat', {
          accessTokenFactory: () => localStorage.getItem('accessToken') || ''
        })
        .withAutomaticReconnect()
        .build();

    connectionRef.current = connection;

    connection.start()
      .then(() => console.log('SignalR connected'))
      .catch(err => console.error('SignalR connection error:', err));

    connection.on('ReceiveMessage', (msg: ChatMessageDto) => {
      console.log('Received message:', msg);
      setMessages((prev) => {
        // Check if message already exists by ID
        if (prev.some((x) => x.id === msg.id)) return prev;
        
        // Check if this is a duplicate of an optimistic message
        // (same sender, same text, sent within last 2 seconds)
        const isDuplicate = prev.some((x) => 
          x.from.id === msg.from.id && 
          x.text === msg.text &&
          Math.abs(new Date(x.sentAt).getTime() - new Date(msg.sentAt).getTime()) < 2000
        );
        
        if (isDuplicate) return prev;
        
        return [...prev, msg];
      });
    });

    return () => {
      connection.stop().catch(() => {});
    };
  }, []);

  // загрузка истории при открытии
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const history = await getConversationMessages(conversationId);
        setMessages(history);
      } catch (e) {
        console.error('Failed to load messages', e);
      } finally {
        setIsLoading(false);
      }
    };

    if (conversationId) {
      load();
    }
  }, [conversationId]);

  const handleSend = async () => {
    const text = message.trim();
    if (!text) return;

    try {
      setIsSending(true);
      
      // Create optimistic message to show immediately
      const optimisticMessage: ChatMessageDto = {
        id: `temp-${Date.now()}`,
        text,
        sentAt: new Date().toISOString(),
        isRead: true,
        from: { id: currentUserId, name: 'You' },
        to: { id: '', name: '' },
      };
      
      // Add message to UI immediately (optimistic update)
      setMessages((prev) => [...prev, optimisticMessage]);
      setMessage('');
      setIsSending(false);
      
      // Send to server in background (fire and forget, but handle errors)
      try {
        if (connectionRef.current?.state === 1) {
          // Use SignalR to send message (don't await, fire and forget)
          connectionRef.current.invoke('SendMessage', conversationId, text)
            .catch((err) => {
              console.error('Failed to send via SignalR:', err);
              // Fallback to HTTP
              sendMessageToConversation(conversationId, text)
                .catch((err) => console.error('Failed to send via HTTP:', err));
            });
        } else {
          // Fallback to HTTP if SignalR is not connected
          console.log('SignalR not connected, using HTTP fallback');
          sendMessageToConversation(conversationId, text)
            .catch((err) => console.error('Failed to send message:', err));
        }
      } catch (e) {
        console.error('Error sending message in background:', e);
      }
    } catch (e) {
      console.error('Failed to send message', e);
      setIsSending(false);
    }
  };

  const handleTemplateClick = (template: string) => {
    setMessage(template);
  };

  return (
  <div className="flex-1 min-h-0 bg-gray-50 flex flex-col text-gray-900">
    {/* header (НЕ в скролле) */}
    <div className="bg-white border-b border-gray-200 px-4 py-3 z-10 text-gray-900 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              {title.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-gray-900 truncate">{title}</h2>
            <p className="text-xs text-gray-500">
              {isLoading ? 'Загружаем историю…' : 'Приватный чат'}
            </p>
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

    {/* scroll area: messages + templates */}
    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
      <div className="flex-1 p-4 space-y-4">
        {isLoading && (
          <div className="text-center text-gray-500 text-sm">Загружаем…</div>
        )}

        {messages.map((msg) => {
          const time = new Date(msg.sentAt).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          });

          const isMine = msg.from.id === currentUserId;

          if (!isMine) {
            return (
              <div key={msg.id} className="flex gap-2 items-start">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                    {msg.from.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 max-w-xs">
                    <p className="text-gray-900 text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-1">{time}</p>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex gap-2 items-start justify-end">
              <div className="flex-1 min-w-0 flex flex-col items-end">
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-3 max-w-xs">
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 mr-1">{time}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
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
    </div>

    {/* input (снизу, не в скролле) */}
    <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
      <div className="flex gap-2 items-end">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <Input
            placeholder="Напишите сообщение…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
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
          disabled={!message.trim() || isSending}
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
