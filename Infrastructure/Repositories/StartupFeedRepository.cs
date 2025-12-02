using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;
using MongoDB.Bson;

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

    public async Task<List<StartupFeed>> GetAllAsync(
    string? search = null,
        string? stage = null,
        string? industry = null,
        string? location = null)
    {
        var filter = Builders<StartupFeed>.Filter.Empty;

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            var searchFilter = Builders<StartupFeed>.Filter.Or(
                Builders<StartupFeed>.Filter.Regex(x => x.Name, new BsonRegularExpression(search, "i")),
                Builders<StartupFeed>.Filter.Regex(x => x.Pitch, new BsonRegularExpression(search, "i")),
                Builders<StartupFeed>.Filter.Regex(x => x.Location, new BsonRegularExpression(search, "i")),
                Builders<StartupFeed>.Filter.Where(x => x.Tags.Any(tag => 
                    tag.ToLower().Contains(searchLower)))
            );
            filter &= searchFilter;
        }

        if (!string.IsNullOrWhiteSpace(stage))
        {
            filter &= Builders<StartupFeed>.Filter.Eq(x => x.Stage, stage);
        }

        if (!string.IsNullOrWhiteSpace(industry))
        {
            filter &= Builders<StartupFeed>.Filter.Eq(x => x.Industry, industry);
        }

        if (!string.IsNullOrWhiteSpace(location))
        {
            filter &= Builders<StartupFeed>.Filter.Regex(x => x.Location, 
                new BsonRegularExpression(location, "i"));
        }

        return await _startups.Find(filter).ToListAsync();
    }

    public async Task CreateAsync(StartupFeed startup)
        => await _startups.InsertOneAsync(startup);

    public async Task UpdateAsync(StartupFeed startup)
        => await _startups.ReplaceOneAsync(x => x.Id == startup.Id, startup);

    public async Task DeleteAsync(string id)
        => await _startups.DeleteOneAsync(x => x.Id == id);
}


