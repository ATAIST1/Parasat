using Core.Models;

namespace Core.Interfaces
{
    public interface IClubMembershipRepository
    {
        Task<List<ClubMembershipApplication>> GetAllAsync();
        Task<ClubMembershipApplication?> GetByIdAsync(string id);
        Task<ClubMembershipApplication?> GetLatestByUserIdAsync(string userId);
        Task<ClubMembershipApplication?> GetActiveOrPendingByUserIdAsync(string userId);
        Task<ClubMembershipApplication?> GetActiveOrPendingByContactAsync(string email, string phone);

        Task AddAsync(ClubMembershipApplication application);
        Task<bool> UpdateAsync(ClubMembershipApplication application);
    }
}
