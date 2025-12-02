using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class DeveloperFeedMapper
{
    public static DeveloperFeedDto ToDto(DeveloperFeed developer)
    {
        return new DeveloperFeedDto
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

    public static DeveloperFeed ToModel(CreateDeveloperFeedDto dto)
    {
        return new DeveloperFeed
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


