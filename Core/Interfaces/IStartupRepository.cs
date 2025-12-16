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
        Task<IEnumerable<Startup>> GetByOwnerAsync(string ownerId);

         Task<IEnumerable<Startup>> GetAllAsync(
            string? search = null,
            string? industry = null,
            string? evidence = null,
            string? city = null);
    }

}
