using Core.Models;

namespace Core.Dtos.Startups
{
    public class StartupResponseDto
    {
        public string Id { get; set; } = null!;
        public string ProjectName { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string ShortPitch { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Industry { get; set; } = null!;
        public string? Evidence { get; set; }

        public List<string> Technologies { get; set; } = new();
        public string City { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string Currency { get; set; } = null!;
        public long? InvestmentRequested { get; set; }

        public List<string> Stage { get; set; } = new();
        public List<string> Model { get; set; } = new();

        public long? Revenue { get; set; }
        public int? DAU { get; set; }
        public double? GrowthPercentage { get; set; }
        public int? TeamMembers { get; set; }

        public bool HasPitchDeck { get; set; }
        public bool HasFinancialModel { get; set; }
        public List<string> ExternalLinks { get; set; } = new();

        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

        public static StartupResponseDto FromModel(Startup model)
        {
            return new StartupResponseDto
            {
                Id = model.Id,
                ProjectName = model.ProjectName,
                Title = model.Title,
                ShortPitch = model.ShortPitch,
                Description = model.Description,
                Industry = model.Industry,
                Evidence = model.Evidence,

                Technologies = model.Technologies,
                City = model.City,
                Country = model.Country,
                Currency = model.Currency,
                InvestmentRequested = model.InvestmentRequested,
                TeamMembers = model.TeamMembers,
                Stage = model.Stage,
                Model = model.Model,
                Revenue = model.Revenue,
                DAU = model.DAU,
                GrowthPercentage = model.GrowthPercentage,
                HasPitchDeck = !string.IsNullOrEmpty(model.PitchDeckKey),
                HasFinancialModel = !string.IsNullOrEmpty(model.FinancialModelKey),
                ExternalLinks = model.ExternalLinks,
                Status = model.Status,
                CreatedAt = model.CreatedAt
            };
        }
    }
}
