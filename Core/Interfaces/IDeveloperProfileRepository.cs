using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IDeveloperProfileRepository
    {
        Task<List<DeveloperProfile>> GetAllAsync();
        Task<DeveloperProfile?> GetByIdAsync(string id);
        Task<DeveloperProfile?> GetByUserIdAsync(string userId);
        Task AddAsync(DeveloperProfile profile);
        Task<bool> UpdateAsync(DeveloperProfile profile);
        Task<bool> DeleteAsync(string id);

        Task<List<DeveloperProfile>> SearchAsync(
            List<DevType>? types = null,
            string? city = null,
            bool? isRemote = null,
            List<string>? techStack = null,
            ExperienceLevel? experience = null,
            bool? isAvailable = null);
    }
}