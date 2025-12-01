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
