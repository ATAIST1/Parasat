using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class InvestorMapper
{
    public static InvestorDto ToDto(Investor investor)
    {
        return new InvestorDto
        {
            Id = investor.Id,
            Name = investor.Name,
            Title = investor.Title,
            Location = investor.Location,
            Bio = investor.Bio,
            CheckSize = investor.CheckSize,
            Industries = investor.Industries ?? new List<string>(),
            Deals = investor.Deals,
            Exits = investor.Exits,
            Verified = investor.Verified
        };
    }

    public static Investor ToModel(CreateInvestorDto dto)
    {
        return new Investor
        {
            Name = dto.Name,
            Title = dto.Title,
            Location = dto.Location,
            Bio = dto.Bio,
            CheckSize = dto.CheckSize,
            Industries = dto.Industries ?? new List<string>(),
            Deals = dto.Deals,
            Exits = dto.Exits,
            Verified = dto.Verified
        };
    }
}

