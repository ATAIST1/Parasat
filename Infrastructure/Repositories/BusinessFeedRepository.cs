using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class BusinessFeedRepository : IBusinessFeedRepository
{
    private readonly IMongoCollection<BusinessFeed> _businesses;

    public BusinessFeedRepository(IMongoDatabase database)
    {
        _businesses = database.GetCollection<BusinessFeed>("businesses_feed");
    }

    public async Task<List<BusinessFeed>> GetAllAsync()
        => await _businesses.Find(_ => true).ToListAsync();

    public async Task<BusinessFeed?> GetByIdAsync(string id)
        => await _businesses.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(BusinessFeed business)
        => await _businesses.InsertOneAsync(business);

    public async Task UpdateAsync(BusinessFeed business)
        => await _businesses.ReplaceOneAsync(x => x.Id == business.Id, business);

    public async Task DeleteAsync(string id)
        => await _businesses.DeleteOneAsync(x => x.Id == id);
}


