using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces;

public interface IBusinessRepository
{
    Task<List<Business>> GetAllAsync();
    Task<Business?> GetByIdAsync(string id);
    Task CreateAsync(Business business);
    Task UpdateAsync(Business business);
    Task DeleteAsync(string id);
}

