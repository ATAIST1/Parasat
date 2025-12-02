using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces;

public interface IDeveloperFeedRepository
{
    Task<List<DeveloperFeed>> GetAllAsync();
    Task<DeveloperFeed?> GetByIdAsync(string id);
    Task CreateAsync(DeveloperFeed developer);
    Task UpdateAsync(DeveloperFeed developer);
    Task DeleteAsync(string id);
}


