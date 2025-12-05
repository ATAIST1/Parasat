using System.ComponentModel.DataAnnotations;

namespace Core.Dtos.Startups
{
    public class CreateStartupDto
    {
        [Required]
        public string OwnerId { get; set; } = default!;

        [Required]
        public string ProjectName { get; set; } = default!;

        [Required]
        public string Title { get; set; } = default!;

        public string ShortPitch { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = default!;

        [Required]
        public string Industry { get; set; } = default!;

        public string? Evidence { get; set; }

        public List<string>? Technologies { get; set; }

        [Required]
        public string City { get; set; } = default!;

        [Required]
        public string Country { get; set; } = default!;

        [Required]
        public string Currency { get; set; } = default!;

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
