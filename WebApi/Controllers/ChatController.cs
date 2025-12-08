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

    [HttpGet("partners")]
    public async Task<ActionResult<List<UserDto>>> GetPartners()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var partners = await _chatService.GetChatPartnersAsync(userId);
        return Ok(partners);
    }

    [HttpGet("{partnerId}")]
    public async Task<ActionResult<List<MessageDto>>> GetChat(string partnerId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var messages = await _chatService.GetChatAsync(userId, partnerId);
        return Ok(messages);
    }

    [HttpPost("{partnerId}")]
    public async Task<IActionResult> SendMessage(string partnerId, [FromBody] SendMessageDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

        // 💡 вся логика создания/сейва в ChatService
        var message = await _chatService.SendMessageAsync(userId, partnerId, dto.Text);

        // маппим под каждого юзера, чтобы IsMine был корректный
        var senderDto   = message.ToDto(userId);
        var receiverDto = message.ToDto(partnerId);

        // рассылаем всем коннектам обоих пользователей
        await _hub.Clients.Group(userId).SendAsync("ReceiveMessage", senderDto);
        await _hub.Clients.Group(partnerId).SendAsync("ReceiveMessage", receiverDto);

        // можно вернуть senderDto, если фронту нужно сразу
        return Ok(senderDto);
    }
}