using Core.Models;

namespace Core.Interfaces
{
    public interface ISupportTicketRepository
    {
        Task<SupportTicket?> GetTicketByIdAsync(string id);
        Task<List<SupportTicket>> GetUserTicketsAsync(string userId);
        Task<List<SupportTicket>> GetAllOpenTicketsAsync();
        Task<SupportTicket> CreateTicketAsync(SupportTicket ticket);
        Task<SupportTicket> UpdateTicketAsync(SupportTicket ticket);
        Task<bool> DeleteTicketAsync(string id);
        Task<SupportTicket> AddMessageToTicketAsync(string ticketId, SupportMessage message);
        Task<SupportTicket?> GetTicketWithMessagesAsync(string ticketId);
    }
}
