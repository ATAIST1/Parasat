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

    [HttpGet("conversations")]
    public async Task<IActionResult> GetMyConversations()
    {
        var list = await _chatService.GetMyConversationsAsync(UserId);
        return Ok(list);
    }

    // открыть/создать чат из стартапа
    [HttpPost("startup/{startupId}")]
    public async Task<IActionResult> OpenFromStartup(string startupId)
    {
        var conv = await _chatService.GetOrCreateForStartupAsync(UserId, startupId);
        return Ok(new { conversationId = conv.Id });
    }

    // получить сообщения по conversationId
    [HttpGet("{conversationId}")]
    public async Task<IActionResult> GetChat(string conversationId)
    {
        var messages = await _chatService.GetConversationMessagesAsync(UserId, conversationId);
        return Ok(messages);
    }

    // ✅ отправка сообщения ТОЛЬКО по conversationId
    [HttpPost("{conversationId}")]
    public async Task<IActionResult> SendMessage(string conversationId, [FromBody] SendMessageDto dto)
    {
        var msg = await _chatService.SendMessageAsync(conversationId, UserId, dto.Text);

        // разослать всем участникам диалога (не partnerId)
        var participantIds = await _chatService.GetConversationParticipantIdsAsync(UserId, conversationId);
        foreach (var pid in participantIds)
            await _hub.Clients.Group(pid).SendAsync("ReceiveMessage", msg);

        return Ok(msg);
    }
}
