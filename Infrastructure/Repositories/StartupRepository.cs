using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class StartupRepository : IStartupRepository
{
    private readonly IMongoCollection<Startup> _startups;

    public StartupRepository(IMongoDatabase database)
    {
        _startups = database.GetCollection<Startup>("startups_feed");
    }

    public async Task<List<Startup>> GetAllAsync()
        => await _startups.Find(_ => true).ToListAsync();

    public async Task<Startup?> GetByIdAsync(string id)
        => await _startups.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Startup startup)
        => await _startups.InsertOneAsync(startup);

    public async Task UpdateAsync(Startup startup)
        => await _startups.ReplaceOneAsync(x => x.Id == startup.Id, startup);

    public async Task DeleteAsync(string id)
        => await _startups.DeleteOneAsync(x => x.Id == id);
}

