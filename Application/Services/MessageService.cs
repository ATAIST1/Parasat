using Application.Mappers;
using Core.Dtos;
using Core.Dtos.Conversations;
using Core.Interfaces;
using Core.Models;
using System.Security.Claims;

namespace Application.Services;

public class MessageService
{
    private readonly IChatRepository _chatRepo;
    private readonly IUserRepository _userRepo;
    private readonly IStartupRepository _startupRepo;
    private readonly IInvestmentRequestRepository _investmentRequestRepo;
    private readonly IInvestorProfileRepository _investorProfileRepo;
    private readonly IDeveloperProfileRepository _developerProfileRepo;
    private readonly IConversationRepository _conversationRepo;
    private readonly IConversationContextOwnerResolver _ownerResolver;
    private readonly IDealRepository _dealRepo;

    public MessageService(IChatRepository chatRepo, 
    IUserRepository userRepo, 
    IStartupRepository startupRepo, 
    IConversationRepository conversationRepo, 
    IConversationContextOwnerResolver ownerResolver, 
    IDealRepository dealRepo,
    IInvestmentRequestRepository investmentRequestRepo,
    IInvestorProfileRepository investorProfileRepo,
    IDeveloperProfileRepository developerProfileRepo)
    {
        _chatRepo = chatRepo;
        _userRepo = userRepo;
        _startupRepo = startupRepo;
        _conversationRepo = conversationRepo;
        _ownerResolver = ownerResolver;
        _dealRepo = dealRepo;
        _investmentRequestRepo = investmentRequestRepo;
        _investorProfileRepo = investorProfileRepo;
        _developerProfileRepo = developerProfileRepo;
    }

    public async Task<List<MessageDto>> GetChatAsync(string currentUserId, string partnerId)
    {
        var messages = await _chatRepo.GetChatAsync(currentUserId, partnerId);

        var ids = messages.SelectMany(m => new[] { m.FromId, m.ToId }).Distinct().ToList();
        var users = await _userRepo.GetByIdsAsync(ids);

        var names = users.ToDictionary(u => u.Id, u => u.Name);
        return messages.ToDtoList(currentUserId, names);
    }



    public async Task<List<UserDto>> GetChatPartnersAsync(string userId)
    {
        var partnerIds = await _chatRepo.GetChatPartnersAsync(userId);
        var partners = new List<UserDto>();

        foreach (var id in partnerIds)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user != null)
                partners.Add(UserMapper.ToDto(user));
        }

        return partners;
    }
    
    public async Task<MessageDto> SendMessageAsync(string conversationId, string fromId, string text)
    {
        var conv = await _conversationRepo.GetByIdAsync(conversationId)
            ?? throw new Exception("Conversation not found");

        if (!conv.ParticipantIds.Contains(fromId))
            throw new UnauthorizedAccessException("Not a participant");

        var toId = conv.ParticipantIds.First(x => x != fromId);

        var message = new Message
        {
            ConversationId = conversationId,   // ✅ ключевой момент
            FromId = fromId,
            ToId = toId,
            Text = text,
            SentAt = DateTime.UtcNow
        };

        await _chatRepo.SendMessageAsync(message);

        // Update conversation's UpdatedAtUtc
        conv.UpdatedAtUtc = DateTime.UtcNow;
        await _conversationRepo.UpdateAsync(conv);

        var users = await _userRepo.GetByIdsAsync(new List<string> { fromId, toId });
        var names = users.ToDictionary(u => u.Id, u => u.Name);

        return message.ToDto(fromId, names);
    }

    public async Task<List<MessageDto>> GetConversationMessagesAsync(string userId, string conversationId)
    {
        var conv = await _conversationRepo.GetByIdAsync(conversationId) ?? throw new Exception("Conversation not found");
        if (!conv.ParticipantIds.Contains(userId)) throw new UnauthorizedAccessException("Not a participant");

        // Mark messages as read when viewing
        await _chatRepo.MarkAsReadAsync(conversationId, userId);

        var messages = await _chatRepo.GetByConversationAsync(conversationId);
        var ids = messages.SelectMany(m => new[] { m.FromId, m.ToId }).Distinct().ToList();
        var users = await _userRepo.GetByIdsAsync(ids);
        var names = users.ToDictionary(u => u.Id, u => u.Name);

        return messages.ToDtoList(userId, names);

    }
    public async Task<List<string>> GetConversationParticipantIdsAsync(string userId, string conversationId)
    {
        var conv = await _conversationRepo.GetByIdAsync(conversationId)
            ?? throw new Exception("Conversation not found");

        if (!conv.ParticipantIds.Contains(userId))
            throw new UnauthorizedAccessException("Not a participant");

        return conv.ParticipantIds;
    }

    /// <summary>Get a conversation (for accessing participant IDs).</summary>
    public async Task<Conversation> GetConversationAsync(string conversationId, string userId)
    {
        var conv = await _conversationRepo.GetByIdAsync(conversationId)
            ?? throw new Exception("Conversation not found");

        if (!conv.ParticipantIds.Contains(userId))
            throw new UnauthorizedAccessException("Not a participant");

        return conv;
    }

    public async Task<List<ConversationListItemDto>> GetMyConversationsAsync(string userId)
    {
        var list = await _conversationRepo.GetByUserAsync(userId);

        // 1) второй участник
        var otherIds = list
            .Select(c => c.ParticipantIds.First(x => x != userId))
            .Distinct()
            .ToList();

        var users = await _userRepo.GetByIdsAsync(otherIds);
        var userNameById = users.ToDictionary(u => u.Id, u => u.Name);

        // 2) ids по контекстам
        var startupIds = list.Where(c => c.ContextType == ConversationContextType.Startup)
            .Select(c => c.ContextId).Distinct().ToList();

        var businessIds = list.Where(c => c.ContextType == ConversationContextType.Business)
            .Select(c => c.ContextId).Distinct().ToList();

        var investorIds = list.Where(c => c.ContextType == ConversationContextType.Investor)
            .Select(c => c.ContextId).Distinct().ToList();

        var developerIds = list.Where(c => c.ContextType == ConversationContextType.Developer)
            .Select(c => c.ContextId).Distinct().ToList();

        // 3) batch загрузка
        var startups = startupIds.Count > 0 ? await _startupRepo.GetByIdsAsync(startupIds) : new List<Startup>();
        var requests = businessIds.Count > 0 ? await _investmentRequestRepo.GetByIdsAsync(businessIds) : new List<InvestmentRequest>();
        var investors = investorIds.Count > 0 ? await _investorProfileRepo.GetByIdsAsync(investorIds) : new List<InvestorProfile>();
        var developers = developerIds.Count > 0 ? await _developerProfileRepo.GetByIdsAsync(developerIds) : new List<DeveloperProfile>();

        var startupTitleById = startups.ToDictionary(s => s.Id, s => s.ProjectName);
        var requestTitleById = requests.ToDictionary(r => r.Id!, r => r.Title);
        var investorTitleById = investors.ToDictionary(p => p.Id!, p => p.FullName);
        var developerTitleById = developers.ToDictionary(p => p.Id!, p => p.FullName);

        var result = new List<ConversationListItemDto>();

        foreach (var c in list)
        {
            var unreadCount = await _chatRepo.GetUnreadCountAsync(c.Id, userId);

            var otherId = c.ParticipantIds.First(x => x != userId);
            if (!userNameById.TryGetValue(otherId, out var otherName))
                throw new Exception($"User not found for id={otherId}");

            string title;
            string subtitle;

            switch (c.ContextType)
            {
                case ConversationContextType.Startup:
                    if (!startupTitleById.TryGetValue(c.ContextId, out title!))
                        throw new Exception($"Startup not found for id={c.ContextId}");
                    subtitle = otherName;
                    break;

                case ConversationContextType.Business:
                    if (!requestTitleById.TryGetValue(c.ContextId, out title!))
                        throw new Exception($"InvestmentRequest not found for id={c.ContextId}");
                    subtitle = otherName;
                    break;

                case ConversationContextType.Investor:
                    if (!investorTitleById.TryGetValue(c.ContextId, out title!))
                        throw new Exception($"InvestorProfile not found for id={c.ContextId}");
                    subtitle = otherName;
                    break;

                case ConversationContextType.Developer:
                    if (!developerTitleById.TryGetValue(c.ContextId, out title!))
                        throw new Exception($"DeveloperProfile not found for id={c.ContextId}");
                    subtitle = otherName;
                    break;

                default:
                    throw new Exception($"Unknown ConversationContextType={(int)c.ContextType}");
            }

            result.Add(new ConversationListItemDto
            {
                ConversationId = c.Id,
                ItemType = (int)c.ContextType,
                ItemId = c.ContextId,
                OwnerId = c.OwnerId,
                CreatedAtUtc = c.CreatedAtUtc,
                UpdatedAtUtc = c.UpdatedAtUtc,
                UnreadCount = unreadCount,

                Title = title,
                Subtitle = subtitle,
                AvatarText = GetInitialsStrict(title)
            });
        }

        return result;
    }

    private static string GetInitialsStrict(string s)
    {
        var t = s?.Trim();
        if (string.IsNullOrWhiteSpace(t))
            throw new Exception("Title is empty, cannot build avatar initials");

        var parts = t.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 1) return parts[0].Substring(0, 1).ToUpperInvariant();
        return $"{char.ToUpperInvariant(parts[0][0])}{char.ToUpperInvariant(parts[1][0])}";
    }


     public async Task<Conversation> GetOrCreateAsync(
        string currentUserId,
        ConversationContextType type,
        string itemId)
    {
        var ownerId = await _ownerResolver.GetOwnerIdAsync(type, itemId);

        if (ownerId == currentUserId)
            throw new Exception("Cannot chat with yourself");

        var existing = await _conversationRepo.GetByContextAndUsersAsync(
            type, itemId, ownerId, currentUserId);

        if (existing != null) return existing;

        var conv = new Conversation
        {
            ContextType = type,
            ContextId = itemId,
            OwnerId = ownerId,
            InitiatorId = currentUserId,
            ParticipantIds = new List<string> { ownerId, currentUserId }
        };

        await _conversationRepo.CreateAsync(conv);
        var deal = new Deal
        {
            ConversationId = conv.Id,
            OwnerId = ownerId,
            InitiatorId = currentUserId,
            OwnerAccepted = false,
            InitiatorAccepted = false,
            Status = DealStatus.Pending,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _dealRepo.CreateAsync(deal);
        return conv;
    }



}