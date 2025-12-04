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

        public string ShortPitch { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Industry { get; set; }

        public string? Evidence { get; set; }

        public List<string>? Technologies { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        public string Currency { get; set; }

        public long? InvestmentRequested { get; set; }

        public List<string>? Stage { get; set; }
        public List<string>? Model { get; set; }
        public long? Revenue { get; set; }
        public int? DAU { get; set; }
        public double? GrowthPercentage { get; set; }
        public int? TeamMembers { get; set; } 

        public List<string>? ExternalLinks { get; set; }
    }
}
