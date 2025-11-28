using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces;

public interface IStartupRepository
{
    Task<List<Startup>> GetAllAsync();
    Task<Startup?> GetByIdAsync(string id);
    Task CreateAsync(Startup startup);
    Task UpdateAsync(Startup startup);
    Task DeleteAsync(string id);
}

