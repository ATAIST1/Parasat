using System.Collections.Generic;
using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class StartupFeedMapper
{
    public static StartupFeedDto ToDto(StartupFeed startup)
    {
        return new StartupFeedDto
        {
            Id = startup.Id,
            Name = startup.Name,
            Stage = startup.Stage,
            Industry = startup.Industry,
            Location = startup.Location,
            Pitch = startup.Pitch,
            Mrr = startup.Mrr,
            Users = startup.Users,
            Team = startup.Team,
            Tags = startup.Tags ?? new List<string>()
        };
    }

    public static StartupFeed ToModel(CreateStartupFeedDto dto)
    {
        return new StartupFeed
        {
            Name = dto.Name,
            Stage = dto.Stage,
            Industry = dto.Industry,
            Location = dto.Location,
            Pitch = dto.Pitch,
            Mrr = dto.Mrr,
            Users = dto.Users,
            Team = dto.Team,
            Tags = dto.Tags ?? new List<string>()
        };
    }
}

