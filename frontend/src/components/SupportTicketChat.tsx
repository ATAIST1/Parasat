import { ArrowLeft, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useEffect, useState, useRef } from 'react';
import { Badge } from './ui/badge';
import type { SupportTicketDto, SupportMessageDto } from '../services/supportService';
import { supportService } from '../services/supportService';

interface SupportTicketChatProps {
  onBack: () => void;
  ticketId: string;
  currentUserId: string;
}

export default function SupportTicketChat({
  onBack,
  ticketId,
  currentUserId,
}: SupportTicketChatProps) {
  const [ticket, setTicket] = useState<SupportTicketDto | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        setIsLoading(true);
        const data = await supportService.getTicket(ticketId);
        setTicket(data);
      } catch (error) {
        console.error('Failed to load ticket:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTicket();
  }, [ticketId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !ticket) return;

    try {
      setIsSending(true);
      const updatedTicket = await supportService.addMessage(ticketId, {
        content: message,
      });
      setTicket(updatedTicket);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
      case 'inprogress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Тикет не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{ticket.subject}</h2>
              <p className="text-sm text-gray-500">ID: {ticket.id}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className={`${getStatusColor(ticket.status)}`}>
            {ticket.status}
          </Badge>
          <Badge className={`${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </Badge>
          <Badge variant="outline">{ticket.category}</Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {ticket.messages && ticket.messages.length > 0 ? (
          ticket.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.userId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.userId === currentUserId
                    ? 'bg-blue-500 text-white'
                    : msg.isSupportAgent
                      ? 'bg-green-100 text-gray-900'
                      : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Нет сообщений</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <Input
            placeholder="Напишите сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isSending}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
            size="icon"
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
