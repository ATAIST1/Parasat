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

        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? PublishedAt { get; set; }

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
                Status = model.Status.ToString(),
                CreatedAt = model.CreatedAt,
                PublishedAt = model.PublishedAt
            };
        }
    }
}