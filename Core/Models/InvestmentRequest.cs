using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models
{
    public class InvestmentRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string UserId { get; set; } = null!;
        public string StartupId { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string Industry { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Description { get; set; } = null!;

        public long RevenueLastYear { get; set; }
        public long ProfitLastYear { get; set; }
        public long InvestmentNeeded { get; set; }
        public int EquityOfferedPercent { get; set; }

        public InvestmentRequestStatus Status { get; set; } = InvestmentRequestStatus.Draft;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PublishedAt { get; set; }
    }

    public enum InvestmentRequestStatus
    {
        Draft,
        Published,
        InReview,
        Approved,
        Rejected
    }
}