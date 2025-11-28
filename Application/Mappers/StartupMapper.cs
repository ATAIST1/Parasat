using System.Collections.Generic;
using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class StartupMapper
{
    public static StartupDto ToDto(Startup startup)
    {
        return new StartupDto
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

    public static Startup ToModel(CreateStartupDto dto)
    {
        return new Startup
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

