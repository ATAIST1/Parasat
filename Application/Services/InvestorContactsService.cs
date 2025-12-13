using Core.Dtos.Investor;
using Core.Interfaces;

namespace Application.Services;

public class InvestorContactsService
{
    private readonly IInvestorProfileRepository _investorRepo;
    private readonly IUserRepository _userRepo;
    private readonly SubscriptionService _subscriptionService;

    public InvestorContactsService(
        IInvestorProfileRepository investorRepo,
        IUserRepository userRepo,
        SubscriptionService subscriptionService)
    {
        _investorRepo = investorRepo;
        _userRepo = userRepo;
        _subscriptionService = subscriptionService;
    }

    public async Task<InvestorContactsDto> GetContactsAsync(string investorProfileId, string requesterUserId)
    {
        var investorProfile = await _investorRepo.GetByIdAsync(investorProfileId)
            ?? throw new KeyNotFoundException("Investor profile not found");

        // инвестор сам видит свои контакты без подписки
        if (investorProfile.UserId != requesterUserId)
        {
            var hasSub = await _subscriptionService.HasActiveInvestorContactsSubscriptionAsync(requesterUserId);
            if (!hasSub) throw new UnauthorizedAccessException("Subscription required");
        }

        var investorUser = await _userRepo.GetByIdAsync(investorProfile.UserId)
            ?? throw new KeyNotFoundException("Investor user not found");

        return new InvestorContactsDto
        {
            Email = investorUser.Email
        };
    }
}
