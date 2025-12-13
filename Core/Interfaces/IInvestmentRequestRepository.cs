using Core.Models;

namespace Core.Interfaces;

public interface IInvestmentRequestRepository
{
    Task<List<InvestmentRequest>> GetAllAsync(
        string? search = null,
        string? industry = null,
        string? profitRange = null,
        string? equityRange = null,
        InvestmentRequestStatus? status = null);

    Task<InvestmentRequest?> GetByIdAsync(string id);
    Task<InvestmentRequest?> GetByStartupIdAsync(string startupId);

    Task AddAsync(InvestmentRequest request);
    Task<bool> UpdateAsync(InvestmentRequest request);
    Task<bool> DeleteAsync(string id);
}
