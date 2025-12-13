using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models;

public class Conversation
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string StartupId { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string OwnerId { get; set; } = null!;   // владелец стартапа

    [BsonRepresentation(BsonType.ObjectId)]
    public string InitiatorId { get; set; } = null!; // кто нажал "написать"

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> ParticipantIds { get; set; } = new();

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
