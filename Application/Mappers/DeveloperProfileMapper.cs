using Core.Dtos.Developer;
using Core.Models;

namespace Application.Mappers
{
    public static class DeveloperProfileMapper
    {
        // ✅ userId приходит из JWT (контроллера/сервиса), не из dto
        public static DeveloperProfile ToModel(string userId, CreateDeveloperProfileDto dto)
        {
            return new DeveloperProfile
            {
                UserId = userId,
                FullName = dto.FullName,
                WorkingRate = dto.WorkingRate,
                Currency = dto.Currency,
                FirstLink = dto.FirstLink,
                SecondLink = dto.SecondLink,
                Types = dto.Types,
                City = dto.City,
                IsRemote = dto.IsRemote,
                TechStack = dto.TechStack,
                Experience = dto.Experience,
                About = dto.About,
                IsAvailable = dto.IsAvailable,
                ProjectCount = dto.ProjectCount
            };
        }

        public static void UpdateModel(DeveloperProfile model, UpdateDeveloperProfileDto dto)
        {
            if (dto.FullName != null) model.FullName = dto.FullName;
            if (dto.WorkingRate != null) model.WorkingRate = dto.WorkingRate;
            if (dto.Currency != null) model.Currency = dto.Currency;
            if (dto.FirstLink != null) model.FirstLink = dto.FirstLink;
            if (dto.SecondLink != null) model.SecondLink = dto.SecondLink;

            if (dto.Types != null) model.Types = dto.Types;
            if (dto.City != null) model.City = dto.City;
            if (dto.IsRemote.HasValue) model.IsRemote = dto.IsRemote.Value;

            if (dto.TechStack != null) model.TechStack = dto.TechStack;
            if (dto.Experience != null) model.Experience = dto.Experience;

            if (dto.About != null) model.About = dto.About;
            if (dto.IsAvailable.HasValue) model.IsAvailable = dto.IsAvailable.Value;
            if (dto.ProjectCount.HasValue) model.ProjectCount = dto.ProjectCount.Value;
        }

        public static DeveloperProfileResponseDto ToResponseDto(DeveloperProfile model)
            => DeveloperProfileResponseDto.FromModel(model);
    }
}
