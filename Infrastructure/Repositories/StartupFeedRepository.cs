using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class StartupFeedRepository : IStartupFeedRepository
{
    private readonly IMongoCollection<StartupFeed> _startups;

    public StartupFeedRepository(IMongoDatabase database)
    {
        _startups = database.GetCollection<StartupFeed>("startups_feed");
    }

    public async Task<List<StartupFeed>> GetAllAsync()
        => await _startups.Find(_ => true).ToListAsync();

    public async Task<StartupFeed?> GetByIdAsync(string id)
        => await _startups.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(StartupFeed startup)
        => await _startups.InsertOneAsync(startup);

    public async Task UpdateAsync(StartupFeed startup)
        => await _startups.ReplaceOneAsync(x => x.Id == startup.Id, startup);

    public async Task DeleteAsync(string id)
        => await _startups.DeleteOneAsync(x => x.Id == id);
}


