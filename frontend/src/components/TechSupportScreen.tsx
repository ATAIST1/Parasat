import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import SupportTicketChat from './SupportTicketChat';
import type { SupportTicketDto, CreateSupportTicketDto } from '../services/supportService';
import { supportService } from '../services/supportService';

interface TechSupportScreenProps {
  user: any;
  navigateTo: (screen: string) => void;
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string | null) => void;
}

export default function TechSupportScreen({
  user,
  navigateTo,
  selectedTicketId,
  onSelectTicket,
}: TechSupportScreenProps) {
  const [tickets, setTickets] = useState<SupportTicketDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateSupportTicketDto>({
    subject: '',
    category: 'General',
    priority: 'Normal',
    initialMessage: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load tickets on mount
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const data = await supportService.getMyTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim()) return;

    try {
      setIsSubmitting(true);
      const newTicket = await supportService.createTicket(formData);
      setTickets([newTicket, ...tickets]);
      setFormData({
        subject: '',
        category: 'General',
        priority: 'Normal',
        initialMessage: '',
      });
      setShowCreateForm(false);
      onSelectTicket(newTicket.id);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show chat if ticket is selected
  if (selectedTicketId) {
    return (
      <SupportTicketChat
        onBack={() => onSelectTicket(null)}
        ticketId={selectedTicketId}
        currentUserId={user?.id || ''}
      />
    );
  }

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
        return 'text-red-600';
      case 'normal':
        return 'text-orange-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in progress':
      case 'inprogress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'open':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('profile')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Техническая поддержка</h1>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Новый тикет
          </Button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white border-b border-gray-200 p-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Создать новый тикет</h2>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тема
              </label>
              <Input
                placeholder="Опишите вашу проблему"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General">Общий вопрос</option>
                  <option value="Technical">Техническая проблема</option>
                  <option value="Account">Проблема с аккаунтом</option>
                  <option value="Payment">Вопрос по платежам</option>
                  <option value="Feature">Запрос функции</option>
                  <option value="Bug">Сообщение об ошибке</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Приоритет
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Низкий</option>
                  <option value="Normal">Обычный</option>
                  <option value="High">Высокий</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание (опционально)
              </label>
              <textarea
                placeholder="Подробное описание вашей проблемы"
                value={formData.initialMessage || ''}
                onChange={(e) =>
                  setFormData({ ...formData, initialMessage: e.target.value })
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.subject.trim()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isSubmitting ? 'Создание...' : 'Создать тикет'}
              </Button>
              <Button
                type="button"
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                disabled={isSubmitting}
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div className="p-4">
        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-500">Загрузка тикетов...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">У вас нет активных тикетов поддержки</p>
            <Button onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Создать первый тикет
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => onSelectTicket(ticket.id)}
                className="w-full bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 flex items-start gap-3">
                    {getStatusIcon(ticket.status)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {ticket.subject}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ID: {ticket.id.substring(0, 8)}... • {new Date(ticket.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className={`${getStatusColor(ticket.status)} text-xs`}>
                    {ticket.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {ticket.category}
                  </Badge>
                  <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority} приоритет
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{ticket.messages?.length || 0} сообщений</span>
                  {ticket.assignedToAgentId && (
                    <span className="text-green-600">Назначен агенту</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
