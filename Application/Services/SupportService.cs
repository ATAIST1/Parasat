using Core.Interfaces;
using Core.Models;
using Core.Dtos.Support;
using Application.Mappers;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class SupportService
    {
        private readonly ISupportTicketRepository _supportRepo;
        private readonly IUserRepository _userRepo;
        private readonly ILogger<SupportService> _logger;

        public SupportService(
            ISupportTicketRepository supportRepo,
            IUserRepository userRepo,
            ILogger<SupportService> logger)
        {
            _supportRepo = supportRepo;
            _userRepo = userRepo;
            _logger = logger;
        }

        /// <summary>Create a new support ticket.</summary>
        public async Task<SupportTicketDto> CreateTicketAsync(string userId, CreateSupportTicketDto dto)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            var ticket = new SupportTicket
            {
                UserId = userId,
                Subject = dto.Subject,
                Category = dto.Category,
                Priority = dto.Priority,
                Status = "Open",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Add initial message if provided
            if (!string.IsNullOrWhiteSpace(dto.InitialMessage))
            {
                ticket.Messages.Add(new SupportMessage
                {
                    Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString(),
                    UserId = userId,
                    UserName = user.Name ?? "Unknown",
                    Content = dto.InitialMessage,
                    IsSupportAgent = false,
                    CreatedAt = DateTime.UtcNow
                });
            }

            await _supportRepo.CreateTicketAsync(ticket);
            _logger.LogInformation($"Support ticket {ticket.Id} created by user {userId}");

            return SupportMapper.MapToDto(ticket, user.Name);
        }

        /// <summary>Get all tickets for a user.</summary>
        public async Task<List<SupportTicketDto>> GetUserTicketsAsync(string userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            var tickets = await _supportRepo.GetUserTicketsAsync(userId);
            return tickets.Select(t => SupportMapper.MapToDto(t, user.Name)).ToList();
        }

        /// <summary>Get a specific ticket with full message history.</summary>
        public async Task<SupportTicketDto> GetTicketAsync(string ticketId, string userId)
        {
            var ticket = await _supportRepo.GetTicketWithMessagesAsync(ticketId);
            if (ticket == null)
                throw new InvalidOperationException($"Support ticket {ticketId} not found");

            // Verify ownership (unless user is admin - can be checked in controller)
            if (ticket.UserId != userId)
                throw new UnauthorizedAccessException("Access denied");

            var user = await _userRepo.GetByIdAsync(userId);
            return SupportMapper.MapToDto(ticket, user?.Name ?? "Unknown");
        }

        /// <summary>Add a message to a support ticket.</summary>
        public async Task<SupportTicketDto> AddMessageAsync(string ticketId, string userId, SendSupportMessageDto dto)
        {
            var ticket = await _supportRepo.GetTicketWithMessagesAsync(ticketId);
            if (ticket == null)
                throw new InvalidOperationException($"Support ticket {ticketId} not found");

            if (ticket.UserId != userId && ticket.AssignedToAgentId != userId)
                throw new UnauthorizedAccessException("Access denied");

            var user = await _userRepo.GetByIdAsync(userId);
            var message = SupportMapper.CreateMessageFromDto(dto, userId, user?.Name ?? "Unknown");

            var updated = await _supportRepo.AddMessageToTicketAsync(ticketId, message);
            _logger.LogInformation($"Message added to ticket {ticketId} by user {userId}");

            return SupportMapper.MapToDto(updated, user?.Name ?? "Unknown");
        }

        /// <summary>Update ticket status (admin only - controller should verify role).</summary>
        public async Task<SupportTicketDto> UpdateStatusAsync(string ticketId, string status)
        {
            var ticket = await _supportRepo.GetTicketWithMessagesAsync(ticketId);
            if (ticket == null)
                throw new InvalidOperationException($"Support ticket {ticketId} not found");

            var validStatuses = new[] { "Open", "In Progress", "Resolved", "Closed" };
            if (!validStatuses.Contains(status))
                throw new InvalidOperationException("Invalid status");

            ticket.Status = status;
            if (status == "Resolved")
                ticket.ResolvedAt = DateTime.UtcNow;

            await _supportRepo.UpdateTicketAsync(ticket);
            _logger.LogInformation($"Support ticket {ticketId} status updated to {status}");

            var user = await _userRepo.GetByIdAsync(ticket.UserId);
            return SupportMapper.MapToDto(ticket, user?.Name ?? "Unknown");
        }

        /// <summary>Assign ticket to support agent (admin only).</summary>
        public async Task<SupportTicketDto> AssignToAgentAsync(string ticketId, string agentId)
        {
            var ticket = await _supportRepo.GetTicketWithMessagesAsync(ticketId);
            if (ticket == null)
                throw new InvalidOperationException($"Support ticket {ticketId} not found");

            var agent = await _userRepo.GetByIdAsync(agentId);
            if (agent == null)
                throw new InvalidOperationException("Agent not found");

            ticket.AssignedToAgentId = agentId;
            await _supportRepo.UpdateTicketAsync(ticket);
            _logger.LogInformation($"Support ticket {ticketId} assigned to agent {agentId}");

            var user = await _userRepo.GetByIdAsync(ticket.UserId);
            return SupportMapper.MapToDto(ticket, user?.Name ?? "Unknown");
        }

        /// <summary>Get all open tickets (admin/support view).</summary>
        public async Task<List<SupportTicketDto>> GetAllOpenTicketsAsync()
        {
            var tickets = await _supportRepo.GetAllOpenTicketsAsync();
            var result = new List<SupportTicketDto>();

            foreach (var ticket in tickets)
            {
                var user = await _userRepo.GetByIdAsync(ticket.UserId);
                result.Add(SupportMapper.MapToDto(ticket, user?.Name ?? "Unknown"));
            }

            return result;
        }
    }
}