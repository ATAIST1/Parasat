using Core.Models;

namespace Core.Interfaces;

public interface IChatRepository
{
    Task<List<Message>> GetChatAsync(string userId1, string userId2);
    Task SendMessageAsync(Message message);
    Task<List<string>> GetChatPartnersAsync(string userId);
    Task<List<Message>> GetByConversationAsync(string conversationId);
}
