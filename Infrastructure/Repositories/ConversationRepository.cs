using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class ConversationRepository : IConversationRepository
{
    private readonly IMongoCollection<Conversation> _conversations;

    public ConversationRepository(IMongoDatabase db)
    {
        _conversations = db.GetCollection<Conversation>("conversations");
    }

    public async Task<Conversation?> GetByStartupAndUsersAsync(string startupId, string ownerId, string initiatorId)
        => await _conversations.Find(c =>
                c.StartupId == startupId &&
                c.OwnerId == ownerId &&
                c.InitiatorId == initiatorId
            ).FirstOrDefaultAsync();

    public async Task<Conversation?> GetByIdAsync(string conversationId)
        => await _conversations.Find(c => c.Id == conversationId).FirstOrDefaultAsync();

    public async Task CreateAsync(Conversation c)
        => await _conversations.InsertOneAsync(c);

    public async Task<List<Conversation>> GetByUserAsync(string userId)
        => await _conversations.Find(c => c.ParticipantIds.Contains(userId))
            .SortByDescending(c => c.CreatedAtUtc)
            .ToListAsync();
}
