using Core.Models;

namespace Core.Interfaces;

public interface IConversationRepository
{
    Task<Conversation?> GetByIdAsync(string id);

    Task<Conversation?> GetByContextAndUsersAsync(
        ConversationContextType type,
        string contextId,
        string userId1,
        string userId2);

    Task<List<Conversation>> GetByUserAsync(string userId);

    Task CreateAsync(Conversation conversation);
    
    Task UpdateAsync(Conversation conversation);

    Task<List<Conversation>> GetAllAsync();

}
