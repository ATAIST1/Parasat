using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class ConversationContextOwnerResolver : IConversationContextOwnerResolver
{
    private readonly IStartupRepository _startupRepo;
    private readonly IDeveloperProfileRepository _devRepo;
    private readonly IInvestmentRequestRepository _businessRepo;
    private readonly IInvestorProfileRepository _investorRepo;

    public ConversationContextOwnerResolver(
        IStartupRepository startupRepo,
        IDeveloperProfileRepository devRepo,
        IInvestmentRequestRepository businessRepo,
        IInvestorProfileRepository investorRepo
        )
    {
        _startupRepo = startupRepo;
        _devRepo = devRepo;
        _businessRepo = businessRepo;
        _investorRepo = investorRepo;
    }

    public async Task<string> GetOwnerIdAsync(ConversationContextType type, string itemId)
    {
        return type switch
        {
            ConversationContextType.Startup =>
                (await _startupRepo.GetByIdAsync(itemId))?.OwnerId
                ?? throw new Exception("Startup not found"),

            ConversationContextType.Developer =>
                (await _devRepo.GetByIdAsync(itemId))?.UserId
                ?? throw new Exception("Developer not found"),

            ConversationContextType.Business =>
                (await _businessRepo.GetByIdAsync(itemId))?.UserId
                ?? throw new Exception("Business not found"),

            ConversationContextType.Investor =>
                (await _investorRepo.GetByIdAsync(itemId))?.UserId
                ?? throw new Exception("Investor not found"),

            _ => throw new Exception("Unsupported context type")
        };
    }
}
