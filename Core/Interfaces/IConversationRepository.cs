using Core.Models;

namespace Core.Interfaces;

public interface IConversationRepository
{
    Task<List<Conversation>> GetByParticipantAsync(string userId);
    Task<Conversation?> GetByIdAsync(string id);
    Task<Conversation?> GetByStartupAndUsersAsync(string startupId, string ownerId, string initiatorId);
    Task CreateAsync(Conversation c);
}
