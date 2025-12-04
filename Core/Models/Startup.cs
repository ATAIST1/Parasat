using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models
{
    public class Startup
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string OwnerId { get; set; }

        public string ProjectName { get; set; }
        public string Title { get; set; }
        public string ShortPitch { get; set; }
        public string Description { get; set; }
        public string Industry { get; set; }
        public string? Evidence { get; set; }
        public List<string> Technologies { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public string Currency { get; set; }
        public long? InvestmentRequested { get; set; }
        public List<string> Stage { get; set; }
        public List<string> Model { get; set; }
        public long? Revenue { get; set; }
        public int? DAU { get; set; }
        public double? GrowthPercentage { get; set; }
        public int? TeamMembers { get; set; }

        public string PitchDeckUrl { get; set; }
        public string FinancialModelUrl { get; set; }
        public List<string> ExternalLinks { get; set; } = new();

        public string Status { get; set; } = "draft";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
