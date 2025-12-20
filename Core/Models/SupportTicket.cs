using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models
{
    public class SupportTicket
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        public string Subject { get; set; } = null!;
        public string Category { get; set; } = "General"; // General, Technical, Billing, Account, etc.
        public string Priority { get; set; } = "Normal"; // Low, Normal, High, Urgent
        public string Status { get; set; } = "Open"; // Open, In Progress, Resolved, Closed

        public List<SupportMessage> Messages { get; set; } = new();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ResolvedAt { get; set; }

        public string? AssignedToAgentId { get; set; } // Support agent ID if assigned
    }

    public class SupportMessage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        public string UserName { get; set; } = null!; // Store name for display
        public string Content { get; set; } = null!;

        public bool IsSupportAgent { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<string> AttachmentKeys { get; set; } = new(); // S3 keys for files
    }
}
