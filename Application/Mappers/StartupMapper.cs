using Core.Dtos.Startups;
using Core.Models;

namespace Application.Mappers
{
    public static class StartupMapper
    {
        public static Startup ToModel(CreateStartupDto dto)
        {
            return new Startup
            {
                OwnerId = dto.OwnerId,
                ProjectName = dto.ProjectName,
                Title = dto.Title,
                ShortPitch = dto.ShortPitch,
                Description = dto.Description,
                Industry = dto.Industry,
                Evidence = dto.Evidence,
                Technologies = dto.Technologies ?? new List<string>(),
                City = dto.City,
                Country = dto.Country,
                Currency = dto.Currency,
                InvestmentRequested = dto.InvestmentRequested,
                Stage = dto.Stage ?? new List<string>(),
                Model = dto.Model ?? new List<string>(),
                Revenue = dto.Revenue,
                DAU = dto.DAU,
                GrowthPercentage = dto.GrowthPercentage,
                TeamMembers = dto.TeamMembers,
                PitchDeckUrl = dto.PitchDeckUrl,
                FinancialModelUrl = dto.FinancialModelUrl,
                ExternalLinks = dto.ExternalLinks ?? new List<string>()
            };
        }

        public static void UpdateModel(Startup model, UpdateStartupDto dto)
        {
            model.ProjectName = dto.ProjectName;
            model.Title = dto.Title;
            model.ShortPitch = dto.ShortPitch;
            model.Description = dto.Description;
            model.Industry = dto.Industry;
            model.Evidence = dto.Evidence;
            model.Technologies = dto.Technologies ?? model.Technologies;
            model.City = dto.City;
            model.Country = dto.Country;
            model.Currency = dto.Currency;
            model.InvestmentRequested = dto.InvestmentRequested;
            model.Stage = dto.Stage ?? model.Stage;
            model.Model = dto.Model ?? model.Stage;
            model.Revenue = dto.Revenue;
            model.DAU = dto.DAU;
            model.GrowthPercentage = dto.GrowthPercentage;
            model.PitchDeckUrl = dto.PitchDeckUrl;
            model.FinancialModelUrl = dto.FinancialModelUrl;
            model.ExternalLinks = dto.ExternalLinks ?? model.ExternalLinks;
        }
    }
}