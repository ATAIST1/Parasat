using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
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

       // public InvestmentRequestStatus Status { get; set; } = InvestmentRequestStatus.Draft;
        public int NumberOfEmployees { get; set; }
        public int? YearOfFoundation { get; set; }
        public string? InvestmentPurpose { get; set; }  
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

         // --- S3 документы ---
        public string? InvestmentMemorandumKey { get; set; }
        public string? FinancialReportKey { get; set; }
        public string? BusinessPlanKey { get; set; }
        public string? PresentationKey { get; set; }
        public List<string> OtherDocumentsKeys { get; set; } = new();
        
    }

    /*{public enum InvestmentRequestStatus
    {
        Draft,
        Published,
        InReview,
        Approved,
        Rejected
    }
    }*/
}