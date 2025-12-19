using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models
{
    public enum ClubMembershipStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2
    }

    public class ClubMembershipApplication
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string UserId { get; set; } = null!;

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;

        public string? Industry { get; set; }
        public string? Position { get; set; }
        public string? Motivation { get; set; }

        public ClubMembershipStatus Status { get; set; } = ClubMembershipStatus.Pending;

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? DecisionAtUtc { get; set; }
        public string? DecidedByUserId { get; set; }
        public string? DecisionComment { get; set; }
    }
}
