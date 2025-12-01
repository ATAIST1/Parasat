using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces;

public interface IStartupFeedRepository
{
    Task<List<StartupFeed>> GetAllAsync();
    Task<StartupFeed?> GetByIdAsync(string id);
    Task CreateAsync(StartupFeed startup);
    Task UpdateAsync(StartupFeed startup);
    Task DeleteAsync(string id);
}


