using Core.Models;

namespace Core.Interfaces
{
    public interface IInvestorProfileRepository
    {
        Task<List<InvestorProfile>> GetAllAsync();
        Task<InvestorProfile?> GetByIdAsync(string id);
        Task<InvestorProfile?> GetByUserIdAsync(string userId);
        Task AddAsync(InvestorProfile profile);
        Task<bool> UpdateAsync(InvestorProfile profile);
        Task<bool> DeleteAsync(string id);
    }
}
