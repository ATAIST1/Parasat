using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class ChatRepository : IChatRepository
{
    private readonly IMongoCollection<Message> _messages;

    public ChatRepository(IMongoDatabase database)
    {
        _messages = database.GetCollection<Message>("messages");
    }

    public async Task<List<Message>> GetChatAsync(string userId1, string userId2)
    {
        var filter = Builders<Message>.Filter.Or(
            Builders<Message>.Filter.And(
                Builders<Message>.Filter.Eq(m => m.FromId, userId1),
                Builders<Message>.Filter.Eq(m => m.ToId, userId2)
            ),
            Builders<Message>.Filter.And(
                Builders<Message>.Filter.Eq(m => m.FromId, userId2),
                Builders<Message>.Filter.Eq(m => m.ToId, userId1)
            )
        );

        return await _messages
            .Find(filter)
            .SortBy(m => m.SentAt)
            .ToListAsync();
    }

    public async Task SendMessageAsync(Message message)
    {
        await _messages.InsertOneAsync(message);
    }

    public async Task<List<string>> GetChatPartnersAsync(string userId)
    {
        var partners = await _messages
            .Find(m => m.FromId == userId || m.ToId == userId)
            .Project(m => m.FromId == userId ? m.ToId : m.FromId)
            .ToListAsync();

        return partners.Distinct().ToList();
    }
}