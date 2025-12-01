using System.ComponentModel.DataAnnotations;

namespace Core.Dtos.Startups
{
    public class CreateStartupDto
    {
        [Required]
        public string OwnerId { get; set; }

        [Required]
        public string ProjectName { get; set; }

        [Required]
        public string Title { get; set; } 

        [Required]
        public string Description { get; set; }

        [Required]
        public string Industry { get; set; }

        public string? SubIndustry { get; set; }

        public List<string>? Technologies { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        public string Currency { get; set; }

        public long? InvestmentRequested { get; set; }

        public List<string>? SpendPlan { get; set; }

        public long? Revenue { get; set; }
        public int? DAU { get; set; }
        public int? MAU { get; set; }
        public double? GrowthPercentage { get; set; }
        public string? PitchDeckUrl { get; set; }
        public string? FinancialModelUrl { get; set; }

        public List<string>? ExternalLinks { get; set; }
    }
}
