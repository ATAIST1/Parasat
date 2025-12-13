using Core.Dtos;
using Core.Interfaces;
using Core.Models;
using Application.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApi.Hubs;
using Microsoft.AspNetCore.SignalR;
using Application.Services;

namespace WebApi.Controllers;

[Authorize]
[Route("api/chat")]
[ApiController]
public class ChatController : ControllerBase
{
    private readonly MessageService _chatService;
    private readonly IHubContext<ChatHub> _hub;

    public ChatController(MessageService chatService, IHubContext<ChatHub> hub)
    {
        _chatService = chatService;
        _hub = hub;
    }
    private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

    [HttpPost("startup/{startupId}")]
    public async Task<IActionResult> OpenFromStartup(string startupId)
    {
        var conv = await _chatService.GetOrCreateForStartupAsync(UserId, startupId);
        return Ok(new { conversationId = conv.Id });
    }

    [HttpGet("{conversationId}")]
    public async Task<IActionResult> GetChat(string conversationId)
    {
        var messages = await _chatService.GetConversationMessagesAsync(UserId, conversationId);
        return Ok(messages);
    }

    [HttpPost("{partnerId}")]
    public async Task<IActionResult> SendMessage(string partnerId, [FromBody] SendMessageDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

        // сервис уже возвращает MessageDto с именами
        var senderDto = await _chatService.SendMessageAsync(userId, partnerId, dto.Text);

        // для получателя то же сообщение, но IsMine = false
        var receiverDto = new MessageDto
        {
            Id = senderDto.Id,
            Text = senderDto.Text,
            SentAt = senderDto.SentAt,
            IsMine = false,
            IsRead = senderDto.IsRead,
            From = senderDto.From,
            To = senderDto.To
        };

        await _hub.Clients.Group(userId).SendAsync("ReceiveMessage", senderDto);
        await _hub.Clients.Group(partnerId).SendAsync("ReceiveMessage", receiverDto);

        return Ok(senderDto);
    }

}