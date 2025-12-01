using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class DeveloperRepository : IDeveloperRepository
{
    private readonly IMongoCollection<Developer> _developers;

    public DeveloperRepository(IMongoDatabase database)
    {
        _developers = database.GetCollection<Developer>("developers_feed");
    }

    public async Task<List<Developer>> GetAllAsync()
        => await _developers.Find(_ => true).ToListAsync();

    public async Task<Developer?> GetByIdAsync(string id)
        => await _developers.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Developer developer)
        => await _developers.InsertOneAsync(developer);

    public async Task UpdateAsync(Developer developer)
        => await _developers.ReplaceOneAsync(x => x.Id == developer.Id, developer);

    public async Task DeleteAsync(string id)
        => await _developers.DeleteOneAsync(x => x.Id == id);
}

