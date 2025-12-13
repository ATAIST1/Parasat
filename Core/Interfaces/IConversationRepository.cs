using Core.Models;

namespace Core.Interfaces;

public interface IConversationRepository
{
    Task<Conversation?> GetByStartupAndUsersAsync(string startupId, string ownerId, string initiatorId);
    Task<Conversation?> GetByIdAsync(string conversationId);
    Task CreateAsync(Conversation c);
    Task<List<Conversation>> GetByUserAsync(string userId);
}
