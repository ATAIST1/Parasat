using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class DeveloperProfileRepository : IDeveloperProfileRepository
    {
        private readonly IMongoCollection<DeveloperProfile> _collection;

        public DeveloperProfileRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<DeveloperProfile>("developer_profiles");
        }

        public async Task<List<DeveloperProfile>> GetAllAsync()
            => await _collection.Find(_ => true).ToListAsync();

        public async Task<DeveloperProfile?> GetByIdAsync(string id)
            => await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<DeveloperProfile?> GetByUserIdAsync(string userId)
            => await _collection.Find(x => x.UserId == userId).FirstOrDefaultAsync();

        public async Task AddAsync(DeveloperProfile profile)
            => await _collection.InsertOneAsync(profile);

        public async Task<bool> UpdateAsync(DeveloperProfile profile)
        {
            var result = await _collection.ReplaceOneAsync(x => x.Id == profile.Id, profile);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _collection.DeleteOneAsync(x => x.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        public async Task<List<DeveloperProfile>> SearchAsync(
            List<string>? types = null,
            string? city = null,
            bool? isRemote = null,
            List<string>? techStack = null,
            string? experience = null,
            bool? isAvailable = null)
        {
            var filter = Builders<DeveloperProfile>.Filter.Empty;

            if (types?.Count > 0)
                filter &= Builders<DeveloperProfile>.Filter.AnyIn(x => x.Types, types);

            if (!string.IsNullOrEmpty(city))
                filter &= Builders<DeveloperProfile>.Filter.Eq(x => x.City, city);

            if (isRemote.HasValue)
                filter &= Builders<DeveloperProfile>.Filter.Eq(x => x.IsRemote, isRemote.Value);

            if (techStack?.Count > 0)
                filter &= Builders<DeveloperProfile>.Filter.All(x => x.TechStack, techStack);

            if (!string.IsNullOrEmpty(experience))
                filter &= Builders<DeveloperProfile>.Filter.Eq(x => x.Experience, experience);

            if (isAvailable.HasValue)
                filter &= Builders<DeveloperProfile>.Filter.Eq(x => x.IsAvailable, isAvailable.Value);

            return await _collection.Find(filter).ToListAsync();
        }
    }
}