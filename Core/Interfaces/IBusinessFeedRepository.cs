using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces;

public interface IBusinessFeedRepository
{
    Task<List<BusinessFeed>> GetAllAsync();
    Task<BusinessFeed?> GetByIdAsync(string id);
    Task CreateAsync(BusinessFeed business);
    Task UpdateAsync(BusinessFeed business);
    Task DeleteAsync(string id);
}


