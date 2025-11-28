using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces;

public interface IDeveloperRepository
{
    Task<List<Developer>> GetAllAsync();
    Task<Developer?> GetByIdAsync(string id);
    Task CreateAsync(Developer developer);
    Task UpdateAsync(Developer developer);
    Task DeleteAsync(string id);
}

