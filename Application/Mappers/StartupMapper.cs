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
                Description = dto.Description,
                Industry = dto.Industry,
                SubIndustry = dto.SubIndustry,
                Technologies = dto.Technologies ?? new List<string>(),
                City = dto.City,
                Country = dto.Country,

                Currency = dto.Currency,
                InvestmentRequested = dto.InvestmentRequested,
                SpendPlan = dto.SpendPlan ?? new List<string>(),

                Revenue = dto.Revenue,
                DAU = dto.DAU,
                MAU = dto.MAU,
                GrowthPercentage = dto.GrowthPercentage,

                PitchDeckUrl = dto.PitchDeckUrl,
                FinancialModelUrl = dto.FinancialModelUrl,
                ExternalLinks = dto.ExternalLinks ?? new List<string>()
            };
        }
    }
}
