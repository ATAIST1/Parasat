using Core.Dtos.Investor;
using Core.Models;

namespace Application.Mappers
{
    public static class InvestorProfileMapper
    {
        public static InvestorProfile ToModel(CreateInvestorProfileDto dto, string userId)
        {
            return new InvestorProfile
            {
                UserId = userId,
                FullName = dto.FullName,
                About = dto.About,
                Description = dto.Description,
                City = dto.City,
                Industries = dto.Industries ?? new List<string>(),
                Models = dto.Models ?? new List<string>(),
                Currency = dto.Currency,
                InvestmentRange = dto.InvestmentRange,
                DealCount = dto.DealCount
            };
        }

        public static void UpdateModel(InvestorProfile model, UpdateInvestorProfileDto dto)
        {
            if (dto.FullName != null) model.FullName = dto.FullName;
            if (dto.About != null) model.About = dto.About;
            if (dto.Description != null) model.Description = dto.Description;
            if (dto.City != null) model.City = dto.City;
            if (dto.Industries != null) model.Industries = dto.Industries;
            if (dto.Models != null) model.Models = dto.Models;
            if (dto.Currency != null) model.Currency = dto.Currency;
            if (dto.InvestmentRange != null) model.InvestmentRange = dto.InvestmentRange;
            if (dto.DealCount.HasValue) model.DealCount = dto.DealCount.Value;
        }

        public static InvestorProfileResponseDto ToResponseDto(InvestorProfile model)
            => InvestorProfileResponseDto.FromModel(model);
    }
}
