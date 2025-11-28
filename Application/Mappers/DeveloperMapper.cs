using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class DeveloperMapper
{
    public static DeveloperDto ToDto(Developer developer)
    {
        return new DeveloperDto
        {
            Id = developer.Id,
            Name = developer.Name,
            Type = developer.Type,
            Location = developer.Location,
            Description = developer.Description,
            Stack = developer.Stack ?? new List<string>(),
            Projects = developer.Projects,
            Experience = developer.Experience,
            Rate = developer.Rate,
            Available = developer.Available
        };
    }

    public static Developer ToModel(CreateDeveloperDto dto)
    {
        return new Developer
        {
            Name = dto.Name,
            Type = dto.Type,
            Location = dto.Location,
            Description = dto.Description,
            Stack = dto.Stack ?? new List<string>(),
            Projects = dto.Projects,
            Experience = dto.Experience,
            Rate = dto.Rate,
            Available = dto.Available
        };
    }
}

