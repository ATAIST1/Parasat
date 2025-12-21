using Core.Dtos.Admin;
using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class AdminService
{
    private readonly IUserRepository _userRepo;
    private readonly IConversationRepository _conversationRepo;

    private readonly IStartupRepository _startupRepo;
    private readonly IDeveloperProfileRepository _devRepo;
    private readonly IInvestmentRequestRepository _businessRepo;
    private readonly IInvestorProfileRepository _investorRepo;

    public AdminService(
        IUserRepository userRepo,
        IConversationRepository conversationRepo,
        IStartupRepository startupRepo,
        IDeveloperProfileRepository devRepo,
        IInvestmentRequestRepository businessRepo,
        IInvestorProfileRepository investorRepo)
    {
        _userRepo = userRepo;
        _conversationRepo = conversationRepo;
        _startupRepo = startupRepo;
        _devRepo = devRepo;
        _businessRepo = businessRepo;
        _investorRepo = investorRepo;
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _userRepo.GetAllAsync();
    }

    public async Task ChangeRoleAsync(string userId, string role)
    {
        var user = await _userRepo.GetByIdAsync(userId)
                   ?? throw new Exception("User not found");

        user.Role = role;
        await _userRepo.UpdateAsync(user);
    }

    public async Task ToggleTwoFactorAsync(string userId, bool enabled)
    {
        var user = await _userRepo.GetByIdAsync(userId)
                   ?? throw new Exception("User not found");

        user.IsTwoFactorEnabled = enabled;
        if (!enabled)
        {
            user.TwoFactorCodeHash = null;
            user.TwoFactorCodeExpiresAt = null;
            user.TwoFactorTempToken = null;
        }

        await _userRepo.UpdateAsync(user);
    }

    public async Task BanUserAsync(string userId)
        {
            var user = await _userRepo.GetByIdAsync(userId) ?? throw new Exception("User not found");
            user.IsBanned = true;
            user.BannedUntil = null;
            await _userRepo.UpdateAsync(user);
        }

    public async Task UnbanUserAsync(string userId)
        {
        var user = await _userRepo.GetByIdAsync(userId)
                   ?? throw new Exception("User not found");

        user.IsBanned = false;
        user.BannedUntil = null;
        await _userRepo.UpdateAsync(user);
        }

    public async Task<List<AdminConversationDto>> GetAllConversationsAsync()
        {
            var conversations = await _conversationRepo.GetAllAsync();

            // собираем все userIds (Owner/Initiator + participants на всякий)
            var userIds = conversations
                .SelectMany(c => new[] { c.OwnerId, c.InitiatorId }.Concat(c.ParticipantIds))
                .Distinct()
                .ToList();

            var users = await _userRepo.GetByIdsAsync(userIds);
            var userMap = users.ToDictionary(x => x.Id, x => x);

            var result = new List<AdminConversationDto>();

            foreach (var c in conversations)
            {
                var title = await ResolveContextTitle(c.ContextType, c.ContextId);

                userMap.TryGetValue(c.OwnerId, out var owner);
                userMap.TryGetValue(c.InitiatorId, out var initiator);

                result.Add(new AdminConversationDto
                {
                    ConversationId = c.Id,
                    ContextType = (int)c.ContextType,
                    ContextId = c.ContextId,
                    ContextTitle = title,

                    Owner = new UserShort
                    {
                        Id = c.OwnerId,
                        Email = owner?.Email ?? "—",
                        Name = string.IsNullOrWhiteSpace(owner?.Name) ? "—" : owner!.Name
                    },
                    Initiator = new UserShort
                    {
                        Id = c.InitiatorId,
                        Email = initiator?.Email ?? "—",
                        Name = string.IsNullOrWhiteSpace(initiator?.Name) ? "—" : initiator!.Name
                    },

                    CreatedAtUtc = c.CreatedAtUtc,
                    UpdatedAtUtc = c.UpdatedAtUtc
                });
            }

            return result;
        }

      private async Task<string> ResolveContextTitle(ConversationContextType type, string contextId)
      {
          switch (type)
          {
              case ConversationContextType.Startup:
              {
                  var s = await _startupRepo.GetByIdAsync(contextId);
                  if (s == null) return $"Startup #{contextId}";
                  return !string.IsNullOrWhiteSpace(s.ProjectName) ? s.ProjectName : s.Title;
              }

              case ConversationContextType.Business:
              {
                  var b = await _businessRepo.GetByIdAsync(contextId);
                  return b?.Title ?? $"Business #{contextId}";
              }

              case ConversationContextType.Investor:
              {
                  var i = await _investorRepo.GetByIdAsync(contextId);
                  return i?.FullName ?? $"Investor #{contextId}";
              }

              case ConversationContextType.Developer:
              {
                  var d = await _devRepo.GetByIdAsync(contextId);
                  return d?.FullName ?? $"Developer #{contextId}";
              }

              default:
                  return $"#{contextId}";
          }
      }
}
