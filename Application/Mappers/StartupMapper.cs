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
                SubIndustry = dto.SubIndustry ?? "",
                Technologies = dto.Technologies ?? new List<string>(),
                City = dto.City,
                Country = dto.Country,

                Currency = dto.Currency,
                InvestmentRequested = dto.InvestmentRequested,
                SpendPlan = dto.SpendPlan ?? new List<string>(),

                Revenue = dto.Revenue,
                DAU = dto.DAU,
                MAU = dto.MAU,
                GrowthPercentage = dto.GrowthPercentage,  // ← double? → double? — ок

                PitchDeckUrl = dto.PitchDeckUrl ?? "",
                FinancialModelUrl = dto.FinancialModelUrl ?? "",
                ExternalLinks = dto.ExternalLinks ?? new List<string>()
            };
        }

        public static void UpdateModel(Startup model, UpdateStartupDto dto)
        {
            model.ProjectName = dto.ProjectName;
            model.Title = dto.Title;
            model.Description = dto.Description;
            model.Industry = dto.Industry;
            model.SubIndustry = dto.SubIndustry ?? model.SubIndustry;
            model.Technologies = dto.Technologies ?? model.Technologies;
            model.City = dto.City;
            model.Country = dto.Country;
            model.Currency = dto.Currency;
            model.InvestmentRequested = dto.InvestmentRequested;
            model.SpendPlan = dto.SpendPlan ?? model.SpendPlan;

            model.Revenue = dto.Revenue;
            model.DAU = dto.DAU;
            model.MAU = dto.MAU;
            model.GrowthPercentage = dto.GrowthPercentage;

            model.PitchDeckUrl = dto.PitchDeckUrl ?? model.PitchDeckUrl;
            model.FinancialModelUrl = dto.FinancialModelUrl ?? model.FinancialModelUrl;
            model.ExternalLinks = dto.ExternalLinks ?? model.ExternalLinks;
        }
    }
}