using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class InvestorFeedRepository : IInvestorFeedRepository
{
    private readonly IMongoCollection<InvestorFeed> _investors;

    public InvestorFeedRepository(IMongoDatabase database)
    {
        _investors = database.GetCollection<InvestorFeed>("investors_feed");
    }

    public async Task<List<InvestorFeed>> GetAllAsync()
        => await _investors.Find(_ => true).ToListAsync();

    public async Task<InvestorFeed?> GetByIdAsync(string id)
        => await _investors.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(InvestorFeed investor)
        => await _investors.InsertOneAsync(investor);

    public async Task UpdateAsync(InvestorFeed investor)
        => await _investors.ReplaceOneAsync(x => x.Id == investor.Id, investor);

    public async Task DeleteAsync(string id)
        => await _investors.DeleteOneAsync(x => x.Id == id);
}


