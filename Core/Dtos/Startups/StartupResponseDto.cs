using Core.Models;

namespace Core.Dtos.Startups
{
    public class StartupResponseDto
    {
        public string Id { get; set; } = null!;
        public string OwnerId { get; set; } = null!;
        public string ProjectName { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Industry { get; set; } = null!;
        public string? SubIndustry { get; set; }
        public List<string> Technologies { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string Currency { get; set; } = null!;
        public long? InvestmentRequested { get; set; }
        public List<string> SpendPlan { get; set; } = null!;
        public long? Revenue { get; set; }
        public int? DAU { get; set; }
        public int? MAU { get; set; }
        public double? GrowthPercentage { get; set; }
        public string PitchDeckUrl { get; set; } = null!;
        public string FinancialModelUrl { get; set; } = null!;
        public List<string> ExternalLinks { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

        public static StartupResponseDto FromModel(Startup model)
        {
            return new StartupResponseDto
            {
                Id = model.Id ?? "",
                OwnerId = model.OwnerId,
                ProjectName = model.ProjectName,
                Title = model.Title,
                Description = model.Description,
                Industry = model.Industry,
                SubIndustry = model.SubIndustry,
                Technologies = model.Technologies,
                City = model.City,
                Country = model.Country,
                Currency = model.Currency,
                InvestmentRequested = model.InvestmentRequested,
                SpendPlan = model.SpendPlan,
                Revenue = model.Revenue,
                DAU = model.DAU,
                MAU = model.MAU,
                GrowthPercentage = model.GrowthPercentage,
                PitchDeckUrl = model.PitchDeckUrl,
                FinancialModelUrl = model.FinancialModelUrl,
                ExternalLinks = model.ExternalLinks,
                Status = model.Status,
                CreatedAt = model.CreatedAt
            };
        }
    }
}