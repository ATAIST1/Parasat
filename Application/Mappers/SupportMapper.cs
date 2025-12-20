using Core.Models;
using Core.Dtos.Support;

namespace Application.Mappers
{
    public class SupportMapper
    {
        public static SupportTicketDto MapToDto(SupportTicket ticket, string? userName = null)
        {
            return new SupportTicketDto
            {
                Id = ticket.Id,
                UserId = ticket.UserId,
                Subject = ticket.Subject,
                Category = ticket.Category,
                Priority = ticket.Priority,
                Status = ticket.Status,
                Messages = ticket.Messages.Select(m => MapMessageToDto(m)).ToList(),
                CreatedAt = ticket.CreatedAt,
                UpdatedAt = ticket.UpdatedAt,
                ResolvedAt = ticket.ResolvedAt,
                AssignedToAgentId = ticket.AssignedToAgentId
            };
        }

        public static SupportMessageDto MapMessageToDto(SupportMessage message)
        {
            return new SupportMessageDto
            {
                Id = message.Id,
                UserId = message.UserId,
                UserName = message.UserName,
                Content = message.Content,
                IsSupportAgent = message.IsSupportAgent,
                CreatedAt = message.CreatedAt,
                AttachmentKeys = message.AttachmentKeys
            };
        }

        public static SupportMessage CreateMessageFromDto(SendSupportMessageDto dto, string userId, string userName, bool isAgent = false)
        {
            return new SupportMessage
            {
                Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString(),
                UserId = userId,
                UserName = userName,
                Content = dto.Content,
                IsSupportAgent = isAgent,
                AttachmentKeys = dto.AttachmentKeys ?? new(),
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}
