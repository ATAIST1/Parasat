using Core.Models;

namespace Core.Interfaces
{
    public interface IStartupRepository
    {
        Task<IEnumerable<Startup>> GetAllAsync();
        Task<Startup?> GetByIdAsync(string id);
        Task AddAsync(Startup startup);
        Task<bool> UpdateAsync(Startup startup);
        Task<bool> DeleteAsync(string id);
    }
}
