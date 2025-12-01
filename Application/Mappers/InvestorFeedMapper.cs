using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class InvestorFeedMapper
{
    public static InvestorFeedDto ToDto(InvestorFeed investor)
    {
        return new InvestorFeedDto
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

    public static InvestorFeed ToModel(CreateInvestorFeedDto dto)
    {
        return new InvestorFeed
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


