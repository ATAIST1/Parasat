using Core.Dtos;
using Core.Interfaces;

namespace Application.Services;

public class SubscriptionService
{
    private readonly IUserRepository _userRepo;

    public SubscriptionService(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<SubscriptionStatusDto> GetInvestorContactsSubscriptionStatusAsync(string userId)
    {
        var user = await _userRepo.GetByIdAsync(userId)
                   ?? throw new Exception("User not found");

        var now = DateTime.UtcNow;
        var isActive = user.InvestorContactsSubscriptionExpiresAt != null
                       && user.InvestorContactsSubscriptionExpiresAt > now;

        return new SubscriptionStatusDto(
            IsActive: isActive,
            ExpiresAt: user.InvestorContactsSubscriptionExpiresAt
        );
    }

    public async Task<SubscriptionStatusDto> CreateOrExtendInvestorContactsSubscriptionAsync(
        string userId,
        CreateOrExtendSubscriptionDto dto)
    {
        if (dto.Months <= 0)
            throw new Exception("Months must be > 0");
        if (dto.Months <= 0 || dto.Months > 24)
            throw new Exception("Months must be between 1 and 24");

        var user = await _userRepo.GetByIdAsync(userId)
                   ?? throw new Exception("User not found");

        var now = DateTime.UtcNow;
        var currentExpire = user.InvestorContactsSubscriptionExpiresAt;

        DateTime newExpire;

        if (currentExpire == null || currentExpire < now)
        {
            newExpire = now.AddMonths(dto.Months);
        }
        else
        {
            newExpire = currentExpire.Value.AddMonths(dto.Months);
        }

        user.InvestorContactsSubscriptionExpiresAt = newExpire;
        await _userRepo.UpdateAsync(user);

        return new SubscriptionStatusDto(
            IsActive: true,
            ExpiresAt: newExpire
        );
    }

    public async Task<bool> HasActiveInvestorContactsSubscriptionAsync(string userId)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null) return false;

        return user.InvestorContactsSubscriptionExpiresAt != null
               && user.InvestorContactsSubscriptionExpiresAt > DateTime.UtcNow;
    }
}
