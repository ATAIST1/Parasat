using Core.Models;
namespace Core.Dtos.Investment
{
    public class InvestmentRequestResponseDto
    {
        public string Id { get; set; } = null!;
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
        public int NumberOfEmployees { get; set; }
        public int? YearOfFoundation { get; set; }
        public string? InvestmentPurpose { get; set; }
        public DateTime CreatedAt { get; set; }

        // S3 keys
        public string? InvestmentMemorandumKey { get; set; }
        public string? FinancialReportKey { get; set; }
        public string? BusinessPlanKey { get; set; }
        public string? PresentationKey { get; set; }
        public List<string> OtherDocumentsKeys { get; set; } = new();

        public static InvestmentRequestResponseDto FromModel(InvestmentRequest model)
        {
            return new InvestmentRequestResponseDto
            {
                Id = model.Id ?? "",
                UserId = model.UserId,
                StartupId = model.StartupId,
                Title = model.Title,
                Industry = model.Industry,
                City = model.City,
                Description = model.Description,
                RevenueLastYear = model.RevenueLastYear,
                ProfitLastYear = model.ProfitLastYear,
                InvestmentNeeded = model.InvestmentNeeded,
                EquityOfferedPercent = model.EquityOfferedPercent,
                NumberOfEmployees = model.NumberOfEmployees,
                YearOfFoundation = model.YearOfFoundation,
                InvestmentPurpose = model.InvestmentPurpose,
                CreatedAt = model.CreatedAt,

                InvestmentMemorandumKey = model.InvestmentMemorandumKey,
                FinancialReportKey = model.FinancialReportKey,
                BusinessPlanKey = model.BusinessPlanKey,
                PresentationKey = model.PresentationKey,
                OtherDocumentsKeys = model.OtherDocumentsKeys
            };
        }
    }
}
