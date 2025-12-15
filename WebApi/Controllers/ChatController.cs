using Application.Services;
using Core.Dtos;
using Core.Dtos.Conversations;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApi.Hubs;
using Microsoft.AspNetCore.SignalR;

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

    private string UserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException("User is not authenticated");

    // ✅ список моих диалогов (отсюда берешь conversationId)
    [HttpGet("conversations")]
    public async Task<IActionResult> GetMyConversations()
    {
        var list = await _chatService.GetMyConversationsAsync(UserId);
        return Ok(list);
    }

    // ✅ универсально открыть/создать чат из любой карточки (startup/business/investor/developer)
    [HttpPost("open")]
    public async Task<IActionResult> Open([FromBody] OpenChatDto dto)
    {
        if (!Enum.IsDefined(typeof(ConversationContextType), dto.ItemType))
            return BadRequest("Invalid itemType");

        var conv = await _chatService.GetOrCreateAsync(
            UserId,
            (ConversationContextType)dto.ItemType,
            dto.ItemId
        );

        return Ok(new { conversationId = conv.Id });
    }


    // ✅ получить сообщения по conversationId
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

        // разослать всем участникам диалога
        var participantIds = await _chatService.GetConversationParticipantIdsAsync(UserId, conversationId);
        foreach (var pid in participantIds)
            await _hub.Clients.Group(pid).SendAsync("ReceiveMessage", msg);

        return Ok(msg);
    }
}
