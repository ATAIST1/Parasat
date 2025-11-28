using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class BusinessMapper
{
    public static BusinessDto ToDto(Business business)
    {
        return new BusinessDto
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

    public static Business ToModel(CreateBusinessDto dto)
    {
        return new Business
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

