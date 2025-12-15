using Core.Interfaces;
using Core.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class InvestmentRequestRepository : IInvestmentRequestRepository
{
    private readonly IMongoCollection<InvestmentRequest> _collection;

    public InvestmentRequestRepository(IMongoDatabase database)
    {
        _collection = database.GetCollection<InvestmentRequest>("investment_requests");
    }

    public async Task<List<InvestmentRequest>> GetAllAsync(
        string? search = null,
        string? industry = null,
        string? profitRange = null,
        string? equityRange = null,
        InvestmentRequestStatus? status = null)
    {
        var filter = Builders<InvestmentRequest>.Filter.Empty;

        if (!string.IsNullOrWhiteSpace(search))
        {
            filter &= Builders<InvestmentRequest>.Filter.Or(
                Builders<InvestmentRequest>.Filter.Regex(x => x.Title, new BsonRegularExpression(search, "i")),
                Builders<InvestmentRequest>.Filter.Regex(x => x.Description, new BsonRegularExpression(search, "i")),
                Builders<InvestmentRequest>.Filter.Regex(x => x.City, new BsonRegularExpression(search, "i"))
            );
        }

        if (!string.IsNullOrWhiteSpace(industry))
            filter &= Builders<InvestmentRequest>.Filter.Eq(x => x.Industry, industry);

        if (!string.IsNullOrWhiteSpace(profitRange))
        {
            switch (profitRange.ToLower())
            {
                case "small":
                    filter &= Builders<InvestmentRequest>.Filter.Lt(x => x.ProfitLastYear, 100_000_000);
                    break;
                case "medium":
                    filter &= Builders<InvestmentRequest>.Filter.And(
                        Builders<InvestmentRequest>.Filter.Gte(x => x.ProfitLastYear, 100_000_000),
                        Builders<InvestmentRequest>.Filter.Lt(x => x.ProfitLastYear, 300_000_000)
                    );
                    break;
                case "large":
                    filter &= Builders<InvestmentRequest>.Filter.Gte(x => x.ProfitLastYear, 300_000_000);
                    break;
            }
        }

        if (!string.IsNullOrWhiteSpace(equityRange))
        {
            switch (equityRange.ToLower())
            {
                case "low":
                    filter &= Builders<InvestmentRequest>.Filter.Lt(x => x.EquityOfferedPercent, 15);
                    break;
                case "medium":
                    filter &= Builders<InvestmentRequest>.Filter.And(
                        Builders<InvestmentRequest>.Filter.Gte(x => x.EquityOfferedPercent, 15),
                        Builders<InvestmentRequest>.Filter.Lt(x => x.EquityOfferedPercent, 30)
                    );
                    break;
                case "high":
                    filter &= Builders<InvestmentRequest>.Filter.Gte(x => x.EquityOfferedPercent, 30);
                    break;
            }
        }

        if (status.HasValue)
            filter &= Builders<InvestmentRequest>.Filter.Eq(x => x.Status, status.Value);

        return await _collection
            .Find(filter)
            .SortByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<InvestmentRequest?> GetByIdAsync(string id)
        => await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();


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
