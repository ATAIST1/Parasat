using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories
{
    public class InvestmentRequestRepository : IInvestmentRequestRepository
    {
        private readonly IMongoCollection<InvestmentRequest> _collection;

        public InvestmentRequestRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<InvestmentRequest>("investment_requests");
        }

        public async Task<List<InvestmentRequest>> GetAllAsync()
            => await _collection.Find(_ => true).ToListAsync();

        public async Task<InvestmentRequest?> GetByIdAsync(string id)
            => await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<InvestmentRequest?> GetByStartupIdAsync(string startupId)
            => await _collection.Find(x => x.StartupId == startupId).FirstOrDefaultAsync();

        public async Task AddAsync(InvestmentRequest request)
            => await _collection.InsertOneAsync(request);

        public async Task<bool> UpdateAsync(InvestmentRequest request)
        {
            var result = await _collection.ReplaceOneAsync(x => x.Id == request.Id, request);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _collection.DeleteOneAsync(x => x.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
    }
}