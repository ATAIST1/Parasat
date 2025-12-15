import api from '../lib/api';

export interface ChatUserDto {
  id: string;
  name: string;
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

// создать/найти диалог по стартапу
export async function startConversationWithStartup(startupId: string): Promise<string> {
  const res = await api.post<{ conversationId: string }>(
    `/api/chat/startup/${startupId}`
  );
  return res.data.conversationId;
}

// получить историю сообщений
export async function getConversationMessages(
  conversationId: string
): Promise<ChatMessageDto[]> {
  const res = await api.get<ChatMessageDto[]>(`/api/chat/${conversationId}`);
  return res.data;
}

// отправить сообщение
export async function sendMessageToConversation(
  conversationId: string,
  text: string
): Promise<ChatMessageDto> {
  const res = await api.post<ChatMessageDto>(`/api/chat/${conversationId}`, { text });
  return res.data;
}
