using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models;

public enum DealStatus
{
    Pending = 0,
    Active = 1,
    Rejected = 2,
    Cancelled = 3,
    Completed = 4
}

public class Deal
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string ConversationId { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string OwnerId { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string InitiatorId { get; set; } = null!;

    public bool OwnerAccepted { get; set; } = false;
    public bool InitiatorAccepted { get; set; } = false;

    public DealStatus Status { get; set; } = DealStatus.Pending;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? ActivatedAtUtc { get; set; }
    public DateTime? ClosedAtUtc { get; set; }
}
