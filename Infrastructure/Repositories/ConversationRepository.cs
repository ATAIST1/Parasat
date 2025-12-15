using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class ConversationRepository : IConversationRepository
{
    private readonly IMongoCollection<Conversation> _col;

    public ConversationRepository(IMongoDatabase db)
    {
        _col = db.GetCollection<Conversation>("conversations");
    }

    public Task<List<Conversation>> GetByParticipantAsync(string userId) =>
        _col.Find(x => x.ParticipantIds.Contains(userId))
            .SortByDescending(x => x.UpdatedAtUtc)
            .ToListAsync();

    public Task<Conversation?> GetByIdAsync(string id) =>
        _col.Find(x => x.Id == id).FirstOrDefaultAsync();

    public Task<Conversation?> GetByStartupAndUsersAsync(string startupId, string ownerId, string initiatorId) =>
        _col.Find(x =>
                x.StartupId == startupId &&
                x.ParticipantIds.Contains(ownerId) &&
                x.ParticipantIds.Contains(initiatorId))
            .FirstOrDefaultAsync();

    public Task CreateAsync(Conversation c) => _col.InsertOneAsync(c);
}
