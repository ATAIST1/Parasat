using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class BusinessRepository : IBusinessRepository
{
    private readonly IMongoCollection<Business> _businesses;

    public BusinessRepository(IMongoDatabase database)
    {
        _businesses = database.GetCollection<Business>("businesses_feed");
    }

    public async Task<List<Business>> GetAllAsync()
        => await _businesses.Find(_ => true).ToListAsync();

    public async Task<Business?> GetByIdAsync(string id)
        => await _businesses.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Business business)
        => await _businesses.InsertOneAsync(business);

    public async Task UpdateAsync(Business business)
        => await _businesses.ReplaceOneAsync(x => x.Id == business.Id, business);

    public async Task DeleteAsync(string id)
        => await _businesses.DeleteOneAsync(x => x.Id == id);
}

