using Application.Mappers;
using Core.Dtos;
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

    public MessageService(IChatRepository chatRepo, IUserRepository userRepo, IStartupRepository startupRepo, IConversationRepository conversationRepo)
    {
        _chatRepo = chatRepo;
        _userRepo = userRepo;
        _startupRepo = startupRepo;
        _conversationRepo = conversationRepo;
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
    public async Task<Conversation> GetOrCreateForStartupAsync(string currentUserId, string startupId)
    {
        var startup = await _startupRepo.GetByIdAsync(startupId)
            ?? throw new Exception("Startup not found");

        var ownerId = startup.OwnerId;

        // запрет писать самому себе
        if (ownerId == currentUserId)
            throw new Exception("Cannot chat with yourself");

        // ищем существующий диалог именно по этому стартапу + этим двум людям
        var existing = await _conversationRepo.GetByStartupAndUsersAsync(startupId, ownerId, currentUserId);
        if (existing != null) return existing;

        var c = new Conversation
        {
            StartupId = startupId,
            OwnerId = ownerId,
            InitiatorId = currentUserId,
            ParticipantIds = new List<string> { ownerId, currentUserId }
        };

        await _conversationRepo.CreateAsync(c);
        return c;
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

        var users = await _userRepo.GetByIdsAsync(new List<string> { fromId, toId });
        var names = users.ToDictionary(u => u.Id, u => u.Name);

        return message.ToDto(fromId, names);
    }

    public async Task<List<MessageDto>> GetConversationMessagesAsync(string userId, string conversationId)
    {
        var conv = await _conversationRepo.GetByIdAsync(conversationId) ?? throw new Exception("Conversation not found");
        if (!conv.ParticipantIds.Contains(userId)) throw new UnauthorizedAccessException("Not a participant");

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
        var convs = await _conversationRepo.GetByParticipantAsync(userId);

        // партнёры
        var partnerIds = convs
            .Select(c => c.ParticipantIds.First(x => x != userId))
            .Distinct()
            .ToList();

        var users = await _userRepo.GetByIdsAsync(partnerIds);
        var names = users.ToDictionary(u => u.Id, u => u.Name);

        // последние сообщения (если у тебя сообщения по conversationId)
        // если нет — просто верни без lastText/lastSentAt
        var result = new List<ConversationListItemDto>();

        foreach (var c in convs)
        {
            var partnerId = c.ParticipantIds.First(x => x != userId);

            var last = await _chatRepo.GetLastByConversationAsync(c.Id); // сделай метод в репо

            result.Add(new ConversationListItemDto
            {
                Id = c.Id,
                StartupId = c.StartupId,
                PartnerId = partnerId,
                PartnerName = names.TryGetValue(partnerId, out var n) ? n : "Unknown",
                LastText = last?.Text,
                LastSentAt = last?.SentAt
            });
        }

        return result;
    }



}