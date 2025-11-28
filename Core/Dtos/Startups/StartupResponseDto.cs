using Core.Models;

namespace Core.Dtos.Startups
{
    public class StartupResponseDto
    {
        public string Id { get; set; }
        public string OwnerId { get; set; }

        public string ProjectName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Industry { get; set; }
        public string SubIndustry { get; set; }
        public List<string> Technologies { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public string Currency { get; set; }
        public long? InvestmentRequested { get; set; }
        public List<string> SpendPlan { get; set; }

        public long? Revenue { get; set; }
        public int? DAU { get; set; }
        public int? MAU { get; set; }
        public int? GrowthPercentage { get; set; }

        public string PitchDeckUrl { get; set; }
        public string FinancialModelUrl { get; set; }
        public List<string> ExternalLinks { get; set; }

        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }

        public static StartupResponseDto FromModel(Startup s)
        {
            return new StartupResponseDto
            {
                Id = s.Id,
                OwnerId = s.OwnerId,

                ProjectName = s.ProjectName,
                Title = s.Title,
                Description = s.Description,
                Industry = s.Industry,
                SubIndustry = s.SubIndustry,
                Technologies = s.Technologies,
                City = s.City,
                Country = s.Country,
                
                Currency = s.Currency,
                InvestmentRequested = s.InvestmentRequested,
                SpendPlan = s.SpendPlan,

                Revenue = s.Revenue,
                DAU = s.DAU,
                MAU = s.MAU,
                GrowthPercentage = s.GrowthPercentage,

                PitchDeckUrl = s.PitchDeckUrl,
                FinancialModelUrl = s.FinancialModelUrl,
                ExternalLinks = s.ExternalLinks,

                Status = s.Status,
                CreatedAt = s.CreatedAt
            };
        }
    }
}
