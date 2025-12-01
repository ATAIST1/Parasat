using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class InvestorRepository : IInvestorRepository
{
    private readonly IMongoCollection<Investor> _investors;

    public InvestorRepository(IMongoDatabase database)
    {
        _investors = database.GetCollection<Investor>("investors_feed");
    }

    public async Task<List<Investor>> GetAllAsync()
        => await _investors.Find(_ => true).ToListAsync();

    public async Task<Investor?> GetByIdAsync(string id)
        => await _investors.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Investor investor)
        => await _investors.InsertOneAsync(investor);

    public async Task UpdateAsync(Investor investor)
        => await _investors.ReplaceOneAsync(x => x.Id == investor.Id, investor);

    public async Task DeleteAsync(string id)
        => await _investors.DeleteOneAsync(x => x.Id == id);
}

