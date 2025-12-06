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

        public async Task<List<InvestmentRequest>> GetAllAsync(
            string? search = null,
            string? industry = null,
            string? profitRange = null,
            string? equityRange = null)
        {
            var filter = Builders<InvestmentRequest>.Filter.Empty;

            // Поиск по тексту (title, description, city)
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchFilter = Builders<InvestmentRequest>.Filter.Or(
                    Builders<InvestmentRequest>.Filter.Regex(
                        x => x.Title,
                        new MongoDB.Bson.BsonRegularExpression(search, "i")
                    ),
                    Builders<InvestmentRequest>.Filter.Regex(
                        x => x.Description,
                        new MongoDB.Bson.BsonRegularExpression(search, "i")
                    ),
                    Builders<InvestmentRequest>.Filter.Regex(
                        x => x.City,
                        new MongoDB.Bson.BsonRegularExpression(search, "i")
                    )
                );

                filter &= searchFilter;
            }

            // Фильтр по индустрии
            if (!string.IsNullOrWhiteSpace(industry))
            {
                filter &= Builders<InvestmentRequest>.Filter.Eq(x => x.Industry, industry);
            }

            // Фильтр по прибыли
            if (!string.IsNullOrWhiteSpace(profitRange))
            {
                switch (profitRange.ToLower())
                {
                    case "small":
                        // < 100M
                        filter &= Builders<InvestmentRequest>.Filter.Lt(x => x.ProfitLastYear, 100_000_000);
                        break;

                    case "medium":
                        // 100M - 300M
                        filter &= Builders<InvestmentRequest>.Filter.And(
                            Builders<InvestmentRequest>.Filter.Gte(x => x.ProfitLastYear, 100_000_000),
                            Builders<InvestmentRequest>.Filter.Lt(x => x.ProfitLastYear, 300_000_000)
                        );
                        break;

                    case "large":
                        // >= 300M
                        filter &= Builders<InvestmentRequest>.Filter.Gte(x => x.ProfitLastYear, 300_000_000);
                        break;
                }
            }

            // Фильтр по доле
            if (!string.IsNullOrWhiteSpace(equityRange))
            {
                switch (equityRange.ToLower())
                {
                    case "low":
                        // < 15%
                        filter &= Builders<InvestmentRequest>.Filter.Lt(x => x.EquityOfferedPercent, 15);
                        break;

                    case "medium":
                        // 15% - 30%
                        filter &= Builders<InvestmentRequest>.Filter.And(
                            Builders<InvestmentRequest>.Filter.Gte(x => x.EquityOfferedPercent, 15),
                            Builders<InvestmentRequest>.Filter.Lt(x => x.EquityOfferedPercent, 30)
                        );
                        break;

                    case "high":
                        // >= 30%
                        filter &= Builders<InvestmentRequest>.Filter.Gte(x => x.EquityOfferedPercent, 30);
                        break;
                }
            }

            return await _collection
                .Find(filter)
                .ToListAsync();
        }

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
