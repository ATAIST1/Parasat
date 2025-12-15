using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class ConversationRepository : IConversationRepository
{
    private readonly IMongoCollection<Conversation> _conversations;

    public ConversationRepository(IMongoDatabase database)
    {
        _conversations = database.GetCollection<Conversation>("conversations");
    }

    public async Task<Conversation?> GetByIdAsync(string id)
        => await _conversations.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<Conversation?> GetByContextAndUsersAsync(
        ConversationContextType type,
        string contextId,
        string userId1,
        string userId2)
    {
        // оба участника должны быть в ParticipantIds + совпасть контекст
        return await _conversations.Find(x =>
                x.ContextType == type &&
                x.ContextId == contextId &&
                x.ParticipantIds.Contains(userId1) &&
                x.ParticipantIds.Contains(userId2))
            .FirstOrDefaultAsync();
    }

    public async Task<List<Conversation>> GetByUserAsync(string userId)
        => await _conversations.Find(x => x.ParticipantIds.Contains(userId))
            .SortByDescending(x => x.CreatedAtUtc)
            .ToListAsync();

    public async Task CreateAsync(Conversation conversation)
        => await _conversations.InsertOneAsync(conversation);
}
