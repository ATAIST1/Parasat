using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models;

public class InvestmentRequest
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string StartupId { get; set; } = null!;

    public string Title { get; set; } = null!;
    public string Industry { get; set; } = null!;
    public string City { get; set; } = null!;
    public string Description { get; set; } = null!;

    public long RevenueLastYear { get; set; }
    public long ProfitLastYear { get; set; }
    public long InvestmentNeeded { get; set; }
    public int EquityOfferedPercent { get; set; }

    public int NumberOfEmployees { get; set; }
    public int? YearOfFoundation { get; set; }
    public string? InvestmentPurpose { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PublishedAt { get; set; }

    // --- S3 keys ---
    public string? InvestmentMemorandumKey { get; set; }
    public string? FinancialReportKey { get; set; }
    public string? BusinessPlanKey { get; set; }
    public string? PresentationKey { get; set; }
    public List<string> OtherDocumentsKeys { get; set; } = new();

    public InvestmentRequestStatus Status { get; set; } = InvestmentRequestStatus.Draft;
}

public enum InvestmentRequestStatus
{
    Draft = 0,
    Published = 1,
    InReview = 2,
    Approved = 3,
    Rejected = 4
}
