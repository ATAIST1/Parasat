import api from '../lib/api';

export interface SupportMessageDto {
  id: string;
  userId: string;
  userName: string;
  content: string;
  isSupportAgent: boolean;
  createdAt: string;
  attachmentKeys: string[];
}

export interface SupportTicketDto {
  id: string;
  userId: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  messages: SupportMessageDto[];
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  assignedToAgentId: string | null;
}

export interface CreateSupportTicketDto {
  subject: string;
  category: string;
  priority: string;
  initialMessage?: string;
}

export interface SendSupportMessageDto {
  content: string;
  attachmentKeys?: string[];
}

class SupportService {
  async createTicket(dto: CreateSupportTicketDto): Promise<SupportTicketDto> {
    const response = await api.post('/api/support/tickets', dto);
    return response.data;
  }

  async getMyTickets(): Promise<SupportTicketDto[]> {
    const response = await api.get('/api/support/tickets');
    return response.data;
  }

  async getTicket(id: string): Promise<SupportTicketDto> {
    const response = await api.get(`/api/support/tickets/${id}`);
    return response.data;
  }

  async addMessage(ticketId: string, dto: SendSupportMessageDto): Promise<SupportTicketDto> {
    const response = await api.post(`/api/support/tickets/${ticketId}/messages`, dto);
    return response.data;
  }

  async updateStatus(ticketId: string, status: string): Promise<SupportTicketDto> {
    const response = await api.patch(`/api/support/tickets/${ticketId}/status`, { status });
    return response.data;
  }
}

export const supportService = new SupportService();
