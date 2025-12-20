using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models;

public enum ConversationContextType
{
    Startup = 0,
    Business = 1,
    Investor = 2,
    Developer = 3
}

public class Conversation
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    public ConversationContextType ContextType { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string ContextId { get; set; } = null!; // startupId/businessId/profileId...

    [BsonRepresentation(BsonType.ObjectId)]
    public string OwnerId { get; set; } = null!; // владелец контекста (кому пишут)

    [BsonRepresentation(BsonType.ObjectId)]
    public string InitiatorId { get; set; } = null!; // кто открыл чат

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> ParticipantIds { get; set; } = new();

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
