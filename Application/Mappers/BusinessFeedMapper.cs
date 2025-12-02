using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class BusinessFeedMapper
{
    public static BusinessFeedDto ToDto(BusinessFeed business)
    {
        return new BusinessFeedDto
        {
            Id = business.Id,
            Name = business.Name,
            Industry = business.Industry,
            Location = business.Location,
            Description = business.Description,
            Revenue = business.Revenue,
            Profit = business.Profit,
            Employees = business.Employees,
            Founded = business.Founded,
            InvestmentNeeded = business.InvestmentNeeded,
            InvestmentGoal = business.InvestmentGoal,
            Equity = business.Equity,
            Verified = business.Verified
        };
    }

    public static BusinessFeed ToModel(CreateBusinessFeedDto dto)
    {
        return new BusinessFeed
        {
            Name = dto.Name,
            Industry = dto.Industry,
            Location = dto.Location,
            Description = dto.Description,
            Revenue = dto.Revenue,
            Profit = dto.Profit,
            Employees = dto.Employees,
            Founded = dto.Founded,
            InvestmentNeeded = dto.InvestmentNeeded,
            InvestmentGoal = dto.InvestmentGoal,
            Equity = dto.Equity,
            Verified = dto.Verified
        };
    }
}


