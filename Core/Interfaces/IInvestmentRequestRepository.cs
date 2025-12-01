using Core.Models;

namespace Core.Interfaces
{
    public interface IInvestmentRequestRepository
    {
        Task<List<InvestmentRequest>> GetAllAsync();
        Task<InvestmentRequest?> GetByIdAsync(string id);
        Task<InvestmentRequest?> GetByStartupIdAsync(string startupId);
        Task AddAsync(InvestmentRequest request);
        Task<bool> UpdateAsync(InvestmentRequest request);
        Task<bool> DeleteAsync(string id);
    }
}