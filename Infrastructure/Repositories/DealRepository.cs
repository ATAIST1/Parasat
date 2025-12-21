using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class DealRepository : IDealRepository
{
    private readonly IMongoCollection<Deal> _deals;

    public DealRepository(IMongoDatabase database)
    {
        _deals = database.GetCollection<Deal>("deals");
    }

    public async Task<Deal?> GetByConversationIdAsync(string conversationId)
        => await _deals.Find(x => x.ConversationId == conversationId).FirstOrDefaultAsync();

    public async Task CreateAsync(Deal deal)
        => await _deals.InsertOneAsync(deal);

    public async Task UpdateAsync(Deal deal)
        => await _deals.ReplaceOneAsync(x => x.Id == deal.Id, deal);

    public async Task<List<Deal>> GetAllAsync()
        => await _deals.Find(_ => true)
            .SortByDescending(x => x.CreatedAtUtc)
            .ToListAsync();
}
