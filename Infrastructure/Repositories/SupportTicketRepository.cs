using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories
{
    public class SupportTicketRepository : ISupportTicketRepository
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<SupportTicket> _collection;

        public SupportTicketRepository(IMongoDatabase database)
        {
            _database = database;
            _collection = _database.GetCollection<SupportTicket>("SupportTickets");
        }

        public async Task<SupportTicket?> GetTicketByIdAsync(string id)
        {
            return await _collection.Find(t => t.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<SupportTicket>> GetUserTicketsAsync(string userId)
        {
            return await _collection
                .Find(t => t.UserId == userId)
                .SortByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<SupportTicket>> GetAllOpenTicketsAsync()
        {
            return await _collection
                .Find(t => t.Status != "Closed")
                .SortByDescending(t => t.UpdatedAt)
                .ToListAsync();
        }

        public async Task<SupportTicket> CreateTicketAsync(SupportTicket ticket)
        {
            await _collection.InsertOneAsync(ticket);
            return ticket;
        }

        public async Task<SupportTicket> UpdateTicketAsync(SupportTicket ticket)
        {
            ticket.UpdatedAt = DateTime.UtcNow;
            await _collection.ReplaceOneAsync(t => t.Id == ticket.Id, ticket);
            return ticket;
        }

        public async Task<bool> DeleteTicketAsync(string id)
        {
            var result = await _collection.DeleteOneAsync(t => t.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<SupportTicket> AddMessageToTicketAsync(string ticketId, SupportMessage message)
        {
            var update = Builders<SupportTicket>.Update
                .Push(t => t.Messages, message)
                .Set(t => t.UpdatedAt, DateTime.UtcNow);

            var options = new FindOneAndUpdateOptions<SupportTicket> 
            { 
                ReturnDocument = ReturnDocument.After 
            };

            return await _collection.FindOneAndUpdateAsync(
                t => t.Id == ticketId, 
                update, 
                options
            ) ?? throw new InvalidOperationException($"Support ticket {ticketId} not found");
        }

        public async Task<SupportTicket?> GetTicketWithMessagesAsync(string ticketId)
        {
            return await _collection.Find(t => t.Id == ticketId).FirstOrDefaultAsync();
        }
    }
}
