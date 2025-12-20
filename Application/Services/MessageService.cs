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
    private readonly IConversationRepository _conversationRepo;
    private readonly IConversationContextOwnerResolver _ownerResolver;
    private readonly IDealRepository _dealRepo;

    public MessageService(IChatRepository chatRepo, IUserRepository userRepo, IStartupRepository startupRepo, IConversationRepository conversationRepo, IConversationContextOwnerResolver ownerResolver, IDealRepository dealRepo)
    {
        _chatRepo = chatRepo;
        _userRepo = userRepo;
        _startupRepo = startupRepo;
        _conversationRepo = conversationRepo;
        _ownerResolver = ownerResolver;
        _dealRepo = dealRepo;
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
    public async Task<List<ConversationListItemDto>> GetMyConversationsAsync(string userId)
    {
        var list = await _conversationRepo.GetByUserAsync(userId);

        var result = new List<ConversationListItemDto>();
        foreach (var c in list)
        {
            var unreadCount = await _chatRepo.GetUnreadCountAsync(c.Id, userId);
            result.Add(new ConversationListItemDto
            {
                ConversationId = c.Id,
                ItemType = (int)c.ContextType,
                ItemId = c.ContextId,
                OwnerId = c.OwnerId,
                CreatedAtUtc = c.CreatedAtUtc,
                UpdatedAtUtc = c.UpdatedAtUtc,
                UnreadCount = unreadCount
            });
        }

        return result;
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