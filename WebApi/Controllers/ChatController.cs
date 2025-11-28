using Core.Dtos;
using Core.Interfaces;
using Core.Models;
using Application.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.Controllers;

[Authorize]
[Route("api/chat")]
[ApiController]
public class ChatController : ControllerBase
{
    private readonly IChatRepository _chatRepo;
    private readonly IUserRepository _userRepo;

    public ChatController(IChatRepository chatRepo, IUserRepository userRepo)
    {
        _chatRepo = chatRepo;
        _userRepo = userRepo;
    }

    // Получить список людей, с кем был чат
    [HttpGet("partners")]
    public async Task<ActionResult<List<UserDto>>> GetPartners()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var partnerIds = await _chatRepo.GetChatPartnersAsync(userId);
        var partners = new List<UserDto>();

        foreach (var id in partnerIds)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user != null)
                partners.Add(UserMapper.ToDto(user));
        }

        return Ok(partners);
    }

    // Получить историю с конкретным человеком
    [HttpGet("{partnerId}")]
    public async Task<ActionResult<List<MessageDto>>> GetChat(string partnerId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var messages = await _chatRepo.GetChatAsync(userId, partnerId);
        
        // Магией маппим
        var dtos = messages.ToDtoList(userId);
        
        return Ok(dtos);
    }

    // Отправить сообщение
    [HttpPost("{partnerId}")]
    public async Task<IActionResult> SendMessage(string partnerId, [FromBody] SendMessageDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

        var message = new Message
        {
            FromId = userId,
            ToId = partnerId,
            Text = dto.Text
        };

        await _chatRepo.SendMessageAsync(message);
        return Ok();
    }
}