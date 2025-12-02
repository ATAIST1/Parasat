using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces;

public interface IInvestorFeedRepository
{
    Task<List<InvestorFeed>> GetAllAsync();
    Task<InvestorFeed?> GetByIdAsync(string id);
    Task CreateAsync(InvestorFeed investor);
    Task UpdateAsync(InvestorFeed investor);
    Task DeleteAsync(string id);
}


