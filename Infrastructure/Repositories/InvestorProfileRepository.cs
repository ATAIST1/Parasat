using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories
{
    public class InvestorProfileRepository : IInvestorProfileRepository
    {
        private readonly IMongoCollection<InvestorProfile> _collection;

        public InvestorProfileRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<InvestorProfile>("investor_profiles");
        }

        public async Task<List<InvestorProfile>> GetAllAsync()
            => await _collection.Find(_ => true).ToListAsync();

        public async Task<InvestorProfile?> GetByIdAsync(string id)
            => await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<InvestorProfile?> GetByUserIdAsync(string userId)
            => await _collection.Find(x => x.UserId == userId).FirstOrDefaultAsync();

        public async Task AddAsync(InvestorProfile profile)
            => await _collection.InsertOneAsync(profile);

        public async Task<bool> UpdateAsync(InvestorProfile profile)
        {
            var result = await _collection.ReplaceOneAsync(x => x.Id == profile.Id, profile);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _collection.DeleteOneAsync(x => x.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
    }
}
