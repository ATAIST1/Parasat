using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories
{
    public class StartupRepository : IStartupRepository
    {
        private readonly IMongoCollection<Startup> _collection;

        public StartupRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<Startup>("startups");
        }

        public async Task<IEnumerable<Startup>> GetAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<IEnumerable<Startup>> GetAllAsync(
            string? search = null,
            string? industry = null,
            string? evidence = null,
            string? city = null)
        {
            var filter = Builders<Startup>.Filter.Empty;

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                var searchFilter = Builders<Startup>.Filter.Or(
                    Builders<Startup>.Filter.Regex(x => x.ProjectName,
                        new MongoDB.Bson.BsonRegularExpression(search, "i")),
                    Builders<Startup>.Filter.Regex(x => x.Title,
                        new MongoDB.Bson.BsonRegularExpression(search, "i")),
                        Builders<Startup>.Filter.Regex(x => x.ShortPitch,
                        new MongoDB.Bson.BsonRegularExpression(search, "i")),
                    Builders<Startup>.Filter.Regex(x => x.Description,
                        new MongoDB.Bson.BsonRegularExpression(search, "i")),
                    Builders<Startup>.Filter.Where(x => x.Technologies != null &&
                        x.Technologies.Any(t => t.ToLower().Contains(searchLower)))
                );
                filter &= searchFilter;
            }

            if (!string.IsNullOrWhiteSpace(industry))
            {
                filter &= Builders<Startup>.Filter.Eq(x => x.Industry, industry);
            }

            if (!string.IsNullOrWhiteSpace(evidence))
            {
                filter &= Builders<Startup>.Filter.Eq(x => x.Evidence, evidence);
            }

            if (!string.IsNullOrWhiteSpace(city))
            {
                filter &= Builders<Startup>.Filter.Regex(x => x.City,
                    new MongoDB.Bson.BsonRegularExpression(city, "i"));
            }

            filter &= Builders<Startup>.Filter.Eq(x => x.Status, "published");

            return await _collection.Find(filter)
                .SortByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<Startup?> GetByIdAsync(string id)
        {
            return await _collection
                .Find(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task AddAsync(Startup startup)
        {
            await _collection.InsertOneAsync(startup);
        }

        public async Task<bool> UpdateAsync(Startup startup)
        {
            var result = await _collection
                .ReplaceOneAsync(x => x.Id == startup.Id, startup);

            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _collection.DeleteOneAsync(x => x.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
