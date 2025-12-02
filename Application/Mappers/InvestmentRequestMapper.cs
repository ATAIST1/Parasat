using Core.Dtos.Investment;
using Core.Models;

namespace Application.Mappers
{
    public static class InvestmentRequestMapper
    {
        public static InvestmentRequest ToModel(CreateInvestmentRequestDto dto, string userId)
        {
            return new InvestmentRequest
            {
                UserId = userId,
                StartupId = dto.StartupId,
                Title = dto.Title,
                Industry = dto.Industry,
                City = dto.City,
                Description = dto.Description,
                RevenueLastYear = dto.RevenueLastYear,
                ProfitLastYear = dto.ProfitLastYear,
                InvestmentNeeded = dto.InvestmentNeeded,
                EquityOfferedPercent = dto.EquityOfferedPercent
            };
        }

        public static void UpdateModel(InvestmentRequest model, UpdateInvestmentRequestDto dto)
        {
            if (dto.Title != null) model.Title = dto.Title;
            if (dto.Industry != null) model.Industry = dto.Industry;
            if (dto.City != null) model.City = dto.City;
            if (dto.Description != null) model.Description = dto.Description;
            if (dto.RevenueLastYear.HasValue) model.RevenueLastYear = dto.RevenueLastYear.Value;
            if (dto.ProfitLastYear.HasValue) model.ProfitLastYear = dto.ProfitLastYear.Value;
            if (dto.InvestmentNeeded.HasValue) model.InvestmentNeeded = dto.InvestmentNeeded.Value;
            if (dto.EquityOfferedPercent.HasValue) model.EquityOfferedPercent = dto.EquityOfferedPercent.Value;
        }

        public static InvestmentRequestResponseDto ToResponseDto(InvestmentRequest model)
            => InvestmentRequestResponseDto.FromModel(model);
    }
}