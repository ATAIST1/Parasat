using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces;

public interface IInvestorRepository
{
    Task<List<Investor>> GetAllAsync();
    Task<Investor?> GetByIdAsync(string id);
    Task CreateAsync(Investor investor);
    Task UpdateAsync(Investor investor);
    Task DeleteAsync(string id);
}

