using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Core.Dtos;
using Application.Services;

namespace WebApi.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly MessageService _messageService;

    public ChatHub(MessageService messageService)
    {
        _messageService = messageService;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userId))
        {
            // one group per user
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>Send a message to a conversation and broadcast to participants.</summary>
    public async Task SendMessage(string conversationId, string text)
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            throw new HubException("Not authenticated");

        try
        {
            var message = await _messageService.SendMessageAsync(conversationId, userId, text);
            
            // Get conversation to find the other participant
            var conversation = await _messageService.GetConversationAsync(conversationId, userId);
            var otherUserId = conversation.ParticipantIds.FirstOrDefault(p => p != userId);

            // Broadcast to both participants' groups
            await Clients.Group(userId).SendAsync("ReceiveMessage", message);
            if (!string.IsNullOrEmpty(otherUserId))
            {
                await Clients.Group(otherUserId).SendAsync("ReceiveMessage", message);
                // Notify chat list of new message
                await Clients.Group(otherUserId).SendAsync("ConversationUpdated", conversationId);
            }
            await Clients.Group(userId).SendAsync("ConversationUpdated", conversationId);
        }
        catch (Exception ex)
        {
            throw new HubException($"Error sending message: {ex.Message}");
        }
    }
}
