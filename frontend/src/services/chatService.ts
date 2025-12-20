import api from '../lib/api';

export interface ChatUserDto {
  id: string;
  name: string;
}
export interface ConversationListItemDto {
  conversationId: string;
  itemType: number;
  itemId: string;
  ownerId: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  unreadCount: number;
}

export interface ChatMessageDto {
  id: string;
  text: string;
  sentAt: string;
  isMine: boolean;
  isRead: boolean;
  from: ChatUserDto;
  to: ChatUserDto;
}

export enum ConversationContextType {
  Startup = 0,
  Business = 1,
  Investor = 2,
  Developer = 3,
}


// создать/найти диалог по стартапу
export async function openChat(itemType: ConversationContextType, itemId: string): Promise<string> {
  const res = await api.post('/api/chat/open', { itemType, itemId });
  const id = res.data?.conversationId;
  if (!id) throw new Error('conversationId not returned');
  return String(id);
}


export async function getConversationMessages(conversationId: string) {
  const res = await api.get(`/api/chat/${conversationId}`);
  return res.data;
}

export async function sendMessageToConversation(conversationId: string, text: string) {
  const res = await api.post(`/api/chat/${conversationId}`, { text });
  return res.data;
}

export async function getMyConversations(): Promise<ConversationListItemDto[]> {
  const res = await api.get<ConversationListItemDto[]>('/api/chat/conversations');
  return res.data;
}
