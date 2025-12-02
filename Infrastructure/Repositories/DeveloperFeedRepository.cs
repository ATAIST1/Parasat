using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class DeveloperFeedRepository : IDeveloperFeedRepository
{
    private readonly IMongoCollection<DeveloperFeed> _developers;

    public DeveloperFeedRepository(IMongoDatabase database)
    {
        _developers = database.GetCollection<DeveloperFeed>("developers_feed");
    }

    public async Task<List<DeveloperFeed>> GetAllAsync()
        => await _developers.Find(_ => true).ToListAsync();

    public async Task<DeveloperFeed?> GetByIdAsync(string id)
        => await _developers.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(DeveloperFeed developer)
        => await _developers.InsertOneAsync(developer);

    public async Task UpdateAsync(DeveloperFeed developer)
        => await _developers.ReplaceOneAsync(x => x.Id == developer.Id, developer);

    public async Task DeleteAsync(string id)
        => await _developers.DeleteOneAsync(x => x.Id == id);
}


