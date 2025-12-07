using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models
{
    public class InvestorProfile
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string UserId { get; set; } = null!;

        public string FullName { get; set; } = null!;

        public string About { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string City { get; set; } = null!;

        public List<string> Industries { get; set; } = new();

        public List<string> Models { get; set; } = new();
        public string Currency { get; set; } = "KZT";
        public string InvestmentRange { get; set; } = null!;
        public int DealCount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
