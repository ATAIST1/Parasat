using Core.Dtos.Developer;
using Core.Models;

namespace Application.Mappers
{
    public static class DeveloperProfileMapper
    {
        public static DeveloperProfile ToModel(CreateDeveloperProfileDto dto)
        {
            return new DeveloperProfile
            {
                UserId = dto.UserId,
                FullName = dto.FullName,
                Telegram = dto.Telegram,
                Phone = dto.Phone,
                Linkedin = dto.Linkedin,
                Github = dto.Github,
                Types = dto.Types.Select(t => Enum.Parse<DevType>(t, true)).ToList(),
                City = dto.City,
                IsRemote = dto.IsRemote,
                TechStack = dto.TechStack,
                Experience = Enum.Parse<ExperienceLevel>(dto.Experience, true),
                About = dto.About,
                IsAvailable = dto.IsAvailable
            };
        }

        public static void UpdateModel(DeveloperProfile model, UpdateDeveloperProfileDto dto)
        {
            if (dto.FullName != null) model.FullName = dto.FullName;
            if (dto.Telegram != null) model.Telegram = dto.Telegram;
            if (dto.Phone != null) model.Phone = dto.Phone;
            if (dto.Linkedin != null) model.Linkedin = dto.Linkedin;
            if (dto.Github != null) model.Github = dto.Github;

            if (dto.Types != null)
                model.Types = dto.Types.Select(t => Enum.Parse<DevType>(t, true)).ToList();
            if (dto.City != null) model.City = dto.City;
            if (dto.IsRemote.HasValue) model.IsRemote = dto.IsRemote.Value;

            if (dto.TechStack != null) model.TechStack = dto.TechStack;
            if (dto.Experience != null)
                model.Experience = Enum.Parse<ExperienceLevel>(dto.Experience, true);

            if (dto.About != null) model.About = dto.About;
            if (dto.IsAvailable.HasValue) model.IsAvailable = dto.IsAvailable.Value;
        }

        public static DeveloperProfileResponseDto ToResponseDto(DeveloperProfile model)
            => DeveloperProfileResponseDto.FromModel(model);
    }
}