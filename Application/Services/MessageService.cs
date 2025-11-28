using Application.Mappers;
using Core.Dtos;
using Core.Interfaces;
using Core.Models;
using System.Security.Claims;

namespace Application.Services;

public class ChatService
{
    private readonly IChatRepository _chatRepo;
    private readonly IUserRepository _userRepo;

    public ChatService(IChatRepository chatRepo, IUserRepository userRepo)
    {
        _chatRepo = chatRepo;
        _userRepo = userRepo;
    }

    public async Task<List<MessageDto>> GetChatAsync(string currentUserId, string partnerId)
    {
        var messages = await _chatRepo.GetChatAsync(currentUserId, partnerId);
        return messages.ToDtoList(currentUserId);
    }

    public async Task SendMessageAsync(string fromId, string toId, string text)
    {
        var message = new Message
        {
            FromId = fromId,
            ToId = toId,
            Text = text,
            SentAt = DateTime.UtcNow
        };

        await _chatRepo.SendMessageAsync(message);
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
}